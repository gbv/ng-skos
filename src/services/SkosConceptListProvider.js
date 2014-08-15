/**
 * @ngdoc service
 * @name ng-skos.service:SkosConceptListProvider
 * @description
 * 
 * Get an ordered list of concepts via HTTP.
 *
 * The server to be queried with this service is expected to return a list with
 * [concept](#/guide/concepts) objects.
 * 
 * ## Configuration
 * 
 * * **`url`**: URL template to get the list from
 * * **`jsonp`**: enable JSONP
 * * **`transform`**: transformation function to map to expected response format
 *
 * ## Methods
 *
 * * **`getConceptList()`**
 * * **`updateConceptList(list)`**
 *
 */
angular.module('ngSKOS')
.factory('SkosConceptListProvider',['SkosProvider',function(SkosProvider) {

    // inherit from SkosProvider
    var SkosConceptListProvider = function(args) {
        SkosProvider.call(this, args);
    };
    SkosConceptListProvider.prototype = new SkosProvider();
    
    SkosConceptListProvider.prototype.getConceptList = function() {
        return this.get();
    };
    
    SkosConceptListProvider.prototype.updateConceptList = function() {
        return this.getConceptList(list).then(
            function(response) {
                angular.copy(response, list);
            }
        );
    };

    return SkosConceptListProvider;
}]);