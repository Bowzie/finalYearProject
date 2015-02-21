window.onload = function() {
	var track;
	var context = new AudioContext();	
	//Get audio track from file and get as an arraybuffer
	var xmlHttpGet = new XMLHttpRequest();
	xmlHttpGet.open("GET", '/../finalYearProject/music/track3.wav', true); 
	xmlHttpGet.responseType = "arraybuffer"; //arraybuffer = raw binary data


	xmlHttpGet.onload = function() {
		context.decodeAudioData(xmlHttpGet.response, function(buffer) {
			loadData(buffer); 
		});
	}

	//creates buffer from data response from server and plays file
	function loadData(data) {
		var track = context.createBufferSource();
		track.buffer = data;
		track.connect(context.destination);
		track.start(0); //plays the contents of the wav
		console.log(track.buffer);
		console.log(track.buffer.getChannelData(4));
	}
	xmlHttpGet.send();
};

