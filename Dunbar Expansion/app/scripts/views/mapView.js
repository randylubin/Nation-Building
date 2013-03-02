define([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone){
		window.MapView = Backbone.View.extend({
			tagName: 'canvas',
			className: 'gameMap',

			initialize: function() {
				//console.log('maptime')
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
		return window.MapView

});
