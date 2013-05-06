define([
	'jquery',
	'underscore',
	'backbone',
	'easel'
], function($, _, Backbone, Easel){

	window.DecisionMenuView = Backbone.View.extend({
		tagName: 'span',

		events: {
			'click .choice': 'choose'
		},

		initialize: function() {
			//console.log('maptime')
			_.bindAll(this, 'render', 'choose');
			this.model.bind('change', this.render);
			this.template = _.template($('#decisionMenu-template').html());
			//this.collection.bind('reset', this.render);

		},

		render: function() {
			var renderedContent = this.template(this.model.toJSON());
			$(this.el).html(renderedContent);

			return this;
		},

		choose: function(e){
			var choiceIndex = $(".choice").index(e.currentTarget);
			console.log('You chose:', choiceIndex);
			window.decisionMenu.choose(choiceIndex);


		}

	});

	return window.DecisionMenuView;

});