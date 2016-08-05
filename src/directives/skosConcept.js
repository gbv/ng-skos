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
 * All [JSKOS concept fields](https://gbv.github.io/jskos/jskos.html#concept)
 * such as `narrower`, `broader` etc. are added to the scope to access directly.
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
                        'altLabel', 'changeNote', 'contributor', 'created',
                        'creator', 'definition', 'depiction', 'editorialNote',
                        'example', 'hiddenLabel', 'historyNote', 'identifier',
                        'issued', 'modified', 'notation', 'partOf',
                        'prefLabel', 'publisher', 'scopeNote', 'subjectOf',
                        'subject', 'type', 'uri', 'url', 'broader', 'narrower',
                        'related', 'previous', 'next', 'startDate', 'endDate',
                        'relatedDate', 'location', 'ancestors', 'inScheme',
                        'topConceptOf', 'relatedPlace'
                    ],
                    function(field) {
                        scope[field] = concept ? concept[field] : null;
                    }
                );
            },true);
        }
    }
});
