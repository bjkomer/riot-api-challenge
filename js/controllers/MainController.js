//app.controller('MainController', ['$scope', '$http', 'itemData', function($scope, $http, itemData) {
app.controller('MainController', ['$scope', '$http', function($scope, $http, itemData) {
	
	$scope.items = null;
	$http.get('data/completed_items.json')
		.success(function(data) {
			$scope.items = data;//data.data;
		})
		.error(function(data) {
			$scope.items = null;
	});
	

	//$scope.items = null; 
	$scope.itemImage = function (name) {
		return 'images/items/'+name.replace(/ /gi, '_')+'_item.png'
	}
	/*
	$scope.processData = function(allText) {
	    // split content based on new line
	    var allTextLines = allText.split(/\r\n|\n/);
	    var headers = allTextLines[0].split(',');
	    var lines = [];

	    for ( var i = 0; i < allTextLines.length; i++) {
	        // split content based on comma
	        var data = allTextLines[i].split(',');
	        if (data.length == headers.length) {
	            var tarr = [];
	            for ( var j = 0; j < headers.length; j++) {
	                tarr.push(data[j]);
	            }
	            lines.push(tarr);
	        }
	    }
	    $scope.items_csv = lines;
	};
	*/
	/*
	itemData.success(function(data){
		$scope.processData(data);
	})
	*/
	/*
	$http.get('/data/completed_items.csv')
		.success(function(data) {
			$scope.processData(data);
		})
		.error(function(data) {
			$scope.items = null;
	});
	*/
	//$scope.num_items = $scope.items.length;

	// Generate a random item set, given specific restrictions
	$scope.buildRandomItemSet = function (params) {
		var data = {
			items: [null, null, null, null, null, null],	//list of 6 items
			champion: null,									//chamption name
			spells: [null, null],							//two summoner spells
			masteries: [0, 0, 0],							//mastery points
			max: [0]										//ability to max first
		};
		//TODO: pick random summoner spells, randomly include a jungle item if smite is taken
		//TODO: pick random boots first
		//TODO: code in the restrictions
		//TODO: pick a random champion
		for (i = 0; i < 6; i++) {
			// Generate random index for the item array
			index = Math.floor((Math.random() * $scope.items.length) + 1);
			
			data.items[i] = {
				id: $scope.items[index].id,
				name: $scope.items[index].name,
				icon: $scope.itemImage($scope.items[index].name)
			}
			
			/* //old csv way
			data.items[i] = {
				id: $scope.csv_items[index][0],
				name: $scope.items_csv[index][1],
				icon: $scope.itemImage($scope.items_csv[index][1])
			}
			*/
		}
		return data;
	}


}]);