/**
 * @ngdoc directive
 * @name ng-skos.directive:skosConcept
 * @restrict A
 * @scope
 * @description
 * 
 * Display a [concept](http://gbv.github.io/jskos/jskos.html#concepts). 
 * Changes on the concept object are reflected by changes in the scope 
 * variables so the display is updated automatically.
 *
 * ## Scope
 *
 * The following variables are added to the scope:
 * <ul>
 * <li>ancestors (array of concepts)
 * <li>prefLabel (object of strings)
 * <li>altLabel (object of array of strings)
 * <li>notation (string)
 * <li>note (object of array of strings)
 * <li>broader (array of concepts)
 * <li>narrower (array of concepts)
 * <li>related (array of concepts)
 * </ul>
 *
 * In addition the helper method `isEmptyObject` is provided to check whether an object
 * is empty.
 *
 * ## Customization
 *
 * The [default
 * template](https://github.com/gbv/ng-skos/blob/master/src/templates/skos-concept.html) 
 * can be changed with parameter `templateUrl`.
 *
 * @param {string} skos-concept Assignable angular expression with a
 *      [concept](http://gbv.github.io/jskos/jskos.html#concepts) to bind to
 * @param {string} language Assignable angular expression with 
 *      preferred language to be used as bounded `language` variable. 
 * @param {string} skos-click function to call when a connected concept is clicked
 * @param {string} template-url URL of a template to display the concept
 *
 */
angular.module('ngSKOS')
.directive('skosConcept', function() {
    return {
        restrict: 'AE',
        scope: { 
            concept: '=skosConcept',
            language: '=language',
            click: '=skosClick',
            // TODO: simplify use by providing a SkosConceptProvider and properties
        },
        templateUrl: function(elem, attrs) {
            return attrs.templateUrl ? 
                   attrs.templateUrl : 'template/skos-concept.html';
        },
        link: function link(scope, element, attr) {
            scope.isEmptyObject = function(object) { 
                var keys = Object.keys;
                return !(keys && keys.length);
            };
            scope.$watch('concept',function(concept) {
                angular.forEach([
                        'uri','inScheme','ancestors','prefLabel',
                        'altLabel','scopeNote','description','notation','narrower','broader','related'
                    ],
                    function(field) {
                        scope[field] = concept ? concept[field] : null;
                    }
                );
            },true);
        }
    }
});
