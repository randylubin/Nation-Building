define([
	'jquery',
	'underscore',
	'backbone',
    'logisticGrowth'
], function($, _, Backbone, logisticGrowth){

    window.Territory = Backbone.Model.extend({
		defaults: {
	            resources: 100,
	            population: 0,
	            color: "#FF9000",
	            maxColor: "#FF9000",
	            neighbors: [],
	            carryingCapacity: 400
        },

        initialize: function(){
        	_.bindAll(this, 'changePopulation', 'expand', 'growOnce');
        	//this.set('color', gameStats.get('neutralColor'));
        },

        changePopulation: function(people){
        	this.set('population', this.get('population') + people);
        	if (this.get('population') > 0){
        		this.set('color', rainbow.colourAt(this.get('population')))
        		this.set('maxColor', gameStats.get('maxColor'))
        	} else {
        		this.set('color', gameStats.get('neutralColor'));
        	}

        	this.trigger('change:population');

        	return this;
        },

        growOnce: function(){
        	var newPop = ~~(logisticGrowth(this.get('population'), gameStats.get('growthRate'), this.get('carryingCapacity')))
        	this.set('population', newPop);
        	////console.log('grew')
        	this.trigger('change:population')

        },

        calculateGrowth: function(){
        	var newPop = ~~(logisticGrowth(this.get('population'), gameStats.get('growthRate'), this.get('carryingCapacity')))
        	return newPop - this.get('population');
        },

        expand: function(){
        	var currentPop = this.get('population');
        	var freePop = gameStats.get('minPopToExp') * (2/3);
        	var popPerExp = gameStats.get('popPerExp');
        	var popToChange = 0;
        	
    		//find viable expansion targets       	
        	var neighbors = _.map(this.get('neighbors'), function(neighbor){
        			return territories.get(neighbor);
				});

        	var targets = _.shuffle(_.filter(neighbors, function(neighbor){
        		neighbor = territories.get(neighbor);
        		if (neighbor.get('population') < (currentPop - popPerExp)){
        			return true;
				}
        	}));	
        	
        	//allocate expansion
        	if (targets.length){
        		var expansions = Math.floor(freePop / popPerExp);
        		for (var i = 0; i < expansions; i++){
	        		var target = targets[i % targets.length]
	        		target.changePopulation(popPerExp)
	        		/*_.forEach(targets, function(target){
	        			target.changePopulation(popToRemove)
	        		});*/
	        		expansions--;
	        	};
        		this.set('population', this.get('population') - (popPerExp * expansions));
        		this.trigger('change:population');
        	};
        }
	});
	

})