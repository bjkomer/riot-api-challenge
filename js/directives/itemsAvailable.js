// Lists all items available for a particular category, and builds an item set with all of them
app.directive('itemsAvailable', function(){
	return {
		restrict: 'E',
		scope: {
			data: '=',
			rangeFn: '='
		},
		templateUrl: 'js/directives/itemsAvailable.html'
	}
})