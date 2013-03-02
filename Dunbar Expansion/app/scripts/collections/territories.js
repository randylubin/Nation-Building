define([
	'jquery',
	'underscore',
	'backbone',
	'models/territory',
	'models/band'
], function($, _, Backbone, territory, band){


	window.Territories = Backbone.Collection.extend({
		model: Territory,

		initialize: function(){
        	_.bindAll(this, 'expand', 'growOnce');
        },

		growOnce: function(){
			var terrs = this.models;

			var popped = _.filter(terrs, function(territory){
				if( territory.get('population') > 0){
					return true;
				};
			});

			var growthTable = [];

			// calc growth
			_.map(popped, function(territory){
				var growth = territory.calculateGrowth()
				//console.log(growth)
				growthTable.push(
					{'cid': territory.cid,
					 'growth': growth
					});
			});

			//increase pop
			_.map(growthTable, function(thing){
				var terr = territories.get(thing.cid);
				terr.changePopulation(thing.growth)
			});

		},

		expand: function(){
			var terrs = territories.models;
			//console.log(terrs)

			var popped = _.filter(terrs, function(territory){

				if( territory.get('population') >= gameStats.get('minPopToExp')){

					return true;
				};
			});

			//console.log("big enough tiles:", popped)

			var expansionTable = [];
			//calc expansion
			_.map(popped, function(territory){
				var expand = territory.expand();
			});

			/*
			//increase pop
			_.map(expansionTable, function(thing){
				var terr = territories.getByCid(thing.cid);
				terr.changePopulation(thing.growth)
			});*/
		}
	});

})
