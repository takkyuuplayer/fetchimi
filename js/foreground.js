var before = '';
$(function() {
	$('body').append('<div id="fetchimi-window">');
	$('body').on('click', function() {
		var port = chrome.extension.connect({name: "FetchImi.Alc"});
		port.postMessage({word: "play"});
		port.onMessage.addListener(function(msg) {
			if(msg.status === "find") {
				$("#fetchimi-window").html(msg.detail);
			}
		});
	});
	$('body').mousemove(function(e) {
		var range = document.caretRangeFromPoint(e.clientX, e.clientY);
		var node = range.startContainer;
		var onmousetext = node.textContent;
		var mouseoffset = range.startOffset;
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
			if (rng == null || before == rng.toString())
				return;
			pageX = e.pageX;
			pageY = e.pageY;
			before = rng.toString();
			alert(before);
		}, 500, lTime);
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