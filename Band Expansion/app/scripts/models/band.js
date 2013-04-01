define([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone){

	window.Band = Backbone.Model.extend({

		defaults: {
			"player": 0
		},

		initialize: function(){
			_.bindAll(this, 'growOnce', 'changePopulation', 'decideNextMove', 'move');
		},

		changePopulation: function(people){
			this.set('population', this.get('population') + people);

			this.trigger('change:population');

			return this;
		},

		growOnce: function(){
			var population = this.get('population');
			var carryingCapacity = window.territories.get(this.get('territory')).get('carryingCapacity');

			//check carrying capacity
			population = Math.max(0,Math.min(Math.floor(1.2*population), carryingCapacity));
			this.set('population', population);
			window.territories.get(this.get('territory')).set('population',population);
			this.trigger('change:population');
		},

		decideNextMove: function(){
			var carryingCapacity;
			var target = [];
			var terr = window.territories.get(this.get('territory'));
			//console.log(terr);
			carryingCapacity = maxCap = terr.get('carryingCapacity');
			var neighbors = window.territories.get(this.get('territory')).get('neighbors');
			// create list of neighbors
			neighbors = _.map(neighbors, function(neighbor){
					return territories.get(neighbor);
				});

			// find elligible targets
			_.map(neighbors, function(neighbor){
				if (neighbor.get('carryingCapacity') > maxCap) {
					target = [neighbor];
					maxCap = neighbor.get('carryingCapacity');
				} else if (neighbor.get('carryingCapacity') == maxCap) {
					target.push(neighbor);
				}
			});

			// select target and add to nextMoves
			if (carryingCapacity < maxCap){
				target = _.shuffle(target).pop().cid;
				//var move = {};
				//move = {'band': this.cid, 'target': target};
				//window.nextMoves.push(move);
				this.setMove(this.cid, target, this.get('territory'));
			} else {
				target = this.get('territory');
				//var stay = {};
				//stay = {'band': this.cid, 'target': this.get('territory')};
				//window.nextMoves.push(stay);
				this.setMove(this.cid, this.get('territory'), this.get('territory'));
			}
		},

		setMove: function(bCid, tCid, oCid){
			window.gameLoop.addNewMove(bCid, tCid, oCid);
			this.set('target', tCid);
		},

		move: function(){
			//clear old territory
			var target = territories.get(this.get('target'));
			var terr = window.territories.get(this.get('territory'));
			terr.changePopulation(this.get('population')*-1);
			//populate new territory
			this.set('territory', this.get('target'));
			if (this.get('player')){
				target.set('player', 1);
			}
			target.changePopulation(this.get('population'));
		}

	});

	return window.Band;

});