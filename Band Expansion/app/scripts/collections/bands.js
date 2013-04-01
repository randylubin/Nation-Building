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
		url: '/bands',

		initialize: function(){
			_.bindAll(this, 'increasePop', 'decideNextMove','move');
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
		}

	});

	return window.Bands;

});
