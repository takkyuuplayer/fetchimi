(function($) {
var before = '';
var ITime = null;
var pageX = 0, pageY = 0;
$(function() {
	$('body').append('<div id="fetchimi-window" style="display:none;">');
	var port = chrome.extension.connect({name: "FetchImi.Alc"});
		port.onMessage.addListener(function(msg) {
			if(msg.status === "find") {
				onText(msg.detail);
			}
		});
	$('body').mousemove(function(e) {
		$('#fetchimi-window').css('display', 'none');
		var range = document.caretRangeFromPoint(e.clientX, e.clientY);
		var node = range.startContainer;
		var onmousetext = node.textContent;
		var mouseoffset = range.startOffset;
		// グローバル変数なので、マウスを動かすたびに変更される
		lTime = Date.now();
		setTimeout(function(t) {
			if (t != lTime) {
				return;
			}
			try {
				if (node.nodeType != Node.TEXT_NODE)
					return;
			} catch (e) {
				return;
			}
			var rng = getWordRange(node, mouseoffset);
			if (rng == null || before == rng.toString()) {
				return;
			}
			pageX = e.pageX;
			pageY = e.pageY;
			before = rng.toString();
			port.postMessage({word: before});
		}, 1000, lTime);
	});
});
function getWordRange(textNode, n) {
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
function onText( detail ) {
    $("#fetchimi-window").ready(function() {
    	$("#fetchimi-window").html(detail);
    	$("#fetchimi-window").css('top', (pageY))
    		.css('left', (pageX))
    		.css('display', 'block');
    });
}
})(jQuery);