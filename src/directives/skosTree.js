/**
 * @ngdoc directive
 * @name ng-skos.directive:skosTree
 * @restrict A
 * @description
 *
 * Displays a hierarchical view of a concept and its transitive narrowers.
 *
 * ## Customization
 *
 * The [default
 * template](https://github.com/gbv/ng-skos/blob/master/src/templates/skos-tree.html) 
 * can be changed with parameter `templateUrl`.
 *
 * ## Source code
 *
 * The most recent [source 
 * code](https://github.com/gbv/ng-skos/blob/master/src/directives/skosTree.js)
 * of this directive is available at GitHub.
 *
 * @param {string} skos-tree Tree to display
 * @param {string} template-url URL of a template to display the tree
 *
 * @example
 <example module="myApp">
  <file name="index.html">
    <div ng-controller="myController">
      ...
    </div>
  </file>
  <file name="script.js">
    angular.module('myApp',['ngSKOS']);

    function myController($scope) {
        // ...
    }
  </file>
</example>
 */
angular.module('ngSKOS')
.directive('skosTree', function($compile) {
    return {
        restrict: 'A',
        transclude: true,
        scope: {
            tree:'=skosTree',
            language: '=language'
        },
        templateUrl: function(elem, attrs) {
            return attrs.templateUrl ? 
                   attrs.templateUrl : 'template/skos-tree.html';
        },
        compile: function(tElement, tAttr, transclude) {
            var contents = tElement.contents().remove();
            var compiledContents;
            return function(scope, iElement, iAttr) {
                if(!compiledContents) {
                    compiledContents = $compile(contents, transclude);
                }
                compiledContents(scope, function(clone, scope) {
                         iElement.append(clone);
                });
            };
        }
    };
});
