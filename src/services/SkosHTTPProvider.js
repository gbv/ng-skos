/**
 * @ngdoc service
 * @name ng-skos.service:SkosHTTPProvider
 * @description
 * 
 * Utility service to facilitate HTTP requests. 
 *
 * This service implements use of URL templates to perform HTTP requests with 
 * optional transformation of JSON responses and error handling.
 *
 * The service is not related to JSKOS but used as utility in ng-skos. A future
 * release of ng-skos may drop it favor of $http or $resource
 * 
 * ## Configuration
 * 
 * * **`url`**: URL requests
 * * **`jsonp`**: enable JSONP (true/false/0/1/name)
 * * **`transform`**: custom transformation function to map expected response format
 *
 * ## Methods
 *
 * * **`get([url])`**: perform a HTTP request
 *
 */
angular.module('ngSKOS') // TODO: rename to SkosHTTP?
.factory('SkosHTTPProvider',['$http','$q',function($http,$q) {

    var SkosHTTPProvider = function(args) {
        if (!args) { args = {}; }
        this.transform = args.transform;
        this.url = args.url;
        var jsonp = args.jsonp;
        if (jsonp && (jsonp === true || angular.isNumber(jsonp) || jsonp.match(/^\d/))) {
            jsonp = 'callback';
        }
        this.jsonp = jsonp;
    };

    SkosHTTPProvider.prototype = {
        get: function(url) {
            if (!url) {
                url = this.url;
            }

            var transform = this.transform;

            var get = $http.get;
            if (this.jsonp) {
                get = $http.jsonp;
                url += url.indexOf('?') == -1 ? '?' : '&';
                url += this.jsonp + '=JSON_CALLBACK';
            }

            return get(url).then(
                function(response) {
                    try {
                        return transform ? transform(response.data) : response.data;
                    } catch(e) {
                        console.error(e);
                        return $q.reject(e);
                    }
                }, function(response) {
                    console.error(response);
                    return $q.reject(response.data);
                }
            );
        }
    };

    return SkosHTTPProvider;
}]);
