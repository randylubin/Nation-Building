require.config({
  paths: {
    'jquery': 'vendor/jquery/jquery',
    'underscore': 'vendor/underscore-amd/underscore',
    'backbone': 'vendor/backbone-amd/backbone',
    'easel': 'vendor/EaselJS/lib/easeljs-0.6.0.min'
  }
});

requirejs(['jquery', 'underscore', 'backbone', 'easel', 'routes/router', 'collections/bands', 'collections/aiBands', 'models/band', 'models/playerBand', 'models/conflictManager', 'models/eventStream', 'models/playerMessage', 'models/decisionMenu', 'models/decisionLibrary'],
    function ($, _, Backbone, Easel, Router, Bands, AIBands, Band, PlayerBand, ConflictManager, EventStream, PlayerMessage, DecisionMenu, DecisionLibrary)
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
            window.decisionMenu = new DecisionMenu();
            window.decisionLibrary = new DecisionLibrary();
            window.gameStats = new GameStats();
            window.eventStream = new EventStream();
            window.conflictManager = new ConflictManager();
            window.bands = new Bands([{
                    "name": "Fjord Clan",
                    "population": 20,
                    "growthRate": 2,
                    "military": 0,
                    "technology": 0,
                    "disposition": 5,
                    "resources": 0,
                    "relationships": []
                },
                {
                    "name": "Dinar Dynasty",
                    "population": 20,
                    "growthRate": 2,
                    "military": 0,
                    "technology": 0,
                    "disposition": 5,
                    "resources": 0,
                    "relationships": []
                }]);
            window.territories = new Territories();
            window.aiBands = new AIBands();
            window.nextMoves = [];
            window.gameLoop = new GameLoop();
//            window.bands.fetch({success: function(){
            _.map(bands.models, function(band){
                window.aiBands.add(band);
            });
            if (gameStats.get('player')){
                window.playerBand = new PlayerBand();
                window.bands.unshift(window.playerBand);
            }
            //window.territories.setup();
//            }});

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

