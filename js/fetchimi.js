//<script type="test/javascript">
var FetchImi = FetchImi || {};
FetchImi.Alc = Backbone.Model.extend({
    defaults: {
        url: "http://eow.alc.co.jp/search",
        word: "test",
        $detail: null,
        $variation: null,
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
        var reg = new RegExp("^"+this.get("word")+"$", "i");
        return reg.test(this.getMidashi());
    },
    hasVariation: function() {
        if(!this.get("$detail")) {
            return false;
        }
        var word = this.get("$detail").find("div.sas a:first-child");
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
        return $.get(this.get("url"), {q: this.get("word")})
            .done($.proxy(function(html) {
                        this.set("$detail", $(html).find("#resultsList ul li:first-child"));
                        }, this))
        ;
    }
});
var alc = new FetchImi.Alc();
chrome.extension.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
      if(! msg.word) {
          port.postMessage({status: "notfind"});
          return;
      }
      alc.set("word", msg.word);
      alc.fetch().done(function() {
          if( alc.isFind() ) {
              port.postMessage({status: "find", detail:alc.get("$detail").html()});
              return;
          }
          port.postMessage({status: "notfind"});
      });
  });
});
