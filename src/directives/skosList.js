/**
 * @ngdoc directive
 * @name ng-skos.directive:skosList
 * @restrict A
 * @description
 *
 * This directive displays a list of [concepts](http://gbv.github.io/jskos/jskos.html#concepts) 
 * with options to manipulate those lists.
 *
 * ## Customization
 *
 * The [default
 * template](https://github.com/gbv/ng-skos/blob/master/src/templates/skos-list.html) 
 * can be changed with parameter `templateUrl`.
 *
 * ## Source code
 *
 * The most recent [source 
 * code](https://github.com/gbv/ng-skos/blob/master/src/directives/skosList.js)
 * of this directive is available at GitHub.
 *
 * @param {string} skosList Object containing an array of concepts
 * @param {string} onSelect function handling the selection of one list item
 * @param {string} canRemove support a `removeConcept` method to remove list items
 * @param {string} templateUrl URL of a template to display the concept list
 *
*/

angular.module('ngSKOS')
.directive('skosList', function(){
    return {
        restrict: 'A',
        scope: {
            concepts: '=skosList',
            onSelect: '=onSelect',
            canRemove: '=canRemove',
        },
        templateUrl: function(elem, attrs) {
            return attrs.templateUrl ?
                   attrs.templateUrl : 'template/skos-list.html';
        },
        link: function link(scope, element, attr) {
            if (scope.canRemove) {
                scope.removeConcept = function(index) { 
                    scope.concepts.splice(index, 1);
                };
            }
            scope.$watch('concepts');
        }
    };
});
