window.onload = function() {
	var fileChooser = document.getElementById('fileChooser');
	var fileDropArea = document.getElementById('drop');
 	fileChooser.addEventListener('change', handleFileSelect, false);	
 	fileDropArea.addEventListener('dragover', handleDragOver, false);
 	fileDropArea.addEventListener('drop', handleFileSelect, false);	

}

function handleFileSelect(evt) {
	var audioContext = new AudioContext();
	var file = evt.target.files;
	console.log(file[0]);
	var fileReader = new FileReader()
	var fileToArrayBuffer = fileReader.readAsArrayBuffer(file[0]);
	fileReader.onload = function() {
		var arrayBuffer = fileReader.result;
		audioContext.decodeAudioData(fileReader.result, function(buffer){
			console.log(buffer);
		});
	}
} 

function handleDragOver(evt) {
	evt.dataTransfer.dropEffect = 'copy';
}