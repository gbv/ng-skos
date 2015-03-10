/**
 * @ngdoc directive
 * @name ng-skos.directive:skosLabel
 * @restrict A
 * @description
 *
 * Shows the multilingual label of a concept or concept scheme, given as
 * JSON object with language codes mapped to labels. A preferred language 
 * can be selected with parameter `lang`. The language a label is actually
 * shown in, is made available as element attribute `skos-lang`.
 *
 * Future versions of this directive may use more elaborated heuristics 
 * to select an alternative languages.
 *
 * @param {string} skos-label Expression with multilingual label data
 * @param {string=} lang preferred language to show. If not available,
 *      a language is chosen based on the given label data.
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

            function selectLanguage(labels, language) {
                if ( angular.isObject(labels) ) {
                    if ( language && angular.isString(labels[language])) {
                        return language;
                    } else {
                        return guessLanguage(labels);
                    }
                }
            }

            function guessLanguage(labels) {
                // TODO: https://github.com/gbv/ng-skos/issues/17
                for (var language in labels) {
                    if (angular.isString(labels[language])) {
                        return language; // take arbitrary language
                    }
                }
            }

            // update if lang attribute changed (also called at initialization)
            attrs.$observe('lang', updateLanguage);

            // update if labels changed
            scope.$watch('label', function(value) { updateLanguage(); }, true);
        },
    };
});
