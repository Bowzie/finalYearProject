function getAudioFile() {
	aClient = new HttpClient();
	var track = aClient.get('/../finalYearProject/music/track1.wav');
	console.log(track);
	//Can't access track.buffer - need to move all functionality in decodeAudioData here to set these params properly
}

//context.channelcount neededed for buffer.getChannelData(context.channelcount)#

var HttpClient = function() {
    this.get = function(audioFileUrl) {
      var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	  var source = audioCtx.createBufferSource();
	  request = new XMLHttpRequest();

	  request.open('GET', audioFileUrl, true);

	  request.responseType = 'arraybuffer';

	  request.send();

	  request.onload = function() {
	    var audioData = request.response;

	    audioCtx.decodeAudioData(audioData, function(buffer) {
	        source.buffer = buffer;

	        source.connect(audioCtx.destination);
	        source.loop = false;
	        // source.channelData = source.buffer.getChannelData(0);
	        // console.log(source.buffer.getChannelData(0));

			// for (var i = source.buffer.length - 1; i >= 0; i--) {
			// 	source.channelData[i] += 0.5;
			// };
			console.log(source.buffer);

	      },

	      function(e){"Error with decoding audio data" + e.err});

	  }

	  console.log(source.buffer);
	  return source;
    }
}