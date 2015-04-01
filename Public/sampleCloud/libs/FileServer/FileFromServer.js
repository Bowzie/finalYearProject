var fileFromServer = {
	audioBuffer: null,
};

fileFromServer.init = function(trackPath) {
	//Determine if browser used supports web audio api
	try {
	  window.AudioContext = window.AudioContext || window.webkitAudioContext;
	  audioContext = new AudioContext();
	} catch(e) {
	  alert('Web Audio API is not supported in this browser');
	}

	//Get file from server only if web audio supported
	if(audioContext !== null)
	{
		fileFromServer.GetUserData(trackPath); 
	}
}

fileFromServer.GetFile = function(trackPath) {
	//Get audio track from file and Get as an arraybuffer
	var xmlHttpGet = new XMLHttpRequest();
	xmlHttpGet.open("Get", '/../finalYearProject/music/'+trackPath, true); 
	xmlHttpGet.responseType = "arraybuffer"; //arraybuffer = raw binary data

	//Decode audio and set to buffer
	xmlHttpGet.onload = function() {
		var data = xmlHttpGet.response;

		audioContext.decodeAudioData(xmlHttpGet.response, function(buffer){
			audioBuffer = buffer;
		},function(e){"Error with decoding audio data" + e.err});
	}

	xmlHttpGet.send();
};

