define([
	'wavEncoder',
	'mp3Encoder',
], function() {
	var data = []

	//Noise generate
 	for(var i = 0; i < 22050; i++)
 	{
 		data[i] = 2 * Math.random() - 1; 
 	}

	var wavButton = document.getElementById('wav');
	var mp3Button = document.getElementById('mp3');

	wavButton.addEventListener('click', encodeWav, false);
	mp3Button.addEventListener('click', encodeMP3, false);

	function encodeWav(evt) 
	{	

		evt.stopPropagation(); //Prevents further propagation of the current event
		evt.preventDefault();  //Prevents default action occuring for event occurence

		var wavDataBase64 = WavEncoder.encode(data); //encode data to wav format

		var split = wavDataBase64.split(',');	//Split string to get necessary encoded data

		var binary = atob(split[1]); //Decodes base-64 encoded string

    	var array = [];	

    	//Fill array with unicode values 
	 	for(var i = 0; i < binary.length; i++) {
    	    array.push(binary.charCodeAt(i));
	 	}

	 	//Make blob of audio (new file)
    	var blob = new Blob([new Uint8Array(array)], { type: 'audio/wav' });

    	//Create download 
        var URL = window.URL || window.webkitURL;
        var downloadUrl = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = downloadUrl;
        a.download = 'bleh.wav';
        document.body.appendChild(a);
        a.click();
   
	}

	function encodeMP3(evt)
	{
		evt.stopPropagation(); //Prevents further propagation of the current event
		evt.preventDefault();  //Prevents default action occuring for event occurence

	    console.log("Start MP3 encoding");

		var mp3codec = Lame.init();
		Lame.set_mode(mp3codec, Lame.JOINT_STEREO);
		Lame.set_num_channels(mp3codec, 2);
		Lame.set_out_samplerate(mp3codec, 44100);
		Lame.set_bitrate(mp3codec, 320);
		Lame.init_params(mp3codec);

		//Lame only works for 8192 size, need to change BUFSIZE I think
		var floatData = new Float32Array(8192);

		for(var i = 0; i < 8192; i++)
		{
			 floatData[i] =  2 * Math.random() - 1;
		}

		console.log(floatData);

		var mp3data = Lame.encode_buffer_ieee_float(mp3codec, floatData, floatData);

		blob = new Blob([mp3data.data], { type: "audio/mp3" });

		console.log(mp3data.data);
		console.log("Done MP3 encoding");

	   	//Create download 
        var URL = window.URL || window.webkitURL;
        var downloadUrl = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = downloadUrl;
        a.download = 'bleh.mp3';
        document.body.appendChild(a);
        a.click();
	}
});



