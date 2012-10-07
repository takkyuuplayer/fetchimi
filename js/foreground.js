//<script type="test/javascript">
(function($) {
var FetchImi = FetchImi || {};
FetchImi.Foreground = function() {
    this.port = chrome.extension.connect({name: "FetchImi.Alc"});
    this.bindEvents();
    $('body').append('<div id="fetchimi-window" style="display:none;">');
    this.pageX = 0, this.pageY = 0;
    this.clientX = 0, this.clientY = 0;
    this.lTime = 0;
};

FetchImi.Foreground.prototype = {
    before: null,
    relative: 0,
    resetView: function() {
        $("#fetchimi-window").html('')
            .removeClass()
            .css('discplay', 'none');
    },
    showLoading: function() {
        this.resetView()
        $("#fetchimi-window").text('検索中')
            .css('top', (pageY-10))
            .css('left', (pageX+10))
            .css('display', 'block')
            .addClass('searching');
    },
    showDetail: function(detail) {
        this.resetView()
        $("#fetchimi-window").html(detail);
        $("#fetchimi-window").css('top', (pageY-10))
            .css('left', (pageX+10))
            .css('display', 'block');
    },
    bindEvents: function() {
        var self = this;
        $('body').on('mousemove', function(e) {
            $('#fetchimi-window').css('display', 'none');
        });
        $('body').on('mousemove', function(e) {
            pageX = e.pageX;
            pageY = e.pageY;
            clientX = e.clientX;
            clientY = e.clientY;
        });
        $('body').on('mousemove', function(e) {
            self.resetView()
            lTime = Date.now();
            setTimeout(function(t) {
                if (t !== lTime) {
                    return;
                }
                var word = self.findWord();
                if(self.before === word) {
                    return;
                }
                self.before = word;
                self.showLoading();
                self.port.postMessage({word: word});
            }, 1000, lTime);
        });
        this.port.onMessage.addListener(function(msg) {
            console.log(msg);
            self.resetView()
            if(msg.status === "find") {
                self.showDetail(msg.detail);
            }
        });
    },
    findWord: function() {
        var range = document.caretRangeFromPoint(clientX, clientY);
        var node = range.startContainer;
        var onmousetext = node.textContent;
        var mouseoffset = range.startOffset;

        try {
            if (node.nodeType != Node.TEXT_NODE)
            return;
        } catch (e) {
            return;
        }
        var rng = this.getWordRange(node, mouseoffset);
        if (rng === null) {
            return;
        }

        return rng.toString();
    },
    getWordRange: function(textNode, n) {
        var words = textNode.wholeText.split(/(\b)/i);
        var a = b = -1;
        for ( var i = x = 0; i < words.length; i++)
        if (n < (x += words[i].length)) {
            if (/^\w+$/i.test(words[i])) {
                a = x - words[i].length;
                b = x;
            }
            break;
        }
        if (a == -1 || b == -1)
        return null;
        var rng = document.createRange();
        rng.setStart(textNode, a);
        rng.setEnd(textNode, b);
        return rng;
    }
}
$(function() {
    var foreground = new FetchImi.Foreground();
});
})(jQuery);
