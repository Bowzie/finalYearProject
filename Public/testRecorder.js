//TODO get rid off global bool
var isRecording = false;

window.onload = function (){
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
}

function stopRecord(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	
	if(isRecording === true) 
	{
		console.log("stopping record and saving to buffer");
	}
	else {
		console.log("Not currently recording!");
	}

	isRecording = false;
}