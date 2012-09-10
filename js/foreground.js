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
});