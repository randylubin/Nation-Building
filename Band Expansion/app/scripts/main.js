require.config({
  paths: {
    'jquery': 'vendor/jquery/jquery',
    'underscore': 'vendor/underscore-amd/underscore',
    'backbone': 'vendor/backbone-amd/backbone',
  }
});

requirejs(['jquery', 'underscore', 'backbone', 'routes/router', 'collections/bands'],
    function ($, _, Backbone, Router, Bands)
    {

        var buildTerritoryArray = function(collection){
            //console.log('building array of territories; row: ', gameStats.get('rows'), 'columns: ', collection.get('columns'))
            var rows = gameStats.get('rows');
            var columns = gameStats.get('columns');

            for (var i = 0; i < columns; i++) {
                for (var j = 0; j < rows; j++){
                    var territory = new Territory({
                        x: i,
                        y: j,
                        land: Math.floor(Math.random()+gameStats.get('landOdds'))
                    });
                    if (!territory.get('land')){
                            territory.set('color', 'aqua')
                            territory.set('maxColor', 'aqua')
                        };
                    collection.add(territory);
                };
            };
        };

        var findTerritoryNeighbors = function(collection){
            //for each territory
            _.forEach(collection.models, function(territory){
                //check if it's land
                if (territory.get('land')){
                    var thisX = territory.get('x');
                    var thisY = territory.get('y');
                    //filter for the neighbors
                    var neighborArray = []
                    neighborArray = _.filter(collection.models, function(neighbor){
                        //check if it's land
                        if (neighbor.get('land')){
                            var newX = neighbor.get('x');
                            var newY = neighbor.get('y');
                            //odd rows
                            if (thisY % 2) {
                                //row above and below
                                if ((newY == thisY -1 || newY == thisY +1) && (newX == thisX || newX == thisX +1)){
                                    return true;
                                //same row
                                } else if (newY == thisY && (newX == thisX - 1 || newX == thisX +1)){
                                    return true;
                                };  
                            //even rows
                            } else {
                                //row above and below
                                if ((newY == thisY -1 || newY == thisY +1) && (newX == thisX || newX == thisX - 1)){
                                    return true;
                                //same row
                                } else if (newY == thisY && (newX == thisX - 1 || newX == thisX +1)){
                                    return true;
                                };  
                            };
                        };
                    });
                };
                neighborArray = _.map(neighborArray, function(thing){
                    return thing.cid;
                });
                territory.set('neighbors', neighborArray);
            });
        };

        var placeInitialPopulations = function(collection){
            var landed = _.filter(collection.models, function(terr){
                return terr.get('land');
            });

            var home = landed[Math.floor(Math.random()*landed.length)];
            home.changePopulation(100)
        };

        window.rainbow = {
            colourAt:function(){
                return true;
            }
        }


        $(document).ready(function ()
        {
            console.log('Initializing Application.');
            
            window.bands = new Bands();
            window.bands.fetch()
            window.territories = new Territories();
            window.gameStats = new GameStats();

            window.rainbow = new Rainbow();
            rainbow.setSpectrum(gameStats.get('minColor'),gameStats.get('maxColor'));
            rainbow.setNumberRange(0, gameStats.get('maxPopColor'))

            buildTerritoryArray(territories);
            findTerritoryNeighbors(territories);
            placeInitialPopulations(territories);

            window.App = new Router();
            Backbone.history.start({
                pushState : true
            });
        });
    }
);

