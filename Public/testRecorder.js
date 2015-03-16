//TODO get rid off globals
var isRecording = false;
var audioContext;
var sourceNode;
var javascriptNode;

//getMedia function set for different browsers
navigator.getMedia = ( navigator.mozGetUserMedia ||
                   navigator.getUserMedia ||
                   navigator.webkitGetUserMedia ||
                   navigator.msGetUserMedia);

window.onload = function (){
		
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
	startRecorder.addEventListener('click', startRecord);
	stopRecorder.addEventListener('click', stopRecord);
}

function startRecord(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	isRecording = true;
	console.log("Starting record");

    javascriptNode.onaudioprocess = function (e) {
    	//console.log(e.inputBuffer);
		var newSource = audioContext.createBufferSource();
		newSource.buffer = e.inputBuffer;
		newSource.connect(audioContext.destination);
		newSource.start(0); //plays the contents of the wav
    }
}

function stopRecord(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	
	if(isRecording === true) 
	{
		console.log("Stopping record and saving to buffer");
	}
	else {
		console.log("Not currently recording!");
	}

	isRecording = false;
	javascriptNode.onaudioprocess = null;
}

function setupAudio(stream) {
	//Create nodes
	sourceNode = audioContext.createMediaStreamSource(stream);
	console.log(audioContext);
	javascriptNode = audioContext.createScriptProcessor(4096, 1, 1);
	console.log(javascriptNode);

	//Connect nodes together and to output(speakers)
	sourceNode.connect(javascriptNode);
	javascriptNode.connect(audioContext.destination);

}

function onError(e) {
    console.log('Error: ' + e);
}