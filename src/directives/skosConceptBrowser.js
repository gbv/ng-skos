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
 * @param {string} typeahead OpenSearchSuggestions for typeahead
 * @param {string} lookup-notation SkosConceptProvider to look up by notation
 * @param {string} search NOT SUPPORTED YET
 * @param {string} template-url URL of a template to display the concept browser
 */
angular.module('ngSKOS')
.directive('skosConceptBrowser', function() {
    return {
        restrict: 'E',
        scope: { 
            concept: '=concept',
            typeahead: '=typeahead',
            lookupNotation: '=lookupNotation',
            search: '=search', // TODO
        },
        templateUrl: function(elem, attrs) {
            return attrs.templateUrl ? 
                   attrs.templateUrl : 'template/skos-concept-browser.html';
        },
        link: function link(scope, element, attr) {
            scope.searchLabel = "";
            scope.$watch('concept',function(concept) {
                /* ... */
            },true);

            // look up by notation or label
            scope.lookupConcept = function(item) {
                // populate with basic data
                var concept = {
                    notation: [ item.notation ],
                    prefLabel: { // TODO: configure language
                        de: item.label
                    }
                };
                // call SkosConceptProvider
                scope.lookup.updateConcept(concept).then(function() {
                    console.log("updateConcept");
                });
            };
        }
     }
);
