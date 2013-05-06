define([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone){

	window.GameStats = Backbone.Model.extend({
		defaults: {
			// Overall Game
			turn: 0,
			phase: 0,
			ready: 0,
			player: 1,
			decisions: 1,
			// Game Map
			rows: 6,
			columns: 8,
			linewidth: 2,
			landOdds: 0.90,
			// Population
			popPerExp: 25,
			minPopToExp: 150,
			initialPop: 20,
			//ecology
			growthRate: 1.3,
			maxWildCap: 30,
			// Tile Colors
			maxPopColor: 200.0,
			minColor: '#2f4f4f',
			maxColor: '#2f4f4f',
			neutralColor: '#9ACD32', //FF9000
			playerColor: '#DAA520',
			//eventControls
			hitSpaceToContinue: 0,
			hitNumberToDecide: 0,
			selectToMove: 1,
			//win conditions
			playerHasWon: 0
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
		},

		changePhase: function(newPhase){
			this.set('phase', newPhase);
			this.trigger('change:gameStats');
			territories.trigger('change:map');
		},

		ready: function(){
			return true;
		}

	});

	return window.GameStats;

})
