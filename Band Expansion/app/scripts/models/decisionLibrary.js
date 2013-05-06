define([
	'jquery',
	'underscore',
	'backbone',
	'models/band'
], function($, _, Backbone, Band){

	window.decisionLibrary = Backbone.Model.extend({
		bandDecisions: [
			{prompt: "Decision 1",
			choices: [
				{message: "Win the game",
				callback: function(){
					console.log('chose 1');
					window.playerBand.set('winCriteriaMet',1);
				}},
				{message: "Choice 2",
				callback: function(){
					console.log('chose 2');
				}}
			]},
			{prompt: "Decision 2",
			choices: [
				{message: "Choice 1",
				callback: function(){
					console.log('chose 1');
				}},
				{message: "Choice 2",
				callback: function(){
					console.log('chose 2');
				}}
			]},
			{prompt: "Decision 3",
			choices: [
				{message: "Choice 1",
				callback: function(){
					console.log('chose 1');
				}},
				{message: "Choice 2",
				callback: function(){
					console.log('chose 2');
				}}
			]},{prompt: "Decision 4",
			choices: [
				{message: "Choice 1",
				callback: function(){
					console.log('chose 1');
				}},
				{message: "Choice 2",
				callback: function(){
					console.log('chose 2');
				}}
			]}
		],

		initialize: function(){
			this.bandDecisions = _.shuffle(this.bandDecisions);
		}	

	});

	return window.decisionLibrary;

});