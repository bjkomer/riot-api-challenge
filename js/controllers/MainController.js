//app.controller('MainController', ['$scope', '$http', 'itemData', function($scope, $http, itemData) {
app.controller('MainController', ['$scope', '$http', function($scope, $http, itemData) {
	
	$scope.items = null;
	$http.get('data/completed_items.json')
		.success(function(data) {
			$scope.items = data;
		})
		.error(function(data) {
			$scope.items = null;
	});

	$scope.champions = null;
	$http.get('data/champions.json')
		.success(function(data) {
			$scope.champions = data;
		})
		.error(function(data) {
			$scope.champions = null;
	});
	
	$scope.itemImage = function (name) {
		return 'images/items/'+name.replace(/ /gi, '_')+'_item.png'
	}
	$scope.championImage = function (name) {
		return 'images/champions/'+name.replace(/ /gi, '_')+'_Square_0.png'
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

	// returns a filter function that matches the requirements of the given filter object
	// extra is an additional filter than can be passed and checked as well. Used for boots and jungle items
	$scope.buildFilter = function(filter, extra) {
		return function(el) {
			for (var key in filter) {
				if (filter.hasOwnProperty(key)) {
					if (el[key] != filter[key]) {
						return false;
					}
				}
			}
			for (var key in extra) {
				if (extra.hasOwnProperty(key)) {
					if (el[key] != extra[key]) {
						return false;
					}
				}
			}
			return true
		}
	};

	$scope.bootsFilter = $scope.buildFilter({boots:"1"});
	$scope.jungleFilter = $scope.buildFilter({jungle:"1"});

	$scope.filters = {championfiler: {}, itemfilter: {}}; //default to no filters
	$scope.setFilter = function (name) {
		$scope.filters['itemfilter'] = {};
		if (name != 'all') {
			$scope.filters['itemfilter'][name] = "1";
		}
	}

	$scope.setChampFilter = function (name) {
		$scope.filters['championfilter'] = {};
		if (name != 'all') {
			$scope.filters['championfilter'][name] = "1";
		}
	}

	// Constructs the json for the item set file
	$scope.buildItemSetFile = function (items, champion) {
		var itemList = [];
		for (var i = 0; i < items.length; i++) {
			itemList.push({
				id: items[i].id,
				count: 1
			});
		}
		return {
			title: "Challenger",
			type: "custom",
			map: "any",
			mode: "any",
			priority: false,
			sortrank: 0,
			blocks: [
				{
					type: "Your Arsenal", //TODO: put a random phrase here
					recMath: false,
					items: itemList
				}
			]
		}
	};

	// Generate a random item set, given specific restrictions
	$scope.buildRandomItemSet = function (filters) {
		var data = {
			items: [null, null, null, null, null, null],	//list of 6 items
			champion: null,									//chamption info
			spells: [null, null],							//two summoner spells
			masteries: [0, 0, 0],							//mastery points
			max: [0],										//ability to max first
			file: null										//text for the item set file
		};
		//TODO: pick random summoner spells, randomly include a jungle item if smite is taken
		//TODO: pick random boots first
		//TODO: code in the restrictions
		//TODO: pick a random champion
		
		// Pick Champion
		// TODO: don't pick viktor if his hex core item is not allowed
		var championFilter = $scope.buildFilter(filters.championfilter, null);
		var championList = $scope.champions.filter(championFilter);
		console.log(championList.length);
		index = Math.floor((Math.random() * championList.length));
		data.champion = {
			id: championList[index].id.toString(),
			name: championList[index].name,
			icon: $scope.championImage(championList[index].image_name),
		};


		// Pick Summoner Spells
		//TODO

		// Pick Items
		var i = 0; // number of items picked to far

		// Pick Boots
		var bootsFilter = $scope.buildFilter(filters.itemfilter, {boots:1});
		var bootsList = $scope.items.filter(bootsFilter);
		//alert($scope.items.length);
		//alert(bootsList.length);
		index = Math.floor((Math.random() * bootsList.length));
		data.items[i] = {
			id: bootsList[index].id.toString(),
			name: bootsList[index].name,
			icon: $scope.itemImage(bootsList[index].name)
		}
		i++;

		// Viktor is a special snowflake
		if (data.champion.name == "Viktor") {
			data.items[i] = {
				id: "3198",
				name: "Perfect Hex Core",
				icon: $scope.itemImage("Perfect Hex Core")
			}
			i++;
		}

		var jungleFilter = $scope.buildFilter(filters.itemfilter, {jungle:"1"});

		// Don't allow boots and jungle items to be found normally
		var itemFilter = $scope.buildFilter(filters.itemfilter, {boots:"0", jungle:"0", viktor:"0"});
		var itemList = $scope.items.filter(itemFilter);
		var alreadyPicked = []

		while( i < 6 ) {
			// Generate random index for the item array
			// TODO: disallow duplicate items? Gold items and ward stones for sure can't be duplicated
			index = Math.floor((Math.random() * itemList.length));
			
			// Keep picking randomly until you get a unique item
			while( alreadyPicked.indexOf(itemList[index].id) > -1 ){
				index = Math.floor((Math.random() * itemList.length));
			}
			alreadyPicked.push(itemList[index].id);

			data.items[i] = {
				id: itemList[index].id.toString(),
				name: itemList[index].name,
				icon: $scope.itemImage(itemList[index].name)
			}
			i++;

			// Limit to one gold income item
			
			if (itemList[index].gold == "1") {
				itemFilter = $scope.buildFilter(filters.itemfilter, {boots:"0", jungle:"0", viktor:"0", gold:"0"});
				itemList = $scope.items.filter(itemFilter);
			}
		}
		data.file = $scope.buildItemSetFile(data.items, data.champion);
		return data;
	}


}]);