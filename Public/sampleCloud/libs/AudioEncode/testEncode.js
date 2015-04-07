define([
	'audioEncode',
], function(audioEncode) {
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
	mp3Button.click();

	function encodeWav(evt) //MAX CHANNELS APPEARS TO BE 5 FROM TESTING, CRASHES WITH TOO MUCH DATA 8.6 million samples max
	{	

		evt.stopPropagation(); //Prevents further propagation of the current event
		evt.preventDefault();  //Prevents default action occuring for event occurence

		var xmlHttpGet = new XMLHttpRequest();
		xmlHttpGet.open("Get", '/../finalYearProject/music/track2.wav', true); 
		xmlHttpGet.responseType = "arraybuffer"; //arraybuffer = raw binary data
		var audioContext = new AudioContext();

		//Decode audio and encode
		xmlHttpGet.onload = function() 
		{
			var data = xmlHttpGet.response;
			audioContext.decodeAudioData(xmlHttpGet.response, function(buffer){
				var encoder = new audioEncode();
				console.log(buffer);

				var data = [];
				var numChannels;
				//Single channel
				if(buffer.numberOfChannels == 1)
				{
					data = buffer.getChannelData(0);
					numChannels = 1;
				}
				else //2 channels
				{	
					var Channel1 = buffer.getChannelData(0);
					var Channel2 = buffer.getChannelData(1);

					//Interleave data
					var index = 0;
					for(var i = 0; i < buffer.length; ) {
						data[i++] = Channel1[index];
						data[i++] = Channel2[index];
						index++;
					}

					numChannels = 2;
				}
				var encoder = new audioEncode();
				encoder.wavEncode(data, numChannels, buffer.sampleRate,  function(blob) {
					download(blob, 'wav');					
				});


			},function(e){"Error with decoding audio data" + e.err});
		}
		xmlHttpGet.send();	
	}

	function mp3Start(evt) //Crashes on larger chunks of data 
	{

		evt.stopPropagation(); //Prevents further propagation of the current event
		evt.preventDefault();  //Prevents default action occuring for event occurence

		//Get audio track from file and Get as an arraybuffer
		var xmlHttpGet = new XMLHttpRequest();
		xmlHttpGet.open("Get", '/../finalYearProject/music/track2.wav', true); 
		xmlHttpGet.responseType = "arraybuffer"; //arraybuffer = raw binary data
		var audioContext = new AudioContext();

		//Decode audio and encode 
		xmlHttpGet.onload = function() {
			var data = xmlHttpGet.response;
			audioContext.decodeAudioData(xmlHttpGet.response, function(buffer){
				var encoder = new audioEncode();
				console.log(buffer);

				var mode = buffer.numberOfChannels == 1 ? 1 : 2; //1 MONO, 2 STEREO

				var data = {};
				var dataLength = 0;
				var numChannels;
				//Single channel
				if(buffer.numberOfChannels == 1)
				{
					var Channel = buffer.getChannelData(0);
					data = {
						left: Channel,
						right: Channel
					}
					numberOfChannels = 1;
				}
				else //2 channels
				{	
					var Channel1 = buffer.getChannelData(0);
					var Channel2 = buffer.getChannelData(1);
					data = {
						left: Channel1,
						right: Channel2
					}
					numChannels = 2;
				}
				// console.log('Attempting to encode ' + dataLength + ' bytes of data');

				encoder.mp3Encode(data, mode, numChannels, buffer.sampleRate, 320, buffer.length, function(blob) {
					download(blob, 'mp3');
				});

			},function(e){"Error with decoding audio data" + e.err});
		}

		xmlHttpGet.send();	
	}

	function download(blob, format)
	{	
    	//Create download 
       	var URL = window.URL || window.webkitURL;
        var downloadUrl = URL.createObjectURL(blob);
	    var a = document.createElement("a");
	    a.href = downloadUrl;
	    a.download = 'bleh.' + format;
	    document.body.appendChild(a);
	    a.click(); 
	}
});



