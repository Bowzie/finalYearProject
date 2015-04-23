define(function () {
    //Empty constructor
    function recorder() {

    }

    recorder.prototype = {
		isRecording: false,
		audioContext: null,
		sourceNode: null,
		recording: null,
		audioBuffer: null,
		
		loadRecorder: function(div, callback)
		{
			require(['jquery'], function($) {
				$(div).load('libs/recorder/recorder.html', function() {
					callback(true);
				});
			});
		},

		removeRecorder: function(div)
		{
			div.parentNode.removeChild(div);
		},

		getIsRecording: function() 
		{
			return this.isRecording;
		},

		getAudioContext: function() 
		{
			return this.audioContext;
		},

		getSourceNode: function()
		{
			return this.sourceNode;
		},

		getRecording: function() 
		{
			return this.recording;
		},

		getAudioBuffer: function()
		{
			return this.audioBuffer;
		},

		getJavaScriptNode: function() {
			return this.javascriptNode;
		},	

		setupAudio: function(stream, audioCtx) 
		{
			this.audioContext = audioCtx;
			//Create nodes
			this.sourceNode = this.audioContext.createMediaStreamSource(stream);

			//TODO Variable buffer size for different qualities
			//TODO variable channels
			this.javascriptNode = this.audioContext.createScriptProcessor(1024, 1, 1); //16384 buffer size = high quality

			//Connect nodes together and to output(speakers)
			this.sourceNode.connect(this.javascriptNode);
			this.javascriptNode.connect(this.audioContext.destination);	
		},

		startRecord: function(callback) 
		{

			if(this.isRecording === true) 
			{
				console.log('Already recording!'); //TODO make toast?
				callback(true);
			}
			else
			{
				callback(false);
				this.isRecording = true;
				console.log("Starting record");
			}			
		},

		stopRecord: function(evt) 
		{
			//Set audioBuffer channel data to current recording
			if(this.isRecording === true) 
			{
				console.log('Stopping record and saving to buffer');
		        this.audioBuffer = this.audioContext.createBuffer( 1, this.recording.length, this.audioContext.sampleRate); //Create buffer
		       	this.audioBuffer.getChannelData(0).set(this.recording, 0);	//Set channel data to current recording
		        this.recording = null; //Clear current recording 
			}
			else {
				console.log('Not currently recording!');
			}

			this.isRecording = false; 
			this.javascriptNode.onaudioprocess = null;
		},

		reset: function(evt) {
			evt.stopPropagation(); //Prevents further propagation of the current event
			evt.preventDefault();  //Prevents default action occuring for event occurence

			this.recording = null;
			this.audioBuffer = null;
		},

		addToRecordingBuffer: function(inputBuffer) {
			if(this.recording === null) //First buffer read in
			{
				this.recording = inputBuffer.getChannelData(0);
			}
			else //Add to buffer
			{
				var tempBuffer = new Float32Array(this.recording.length + inputBuffer.length); //Create temp buffer that adds inputbuffer to recording
				tempBuffer.set(this.recording, 0);	//Set start of tempBuffer to recording
				tempBuffer.set(inputBuffer.getChannelData(0), this.recording.length);	//Add inputBuffer to end 
				this.recording = tempBuffer;			//Set tempBuffer to global recording
			}
		},

		playRecording: function() {
			// evt.stopPropagation(); //Prevents further propagation of the current event
			// evt.preventDefault();  //Prevents default action occuring for event occurence

			if(this.audioBuffer != null) 
			{
				console.log(this.audioBuffer);
				var newSource = this.audioContext.createBufferSource(); //Create new buffer source
				newSource.buffer = this.audioBuffer;
				newSource.connect(this.audioContext.destination); //Connect to output (speakers)
				newSource.start(0); //plays the contents of the wav
			}
		}
    }

	return recorder;
});
   


