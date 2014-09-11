angular.module('myApp', ['ui.bootstrap','ngSKOS','ngSuggest']);

function myController($scope, $q, OpenSearchSuggestions, SkosConceptProvider, SkosConceptListProvider) {

    // RVK-Zugriff ausgelagert in rvk.js
    $scope.rvk = rvkTerminologyService(
        $q,
        SkosConceptProvider, SkosConceptListProvider, OpenSearchSuggestions
    );
    // init example via RVK API
    $scope.sampleConcept = { };
    $scope.rvk.byNotation('UN').then(function(response){
        angular.copy(response, $scope.sampleConcept);
    });
 
    //$scope.safeApply = function(fn) { 
    //    var phase = this.$root.$$phase; 
    //    if(phase == '$apply' || phase == '$digest') { if(fn) fn(); } else { this.$apply(fn); } };
    //

   
    $scope.currentMapping = {
        from: [],
        to: [],
    }
    $scope.insertMapping = function(mapping){
        $scope.currentMapping = mapping;
    }
}

angular.module('myApp')
.run(function($rootScope,$http) {
    
	$http.get('data/jita/jita.json').success(function(jita){
        $rootScope.jita = jita;
        $rootScope.sampleSkosConcept = jita.topConcepts[0].narrower[0];
        // TODO: JITA-Zugriff als TerminologyProvider
	});

})
.config(function($locationProvider) {
    $locationProvider.html5Mode(true);
}).controller('MainCtrl', function ($$rootScope, $location) { });
