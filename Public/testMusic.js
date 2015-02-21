window.onload = function() {
	var context = new AudioContext();	

	var track;
	var xmlHttpGet = new XMLHttpRequest();
	xmlHttpGet.open("GET", '/../finalYearProject/music/track1.wav', true);
	xmlHttpGet.responseType = "arraybuffer";
	xmlHttpGet.send();

	xmlHttpGet.onload = function() {
		context.decodeAudioData(xmlHttpGet.response, function(buffer) {
			track = buffer;
			console.log(track);
		});
	}


};
	