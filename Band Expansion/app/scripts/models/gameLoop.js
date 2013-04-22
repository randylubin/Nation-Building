define([
    'jquery',
    'underscore',
    'backbone',
    'collections/territories',
    'collections/bands',
    'models/gameStats',
    //'models/territory',
    'models/band',
    'views/libraryView',
    'views/mapView',
    'models/decisionMenu'
], function ($, _, Backbone, Territories, Bands, GameStats, Band, LibraryView, MapView, DecisionMenu){

/*
    var say = function(say){
        console.log(arguments);           
    };
*/
    var say = function(message){
        window.message.say(message);
    };



	window.GameLoop = Backbone.Model.extend({

        initialize: function() {
            _.bindAll(this, 'nextPhase');
        },

        phases: [
            /*
            //Reset defaults
            function(){
                window.nextMoves = [];
                gameLoop.nextPhase();
            },
*/
            //player selects move
            function(){
                window.nextMoves = [];
                if (gameStats.get('player')){
                    say('Choose target');
                    gameStats.set('ready', 0);
                } else {
                    gameLoop.nextPhase();
                }
            },

            // assess legality of moves
            function(){
                if (gameStats.get('player')){
                    say('Assessing move legality');
                    var target = window.playerMoveTarget;
                    var legalTargets = territories.get(window.playerBand.get('territory')).get('neighbors');
                    legalTargets.push(window.playerBand.get('territory'));
                    //say('legal', legalTargets)
                    if (_.contains(legalTargets, target)){
                        //say('legal move');
                        gameStats.set('ready', 1);
                        gameLoop.nextPhase();
                    } else {
                        say('Too Far Away; Choose Again');
                        gameStats.set('ready',0);
                        window.gameStats.changePhase(window.gameStats.get('phase')-1);
                    }
                } else {
                    gameLoop.nextPhase();
                }
            },

            // band moves submitted
            function(){
                if (gameStats.get('player')){
                    //player move
                    window.playerBand.decideNextMove();
                    //window.playerMoveTarget = null;                
                }
                //ai submit move
                say('AI choosing targets');
                window.aiBands.decideNextMove();
                //console.log('next moves',nextMoves);
                gameLoop.nextPhase();
            },
            //Band Conflict Management
            function(){
                say('Managing Conflicts');
                //console.log('next moves',nextMoves);
                conflictManager.identifyConflicts(nextMoves);
                console.log(window.conflicts);
                gameLoop.nextPhase();
            },
            //Move & Conflict Resolution
            function(){
                say('Resolving Conflicts and Moves');
                window.bands.move();
                gameLoop.nextPhase();
            },
            //Band Updates
            function(){
                say('Growing Bands');
                window.bands.increasePop();
                gameLoop.nextPhase();
            },
            //Territory Updates
            function(){
                say('Updating Ecology');
                window.territories.updateCarryingCapacity();
                gameStats.increaseTurnCounter();
                gameLoop.nextPhase();
            },
            // Random Decision
            function(){
                if (true){
                    say('decision time!');
                    window.decisionMenu.showDecisionMenu();
                }
            }

        ],


        nextPhase: function(){
            if (gameStats.get('ready')){
                setTimeout( function(){
                    currentPhase = gameStats.get('phase') + 1;
                    currentPhase = currentPhase % gameLoop.phases.length;
                    window.gameStats.changePhase(currentPhase);
                    gameLoop.phases[currentPhase]();
                }, 300);
            } else {
                gameLoop.phases[gameStats.get('phase')]();
            }
        },

        addNewMove: function(band, target, origin){
            //say('adding');
            window.nextMoves.push({'band': band,'target': target, 'origin': origin});
        }
    });

    return window.GameLoop;

});