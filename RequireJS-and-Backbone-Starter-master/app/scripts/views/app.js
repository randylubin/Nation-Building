define([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone){

		window.TerritoryView = Backbone.View.extend({
		});

		window.MapView = Backbone.View.extend({
			tagName: 'canvas',
			className: 'gameMap',

			initialize: function() {
				sayWhat('maptime')
				_.bindAll(this, 'render');
				this.collection.bind('change', this.render);
				this.collection.bind('change:population', this.render);
				//this.template = _.template($('#map-template').html())
				this.collection.bind('reset', this.render);
			},

			render: function(){
				var Collection = this.collection;
				//$(this.el).html(this.template({}));
				

				var context = document.getElementById("canvasId").getContext("2d");
				

				// Draw Territories

				var linewidth = gameStats.get('linewidth');
				var width = 40;  // Territory Width
				var height = 30; // Territory Height

				this.collection.each(function(territory){
					var x = territory.get('x')*width + .5*(territory.get('y')%2)*width
					var y = territory.get('y')*height

					
					// Draw a path
					context.clearRect(x,y,width,height)
					context.globalCompositeOperation = 'source-over';
					context.globalAlpha = 0.1;
					context.fillStyle = territory.get('color');
					context.fillRect(x+linewidth, y+linewidth, width-linewidth*2, height-linewidth*2);
			

					// Fill the path
					context.globalAlpha = 1;
					context.strokeStyle = territory.get('maxColor');
					context.lineWidth = linewidth;
					context.strokeRect(x+linewidth, y+linewidth, width-linewidth*2, height-linewidth*2);

					//add text
					context.fillStyle = 'black';
					context.fillText(territory.get('population'),x+10, y+13)


				});

				return this;
			}

		});

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
				this.template = _.template($('#band-template').html())
			},

			render: function() {
				var renderedContent = this.template(this.model.toJSON());
				$(this.el).html(renderedContent);

				return this
			},

			increase: function(){

				this.model.growOnce();

			}

		});

		window.LibraryBandView = BandView.extend({});

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
	
});
