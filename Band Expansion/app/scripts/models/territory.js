define([
	'jquery',
	'underscore',
	'backbone',
	'logisticGrowth',
	'models/gameStats'
], function($, _, Backbone, logisticGrowth, GameStats){

	var gameStats = new GameStats();

	window.Territory = Backbone.Model.extend({
		defaults: {
				resources: 100,
				population: 0,
				color: '#9ACD32', //FF9000
				maxColor: 'forestgreen',
				neighbors: [],
				carryingCapacity: 30,
				player: 0
		},

		initialize: function(){
			_.bindAll(this, 'changePopulation', 'growOnce', 'updateCarryingCapacity');
			//this.set('color', gameStats.get('neutralColor'));
		},

		togglePlayer: function(){
			if (this.get('player')){
				this.set('player', 0);
			} else {
				this.set ('player', 1);
			}
			this.trigger('change:population');
		},

		changePopulation: function(people){
			this.set('population', this.get('population') + people);
			if (this.get('population') > 0){
				if (this.get('player')){
					this.set('color', gameStats.get('playerColor'));
				} else {
					this.set('color', rainbow.colourAt(this.get('population')));
					this.set('maxColor', gameStats.get('maxColor'));
				}
			} else {
				this.set('color', gameStats.get('neutralColor'));
				this.set('player', 0);
			}

			this.trigger('change:population');

			return this;
		},

		growOnce: function(){
			var newPop = ~~(logisticGrowth(this.get('population'), gameStats.get('growthRate'), this.get('carryingCapacity')));
			this.set('population', newPop);
			////console.log('grew')
			this.trigger('change:population');

		},

		calculateGrowth: function(){
			var newPop = ~~(logisticGrowth(this.get('population'), gameStats.get('growthRate'), this.get('carryingCapacity')));
			return newPop - this.get('population');
		},

		updateCarryingCapacity: function(){
			population = this.get('population');
			carryingCapacity = this.get('carryingCapacity');
			//if pop is over half carryingCapacity, reduce cap by 2; over 80%, reduce by 5;
			if (population > (carryingCapacity/2)){
				if (population > (carryingCapacity* 0.8)){
					carryingCapacity -= 5;
				} else {
					carryingCapacity -= 2;
				}
			//otherwise regrow carrying capacity
			} else if(this.get('land')){
				carryingCapacity = Math.min(carryingCapacity * 1 - population, gameStats.get('maxWildCap'));
				this.set('carryingCapacity', carryingCapacity);
			}
			carryingCapacity = Math.max(carryingCapacity, 0);
			this.set('carryingCapacity', carryingCapacity);
		}
	});


});