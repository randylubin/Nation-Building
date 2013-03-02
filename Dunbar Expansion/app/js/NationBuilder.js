(function($) {

	var logisticGrowth = function(pop, r, K){
		pop = pop*r*(1-pop/K)
		return pop
	};

	var buildTerritoryArray = function(collection){
		//console.log('building array of territories; row: ', gameStats.get('rows'), 'columns: ', collection.get('columns'))
		var rows = gameStats.get('rows');
		var columns = gameStats.get('columns');

		for (var i = 0; i < columns; i++) {
			for (var j = 0; j < rows; j++){
				var territory = new Territory({
					x: i,
					y: j,
					land: Math.floor(Math.random()+gameStats.get('landOdds'))
				});
				if (!territory.get('land')){
						territory.set('color', 'aqua')
						territory.set('maxColor', 'aqua')
					};
				collection.add(territory);
			};
		};
	};

	var findTerritoryNeighbors = function(collection){
		//for each territory
		_.forEach(collection.models, function(territory){
			//check if it's land
			if (territory.get('land')){
				var thisX = territory.get('x');
				var thisY = territory.get('y');
				//filter for the neighbors
				var neighborArray = []
				neighborArray = _.filter(collection.models, function(neighbor){
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
							};	
						//even rows
						} else {
							//row above and below
							if ((newY == thisY -1 || newY == thisY +1) && (newX == thisX || newX == thisX - 1)){
								return true;
							//same row
							} else if (newY == thisY && (newX == thisX - 1 || newX == thisX +1)){
								return true;
							};	
						};
					};
				});
			};
			neighborArray = _.map(neighborArray, function(thing){
				return thing.cid;
			});
			territory.set('neighbors', neighborArray);
		});
	};

	var placeInitialPopulations = function(collection){
		var landed = _.filter(collection.models, function(terr){
			return terr.get('land');
		});

		var home = landed[Math.floor(Math.random()*landed.length)];
		home.changePopulation(100)
	};

	window.rainbow = {
		colourAt:function(){
			return true;
		}
	}

	window.GameStats = Backbone.Model.extend({
		defaults: {
			turn: 0,
			rows: 8,
			columns: 5,
			linewidth: 2,
			popPerExp: 25,
			minPopToExp: 150,
			growthRate: 2.3,
			landOdds: 0.90,
			maxPopColor: 200.0,
			minColor: 'teal',
			maxColor: 'navy',
			neutralColor: '#FF9000'

		},
		
		initialize:function(turn){
		  
		  //console.log(this.get('turn'))
		  //console.log(this.toJSON())
		},

		increaseTurnCounter: function(){
			//console.log('increasing turn')
			//console.log(this.get('turn'))
			var turn = this.get('turn') + 1;
			this.set("turn", turn);
			this.trigger('change:gameStats');
		}

	});

	window.Territory = Backbone.Model.extend({
		defaults: {
	            resources: 100,
	            population: 0,
	            color: "#FF9000",
	            maxColor: "#FF9000",
	            neighbors: [],
	            carryingCapacity: 400
        },

        initialize: function(){
        	_.bindAll(this, 'changePopulation', 'expand', 'growOnce');
        	//this.set('color', gameStats.get('neutralColor'));
        },

        changePopulation: function(people){
        	this.set('population', this.get('population') + people);
        	if (this.get('population') > 0){
        		this.set('color', rainbow.colourAt(this.get('population')))
        		this.set('maxColor', gameStats.get('maxColor'))
        	} else {
        		this.set('color', gameStats.get('neutralColor'));
        	}

        	this.trigger('change:population');

        	return this;
        },

        growOnce: function(){
        	var newPop = ~~(logisticGrowth(this.get('population'), gameStats.get('growthRate'), this.get('carryingCapacity')))
        	this.set('population', newPop);
        	////console.log('grew')
        	this.trigger('change:population')

        },

        calculateGrowth: function(){
        	var newPop = ~~(logisticGrowth(this.get('population'), gameStats.get('growthRate'), this.get('carryingCapacity')))
        	return newPop - this.get('population');
        },

        expand: function(){
        	var currentPop = this.get('population');
        	var freePop = gameStats.get('minPopToExp') * (2/3);
        	var popPerExp = gameStats.get('popPerExp');
        	var popToChange = 0;
        	
    		//find viable expansion targets       	
        	var neighbors = _.map(this.get('neighbors'), function(neighbor){
        			return territories.getByCid(neighbor);
				});

        	var targets = _.shuffle(_.filter(neighbors, function(neighbor){
        		neighbor = territories.getByCid(neighbor);
        		if (neighbor.get('population') < (currentPop - popPerExp)){
        			return true;
				}
        	}));	
        	
        	//allocate expansion
        	if (targets.length){
        		var expansions = Math.floor(freePop / popPerExp);
        		for (var i = 0; i < expansions; i++){
	        		var target = targets[i % targets.length]
	        		target.changePopulation(popPerExp)
	        		/*_.forEach(targets, function(target){
	        			target.changePopulation(popToRemove)
	        		});*/
	        		expansions--;
	        	};
        		this.set('population', this.get('population') - (popPerExp * expansions));
        		this.trigger('change:population');
        	};
        }
	});

	window.Territories = Backbone.Collection.extend({
		model: Territory,

		initialize: function(){
        	_.bindAll(this, 'expand', 'growOnce');
        },

		growOnce: function(){
			var terrs = this.models;

			var popped = _.filter(terrs, function(territory){
				if( territory.get('population') > 0){
					return true;
				};
			});

			var growthTable = [];

			// calc growth
			_.map(popped, function(territory){
				var growth = territory.calculateGrowth()
				//console.log(growth)
				growthTable.push(
					{'cid': territory.cid,
					 'growth': growth
					});
			});

			//increase pop
			_.map(growthTable, function(thing){
				var terr = territories.getByCid(thing.cid);
				terr.changePopulation(thing.growth)
			});

		},

		expand: function(){
			var terrs = this.models;

			var popped = _.filter(terrs, function(territory){
				if( territory.get('population') >= gameStats.get('minPopToExp')){
					////console.log('the popis:', territory.get('population'))
					return true;
				};
			});

			//console.log("big enough tiles:", popped)

			var expansionTable = [];
			//calc expansion
			_.map(popped, function(territory){
				var expand = territory.expand();
			});

			/*
			//increase pop
			_.map(expansionTable, function(thing){
				var terr = territories.getByCid(thing.cid);
				terr.changePopulation(thing.growth)
			});*/
		}
	});

	window.Band = Backbone.Model.extend({

		changePopulation: function(people){
        	this.set('population', this.get('population') + people);

        	this.trigger('change:population');

        	return this;
        }		

	});

	window.Bands = Backbone.Collection.extend({
		model: Band,
		url: '/bands',

		increasePop: function(){

			var bands = this.models;
			
			_.map(bands, function(band){
				band.growOnce();
			})
			
			this.trigger('change:stats')
		}	

	});

