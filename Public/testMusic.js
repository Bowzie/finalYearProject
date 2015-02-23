window.onload = function() {
	var audioContext;

	//Determine if browser used supports web audio api
	try {
	  window.AudioContext = window.AudioContext || window.webkitAudioContext;
	  audioContext = new AudioContext();
	} catch(e) {
	  alert('Web Audio API is not supported in this browser');
	}
	
	source = audioContext.createBufferSource();
	getData();
	//playData(source);
	var lowPassNode = lowPassFilter(source);
	console.log(lowPassNode);
	playData(lowPassNode);

	function getData() {
		//Get audio track from file and get as an arraybuffer
		var xmlHttpGet = new XMLHttpRequest();
		xmlHttpGet.open("GET", '/../finalYearProject/music/track1.wav', true); 
		xmlHttpGet.responseType = "arraybuffer"; //arraybuffer = raw binary data

		xmlHttpGet.onload = function() {
			var data = xmlHttpGet.response;
			audioContext.decodeAudioData(xmlHttpGet.response, function(buffer){
				source.buffer = buffer;
			},
			function(e){"Error with decoding audio data" + e.err});
		}

		xmlHttpGet.send();
	}

	//creates buffer from data response from server and plays file
	function playData() {
		source.connect(lowPassNode);
		lowPassNode.connect(audioContext.destination);
		source.start(0); //plays the contents of the wav
	}
	

	function lowPassFilter(data) {
		var track = data;
		var lastOutput = 0.0;
		var scriptNode;
		scriptNode = audioContext.createScriptProcessor(4096, 1, 1);

		scriptNode.onaudioprocess = function(e) {
	        var input = e.inputBuffer.getChannelData(0);
	        var output = e.outputBuffer.getChannelData(0);
	        for (var i = 0; i < 4096; i++) {
	            output[i] = (input[i] + lastOutput) / 2.0;
	            lastOutput = output[i];
	        }
	        console.log(output);
		}

		return scriptNode;
	}
};

