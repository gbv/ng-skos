/**
 * @ngdoc directive
 * @name ng-skos.directive:skosBrowser
 * @restrict E
 * @scope
 * @description
 *
 * Provides a browsing interface to a concept scheme.
 *
 * For dynamic browsing, the browser requires a lookup function to query a
 * concept by notation (`get-by-notation`), by URI (`get-by-uri`), or by
 * a unique preferred label (`get-by-label`). Each function is expected to
 * return an AngularJS promise to return a single concept in JSKOS format.
 *
 * Please note that *searching* is not supported by this directive -- each
 * lookup function must either return a single concept or none.
 *
 * ## Scope
 *
 * The following variables are added to the scope, if the corresponding
 * lookup function have been provided:
 *
 * <ul>
 * <li>selectURI
 * <li>selectNotation
 * <li>selectLabel
 * </ul>
 *
 * The current version only tries either one of this methods.
 *
 * ## Customization
 *
 * The [default 
 * template](https://github.com/gbv/ng-skos/blob/master/src/templates/skos-browser.html)
 * can be changed with parameter `templateUrl`.
 *
 * ## Source code
 *
 * The most recent [source 
 * code](https://github.com/gbv/ng-skos/blob/master/src/directives/skosBrowser.js)
 * of this directive is available at GitHub.
 *
 * @param {string} concept selected [concept](http://gbv.github.io/jskos/jskos.html#concepts)
 * @param {string} suggest-concept OpenSearchSuggestions for typeahead
 * @param {string} get-by-uri function to look up by uri
 * @param {string} get-by-notation function to look up by notation (given as array)
 * @param {string} get-by-label function to look up by label (given as prefLabel object)
 * @param {string} template-url URL of a template to display the concept browser
 */
angular.module('ngSKOS')
.directive('skosBrowser', function() {
    return {
        restrict: 'E',
        scope: { 
            concept: '=',
            suggestConcept: '=',
            getByURI: '=',
            getByNotation: '=',
            getByLabel: '=',
        },
        templateUrl: function(elem, attrs) {
            return attrs.templateUrl ? 
                   attrs.templateUrl : 'template/skos-browser.html';
        },
        link: function link(scope, element, attr) {

            angular.forEach(['URI','Notation','Label'],function(value){
                var lookup = scope['getBy'+value];
                if (lookup) {
                    scope['select'+value] = function(query) {
                        console.log('selectBy'+value+': '+query);
                        lookup(query).then(
                            function(response) { 
                                angular.copy(response, scope.concept);
                            }
                        );
                    };
                }
            });

            scope.selectConcept = function(concept) {
                if (scope.selectURI && concept.uri) {
                    scope.selectURI(concept.uri);
                } else if (scope.selectNotation && concept.notation && concept.notation.length) {
                    scope.selectNotation(concept.notation);
                } else if (scope.selectLabel && concept.prefLabel) {
                    scope.selectLabel(concept.prefLabel);
                }
            };
        }
     }
});
