/**
 * @ngdoc directive
 * @name ng-skos.directive:skosConceptBrowser
 * @restrict E
 * @scope
 * @description
 *
 * ## Scope
 *
 * The following variables are added to the scope, in addition to parameters:
 * <ul>
 * <li>notation
 * <li>selectNotation
 * </ul>
 *
 * ## Limitations
 *
 * By now, only getByNotation is supported.
 *
 * @param {string} concept selected [concept](http://gbv.github.io/jskos/jskos.html#concepts)
 * @param {string} suggest-concept OpenSearchSuggestions for typeahead
 * @param {string} get-by-notation function to look up by notation (promise)
 * @param {string} template-url URL of a template to display the concept browser
 */
angular.module('ngSKOS')
.directive('skosConceptBrowser', function() {
    return {
        restrict: 'E',
        scope: { 
            concept: '=',
            suggestConcept: '=',
            getByNotation: '=',
            getByURI: '=',  // TODO
            getByLabel: '=' // TODO (thesaurus)
        },
        templateUrl: function(elem, attrs) {
            return attrs.templateUrl ? 
                   attrs.templateUrl : 'template/skos-concept-browser.html';
        },
        link: function link(scope, element, attr) {
            if (scope.getByNotation) {
                scope.selectNotation = function(notation) {
                    console.log(notation);
                    scope.getByNotation(notation).then(
                        function(response) {
                            angular.copy(response, scope.concept);
                        }
                    );
                };
            }
            scope.selectConcept = function(concept) {
                if (scope.selectNotation && concept.notation && concept.notation.length) {
                    scope.selectNotation(concept.notation[0]);
                }
            };
        }
     }
});
