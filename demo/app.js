angular.module('myApp', ['ui.bootstrap','ngSKOS']);

function myController($scope, SkosConceptProvider) {

    var rvkProvider = new SkosConceptProvider({
        //url:'data/rvk/{notation}.json',
        //jsonp: false,

        // TOOD: look up narrower
        url: "http://rvk.uni-regensburg.de/api/json/node/{notation}",
        transform: function(item) {
            var concept = {
                notation: [ item.node.notation ],
                uri: item.node.notation,
                prefLabel: { de: item.node.benennung },
                altLabel: "" ,
                hasChildren: false
            }
            if(angular.isArray(item.node.register)){
                concept.altLabel = item.node.register;
            }else if(angular.isString(item.node.register)){
                concept.altLabel = [item.node.register];
            }
            if(item.node.has_children == 'yes'){
                concept.hasChildren = true;
            }
            return concept;
        },
        jsonp: 'jsonp'
    });
    $scope.rvkByNotation = rvkProvider;


    //$scope.safeApply = function(fn) { 
    //    var phase = this.$root.$$phase; 
    //    if(phase == '$apply' || phase == '$digest') { if(fn) fn(); } else { this.$apply(fn); } };
    //

    $scope.sampleConcept = { notation: ['UN'] };
    rvkProvider.updateConcept($scope.sampleConcept);
    
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
    $rootScope.treeSample = {};
	$http.get('data/tree-1.json').success(function(data){
        $rootScope.treeSample = data;
	});
})
.config(function($locationProvider) {
    $locationProvider.html5Mode(true);
}).controller('MainCtrl', function ($$rootScope, $location) { });
