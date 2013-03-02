define([
    'jquery',
    'underscore',
    'backbone',
    'collections/territories',
    'collections/bands',
    'models/gameStats',
    'models/territory',
    'models/band',
    'views/libraryView',
    'views/mapView'
], function ($, _, Backbone, Territories, Bands, GameStats, Territory, Band, LibraryView, MapView)
{
    var Router = Backbone.Router.extend({
        routes: {
            '': 'home',
            'blank' : 'blank'
        },

        initialize: function() {
            this.libraryView = new LibraryView({
                collection: window.bands
            });
            this.mapView = new MapView({
                collection: window.territories
            });
        },

        home: function(){
            var $container = $('#container');
            $container.empty();
            $container.append(this.libraryView.render().el);
            $container.append(this.mapView.render());
        },

        blank: function(){
            $('#container').empty();
            $('#container').text('blank');
        },

        advanceTurns: function(turns){
            setTimeout( function(){
                if(turns>0){
                    //console.log('remaining:', turns);
                    //library.increasePop();
                    territories.growOnce();
                    territories.expand();
                    gameStats.increaseTurnCounter();
                    turns -= 1;
                    window.App.advanceTurns(turns);

                } else {
                    //console.log('finished');
                }
            }, 300);
        }

    });
    return Router;
});