define([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone){

	var whisper = function(say){
        console.log(arguments);           
    };

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
			// movement: q,w,d,x,z,a,s
			var moveKeyArray = [81,87,68,88,90,65,83];
			var keyCode = e.keyCode;

			// 
			// space to continue
			// 
			if (keyCode == 32 && gameStats.get('hitSpaceToContinue') == 1){ //space
				gameStats.set('hitSpaceToContinue', 0);
				gameStats.set('ready',1);
				gameLoop.nextPhase();
			//
			// numbers to select options
			// 
			} else if((keyCode >= 48 && keyCode <= 57) && gameStats.get('hitNumberToDecide') == 1) {
				whisper('you decided', (keyCode - 48));
				decisionMenu.choose(keyCode - 49);
				gameStats.set('hitNumberToDecide', 0);
			//
			// movement: w,e,d,x,z,a,s
			// 
			} else if (_.contains(moveKeyArray, keyCode) && gameStats.get('selectToMove') == 1) {
				var moveKeyIndex = _.indexOf(moveKeyArray, keyCode);
				var terr = territories.get(playerBand.get('territory'));
				window.playerMoveTarget = terr.get('directionalNeighbors')[moveKeyIndex];

				if ((gameStats.get('phase') === 0) && (gameStats.get('ready') === 0)){
					gameStats.set('ready',1);
					gameStats.set('hitSpaceToContinue', 0);
					gameLoop.nextPhase();
				}

			} else {
				whisper('not a valid key press');
			}
			whisper('key pressed:', keyCode);
		}

	});

	return window.PlayerMessageView;

});