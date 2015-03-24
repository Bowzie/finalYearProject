window.onload = function() {
	var fileChooser = document.getElementById('fileChooser');
	var fileDropArea = document.getElementById('drop');
 	fileChooser.addEventListener('change', handleFileSelectFromFileChoose, false);	
 	fileDropArea.addEventListener('dragover', handleDragOver, false);
 	fileDropArea.addEventListener('drop', handleFileSelectFromFileDrop, false);	

}

function handleFileSelectFromFileChoose(evt) {	
	var file = evt.target.files;
	fileReadToBuff(file);
} 

function handleFileSelectFromFileDrop(evt) {
	evt.stopPropagation();
	evt.preventDefault();

	var file = evt.dataTransfer.files;
	fileReadToBuff(file);
}

function handleDragOver(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	evt.dataTransfer.dropEffect = 'copy';
}

function fileReadToBuff(file) {
	var audioContext = new AudioContext();
	console.log(file);
	var fileReader = new FileReader()
	var fileToArrayBuffer = fileReader.readAsArrayBuffer(file[0]);
	fileReader.onload = function() {
		var arrayBuffer = fileReader.result;
		audioContext.decodeAudioData(fileReader.result, function(buffer){
			console.log(buffer);
		});
	}
}