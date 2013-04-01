define([
	'jquery',
	'underscore',
	'backbone',
	'models/band'
], function($, _, Backbone, Band){

	window.EventStream = Backbone.Model.extend({
		defaults: {
			messages: []
		},

		initialize: function(){
			console.log('Event Stream Initialized');
		},

		broadcast: function(message){
			messages.push(message);
			console.log(message);
		}
	});

	return window.EventStream;

});