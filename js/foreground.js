//<script type="test/javascript">
(function($) {
var FetchImi = FetchImi || {};
FetchImi.Foreground = function() {
    this.bindEvents();
    $('body').append('<div id="fetchimi-window" style="display:none;">');
};

FetchImi.Foreground.prototype = {
    before: null,
    pageX: 0,
    pageY: 0,
    clientX: 0,
    clientY: 0,
    lTime: 0,
    relative: 0,
    showLoading: function() {
        $("#fetchimi-window").html('').text('検索中');
        $("#fetchimi-window").removeClass();
        $("#fetchimi-window").css('top', (pageY-10))
            .css('left', (pageX+10))
            .css('display', 'block')
            .addClass('searching');
    },
    showDetail: function(detail) {
        $("#fetchimi-window").html('').text('検索中');
        $("#fetchimi-window").html(detail);
        $("#fetchimi-window").css('top', (pageY))
            .css('left', (pageX))
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
            }, 1000, lTime);
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
    var port = chrome.extension.connect({name: "FetchImi.Alc"});
    port.onMessage.addListener(function(msg) {
        if(msg.status === "find") {
            foreground.showDetail(msg.detail);
        }
    });
});
})(jQuery);
