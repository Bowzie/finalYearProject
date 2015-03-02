window.onload = function() {
	var fileChooser = document.getElementById('fileChooser');
 	console.log(fileChooser);
 	fileChooser.addEventListener('change', handleFileSelect, false);	
}

function handleFileSelect(evt) {
	var file = evt.target.files;
	console.log("here" + file);
} 