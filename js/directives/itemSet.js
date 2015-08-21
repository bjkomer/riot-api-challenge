// Builds and displays a particular item set (including champion and summoner spells)
app.directive('itemSet', function(){
	return {
		restrict: 'E',
		scope: {
			data: '='
		},
		templateUrl: 'js/directives/itemSet.html'
	}
})