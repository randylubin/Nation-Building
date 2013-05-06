define(["jquery","underscore","backbone","easel","collections/territories","collections/bands","models/gameStats","models/territory","models/band","models/playerBand","views/libraryView","views/mapView","models/gameLoop","views/playerMessageView","views/decisionMenuView"],function(e,t,n,r,i,s,o,u,a,f,l,c,h,p,d){var v=n.Router.extend({routes:{"":"home",blank:"blank","#":"home"},initialize:function(){this.libraryView=new l({collection:window.bands}),this.mapView=new c({collection:window.territories}),this.playerMessageView=new p({model:window.message}),this.decisionMenuView=new d({model:window.decisionMenu})},home:function(){var t=e("#container");t.empty(),t.append(this.playerMessageView.render().el),t.append(this.decisionMenuView.render().el),t.append(this.libraryView.render().el),this.mapView.render()},blank:function(){e("#container").empty(),e("#container").text("blank")},advanceTurns:function(e){setTimeout(function(){e&&(gameLoop.nextPhase(),e--,window.App.advanceTurns(e))},300)}});return v});