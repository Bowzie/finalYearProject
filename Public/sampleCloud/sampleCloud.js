define([
	'jquery',
	'audioEncode',
	'audioServer',
	'charting',
	'dspFunctions',
	'fileSelection',
	'login',
	'musicPanel',
	'recorder',
	'register',
], function($, audioEncoder, audioServer, charting, dspFunctions, fileSelection, login, musicPanel, recorder, register) {

	var sampleCloud = {
		audioContext: null,
		mainDiv: null,
		audioEncoder: null,
		audioServer: null,
		charting: null,
		dspFunctions: null,
		fileSelection: null,
		login: null,
		musicPanel: null,
		recorder: null,
		register: null,
	}

	//Determine if browser used supports web audio api
	try {
	  window.AudioContext = window.AudioContext || window.webkitAudioContext;
	  sampleCloud.audioContext = new AudioContext();
	} catch(e) {
	  alert('Web Audio API is not supported in this browser');
	}
	mainDiv = document.getElementById('main');

	sampleCloud.login = new login();
	sampleCloud.register = new register();
	loadLogin();

	function loadLogin()
	{
		sampleCloud.login.loadLogin(function(response) {
			var loginDiv = document.getElementById('login');

			loginDiv.addEventListener('submit', validate, false);

			var registerButton = document.getElementById('registerButton');

			registerButton.addEventListener('click', function(evt) {
				evt.preventDefault();
				evt.stopImmediatePropagation();
				sampleCloud.login.removeLogin(loginDiv);
				
				loadRegister();
			});

			console.log(registerButton);
		});
	}

	function loadRegister()
	{
		sampleCloud.register.loadRegister(mainDiv, function() {
			var registerForm = document.getElementById('registration');
			registerForm.addEventListener('submit', registerFormFunction, false);
			var loginButton = document.getElementById('loginButton');
			loginButton.addEventListener('click', function(evnt) {
				evnt.preventDefault();
				evnt.stopPropagation();
				sampleCloud.register.removeRegister();
				loadLogin();
			})
		});
	}

	function validate(evt)
	{
		evt.preventDefault();
		evt.stopPropagation();
		sampleCloud.login.validate(function (user) {
			if(user.result === true)
			{
				sampleCloud.login.removeLogin(mainDiv);
				loadMusicPanel(user);
			}
			else 
			{
				alert('No such login');
			}
		});
	}

	function registerFormFunction(evt) 
	{
		evt.preventDefault();

		sampleCloud.register.register(function(response) {
			if(response.result === true)
			{
				sampleCloud.register.removeRegister();
				loadLogin();
			}
			else
			{
				alert('Username already exists!')
			}
		});
	}

	function loadMusicPanel(user) 
	{
		sampleCloud.musicPanel = new musicPanel();
		sampleCloud.musicPanel.loadMusicPanel(mainDiv, function (response) {
			handleMusicPanel(user);
		});
	}

	function handleMusicPanel(user) 
	{
		var cloudButton = document.getElementById('cloudButton');
		var uploadButton = document.getElementById('uploadButton');
		var recorderButton = document.getElementById('recorderButton');

		cloudButton.addEventListener('click', function(evt) {
			evt.preventDefault();
			evt.stopPropagation();
			loadCloud(user);
		}, false);
		uploadButton.addEventListener('click', loadUpload, false);
		recorderButton.addEventListener('click', loadRecorder, false);
	}

	function loadCloud(user) {
		sampleCloud.audioServer = new audioServer();
		sampleCloud.audioServer.getTrackList(user.id, function(response) {
			if(response === null) {
				alert('You have no tracks stored here!');
			}
		})
		console.log(user);
	}

	function loadUpload() {
		console.log("here");
		sampleCloud.fileSelection = new fileSelection();
		sampleCloud.fileSelection.loadFileSelection(mainDiv);
	}

	function loadRecorder() {
		console.log('Recorder');

		sampleCloud.recorder = new recorder();

		sampleCloud.recorder.loadRecorder(mainDiv, function() {
			console.log("init recorder");

			//getMedia function set for different browsers
			navigator.getMedia = ( navigator.mozGetUserMedia ||
			                   navigator.getUserMedia ||
			                   navigator.webkitGetUserMedia ||
			                   navigator.msGetUserMedia);
			
			//Setup audio for mic input
			try {
				navigator.getMedia({audio:true}, function(stream) {
					sampleCloud.recorder.setupAudio(stream, sampleCloud.audioContext);
				}, function() {
					alert('getMedia failed!');
				});
			} catch(err) {
				console.log('getMedia failed! ' + err);
			}

			//Set divs to variables
			var startRecorder = document.getElementById('recStart');
			var stopRecorder = document.getElementById('recStop');
			var play = document.getElementById('play');
			var reset = document.getElementById('reset');

			//Add event listeners
			startRecorder.addEventListener('click', function(evt) {
				evt.stopPropagation(); //Prevents further propagation of the current event
				evt.preventDefault();  //Prevents default action occuring for event occurence

				sampleCloud.recorder.startRecord(function(isRecording) {
					if(isRecording === true) {

					}
					else {
						//Read in from audio inputa and add to recording 
					    sampleCloud.recorder.getJavaScriptNode().onaudioprocess = function (e) {
					    	sampleCloud.recorder.addToRecordingBuffer(e.inputBuffer);
					    }	
					}
				});
			}, false); //Start recording when button pressed


			stopRecorder.addEventListener('click', function(evt) {
				evt.stopPropagation(); //Prevents further propagation of the current event
				evt.preventDefault();  //Prevents default action occuring for event occurence
				sampleCloud.recorder.stopRecord();
			}, false); //Start recording when button pressed

			play.addEventListener('click', function(evt) {
				evt.stopPropagation(); //Prevents further propagation of the current event
				evt.preventDefault();  //Prevents default action occuring for event occurence
				console.log(sampleCloud.audioContext.destination);
				var newSource = sampleCloud.audioContext.createBufferSource(); //Create new buffer source
				newSource.buffer = sampleCloud.recorder.getAudioBuffer();
				newSource.connect(sampleCloud.audioContext.destination); //Connect to output (speakers)
				newSource.start(0); //plays the contents of the wav

			}, false); //Start recording when button pressed	
			reset.addEventListener('click', sampleCloud.recorder.reset, false);	
		});

	}
});