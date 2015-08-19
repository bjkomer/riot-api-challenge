app.factory('itemData', ['$http', function($http) {
	return $http.get('/data/completed_items.csv')
		.success(function(data) {
			return data;
		})
		.error(function(err) {
			return err;
		});
}]);