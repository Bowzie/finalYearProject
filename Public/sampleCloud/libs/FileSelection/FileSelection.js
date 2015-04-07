define(function () {
    //Empty constructor
    function fileSelection() {

    }

    fileSelection.prototype = {
    	audioBuffer: {},
    	loaded: false,

		//Initialise fileChooser and fileDropArea
		getAudioBuffer: function()
		{
			return this.audioBuffer;
		},

		setAudioBuffer: function(input)
		{
			this.audioBuffer = input;
		},

		//Get file from file chooser and read to buffer
		handleFileSelectFromFileChooser: function(evt) 
		{	
			evt.stopPropagation(); //Prevents further propagation of the current event
			evt.preventDefault();  //Prevents default action occuring for event occurence

			var fileList = evt.target.files;	//Read fileList from target of event
			fileSelection.prototype.fileReadToBuff(fileList);	//Send fileList to function that will read file contents as array buffer
		},

		//Get file when dropped into fileDropArea
		handleFileSelectFromFileDrop: function(evt) 
		{
			evt.stopPropagation(); //Prevents further propagation of the current event
			evt.preventDefault();  //Prevents default action occuring for event occurence

			var fileList = evt.dataTransfer.files; //Read fileList from data transfer event
			fileSelection.prototype.fileReadToBuff(fileList, function(result) { console.log(result)});	//Send fileList to function that will read file contents as array buffer
		},

		//Change drope effect when file dragged over fileDropArea
		fileSelectionhandleDragOver: function(evt) 
		{
			evt.stopPropagation(); //Prevents further propagation of the current event
			evt.preventDefault();  //Prevents default action occuring for event occurence

			evt.dataTransfer.dropEffect = 'copy'; //Copy file when it is dropped into fileDropArea (default is download)
		},

		//Read file contents as array buffer //ADD CALLBACKS
		fileReadToBuff: function(fileList) 
		{
			//TODO check if audio context works in browser
			var audioContext = new AudioContext(); //Create new audio context 
			var fileReader = new FileReader()	//Create new file reader
			var fileToArrayBuffer = fileReader.readAsArrayBuffer(fileList[0]); //Read file contents as array buffer

			//Decode file array buffer contents as audio buffer
			fileReader.onload = function() {
				var arrayBuffer = fileReader.result;
				audioContext.decodeAudioData(fileReader.result, function(buffer){
					setAudioBuffer(buffer);
				});
			}
		}

    };

    return fileSelection;
});
