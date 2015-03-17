//TODO get rid off globals
var isRecording = false;
var audioContext;
var sourceNode;
var javascriptNode;
var recording = null;
var audioBuffer;

//getMedia function set for different browsers
navigator.getMedia = ( navigator.mozGetUserMedia ||
                   navigator.getUserMedia ||
                   navigator.webkitGetUserMedia ||
                   navigator.msGetUserMedia);

window.onload = function ()
{		
	//Determine if browser used supports web audio api
	try {
	  window.AudioContext = window.AudioContext || window.webkitAudioContext;
	  audioContext = new AudioContext();
	} catch(e) {
	  alert('Web Audio API is not supported in this browser');
	}

	//Setup audio for mic input
	try {
		navigator.getMedia({audio:true}, setupAudio, onError);
	} catch(err) {
		console.log('getMedia failed! Error: ' + err);
	}

	var startRecorder = document.getElementById('recStart');
	var stopRecorder = document.getElementById('recStop');
	var play = document.getElementById('play');
	startRecorder.addEventListener('click', startRecord);
	stopRecorder.addEventListener('click', stopRecord);
	play.addEventListener('click', playRecording);
}

function startRecord(evt) 
{
	evt.stopPropagation();
	evt.preventDefault();

	if(isRecording === true) 
	{
		console.log('Already recording!'); //TODO make toast?
	}
	else
	{
		isRecording = true;
		console.log("Starting record");

	    javascriptNode.onaudioprocess = function (e) {
	    	addToRecordingBuffer(e.inputBuffer); 
	    }		
	}

}

function stopRecord(evt) 
{
	evt.stopPropagation();
	evt.preventDefault();
	
	if(isRecording === true) 
	{
		console.log("Stopping record and saving to buffer");
        audioBuffer = audioContext.createBuffer( 1, recording.length, audioContext.sampleRate);
        audioBuffer.getChannelData(0).set(recording, 0);
	}
	else {
		console.log("Not currently recording!");
	}

	isRecording = false;
	javascriptNode.onaudioprocess = null;
}

function setupAudio(stream) 
{
	//Create nodes
	sourceNode = audioContext.createMediaStreamSource(stream);
	console.log(audioContext);
	javascriptNode = audioContext.createScriptProcessor(16384, 1, 1);
	console.log(javascriptNode);

	//Connect nodes together and to output(speakers)
	sourceNode.connect(javascriptNode);
	javascriptNode.connect(audioContext.destination);

}

function addToRecordingBuffer(inputBuffer) 
{
	if(recording === null)
	{
		recording = inputBuffer.getChannelData(0);
		console.log(recording);
	}
	else
	{
		//Create temp buffer that adds inputbuffer to recording
		var tempBuffer = new Float32Array(recording.length + inputBuffer.length);
		//Set start of tempBuffer to recording
		tempBuffer.set(recording, 0);
		//Add inputBuffer to end 
		tempBuffer.set(inputBuffer.getChannelData(0), recording.length);
		//Set tempBuffer to global recording
		recording = tempBuffer;
		console.log(recording);
	}
}

function playRecording() {
	console.log(recording);
	if(recording != null) 
	{
		var newSource = audioContext.createBufferSource();
		newSource.buffer = audioBuffer;
		newSource.connect(audioContext.destination);
		newSource.start(0); //plays the contents of the wav
	}

}

function onError(e) {
    console.log('Error: ' + e);
}