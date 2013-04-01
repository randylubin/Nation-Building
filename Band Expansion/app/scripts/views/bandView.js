define([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone){

	window.BandView = Backbone.View.extend({
		tagName:  'li',
		className: 'band',

		events: {
			'click .queue.add': 'increase'
		},

		initialize: function() {
			_.bindAll(this, 'render', 'increase');
			this.model.bind('change:stats', this.render);
			this.model.bind('change:population', this.render);
			this.collection.bind('change:stats', this.render);
			this.collection.bind('reset', this.render);
			this.template = _.template($('#band-template').html());
		},

		render: function() {
			var renderedContent = this.template(this.model.toJSON());
			$(this.el).html(renderedContent);

			return this;
		},

		increase: function(){

			this.model.growOnce();

		}

	});

	return window.BandView;

});