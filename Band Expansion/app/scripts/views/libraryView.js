define([
	'jquery',
	'underscore',
	'backbone',
	'views/libraryStatsView',
	'views/libraryBandView'
], function($, _, Backbone, LibraryStatsView, LibraryBandView){

		

	window.LibraryView = Backbone.View.extend({
		tagName: 'section',
		className: 'library',

		initialize: function(){
			_.bindAll(this, 'render');
			this.template = _.template($('#library-template').html());
			this.collection.bind('reset', this.render);
			//this.collection.bind('change', this.render);

		},
		
		render: function(){
			var $stats,
				$bands,
				collection = this.collection;

			$(this.el).html(this.template({}));
			
			$stats = this.$(".stats");
			var view = new LibraryStatsView({
				model: gameStats
			});
			$stats.append(view.render().el)

			$bands = this.$(".bands");
			this.collection.each(function(band) {
				var view = new LibraryBandView({
					model: band,
					collection: collection
				});
				$bands.append(view.render().el)
			});

			return this;
		}		

	});

	return window.LibraryView
	
});
