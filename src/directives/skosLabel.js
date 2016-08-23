/**
 * @ngdoc directive
 * @name ng-skos.directive:skosLabel
 * @restrict A
 * @description
 *
 * Shows the multilingual label of a concept or concept scheme, given as
 * JSON object with language codes mapped to labels. One or more preferred languages 
 * can be selected with parameter `lang`. The language a label is actually
 * shown in, is made available as element attribute `skos-lang`.
 *
 * Future versions of this directive may use more elaborated heuristics 
 * to select an alternative languages.
 *
 * @param {string} skos-label Expression with multilingual label data
 * @param {string=|array=} lang preferred language(s) to show. If several languages 
 *      are provided via an array, they are processed in that order. If none are 
 *      available, a language is chosen based on the given label data.
 *
 * @example
 <example module="myApp">
  <file name="index.html">
    <div ng-controller="myController">
      <ul>
        <li skos-label="example" lang="en" />
        <li skos-label="example" lang="de" />
        <li>
         <span skos-label="example" lang="{{language}}"/>
         <input type="text" ng-model="language" class="input-small"/>
         (select language)
        </li>
      </dl>
    </div>
  </file>
  <file name="script.js">
    angular.module('myApp',['ngSKOS']);

    function myController($scope) {
        $scope.example = {
            en: "example",
            de: "Beispiel",
        };
        $scope.language = "fr";
    }
  </file>
  <file name="style.css">
   *[skos-label]:after { 
      content: "\00a0" attr(skos-lang); 
      vertical-align: super;
      color: gray;
   }
  </file>
</example>
 */
angular.module('ngSKOS')
.directive('skosLabel', function() {
    return {
        restrict: 'A',
        scope: { 
            label: '=skosLabel',
        },
        template: '{{label[language]}}',
        link: function(scope, element, attrs) {

            function updateLanguage(language) {            
              scope.language = language ? language : attrs.lang;
              language = scope.label ? selectLanguage(scope.label, scope.language) : "";
              if (language != scope.language) {
                  scope.language = language;
              }
              attrs.$set('skos-lang', language);
            }

            function selectLanguage(labels, languages) {
              if ( angular.isObject(labels) ) {
                if (languages && languages.indexOf(",") !== -1){
                  languages = languages.split(",");
                }
                if (angular.isString(languages) && angular.isString(labels[languages])){
                  return languages;
                }else if (angular.isArray(languages) && angular.isString(labels[languages[0]])){
                    return languages[0];
                } else {
                    return guessLanguage(labels, languages);
                }    
              }
            }

            function guessLanguage(labels, languages) {      
              if(languages){
                if(angular.isString(languages)){

                  for (var dialect in labels){
                    if (dialect.indexOf(languages) !== -1){
                      return dialect;
                    }
                  }
                  for (var language in labels){
                    if (angular.isString(labels[language])){
                      return language; // take arbitrary language
                    }
                  }
                } else if (angular.isArray(languages)){
                  for (i in languages){
                    for (var dialect in labels){
                      if (dialect.indexOf(languages[i]) !== -1){
                        return dialect;
                      }
                    }
                  };
                  for (var language in labels){
                    if (angular.isString(labels[language])){
                      console.log(labels);
                      return language; // take arbitrary language
                    }
                  }
                }
              }else{
                for (var language in labels){
                  if (angular.isString(labels[language])){
                    return language; // take arbitrary language
                  }
                }
              }
            }

            // update if lang attribute changed (also called at initialization)
            attrs.$observe('lang', updateLanguage);

            // update if labels changed
            scope.$watch('label', function() { updateLanguage(); }, true);
        },
    };
});
