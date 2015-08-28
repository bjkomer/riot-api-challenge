//app.controller('MainController', ['$scope', '$http', 'itemData', function($scope, $http, itemData) {
app.controller('MainController', ['$scope', '$http', function($scope, $http) {
	
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

	$scope.spells = null;
	$http.get('data/spells.json')
		.success(function(data) {
			$scope.spells = data;
		})
		.error(function(data) {
			$scope.spells = null;
	});
	
	$scope.itemImage = function (name) {
		return 'images/items/'+name.replace(/ /gi, '_')+'_item.png'
	}
	$scope.championImage = function (name) {
		return 'images/champions/'+name.replace(/ /gi, '_')+'_Square_0.png'
	}
	$scope.spellImage = function (name) {
		return 'images/spells/'+name.replace(/ /gi, '_')+'.png'
	}

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
	$scope.buildItemSetFile = function (items, champion, name, blockName) {
		var itemList = [];
		for (var i = 0; i < items.length; i++) {
			itemList.push({
				id: items[i].id,
				count: 1
			});
		}
		return {
			title: name,
			type: "custom",
			map: "any",
			mode: "any",
			priority: false,
			sortrank: 0,
			blocks: [
				{
					type: blockName, //TODO: put a random phrase here
					recMath: false,
					items: itemList
				}
			]
		}
	};

	//TODO add more here
	// some fun titles for the item sets
	$scope.braveryTitles = ["Feeder", "Noob", "Cardboard VII", "Useless"];
	$scope.budgetTitles = ["Super Saver", "Cheapskate", "Broke", "Penniless", "Begger", 
	                       "Financially Irresponsible", "Coupon Clipper", "Poverty Stricken",
	                       "Ramen Noodle Eating", "Bankrupt", "Tax Evader"];
	$scope.activeTitles = ["Button Masher", "Confused", "Face Roller", "Repetitive Strain Injury", 
	                       "Spammer", "Psychotic", "Broken Keyboard"]
	
	// Picks a title relevant to the item filter used
	$scope.pickTitle = function (itemfilter) {
		if (itemfilter.hasOwnProperty('budget')) {
			index = Math.floor((Math.random() * $scope.budgetTitles.length));
			return $scope.budgetTitles[index];
		} else if (itemfilter.hasOwnProperty('active')) {
			index = Math.floor((Math.random() * $scope.activeTitles.length));
			return $scope.activeTitles[index];
		} else if (itemfilter.hasOwnProperty('red')) {
			return "Red Ranger";
		} else if (itemfilter.hasOwnProperty('blue')) {
			return "Blue Ranger";
		} else if (itemfilter.hasOwnProperty('yellow')) {
			return "Yellow Ranger";
		} else if (itemfilter.hasOwnProperty('green')) {
			return "Green Ranger";
		} else if (itemfilter.hasOwnProperty('white')) {
			return "White Ranger";
		} else if (itemfilter.hasOwnProperty('purple')) {
			return "Purple Ranger";
		}
		else {
			index = Math.floor((Math.random() * $scope.braveryTitles.length));
			return $scope.braveryTitles[index];
		}
	}


	// Generate a random item set, given specific restrictions
	$scope.buildRandomItemSet = function (filters) {
		var data = {
			items: [null, null, null, null, null, null],	//list of 6 items
			champion: null,									//chamption info
			spells: [null, null],							//two summoner spells
			masteries: [0, 0, 0],							//mastery points
			max: [0],										//ability to max first
			file: null,										//text for the item set file
			title: null										//title for the item set
		};
		//TODO: pick random summoner spells, randomly include a jungle item if smite is taken
		//TODO: pick random boots first
		//TODO: code in the restrictions
		//TODO: pick a random champion
		
		// Pick title for item set
		data.title = $scope.pickTitle(filters.itemfilter)

		// Pick Champion
		// TODO: don't pick viktor if his hex core item is not allowed
		data.champion = $scope.pickChampion(filters.championfilter);

		// Pick Summoner Spells
		//TODO
		data.spells = $scope.pickSpells(filters.itemfilter);

		// Pick Items
		var i = 0; // number of items picked to far

		// Pick Boots
		var bootsFilter = $scope.buildFilter(filters.itemfilter, {boots:1});
		var bootsList = $scope.items.filter(bootsFilter);

		// If the filter doesn't have any boots (i.e. active items) pick from all boots
		if (bootsList.length == 0) {
			bootsFilter = $scope.buildFilter(null, {boots:1});
			bootsList = $scope.items.filter(bootsFilter);
		}
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

		// chance to pick a jungle item if smite is taken
		if (data.spells[0].id == 11 || data.spells[1].id == 11) {
			var jungleFilter = $scope.buildFilter(filters.itemfilter, {jungle:"1"});
			var jungleList = $scope.items.filter(jungleFilter);
			if (jungleList.length > 0) {
				if (Math.random() > .3) {
					index = Math.floor((Math.random() * jungleList.length));
					data.items[i] = {
						id: jungleList[index].id.toString(),
						name: jungleList[index].name,
						icon: $scope.itemImage(jungleList[index].name)
					}
					i++;
				}
			}
		}
		

		// Don't allow boots and jungle items to be found normally
		var itemFilter = $scope.buildFilter(filters.itemfilter, {boots:"0", jungle:"0", viktor:"0"});
		var itemList = $scope.items.filter(itemFilter);
		var alreadyPicked = [];

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
		//TODO: put fun names in for the item sets 
		data.file = $scope.buildItemSetFile(data.items, data.champion, data.title+" "+data.champion.name, "Your Arsenal");
		return data;
	}

	$scope.rangerColours = ["red", "blue", "yellow", "green", "white", "purple"];
	$scope.rangerNames = ["Red Ranger", "Blue Ranger", "Yellow Ranger", "Green Ranger", "White Ranger", "Purple Ranger"];
	
	$scope.buildRangerItemSet = function() {
		// Remove the team items from display, if there are any
		$scope.teamRangerItems = null;

		// Pick a random colour and set a filter for that colour
		var index = Math.floor((Math.random() * $scope.rangerColours.length));
		var filter = {}
		filter[$scope.rangerColours[index]] = "1"

		// Build the item list
		$scope.rangerItems = $scope.buildItemsAvailable({championfilter:{}, itemfilter:filter}, $scope.rangerNames[index], $scope.rangerNames[index])
	}

	$scope.buildRangerItemSets = function() {
		// Remove the individual items from display, if there are any
		$scope.rangerItems = null;
		$scope.teamRangerItems = [];

		var pickedColours = [];
		var pickedChampions = [];
		
		for (var i = 0; i < 5; i++) {

			// Pick Colour
			var colourIndex = Math.floor((Math.random() * $scope.rangerColours.length));
			// Keep picking randomly until you get a unique colour
			while( pickedColours.indexOf(colourIndex ) > -1 ) {
				colourIndex  = Math.floor((Math.random() * $scope.rangerColours.length));
			}
			pickedColours.push(colourIndex);

			// Pick Champion
			var champIndex = Math.floor((Math.random() * $scope.champions.length));
			// Keep picking randomly until you get a unique champion
			while( pickedChampions.indexOf(champIndex ) > -1 ) {
				champIndex  = Math.floor((Math.random() * $scope.champions.length));
			}
			pickedChampions.push(champIndex);

			var itemFilter = {};
			itemFilter[$scope.rangerColours[colourIndex]] = "1";
			var champFilter = {};
			champFilter["id"] = $scope.champions[champIndex].id;
			$scope.teamRangerItems.push($scope.buildItemsAvailable({championfilter:champFilter, itemfilter:itemFilter}, $scope.rangerNames[colourIndex], $scope.rangerNames[colourIndex]));
		}
	}

	$scope.buildBudgetItemSet = function() {
		// Remove the team items from display, if there are any
		$scope.teamBudgetItems = null;

		// Pick a random title
		var index = Math.floor((Math.random() * $scope.budgetTitles.length));

		// Build the item list
		$scope.budgetItems = $scope.buildItemsAvailable({championfilter:{budget:"1"}, itemfilter:{budget:"1"}}, $scope.budgetTitles[index], $scope.budgetTitles[index])
	}

	$scope.buildBudgetItemSets = function() {
		// Remove the individual items from display, if there are any
		$scope.budgetItems = null;
		$scope.teamBudgetItems = [];

		var pickedTitles = [];
		var pickedChampions = [];
		
		for (var i = 0; i < 5; i++) {

			// Pick Title
			var titleIndex = Math.floor((Math.random() * $scope.budgetTitles.length));
			// Keep picking randomly until you get a unique colour
			while( pickedTitles.indexOf(titleIndex ) > -1 ) {
				titleIndex  = Math.floor((Math.random() * $scope.budgetTitles.length));
			}
			pickedTitles.push(titleIndex);

			// Pick Champion
			var champ = $scope.pickChampion({budget:"1"});
			// Keep picking randomly until you get a unique colour
			while( pickedChampions.indexOf(champ.id ) > -1 ) {
				 champ = $scope.pickChampion({budget:"1"});
			}
			pickedChampions.push(champ.id);

			$scope.teamBudgetItems.push($scope.buildItemsAvailable({championfilter:{id:champ.id}, itemfilter:{budget:"1"}}, $scope.budgetTitles[titleIndex], $scope.budgetTitles[titleIndex]));
		}
	}

	$scope.buildActiveItemSet = function() {
		// Remove the team items from display, if there are any
		$scope.teamActiveItems = null;

		// Pick a random title
		var index = Math.floor((Math.random() * $scope.activeTitles.length));

		// Build the item list
		$scope.activeItems = $scope.buildItemsAvailable({championfilter:{}, itemfilter:{active:"1"}}, $scope.activeTitles[index], $scope.activeTitles[index])
	}

	$scope.buildActiveItemSets = function() {
		// Remove the individual items from display, if there are any
		$scope.activeItems = null;
		$scope.teamActiveItems = [];

		var pickedTitles = [];
		var pickedChampions = [];
		
		for (var i = 0; i < 5; i++) {

			// Pick Title
			var titleIndex = Math.floor((Math.random() * $scope.activeTitles.length));
			// Keep picking randomly until you get a unique colour
			while( pickedTitles.indexOf(titleIndex ) > -1 ) {
				titleIndex  = Math.floor((Math.random() * $scope.activeTitles.length));
			}
			pickedTitles.push(titleIndex);

			// Pick Champion
			var champ = $scope.pickChampion({});
			// Keep picking randomly until you get a unique colour
			while( pickedChampions.indexOf(champ.id ) > -1 ) {
				 champ = $scope.pickChampion({});
			}
			pickedChampions.push(champ.id);

			$scope.teamActiveItems.push($scope.buildItemsAvailable({championfilter:{id:champ.id}, itemfilter:{active:"1"}}, $scope.activeTitles[titleIndex], $scope.activeTitles[titleIndex]));
		}
	}

	// builds a list of all items available for a particular filter
	$scope.buildItemsAvailable = function(filters, name, blockName) {
		var data = {
			items: [],				//list of all items
			champion: null,			//chamption info
			spells: [null, null],	//two summoner spells
			masteries: [0, 0, 0],	//mastery points
			max: [0],				//ability to max first
			file: null,				//text for the item set file
			title: name				//title for the item set
		};

		// Pick Champion
		// TODO: don't pick viktor if his hex core item is not allowed
		data.champion = $scope.pickChampion(filters.championfilter);
		data.items = $scope.getAllItems(filters.itemfilter);
		data.spells = $scope.pickSpells(filters.itemfilter);
		data.file = $scope.buildItemSetFile(data.items, data.champion, name+" "+data.champion.name, blockName);
		return data;
	}

	// Picks a random champion following a given filter
	$scope.pickChampion = function (filter) {
		var championFilter = $scope.buildFilter(filter, null);
		var championList = $scope.champions.filter(championFilter);
		index = Math.floor((Math.random() * championList.length));
		return {
			id: championList[index].id.toString(),
			name: championList[index].name,
			icon: $scope.championImage(championList[index].image_name),
		};
	}

	// Returns true if the filter is for colours
	$scope.colourFilter = function(itemfilter){
		if (itemfilter.hasOwnProperty('red')) {
			return true;
		} else if (itemfilter.hasOwnProperty('blue')) {
			return true;
		} else if (itemfilter.hasOwnProperty('yellow')) {
			return true;
		} else if (itemfilter.hasOwnProperty('green')) {
			return true;
		} else if (itemfilter.hasOwnProperty('white')) {
			return true;
		} else if (itemfilter.hasOwnProperty('purple')) {
			return true;
		} else {
			return false;
		}
	}

	// Picks random summoner spells, of a particular colour if that filter is given
	$scope.pickSpells = function (filter) {
		
		// Filter summoner spells only by colour
		if ($scope.colourFilter(filter)) {
			var spellFilter = $scope.buildFilter(filter, null);
			var spellList = $scope.spells.filter(spellFilter);
		} else {
			var spellList = $scope.spells;
		}
		
		var spells = [null, null];
		index = Math.floor((Math.random() * spellList.length));
		spells[0] = {
			id: spellList[index].id.toString(),
			name: spellList[index].name,
			icon: $scope.spellImage(spellList[index].name),
		};

		var alreadyPicked = index;
		while( alreadyPicked == index ) {
			index = Math.floor((Math.random() * spellList.length));
		}

		spells[1] = {
			id: spellList[index].id.toString(),
			name: spellList[index].name,
			icon: $scope.spellImage(spellList[index].name),
		};

		return spells
	}

	// Returns an array with all items that match a particular filter
	$scope.getAllItems = function (filter) {
		var itemFilter = $scope.buildFilter(filter, null);
		var itemList = $scope.items.filter(itemFilter);
		var ret = [];
		for (var i = 0; i < itemList.length; i++ ) {
			ret.push({
				id: itemList[i].id.toString(),
				name: itemList[i].name,
				icon: $scope.itemImage(itemList[i].name)
			})
		}
		return ret
	}

	// Simplified version of Python's range() function
	$scope.range = function(end) {
		var result = [];
	    for (var i = 0; i < end; i += 1) {
	        result.push(i);
	    }
	    return result;
	}

}]);