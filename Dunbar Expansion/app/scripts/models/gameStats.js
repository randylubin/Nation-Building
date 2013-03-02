define([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone){

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

	return window.GameStats

})
