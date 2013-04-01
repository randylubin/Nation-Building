define([
	'jquery',
	'underscore',
	'backbone',
	'models/gameStats',
	'models/territory',
	'models/band',
	'collections/bands'
], function($, _, Backbone, gameStats, territory, Band, Bands){

	window.AIBands = Bands.extend({

	});

	return window.AIBands;

});
