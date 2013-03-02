define([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone){

	window.LibraryStatsView = Backbone.View.extend({
		tagName: 'li',
		className: 'gameStats',

		initialize: function() {
			_.bindAll(this, 'render');
			this.model.bind('change:gameStats', this.render);
			this.template = _.template($('#stats-template').html())
		},

		render: function() {
			var renderedContent = this.template(this.model.toJSON());
			$(this.el).html(renderedContent);

			return this
		}


	});

	return window.LibraryStatsView

});