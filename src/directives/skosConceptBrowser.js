/**
 * @ngdoc directive
 * @name ng-skos.directive:skosConceptBrowser
 * @restrict E
 * @scope
 * @description
 *
 * ## Scope
 *
 * The following variables are added to the scope:
 * <ul>
 * <li>concept
 * <li>notation
 * <li>getByNotation
 * <li>lookupByNotation
 * <li>suggestConcept
 * </ul>
 *
 * @param {string} concept selected [concept](#/guide/concepts)
 * @param {string} suggest-concept OpenSearchSuggestions for typeahead
 * @param {string} get-by-notation SkosConceptProvider to look up by notation
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
        },
        templateUrl: function(elem, attrs) {
            return attrs.templateUrl ? 
                   attrs.templateUrl : 'template/skos-concept-browser.html';
        },
        link: function link(scope, element, attr) {
            if (scope.getByNotation) {
                scope.lookupByNotation = function(notation) {
                    scope.getByNotation(notation).then(
                        function(response) {
                            angular.copy(response, scope.concept);
                        }
                    );
                };
            }
        }
     }
});
