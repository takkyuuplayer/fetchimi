//<script type="test/javascript">
(function($) {
var clientX = clientY = 0
var FetchImi = FetchImi || {}
FetchImi.Foreground = function() {
    this.port = chrome.extension.connect({name: "FetchImi.Alc"})
    this.bindEvents()
    $('body').append('<div id="fetchimi-window" style="display:none;">')
    this.lTime = 0
}

FetchImi.Foreground.prototype = {
    before: null,
    relative: 10,
    resetView: function() {
        $("#fetchimi-window").html('')
            .removeClass()
            .css('display', 'none')
    },
    showProgress: function(message) {
        this.resetView()
        $("#fetchimi-window").text(message)
            .addClass('progress')
            .css('top', (this.calcTop()))
            .css('left', (this.calcLeft()))
            .css('display', 'block')
    },
    showDetail: function(detail) {
        this.resetView()
        $("#fetchimi-window").html(detail)
            .css('top', this.calcTop())
            .css('left', this.calcLeft())
            .css('display', 'block')
    },
    calcTop: function() {
        var height = $("#fetchimi-window").outerHeight()
        var top = clientY + height > $(window).height()
                ? Math.max(0, $(window).height() - height - this.relative)
                : clientY - this.relative

        return top
    },
    calcLeft: function() {
        var width = $("#fetchimi-window").outerWidth()
        console.log(clientX + width > $(window).width())
        var left = clientX + width > $(window).width()
                ? Math.max(0, clientX - width - this.relative)
                : clientX + this.relative

        return left
    },
    bindEvents: function() {
        var self = this
        $('body').on('mousemove', function(e) {
            $('#fetchimi-window').css('display', 'none')
        })
        $('body').on('mousemove', function(e) {
            clientX = e.clientX
            clientY = e.clientY
        })
        $('body').on('mousemove', function(e) {
            self.resetView()
            lTime = Date.now()
            setTimeout(function(t) {
                if (t !== lTime) {
                    return
                }
                var word = self.findWord()
                if(self.before === word) {
                    return
                }
                self.before = word
                self.showProgress('Searching...')
                self.port.postMessage({word: word})
            }, 1000, lTime)
        })
        this.port.onMessage.addListener(function(msg) {
            self.resetView()
            if(msg.status === "find") {
                self.showDetail(msg.detail)
            } else if(msg.status === 'not found') {
                self.showProgress('Not Found')
            }

        })
    },
    findWord: function() {
        var range = document.caretRangeFromPoint(clientX, clientY)
        var node = range.startContainer
        var onmousetext = node.textContent
        var mouseoffset = range.startOffset

        try {
            if (node.nodeType != Node.TEXT_NODE)
            return
        } catch (e) {
            return
        }
        var rng = this.getWordRange(node, mouseoffset)
        if (rng === null) {
            return
        }

        return rng.toString()
    },
    getWordRange: function(textNode, n) {
        var words = textNode.wholeText.split(/(\b)/i)
        var a = b = -1
        for ( var i = x = 0; i < words.length; i++)
        if (n < (x += words[i].length)) {
            if (/^\w+$/i.test(words[i])) {
                a = x - words[i].length
                b = x
            }
            break
        }
        if (a == -1 || b == -1)
        return
        var rng = document.createRange()
        rng.setStart(textNode, a)
        rng.setEnd(textNode, b)
        return rng
    }
}
$(function() {
    var foreground = new FetchImi.Foreground()
})
})(jQuery)
