define([
	'jquery',
	'underscore',
	'backbone',
	'models/gameStats',
	'models/territory',
	'models/band'
], function($, _, Backbone, gameStats, territory, band){

	window.Bands = Backbone.Collection.extend({
		model: Band,
		//url: '/bands',

		initialize: function(){
			_.bindAll(this, 'increasePop', 'decideNextMove','move', 'checkWinConditions');
/*			this.add([
				{
					"name": "Fjord Clan",
				    "population": 20,
				    "growthRate": 2,
				    "military": 0,
				    "technology": 0,
				    "disposition": 5,
				    "resources": 0,
				    "relationships": []
				},
			    {
					"name": "Dinar Dynasty",
				    "population": 20,
				    "growthRate": 2,
				    "military": 0,
				    "technology": 0,
				    "disposition": 5,
				    "resources": 0,
				    "relationships": []
				}
			]);*/
		},

		increasePop: function(){

			_.map(this.models, function(band){
				band.growOnce();
			});

			this.trigger('change:stats');
		},

		decideNextMove: function(){
			_.map(this.models, function(band){
				band.decideNextMove();
			});
		},

		move: function(){
			_.map(this.models, function(band){
				band.move();
			});
		},
		checkWinConditions: function(){
			_.map(this.models, function(band){
				band.checkWinConditions();
			});
		}

	});

	return window.Bands;

});
