define([
	'jquery',
	'underscore',
	'backbone',
	'models/band'
], function($, _, Backbone, Band){

	window.PlayerMessage = Backbone.Model.extend({
		defaults: {
			message: 'Welcome, click to move'
		},

		initialize: function(){
			console.log('Message Loaded');
		},

		say: function(message){
			this.set('message', message);
			this.trigger('change:message');
		}
	});

	return window.PlayerMessage;

});