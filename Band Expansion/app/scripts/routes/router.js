define([
    'jquery',
    'underscore',
    'backbone',
    'easel',
    'collections/territories',
    'collections/bands',
    'models/gameStats',
    'models/territory',
    'models/band',
    'models/playerBand',
    'views/libraryView',
    'views/mapView',
    'models/gameLoop',
    'views/playerMessageView',
    'views/decisionMenuView'
], function ($, _, Backbone, Easel, Territories, Bands, GameStats, Territory, Band, PlayerBand, LibraryView, MapView, GameLoop, PlayerMessageView, DecisionMenuView)
{
    var Router = Backbone.Router.extend({
        routes: {
            '': 'home',
            'blank' : 'blank',
            '#': 'home'
        },

        initialize: function() {
            this.libraryView = new LibraryView({
                collection: window.bands
            });
            this.mapView = new MapView({
                collection: window.territories
            });
            this.playerMessageView = new PlayerMessageView({
                model: window.message
            });
            this.decisionMenuView = new DecisionMenuView({
                model: window.decisionMenu
            });
            window.territories.setup();
        },

        home: function(){
            var $container = $('#container');
            $container.empty();
            $container.append(this.playerMessageView.render().el);
            $container.append(this.decisionMenuView.render().el);
            $container.append(this.libraryView.render().el);
            this.mapView.render();
        },

        blank: function(){
            $('#container').empty();
            $('#container').text('blank');
        },

        advanceTurns: function(turnTarget){
            setTimeout( function(){
                if(turnTarget /*> gameStats.get('turn')*/){
                    gameLoop.nextPhase();
                    turnTarget--;
                    window.App.advanceTurns(turnTarget);
                } else {
                    //console.log('finished');
                }
            }, 300);
        }

    });
    return Router;
});