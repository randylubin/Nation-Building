define([
	'jquery',
	'underscore',
	'backbone',
	'easel'
], function($, _, Backbone, Easel){
		window.MapView = Backbone.View.extend({
			tagName: 'canvas',
			className: 'gameMap',

			events: {

			},

			initialize: function() {
				//console.log('maptime')
				_.bindAll(this, 'render');
				this.collection.bind('change:map', this.render);
				//this.collection.bind('change:population', this.render);
				//this.template = _.template($('#map-template').html())
				//this.collection.bind('reset', this.render);

			},

			render: function(){
				stage.removeAllChildren();
				var Collection = this.collection;
				//$(this.el).html(this.template({}));


				var context = document.getElementById("canvasId").getContext("2d");


				// Draw Territories

				var linewidth = gameStats.get('linewidth');
				var width = 48;  // Territory Width
				var height = 43; // Territory Height
				//var tile;

				//var stage = new createjs.Stage('canvasId');

				this.collection.each(function(territory){

					var x = territory.get('x')*width + 0.5*(territory.get('y')%2)*width; //16.8 offset?
					var y = territory.get('y')*height;

					var container = new createjs.Container();
					var hex = new createjs.Shape();
					hex.graphics.beginFill(territory.get('color')).drawPolyStar(x, y, 25, 6, 0, 90);
					hex.x = 50;
					hex.y=50;
					hex.cid = territory.cid;

					//when the player clicks, set moved to that hex
					//(function(target) {
						hex.onPress = function(evt) {
							console.log('Target selected:', hex.cid);
							window.playerMoveTarget = hex.cid;
							if ((gameStats.get('phase') === 0) && (gameStats.get('ready') === 0)){
								gameStats.set('ready',1);
								gameLoop.nextPhase();
							}

						};
					//})(hex);


					container.addChild(hex);


/*
					// Draw a path
					context.clearRect(x,y,width,height);
					context.globalCompositeOperation = 'source-over';
					context.globalAlpha = 0.1;
					context.fillStyle = territory.get('color');
					context.fillRect(x+linewidth, y+linewidth, width-linewidth*2, height-linewidth*2);


					// Fill the path
					context.globalAlpha = 1;
					context.strokeStyle = territory.get('maxColor');
					context.lineWidth = linewidth;
					context.strokeRect(x+linewidth, y+linewidth, width-linewidth*2, height-linewidth*2);
*/
					//add text
					//context.fillStyle = 'black';
					//context.fillText(territory.get('population'),x+60, y+63);
					//context.fillStyle = 'red';
					//context.fillText(territory.get('carryingCapacity'),x+60,y+73);

					var text = new createjs.Text(territory.get('population'), "12px Arial", "black");
					text.x = x + 35;
					text.y = y + 50;
					text.textBaseline = "alphabetic";

					container.addChild(text);

					text = new createjs.Text(territory.get('currentEcology'), "12px Arial", "red");
					text.x = x + 35;
					text.y = y + 63;
					text.textBaseline = "alphabetic";

					container.addChild(text);


					//update stage
					stage.addChild(container);

				});
				
				stage.update();

				return this;
			}


		});

		return window.MapView;

});
