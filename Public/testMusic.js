window.onload = function() {
	var audioContext;

	//Determine if browser used supports web audio api
	try {
	  window.AudioContext = window.AudioContext || window.webkitAudioContext;
	  audioContext = new AudioContext();
	} catch(e) {
	  alert('Web Audio API is not supported in this browser');
	}
	var sound = audioContext.createBufferSource();
	sound.isLoaded = false;
	getData();
	var lowPassNode = lowPassFilter(sound);

	var button = document.getElementById('playButton');
	button.addEventListener('click', function() {
		playData(sound);
	});

	var lowPassbutton = document.getElementById('playLowPassButton');
	lowPassbutton.addEventListener('click', function() {
		playScriptNodeData(sound, lowPassNode);
	});


	function getData() {
		//Get audio track from file and get as an arraybuffer
		var xmlHttpGet = new XMLHttpRequest();
		xmlHttpGet.open("GET", '/../finalYearProject/music/track1.wav', true); 
		xmlHttpGet.responseType = "arraybuffer"; //arraybuffer = raw binary data

		xmlHttpGet.onload = function() {
			var data = xmlHttpGet.response;
			audioContext.decodeAudioData(xmlHttpGet.response, function(buffer){
				sound.buffer = buffer;
				sound.isLoaded = true;
			},
			function(e){"Error with decoding audio data" + e.err});
			
		}
		xmlHttpGet.send();
	}

	//creates buffer from data response from server and plays file
	function playData(sound) {
		if(sound.isLoaded === true) {
			var newSource = audioContext.createBufferSource();
			newSource.buffer = sound.buffer;
			newSource.connect(audioContext.destination);
			newSource.start(0); //plays the contents of the wav
		} else {
			console.log("sound not loaded!");
		}
	}

	function playScriptNodeData(sound, scriptNode) {
		console.log(scriptNode);
		var newSource = audioContext.createBufferSource();
		newSource.buffer = sound.buffer;
		newSource.connect(scriptNode);
		scriptNode.connect(audioContext.destination);
		newSource.start(0); //plays the contents of the wav
	}
	

	function lowPassFilter(sound) {
		var bufferSize = 4096;
	 	var lastOut = 0.0;
	    var node = audioContext.createScriptProcessor(bufferSize, 1, 1);
	    node.onaudioprocess = function(e) {
	        var input = e.inputBuffer.getChannelData(0);
	        var output = e.outputBuffer.getChannelData(0);
	        for (var i = 0; i < bufferSize; i++) {
	            output[i] = (input[i] + lastOut) / 2;
	            lastOut = output[i];
	        }
	        console.log(output);
	    }
	    return node;
	}
};

