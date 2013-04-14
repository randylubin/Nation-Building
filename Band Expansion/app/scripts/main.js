require.config({
  paths: {
    'jquery': 'vendor/jquery/jquery',
    'underscore': 'vendor/underscore-amd/underscore',
    'backbone': 'vendor/backbone-amd/backbone',
    'easel': 'vendor/EaselJS/lib/easeljs-0.6.0.min'
  }
});

requirejs(['jquery', 'underscore', 'backbone', 'easel', 'routes/router', 'collections/bands', 'collections/aiBands', 'models/band', 'models/playerBand', 'models/conflictManager', 'models/eventStream', 'models/playerMessage'],
    function ($, _, Backbone, Easel, Router, Bands, AIBands, Band, PlayerBand, ConflictManager, EventStream, PlayerMessage)
    {


        //TODO refactor rainbow, add to bower
        window.rainbow = {
            colourAt:function(){
                return true;
            }
        };

        $(document).ready(function ()
        {
            console.log('Initializing Application.');
            window.stage = new createjs.Stage('canvasId');
            window.message = new PlayerMessage();
            window.gameStats = new GameStats();
            window.eventStream = new EventStream();
            window.conflictManager = new ConflictManager();
            window.bands = new Bands();
            window.aiBands = new AIBands();
            window.bands.fetch({success: function(){
                console.log('check bands', bands);
                _.map(bands.models, function(band){
                    window.aiBands.add(band);
                });
                if (gameStats.get('player')){
                    window.playerBand = new PlayerBand();
                    window.bands.unshift(window.playerBand);
                }
                window.territories.setup();
            }});
            window.territories = new Territories();
            window.nextMoves = [];
            window.gameLoop = new GameLoop();

            window.rainbow = new Rainbow();
            rainbow.setSpectrum(gameStats.get('minColor'),gameStats.get('maxColor'));
            rainbow.setNumberRange(0, gameStats.get('maxPopColor'));

            window.App = new Router();
            Backbone.history.start({
                pushState : true
            });
        });
    }
);

