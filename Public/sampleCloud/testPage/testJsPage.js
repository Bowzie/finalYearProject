define([
	'backbone',
	'dspFunctions',
	'd3',
	'charting',
	'fileSelection'
], function(backbone, dspFunctions, d3, charting, fileSelection) {

		var audioContext;

		//Determine if browser used supports web audio api
		try {
	  		window.AudioContext = window.AudioContext || window.webkitAudioContext;
	  		audioContext = new AudioContext();
		} catch(e) {
	  	alert('Web Audio API is not supported in this browser');
		}

		var fileSelection = new fileSelection();

		//Set divs to variables
		var fileChooser = document.getElementById('fileChooser');
		var fileDropArea = document.getElementById('drop');

		//Add event listeners 
	 	fileChooser.addEventListener('change', fileSelection.handleFileSelectFromFileChooser, false); //fileChooser state changed(new file loaded)
	 	fileDropArea.addEventListener('dragover', fileSelection.handleDragOver, false); //fileDropArea drag over event
	 	fileDropArea.addEventListener('drop', fileSelection.handleFileSelectFromFileDrop, false); //fileDropArea file drop event		

		var userButton = document.getElementById('user');

		userButton.addEventListener('click', function() {
			User = Backbone.Model.extend({
				urlRoot: '/../finalYearProject/mvc/Controllers/User.php', //call php controller
		});

		var user = new User();

		var userDetails = {
			id: 1
		};

		console.log(userDetails);

		//POST to PHP Controller class and alert return data
		user.save(userDetails, {
			type: 'POST',
			success: function(user) {
				console.log(user);
			},
			wait: true
		});
	});
});
