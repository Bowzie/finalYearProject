define([
	'audioEncode',
	'jquery'
], function(audioEncode, jquery) {
	var data = []

	//Noise generate
 	for(var i = 0; i < 22050; i++)
 	{
 		data[i] = 2 * Math.random() - 1; 
 	}

	var wavButton = document.getElementById('wav');
	var mp3Button = document.getElementById('mp3');

	wavButton.addEventListener('click', encodeWav, false);
	mp3Button.addEventListener('click', mp3Start, false);
	var blob = null;
	function encodeWav(evt) 
	{	

		evt.stopPropagation(); //Prevents further propagation of the current event
		evt.preventDefault();  //Prevents default action occuring for event occurence

		var xmlHttpGet = new XMLHttpRequest();
		xmlHttpGet.open("Get", '/../finalYearProject/music/track1.mp3', true); 
		xmlHttpGet.responseType = "arraybuffer"; //arraybuffer = raw binary data
		var audioContext = new AudioContext();

		//Decode audio and encode
		xmlHttpGet.onload = function() 
		{
			var data = xmlHttpGet.response;
			audioContext.decodeAudioData(xmlHttpGet.response, function(buffer){
				var encoder = new audioEncode();

				encoder.wavEncode(buffer.getChannelData(0), function(bleh) {
					download(bleh);						
				});
			},function(e){"Error with decoding audio data" + e.err});
		}
		xmlHttpGet.send();	
	}

	function download(blob)
	{	
    	//Create download 
       	var URL = window.URL || window.webkitURL;
        var downloadUrl = URL.createObjectURL(blob);
	    var a = document.createElement("a");
	    a.href = downloadUrl;
	    a.download = 'bleh.wav';
	    document.body.appendChild(a);
	    a.click(); 
	}

	function mp3Start(evt) 
	{

		evt.stopPropagation(); //Prevents further propagation of the current event
		evt.preventDefault();  //Prevents default action occuring for event occurence

		//Get audio track from file and Get as an arraybuffer
		var xmlHttpGet = new XMLHttpRequest();
		xmlHttpGet.open("Get", '/../finalYearProject/music/track1.mp3', true); 
		xmlHttpGet.responseType = "arraybuffer"; //arraybuffer = raw binary data
		var audioContext = new AudioContext();

		//Decode audio and encode 
		xmlHttpGet.onload = function() {
			var data = xmlHttpGet.response;
			audioContext.decodeAudioData(xmlHttpGet.response, function(buffer){
				var encoder = new audioEncode();
				console.log(buffer);

				var mode = buffer.numberOfChannels < 2 ? 1 //mono
					: buffer.numberOfChannels == 2 ? 2 	//stereo
					: buffer.numberOfChannels > 2 ? 3 	//joint stereo
					: null;

				encoder.mp3Encode(buffer.getChannelData(0), mode, buffer.numberOfChannels, buffer.sampleRate, 320, function(bleh) {
					console.log(bleh);
				});

			},function(e){"Error with decoding audio data" + e.err});
		}

		xmlHttpGet.send();	
	}
});



