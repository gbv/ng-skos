angular.module('myApp', ['ui.bootstrap','ngSKOS','ngSuggest']);

function myController($scope, $q, OpenSearchSuggestions, SkosConceptProvider, SkosHTTPProvider) {

    // RVK-Zugriff ausgelagert in rvk.js
    var rvk = rvkConceptScheme(
        $q,
        SkosConceptProvider, SkosHTTPProvider, OpenSearchSuggestions
    );

    rvk.getTopConcepts().then(function(response){
        rvk.topConcepts = response;
    });

    // demo of skos-browser
    $scope.sampleConcept = {};
    
    rvk.lookupNotation('UN').then(function(response){
        angular.copy(response, $scope.sampleConcept);
    });

    $scope.selectTopConcept = function(concept){
        rvk.lookupNotation(concept.notation).then(function(response){
            angular.copy(response, $scope.sampleConcept);
        });
    };


    // demo of skos-list
    $scope.conceptList = [];
    $scope.selectedConcept = {};
    rvk.lookupNotation('UN').then(function(response){
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
        rvk.lookupNotation(concept.notation[0]).then(function(response){
            angular.copy(response, $scope.selectedConcept);
        });
        $scope.conceptLabel = {};
    }
    
    $scope.rvk = rvk;
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
});
