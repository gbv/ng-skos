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
 * @param {string} concepts array of JSKOS concepts to display
 * @param {string} onSelect function handling the selection of one concept
 * @param {string} canRemove support a `removeConcept` method to remove concepts
 * @param {string} templateUrl URL of a template to display the concept list
 *
 */
angular.module('ngSKOS')
.directive('skosList', function($timeout){
    return {
        restrict: 'E',
        scope: {
            concepts: '=concepts',
            onSelect: '=onSelect',
            canRemove: '=removeable',
            showLabels: '=showLabels'
        },
        templateUrl: function(elem, attrs) {
            return attrs.templateUrl ?
                   attrs.templateUrl : 'template/skos-list.html';
        },
        link: function link(scope, element, attr) {
            scope.removeConcept = function(index) { 
                scope.concepts.splice(index, 1);
            };
            scope.tabFocus = null;
            scope.$watch('concepts');
            scope.clicked = function(index){
                scope.tabFocus = index;
                scope.onSelect(scope.concepts[index]);
            };
            scope.focused = function(index){
                scope.tabFocus = index;
            };
            scope.onKeyDown = function($event, first, last, index) {
                var key = $event.keyCode;
                scope.tabFocus = index;
                if(key == 38){
                    $event.preventDefault();
                    if(!first){
                        scope.tabFocus--;
                    } else {
                        scope.tabFocus = scope.concepts.length - 1;
                    }
                    $timeout(function(){
                        var fc = angular.element("[list-id=" + scope.tabFocus + "]");
                        fc.focus();
                    },0,false);
                } else if(key == 40){
                    $event.preventDefault();
                    if(last){
                        scope.tabFocus = 0;
                    } else {
                        scope.tabFocus++;
                    }
                    $timeout(function(){
                        var fc = angular.element("[list-id=" + scope.tabFocus + "]");
                        fc.focus();
                    },0,false);
                } else if(key == 46){
                    $event.preventDefault();
                    if(last){
                        scope.tabFocus--;
                    }
                    scope.removeConcept(index);
                    $timeout(function(){
                        var fc = angular.element("[list-id=" + scope.tabFocus + "]");
                        fc.focus();
                    },0);
                } else if(key == 13){
                    $event.preventDefault();
                    scope.onSelect(scope.concepts[index]);
                }
            };
        }
    };
});
