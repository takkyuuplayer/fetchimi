var FetchImi = FetchImi || {};
FetchImi.Alc = Backbone.Model.extend({
	defaults: {
		url: "http://eow.alc.co.jp/search",
		word: "test",
		$detail: null
	},
	getMidashi: function() {
		if(!this.get("$detail")) {
			return null;
		}
	  	return this.get("$detail").find("span.midashi").text();
	},
	isFind: function() {
		if(!this.get("$detail")) {
			return false;
		}
		return this.get("word") === this.getMidashi();
	},
	getPron: function() {
		if(!this.get("$detail")) {
			return null;
		}
		return this.get("$detail").find("span.pron").text();
	},
	getDescriptions: function() {
		if(!this.get("$detail")) {
			return null;
		}
		var classes  = this.get("$detail").find("div span.wordclass");
		var meanings = this.get("$detail").find("div ol");
		var descs = [];
		classes.each(function(i) {
			descs.push({class:$(this).html(), meaning:$(meanings[i]).html()});
		});
		return descs;
	},
	fetch: function() {
	  	return $.get(this.get("url"), {q: this.get("word")}).done($.proxy(function(html) {
	  		this.set("$detail", $(html).find("#resultsList ul li:first-child"));
	  	}, this));
	}
});
$(function() {
	console.log("read");
	var alc = new FetchImi.Alc();
	alc.set("word", "play");
	alc.fetch().done(function() {
		console.log(alc.isFind());
		console.log(alc.getMidashi());
		console.log(alc.getPron());
		console.log(alc.getDescriptions());
	});
});