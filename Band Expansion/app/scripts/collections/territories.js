define([
	'jquery',
	'underscore',
	'backbone',
	'models/territory',
	'models/band'
], function($, _, Backbone, territory, Band){


	window.Territories = Backbone.Collection.extend({
		model: Territory,

		initialize: function(){
			_.bindAll(this, 'growOnce', 'updateCarryingCapacity');

			// build initial territory array
			var rows = gameStats.get('rows');
			var columns = gameStats.get('columns');
			this.cidArray = [];

			for (var i = 0; i < columns; i++) {
				var cidRow = [];
				for (var j = 0; j < rows; j++){
					var territory = new Territory({
						x: i,
						y: j,
						land: Math.floor(Math.random()+gameStats.get('landOdds'))
					});
					if (!territory.get('land')){
							territory.set({population: "≈≈≈≈≈", carryingCapacity: ""});
							territory.set('color', 'aqua');
							territory.set('maxColor', 'aqua');
						}
					this.add(territory);
					cidRow.push(territory.cid);
				}
				this.cidArray.push(cidRow);
			}

			// add neighbor information to territories
            var allTerr = this.models;
            _.forEach(this.models, function(territory){
                //check if it's land
                var neighborArray = [];
                if (territory.get('land')){
                    var thisX = territory.get('x');
                    var thisY = territory.get('y');
                    //filter for the neighbors
                    neighborArray = _.filter(allTerr, function(neighbor){
                        //check if it's land
                        if (neighbor.get('land')){
                            var newX = neighbor.get('x');
                            var newY = neighbor.get('y');
                            //odd rows
                            if (thisY % 2) {
                                //row above and below
                                if ((newY == thisY -1 || newY == thisY +1) && (newX == thisX || newX == thisX +1)){
                                    return true;
                                //same row
                                } else if (newY == thisY && (newX == thisX - 1 || newX == thisX +1)){
                                    return true;
                                }
                            //even rows
                            } else {
                                //row above and below
                                if ((newY == thisY -1 || newY == thisY +1) && (newX == thisX || newX == thisX - 1)){
                                    return true;
                                //same row
                                } else if (newY == thisY && (newX == thisX - 1 || newX == thisX +1)){
                                    return true;
                                }
                            }
                        }
                    });
                }
                neighborArray = _.map(neighborArray, function(thing){
                    return thing.cid;
                });
                territory.set('neighbors', neighborArray);
            });	

		},

		setup: function(){
			//create directional mapping
			_.forEach(this.models, function(territory){
				var directionalNeighbors = [];
				var thisX = territory.get('x');
				var thisY = territory.get('y');
				var rows = gameStats.get('rows');
				var columns = gameStats.get('columns');
				var oddLine = thisY % 2;
				var neighbor = null;
				var candidate = null;

				//northwest
				neighbor = null;
				if (thisY !== 0 && !(thisX === 0 && !oddLine)){
					if (oddLine){
						neighbor = territories.cidArray[thisX][thisY - 1];
					} else {
						neighbor = territories.cidArray[thisX - 1][thisY - 1];
					}
				}
				directionalNeighbors.push(neighbor);

				//northeast
				neighbor = null;
				if (thisY !== 0 && !(thisX == columns - 1 && oddLine)){
					if (oddLine){
						neighbor = territories.cidArray[thisX + 1][thisY - 1];
					} else {
						neighbor = territories.cidArray[thisX][thisY - 1];
					}
				}
				directionalNeighbors.push(neighbor);

				//east
				neighbor = null;
				if (thisX != columns -1){
					neighbor = territories.cidArray[thisX + 1][thisY];
				}
				directionalNeighbors.push(neighbor);

				//southeast
				neighbor = null;
				if (thisY != rows - 1 && !(thisX == columns - 1 && oddLine)){
					if (oddLine){
						neighbor = territories.cidArray[thisX + 1][thisY + 1];
					} else {
						neighbor = territories.cidArray[thisX][thisY + 1];
					}
				}
				directionalNeighbors.push(neighbor);

				//southwest
				neighbor = null;
				if (thisY != rows - 1 && !(thisX === 0 && !oddLine)){
					if (oddLine){
						neighbor = territories.cidArray[thisX][thisY + 1];
					} else {
						neighbor = territories.cidArray[thisX - 1][thisY + 1];
					}
				}
				directionalNeighbors.push(neighbor);

				//west
				neighbor = null;
				if (thisX !== 0){
					neighbor = territories.cidArray[thisX -1][thisY];
				}
				directionalNeighbors.push(neighbor);

				//stay put
				directionalNeighbors.push(territory.cid);

				territory.set('directionalNeighbors', directionalNeighbors);
			});

			//place initial pops on the map

			//get land tiles
            var landed = _.shuffle(_.filter(this.models, function(terr){
                return terr.get('land');
            }));

            _.map(window.bands.models, function(band){
				var home = landed.pop();
				band.set({territory: home.cid, carryingCapacity: home.get('carryingCapacity')});
				home.set('player', band.get('player'));
				home.changePopulation(gameStats.get('initialPop'));
            });
            if (gameStats.get('player')){
	            window.moved = window.playerBand.get('territory');
	            window.playerMoveTarget = window.playerBand.get('territory');
	        }
            window.territories.trigger('change:map');
		},

		growOnce: function(){
			var terrs = this.models;

			var popped = _.filter(terrs, function(territory){
				if( territory.get('population') > 0){
					return true;
				}
			});

			var growthTable = [];

			// calc growth
			_.map(popped, function(territory){
				var growth = territory.calculateGrowth();
				//console.log(growth)
				growthTable.push({
					'cid': territory.cid,
					'growth': growth });
			});

			//increase pop
			_.map(growthTable, function(table){
				var terr = territories.get(table.cid);
				terr.changePopulation(table.growth);
			});

		},

		updateCarryingCapacity: function(){
			_.map(this.models, function(territory){
				if (territory.get('land')) {territory.growOnce();}
			});
		}
	});

});
