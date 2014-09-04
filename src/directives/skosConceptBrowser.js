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
 * </ul>
 *
 * @param {string} concept selected [concept](#/guide/concepts)
 * @param {string} template-url URL of a template to display the concept browser
 */
angular.module('ngSKOS')
.directive('skosConceptBrowser', function() {
    return {
        restrict: 'E',
        scope: { 
            concept: '=concept',
        },
        templateUrl: function(elem, attrs) {
            return attrs.templateUrl ? 
                   attrs.templateUrl : 'src/templates/skos-concept-browser.html';
        },
        link: function link(scope, element, attr) {
            scope.$watch('concept',function(concept) {
                /* ... */
            },true);
        }
     }
});
