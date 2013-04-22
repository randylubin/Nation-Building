define([
	'jquery',
	'underscore',
	'backbone',
	'models/band'
], function($, _, Backbone, Band){

	window.DecisionMenu = Backbone.Model.extend({
		defaults: {
			prompt: 'No choice for now',
			visible: 1,
			choices: [
				{
					"message": "next turn",
					callback: function(){
						console.log('yup');
					}
				},
				{
					"message": "keep going",
					callback: function(){
						console.log('yup');
					}
				}
			]
		},

		initialize: function(){
			console.log('Decision Menu loaded');
			_.bindAll(this, 'newOptions', 'hideDecisionMenu', 'showDecisionMenu', 'choose');
		},

		newOptions: function(optionsArray){
			this.set('message', message);
			this.trigger('change:message');
		},

		hideDecisionMenu: function(){
			this.set('visible', 0);
		},

		showDecisionMenu: function(){
			this.set('visible', 1);
		},

		choose: function(callback){
			callback();
			this.hideDecisionMenu();
			this.nextPhase();
		},

		nextPhase: function(){
			window.gameStats.set('ready', 1);
			window.gameLoop.nextPhase();
		}
	});

	return window.DecisionMenu;

});