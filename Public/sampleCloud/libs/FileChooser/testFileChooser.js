var fileSelection = {
	AudioBuffer: null
};

//Initialise fileChooser and fileDropArea
fileSelection.init = function()
{
	//Set divs to variables
	var fileChooser = document.getElementById('fileChooser');
	var fileDropArea = document.getElementById('drop');

	//Add event listeners 
 	fileChooser.addEventListener('change', fileSelection.handleFileSelectFromFileChooser, false); //fileChooser state changed(new file loaded)
 	fileDropArea.addEventListener('dragover', fileSelection.handleDragOver, false); //fileDropArea drag over event
 	fileDropArea.addEventListener('drop', fileSelection.handleFileSelectFromFileDrop, false); //fileDropArea file drop event		
}

//Get file from file chooser and read to buffer
fileSelection.handleFileSelectFromFileChooser = function(evt) {	
	evt.stopPropagation(); //Prevents further propagation of the current event
	evt.preventDefault();  //Prevents default action occuring for event occurence

	var fileList = evt.target.files;	//Read fileList from target of event
	fileSelection.fileReadToBuff(fileList);	//Send fileList to function that will read file contents as array buffer
} 

//Get file when dropped into fileDropArea
fileSelection.handleFileSelectFromFileDrop = function(evt) {
	evt.stopPropagation(); //Prevents further propagation of the current event
	evt.preventDefault();  //Prevents default action occuring for event occurence

	var fileList = evt.dataTransfer.files; //Read fileList from data transfer event
	fileSelection.fileReadToBuff(fileList);	//Send fileList to function that will read file contents as array buffer
}

//Change drope effect when file dragged over fileDropArea
fileSelection.handleDragOver = function(evt) {
	evt.stopPropagation(); //Prevents further propagation of the current event
	evt.preventDefault();  //Prevents default action occuring for event occurence

	evt.dataTransfer.dropEffect = 'copy'; //Copy file when it is dropped into fileDropArea (default is download)
}

//Read file contents as array buffer
fileSelection.fileReadToBuff = function(fileList) {
	//TODO check if audio context works in browser
	var audioContext = new AudioContext(); //Create new audio context 
	var fileReader = new FileReader()	//Create new file reader
	var fileToArrayBuffer = fileReader.readAsArrayBuffer(fileList[0]); //Read file contents as array buffer

	//Decode file array buffer contents as audio buffer
	fileReader.onload = function() {
		var arrayBuffer = fileReader.result;
		audioContext.decodeAudioData(fileReader.result, function(buffer){
			AudioBuffer = buffer;
		});
	}
}