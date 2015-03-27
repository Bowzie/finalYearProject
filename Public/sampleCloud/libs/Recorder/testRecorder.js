var recorder = {
	isRecording: false,
	audioContext: null,
	sourceNode: null,
	javascriptNode: null,
	recording: null,
	audioBuffer: null
};

recorder.init = function()
{
	//getMedia function set for different browsers
	navigator.getMedia = ( navigator.mozGetUserMedia ||
	                   navigator.getUserMedia ||
	                   navigator.webkitGetUserMedia ||
	                   navigator.msGetUserMedia);
	

	//Setup audio for mic input
	try {
		navigator.getMedia({audio:true}, setupAudio, recorder.onError);
	} catch(err) {
		console.log('getMedia failed! Error: ' + err);
	}

	//Set divs to variables
	var startRecorder = document.getElementById('recStart');
	var stopRecorder = document.getElementById('recStop');
	var play = document.getElementById('play');

	//Add event listeners
	startRecorder.addEventListener('click', recorder.startRecord); //Start recording when button pressed
	stopRecorder.addEventListener('click', recorder.stopRecord); //Start recording when button pressed
	play.addEventListener('click', recorder.playRecording); //Start recording when button pressed
}

recorder.startRecord = function(evt) 
{
	evt.stopPropagation(); //Prevents further propagation of the current event
	evt.preventDefault();  //Prevents default action occuring for event occurence

	if(isRecording === true) 
	{
		console.log('Already recording!'); //TODO make toast?
	}
	else
	{
		isRecording = true;
		console.log("Starting record");
		//Read in from audio input and add to recording 
	    javascriptNode.onaudioprocess = function (e) {
	    	addToRecordingBuffer(e.inputBuffer); 
	    }		
	}
}

recorder.stopRecord = function(evt) 
{
	evt.stopPropagation(); //Prevents further propagation of the current event
	evt.preventDefault();  //Prevents default action occuring for event occurence
	
	//Set audioBuffer channel data to current recording
	if(isRecording === true) 
	{
		console.log('Stopping record and saving to buffer');
        audioBuffer = audioContext.createBuffer( 1, recording.length, audioContext.sampleRate); //Create buffer
       	audioBuffer.getChannelData(0).set(recording, 0);	//Set channel data to current recording
        recording = null; //Clear current recording 
	}
	else {
		console.log('Not currently recording!');
	}

	isRecording = false; 
	javascriptNode.onaudioprocess = null;
}

recorder.setupAudio = function(stream) 
{
	//Create nodes
	sourceNode = audioContext.createMediaStreamSource(stream);

	//TODO Variable buffer size for different qualities
	//TODO variable channels
	javascriptNode = audioContext.createScriptProcessor(16384, 1, 1); //16384 buffer size = high quality

	//Connect nodes together and to output(speakers)
	sourceNode.connect(javascriptNode);
	javascriptNode.connect(audioContext.destination);
}

recorder.addToRecordingBuffer = function(inputBuffer) 
{
	if(recording === null) //First buffer read in
	{
		recording = inputBuffer.getChannelData(0);
	}
	else //Add to buffer
	{
		var tempBuffer = new Float32Array(recording.length + inputBuffer.length); //Create temp buffer that adds inputbuffer to recording
		tempBuffer.set(recording, 0);	//Set start of tempBuffer to recording
		tempBuffer.set(inputBuffer.getChannelData(0), recording.length);	//Add inputBuffer to end 
		recording = tempBuffer;			//Set tempBuffer to global recording
	}
}

//TODO remove play from here, make own object for it
recorder.playRecording = function() {
	evt.stopPropagation(); //Prevents further propagation of the current event
	evt.preventDefault();  //Prevents default action occuring for event occurence

	if(audioBuffer != null) 
	{
		var newSource = audioContext.createBufferSource(); //Create new buffer source
		newSource.buffer = audioBuffer;
		newSource.connect(audioContext.destination); //Connect to output (speakers)
		newSource.start(0); //plays the contents of the wav
	}
}

recorder.onError = function(e) {
    console.log('Error: ' + e);
}


