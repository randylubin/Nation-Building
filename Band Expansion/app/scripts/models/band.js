define([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone){

	window.Band = Backbone.Model.extend({

		changePopulation: function(people){
        	this.set('population', this.get('population') + people);

        	this.trigger('change:population');

        	return this;
        }		

	});	

})