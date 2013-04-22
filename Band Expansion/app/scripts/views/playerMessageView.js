define([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone){

	window.PlayerMessageView = Backbone.View.extend({
		tagName: 'span',


		initialize: function() {
			_.bindAll(this, 'render', 'keyup');
			this.model.bind('change:message', this.render);
			this.template = _.template($('#player-message').html());
			$(document).on('keyup', this.keyup);
		},

		render: function() {
			var renderedContent = this.template(this.model.toJSON());
			$(this.el).html(renderedContent);

			return this;
		},

		keyup: function(e){
			if (e.keyCode == 32){
				gameStats.set('ready',1);
				gameLoop.nextPhase();
			} else {
				console.log('key pressed:', e.keyCode);
			}
		}

	});

	return window.PlayerMessageView;

});