define([
	'jquery',
	'underscore',
	'backbone',
	'models/band'
], function($, _, Backbone, Band){

	window.DecisionMenu = Backbone.Model.extend({
		defaults: {
			prompt: 'No choice for now',
			visible: 0,
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
			this.set('prompt', optionsArray.prompt);
			this.set('choices', optionsArray.choices);
			this.trigger('change:message');
		},

		hideDecisionMenu: function(){
			this.set('visible', 0);
		},

		showDecisionMenu: function(){
			this.set('visible', 1);
		},

		choose: function(choiceNumber){
			if (choiceNumber < this.get('choices').length){
				choice = this.get('choices')[choiceNumber];
				choice.callback();
				this.hideDecisionMenu();
				this.nextPhase();
			} else {
				console.log('not a valid choice');
			}
		},

		nextPhase: function(){
			window.gameStats.set('ready', 1);
			window.gameLoop.nextPhase();
		}
	});

	return window.DecisionMenu;

});