define([
	'jquery',
	'underscore',
	'backbone',
	'models/territory',
	'models/band',
	'gameloop/gameLoop',
	'collections/territories'
], function($, _, Backbone, territory, band, gameLoop, territories){

	window.PopulatedTerritories = Territories.extend({

	});

	return PopulatedTerritories;

});