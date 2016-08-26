/**
 * @ngdoc directive
 * @name ng-skos.directive:skosLabel
 * @restrict A
 * @description
 *
 * Shows the multilingual label of a concept or concept scheme, given as
 * JSON object with language or language-country codes mapped to labels. 
 * One or more preferred languages can be selected with parameter `lang`. 
 * The language a label is actually shown in, is made available as 
 * element attribute `skos-lang`.
 *
 * @param {string} skos-label Expression with multilingual label data
 * @param {string=} lang preferred language(s) to show. If several languages 
 *      are to be considered, they should be separated by ',' without blank spaces. 
 *      The languages are being checked for in their given order.
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
                } else if (angular.isArray(languages) && angular.isString(labels[languages[0]])){
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
                    if (dialect.toLowerCase().indexOf(languages) === 0 || languages.toLowerCase().indexOf(dialect) === 0){
                      return dialect;
                    }
                  }
                } else if (angular.isArray(languages)){
                  for (var i in languages){
                    for (var dialect in labels){
                      if (dialect.toLowerCase().indexOf(languages[i].toLowerCase()) === 0 || languages[i].toLowerCase().indexOf(dialect.toLowerCase()) === 0){
                        return dialect;
                      }
                    }
                  };
                }
              }
              if(labels["und"]){
                for (var language in labels){
                  if(language == "und" && labels[language] !== "false" && labels[language] !== "true"){
                    return language;
                  }
                }
              } else {
                return "";
              }
            }

            // update if lang attribute changed (also called at initialization)
            attrs.$observe('lang', updateLanguage);

            // update if labels changed
            scope.$watch('label', function() { updateLanguage(); }, true);
        },
    };
});
