app.directive('itemSet', function(){
	return {
		restrict: 'E',
		scope: {
			data: '='
		},
		templateUrl: 'js/directives/itemSet.html'
	}
})