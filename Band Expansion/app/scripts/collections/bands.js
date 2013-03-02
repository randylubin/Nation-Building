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

		increasePop: function(){

			var bands = this.models;
			
			_.map(bands, function(band){
				band.growOnce();
			})
			
			this.trigger('change:stats')
		}	

	});

	return window.Bands

})
