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
    'views/mapView'
], function ($, _, Backbone, Territories, Bands, GameStats, Band, LibraryView, MapView){

	window.ConflictManager = Backbone.Model.extend({
        identifyConflicts: function(moves){
            
            window.conflicts = [];
            _.each(moves, function(move){
                console.log('moves', move);
                _.forEach(moves, function(otherMove){
                    if (move.target == otherMove.target) {
                        if (move.band != otherMove.band) { 
                            console.log('conflict');
                            window.conflicts.push(otherMove);
                        }
                    }
                });
            });
            console.log('conflicts', conflicts);
            this.conflictConsolidator(window.conflicts);
        },

        conflictConsolidator: function(){
            var disputedTerritories = [];
            var newConflicts = [];
            // create an array of the disputed terrs
            _.forEach(window.conflicts, function(conflict){
                disputedTerritories.push(conflict.target);
            });
            disputedTerritories = _.uniq(disputedTerritories);

            //map the bands to the conflicts
            _.forEach(disputedTerritories, function(target){
                var bandsInSpace= [];
                _.forEach(window.conflicts, function(conflict){
                    if (conflict.target == target){
                        bandsInSpace.push(conflict.band);
                        console.log('adding conflicted band', conflict.band, 'to territory', target)
                    }
                });
                newConflict = {
                    'target': target,
                    'bands': bands
                };

                newConflicts.push(newConflict);
            });
            console.log('new conflicts', newConflicts)
            
        }
    });

    return window.ConflictManager;

});