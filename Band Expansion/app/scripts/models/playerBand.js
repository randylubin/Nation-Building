define([
	'jquery',
	'underscore',
	'backbone',
	'models/band'
], function($, _, Backbone, Band){

	window.PlayerBand = Band.extend({
		defaults: {
			"name": "Player Band",
			"population": 20,
			"growthRate": 2,
			"military": 0,
			"technology": 0,
			"disposition": 5,
			"resources": 0,
			"relationships": [],
			"player": 1
		},

		decideNextMove: function(){
			//ask for move
			var neighbors = window.territories.get(this.get('territory')).get('neighbors');
			console.log('make your move');
			//window.moved = null;
			//while (!window.moved){}
			//var target = prompt('where to move?', neighbors);
			var target = window.playerMoveTarget;
			console.log('target', target);
			//window.moved = null;

			//move
			this.setMove(this.cid, target, this.get('territory'));
		}
	});

	return window.PlayerBand;

});