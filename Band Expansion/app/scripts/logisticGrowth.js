define([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone){

	var logisticGrowth = function(pop, r, K){
            pop = pop*r*(1-pop/K)
            return pop
    };

    return logisticGrowth;

});