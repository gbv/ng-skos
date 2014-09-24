angular.module('myApp', ['ui.bootstrap','ngSKOS','ngSuggest']);

function myController($scope, $q, OpenSearchSuggestions, SkosConceptProvider, SkosConceptListProvider) {

    // RVK-Zugriff ausgelagert in rvk.js
    $scope.rvk = rvkTerminologyService(
        $q,
        SkosConceptProvider, SkosConceptListProvider, OpenSearchSuggestions
    );
    // init example via RVK API
    $scope.sampleConcept = {};
    $scope.rvk.byNotation('UN').then(function(response){
        angular.copy(response, $scope.sampleConcept);
    });
    $scope.rvk.topConcepts.getConceptList().then(function(response){
        $scope.rvkTopConcepts = response;
    });
    $scope.selectTopConcept = function(notation){
        $scope.rvk.byNotation(notation).then(function(response){
            angular.copy(response, $scope.sampleConcept);
        });
    };
    //$scope.safeApply = function(fn) { 
    //    var phase = this.$root.$$phase; 
    //    if(phase == '$apply' || phase == '$digest') { if(fn) fn(); } else { this.$apply(fn); } };
    //

    $scope.conceptList = [];
    $scope.selectedConcept = {};
    $scope.rvk.byNotation('UN').then(function(response){
        angular.copy(response, $scope.selectedConcept);
    });
    $scope.addConcept = function(concept){
        $scope.conceptList.push({
            prefLabel: { de: concept.prefLabel.de },
            notation: [ concept.notation[0] ],
            uri: concept.uri
        });
    };
    $scope.checkDuplicate = function(){
        var dupe = false;
        angular.forEach($scope.conceptList, function(value, key){
            if(value.uri == $scope.selectedConcept.uri){
                dupe = true;
            }
        })
        return dupe;
    }
    $scope.reselectConcept = function(concept){
        
        $scope.rvk.byNotation(concept.notation[0]).then(function(response){
            angular.copy(response, $scope.selectedConcept);
        });
        $scope.conceptLabel = {};
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
.config(function($locationProvider, $anchorScrollProvider) {
    $locationProvider.html5Mode(true);
})
.controller('MainCtrl', function ($$rootScope, $location) { 
    
});