/*	*	*	*	*	*	*	*
Initialization
*	*	*	*	*	*	*	*/




	$(document).ready(function() {

		window.library = new Bands();
		window.territories = new Territories();
		window.gameStats = new GameStats();

		window.rainbow = new Rainbow();
		rainbow.setSpectrum(gameStats.get('minColor'),gameStats.get('maxColor'));
		rainbow.setNumberRange(0, gameStats.get('maxPopColor'))

		buildTerritoryArray(territories);
		findTerritoryNeighbors(territories);
		placeInitialPopulations(territories);


		window.TerritoryView = Backbone.View.extend({
		});

		window.MapView = Backbone.View.extend({
			tagName: 'canvas',
			className: 'gameMap',

			initialize: function() {
				//console.log('maptime')
				_.bindAll(this, 'render');
				this.collection.bind('change', this.render);
				this.collection.bind('change:population', this.render);
				//this.template = _.template($('#map-template').html())
				this.collection.bind('reset', this.render);
			},

			render: function(){
				var Collection = this.collection;
				//$(this.el).html(this.template({}));
				

				var context = document.getElementById("canvasId").getContext("2d");
				

				// Draw Territories

				var linewidth = gameStats.get('linewidth');
				var width = 40;  // Territory Width
				var height = 30; // Territory Height

				this.collection.each(function(territory){
					var x = territory.get('x')*width + .5*(territory.get('y')%2)*width
					var y = territory.get('y')*height

					
					// Draw a path
					context.clearRect(x,y,width,height)
					context.globalCompositeOperation = 'source-over';
					context.globalAlpha = 0.1;
					context.fillStyle = territory.get('color');
					context.fillRect(x+linewidth, y+linewidth, width-linewidth*2, height-linewidth*2);
			

					// Fill the path
					context.globalAlpha = 1;
					context.strokeStyle = territory.get('maxColor');
					context.lineWidth = linewidth;
					context.strokeRect(x+linewidth, y+linewidth, width-linewidth*2, height-linewidth*2);

					//add text
					context.fillStyle = 'black';
					context.fillText(territory.get('population'),x+10, y+13)


				});

				return this;
			}

		});

		window.BandView = Backbone.View.extend({
			tagName:  'li',
			className: 'band',

			events: {
				'click .queue.add': 'increase'
			},

			initialize: function() {
				_.bindAll(this, 'render', 'increase');
				this.model.bind('change:stats', this.render);
				this.model.bind('change:population', this.render);
				this.collection.bind('change:stats', this.render);
				this.collection.bind('reset', this.render);
				this.template = _.template($('#band-template').html())
			},

			render: function() {
				var renderedContent = this.template(this.model.toJSON());
				$(this.el).html(renderedContent);

				return this
			},

			increase: function(){

				this.model.growOnce();

			}

		});

		window.LibraryBandView = BandView.extend({});

		window.LibraryStatsView = Backbone.View.extend({
			tagName: 'li',
			className: 'gameStats',

			initialize: function() {
				_.bindAll(this, 'render');
				this.model.bind('change:gameStats', this.render);
				this.template = _.template($('#stats-template').html())
			},

			render: function() {
				var renderedContent = this.template(this.model.toJSON());
				$(this.el).html(renderedContent);

				return this
			}


		});

		window.LibraryView = Backbone.View.extend({
			tagName: 'section',
			className: 'library',

			initialize: function(){
				_.bindAll(this, 'render');
				this.template = _.template($('#library-template').html());
				this.collection.bind('reset', this.render);
				//this.collection.bind('change', this.render);

			},
			
			render: function(){
				var $stats,
					$bands,
					collection = this.collection;

				$(this.el).html(this.template({}));
				
				$stats = this.$(".stats");
				var view = new LibraryStatsView({
					model: gameStats
				});
				$stats.append(view.render().el)

				$bands = this.$(".bands");
				this.collection.each(function(band) {
					var view = new LibraryBandView({
						model: band,
						collection: collection
					});
					$bands.append(view.render().el)
				});

				return this;
			}		

		});

		window.BackboneNationBuilding = Backbone.Router.extend({
			routes: {
				'': 'home',
				'blank' : 'blank'
			},

			initialize: function() {
				this.libraryView = new LibraryView({
					collection: window.library
				});
				this.mapView = new MapView({
					collection: window.territories
				});
			},

			home: function(){
				var $container = $('#container');
				$container.empty();
				$container.append(this.libraryView.render().el);
				$container.append(this.mapView.render());
			},

			blank: function(){
				$('#container').empty();
				$('#container').text('blank');
			},

			advanceTurns: function(turns){
				setTimeout( function(){
					if(turns>0){
						//console.log('remaining:', turns);
						//library.increasePop();
						territories.growOnce();
						territories.expand();
						gameStats.increaseTurnCounter();
						turns -= 1;
						window.App.advanceTurns(turns);

					} else {
						//console.log('finished');
					}
				}, 300);
			}

		});

		$(function() {
			window.App = new BackboneNationBuilding();
			Backbone.history.start();

		});
	});
})(jQuery);
