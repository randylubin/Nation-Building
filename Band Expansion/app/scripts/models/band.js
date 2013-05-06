define([
	'jquery',
	'underscore',
	'backbone',
	'logisticGrowth'
], function($, _, Backbone, logisticGrowth){

	window.Band = Backbone.Model.extend({

		defaults: {
			"player": 0,
			"discoveries": {
				"spears": 0,
				"archery": 0,
				"slings": 0,
				"pottery": 0,
				"dogs": 0,
				"livestock": 0,
				"farming": 0,
				"irrigating": 0
			}
		},

		initialize: function(){
			_.bindAll(this, 'growOnce', 'changePopulation', 'decideNextMove', 'move', 'checkWinConditions');
		},

		changePopulation: function(people){
			this.set('population', this.get('population') + people);

			this.trigger('change:population');

			return this;
		},

		growOnce: function(){
			var population = this.get('population');
			var currentEcology = window.territories.get(this.get('territory')).get('currentEcology');

			//update pop of band
			//var populationDelta = Math.max(0,Math.min(~~(1.2*population), currentEcology)) - population;
			var populationDelta = ~~logisticGrowth(population,1.3,currentEcology);
			population = Math.max(population + populationDelta + ~~(0.5+Math.random()),0);
			var newEcology = Math.max(currentEcology - population, 2);
			this.set('population', population);
			//update territory
			var terr = window.territories.get(this.get('territory'));
			terr.set('population', population);
			terr.set('currentEcology', newEcology);
			terr.trigger('change:population');
			this.trigger('change:population');
		},

		decideNextMove: function(){
			var currentEcology;
			var target = [];
			var terr = window.territories.get(this.get('territory'));
			//console.log(terr);
			currentEcology = maxCap = terr.get('currentEcology');
			var neighbors = window.territories.get(this.get('territory')).get('neighbors');
			// create list of neighbors
			neighbors = _.map(neighbors, function(neighbor){
					return territories.get(neighbor);
				});

			// find elligible targets
			_.map(neighbors, function(neighbor){
				if (neighbor.get('currentEcology') > maxCap) {
					target = [neighbor];
					maxCap = neighbor.get('currentEcology');
				} else if (neighbor.get('currentEcology') == maxCap) {
					target.push(neighbor);
				}
			});

			// select target and add to nextMoves
			if (currentEcology < maxCap){
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
		},

		checkWinConditions: function(){

		}

	});

	return window.Band;

});