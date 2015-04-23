define([
	'jquery',
	'audioEncode',
	'audioServer',
	'charting',
	'dspFunctions',
	'fileSelection',
	'login',
	'mainPanel',
	'musicPanel',
	'recorder',
	'register',
], function($, audioEncode, audioServer, charting, dspFunctions, fileSelection, login, mainPanel, musicPanel, recorder, register) {

	var sampleCloud = {
		audioContext: null,
		mainDiv: null,
		h1: null,
		audioEncode: null,
		audioServer: null,
		charting: null,
		dspFunctions: null,
		fileSelection: null,
		login: null,
		mainPanel: null,
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
	var userPanel = document.getElementById('userPanel');
	h1 = document.getElementById('header1');
	sampleCloud.login = new login();
	sampleCloud.register = new register();
	 loadLogin();
	//loadMainPanel(null);

	function loadLogin()
	{
		userPanel.style.display = "none";
		h1.innerText = 'WELCOME TO SAMPLE CLOUD';
		$('#top').show();
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
		});
	}

	function loadRegister()
	{
		h1.innerText = 'REGISTER FOR SAMPLE CLOUD';
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
		sampleCloud.login.removeLogin();
    	var elem = document.createElement("img");
		elem.setAttribute("src", "images/loading.gif");
		// var recorderDiv = document.getElementById('recorder');
		mainDiv.appendChild(elem);
		// console.log(div);
		sampleCloud.login.validate(function (user) {
			if(user.result === true)
			{
				sampleCloud.login.removeLogin(mainDiv);
				userPanel.style.display = "block";
				loadMusicPanel(user);
			}
			else 
			{
				loadLogin();
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
		h1.innerText = 'SELECT AUDIO SOURCE';
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
		h1.innerText = 'FROM THE CLOUD';
		sampleCloud.audioServer = new audioServer();
		sampleCloud.audioServer.getTrackList(user.id, function(music) {
			if(music === null) {
				alert('You have no tracks stored here!');
			}
			else {
				sampleCloud.audioServer.loadAudioServer(mainDiv, function()
				{
					sampleCloud.charting = new charting();
					var previewButton = document.getElementById('previewButton');
					var loadButton = document.getElementById('loadButton');
					var select = document.getElementById('musicList');
					var currentBuffer = null;
					var currentTrack = null;
					var selectedTrack = null;

					previewButton.addEventListener('click', function(evt) {
						evt.stopPropagation(); //Prevents further propagation of the current event
						evt.preventDefault();  //Prevents default action occuring for event occurence
						selectedTrack = select.value;

						console.log(user);
						if(currentTrack !== selectedTrack)
						{
							var trackDetails = {
			    				userId: user.id,
			    				username: user.username,
			    				trackname: selectedTrack 
							}

							sampleCloud.audioServer.getTrackPath(trackDetails, function(trackPath) {
								sampleCloud.audioServer.getTrack(trackPath.trackPath, function(track) {
									sampleCloud.audioContext.decodeAudioData(track, function(buffer){
										currentTrack = selectedTrack;
										var prev = document.getElementById('previewArea');
										prev.style.display = 'block';
										console.log(prev);
										sampleCloud.charting.lineChart('cloudChart', buffer);
										console.log(buffer);
										currentBuffer = buffer;
									},function(e){"Error with decoding audio data" + e.err});
								});
							});
						}
						else {
							console.log('Already Loaded That File!');
						}
					}, false);

					loadButton.addEventListener('click', function(evt) {
						evt.stopPropagation(); //Prevents further propagation of the current event
						evt.preventDefault();  //Prevents default action occuring for event occurence

						sampleCloud.audioServer.removeAudioServer(document.getElementById('cloudList'));
						if(currentTrack !== null && currentBuffer !== null)
						{
							var bufferData = currentBuffer.getChannelData(0);
							var chartDiv = document.getElementById('cloudChart');
							loadMainPanel(bufferData, chartDiv);
						}
						else 
						{
							selectedTrack = select.value;
							var trackDetails = {
			    				userId: user.id,
			    				username: user.username,
			    				trackname: selectedTrack 
							}

							sampleCloud.audioServer.getTrackPath(trackDetails, function(trackPath) {
								sampleCloud.audioServer.getTrack(trackPath.trackPath, function(track) {
									sampleCloud.audioContext.decodeAudioData(track, function(buffer){
										loadMainPanel(buffer, null);
									},function(e){"Error with decoding audio data" + e.err});
								});
							});
						}

						console.log('Load');
					}, false);

					console.log(music);
					var musicList = document.getElementById('musicList');
					music.forEach(function(track) {
						console.log(track);
						var option = document.createElement('option');
						option.value = track.title;
						option.innerText = track.title;
						musicList.appendChild(option);
					});	
				});
			}
		});
	}

	function loadUpload() {
		h1.innerText = 'UPLOAD';
		sampleCloud.fileSelection = new fileSelection();
		sampleCloud.fileSelection.loadFileSelection(mainDiv, function() {
			var fileChooser = document.getElementById('fileChooser');
			var fileDropArea = document.getElementById('drop');
			var spanDiv = document.getElementById('spanFileSelector');
			var loadButton = document.getElementById('loadFileSelector');
			var fileChooserDiv = document.getElementById('fileChooser');
		 	fileChooser.addEventListener('change', function(evt) {
		 		evt.stopPropagation(); //Prevents further propagation of the current event
				evt.preventDefault();  //Prevents default action occuring for event occurence

				var fileList = evt.target.files;	//Read fileList from target of event
				
				if(fileList.length > 0)
				{
					sampleCloud.fileSelection.fileReadToBuff(fileList, function(buffer) {
						console.log(buffer);
						if(buffer.length <= 882000)
						{
							loadButton.disabled = false;
							spanDiv.style.color = "blue";
							spanDiv.innerText = fileList[0]. name + " Allowed!";
							sampleCloud.fileSelection.setAudioBuffer(buffer.getChannelData(0));
						}
						else 
						{
							loadButton.disabled = true;
							spanDiv.style.color = "red";
							spanDiv.innerText = fileList[0].name + " Not Allowed! Pick a file with a smaller size";
							console.log('Not allowed');
							fileChooserDiv.value = '';
						}
					});	//Send fileList to function that will read file contents as array buffer
				}
		 	}, false);	

		 	fileDropArea.addEventListener('dragover', function(evt) {
		 		evt.stopPropagation(); //Prevents further propagation of the current event
				evt.preventDefault();  //Prevents default action occuring for event occurence
				console.log('dragover');
				evt.dataTransfer.dropEffect = 'copy'; //Copy file when it is dropped into fileDropArea (default is download)
		 	}
		 	, false);

		 	fileDropArea.addEventListener('drop', function(evt) {
		 		evt.stopPropagation(); //Prevents further propagation of the current event
				evt.preventDefault();  //Prevents default action occuring for event occurence

				var fileList = evt.dataTransfer.files; //Read fileList from data transfer event

				sampleCloud.fileSelection.fileReadToBuff(fileList, function(buffer) { 
					console.log(fileList[0]);
					if(buffer.length <= 882000)
					{
						loadButton.disabled = false;
						spanDiv.style.color = "blue";
						spanDiv.innerText = fileList[0]. name + " Allowed!";
						fileChooserDiv.value = '';
						sampleCloud.fileSelection.setAudioBuffer(buffer.getChannelData(0));
					}
					else 
					{
						loadButton.disabled = true;
						spanDiv.style.color = "red";
						spanDiv.innerText = fileList[0].name + " Not Allowed! Pick a file with a smaller size";
						fileChooserDiv.value = '';
						console.log('Not allowed');
					}
				});	//Send fileList to function that will read file contents as array buffer
		 	}, false);	

		 	loadButton.addEventListener('click', function(evt) {
		 		var buffer = sampleCloud.fileSelection.getAudioBuffer();
		 		loadMainPanel(buffer, null);
		 	});
		});
	}

	function loadRecorder() {
		h1.innerText = 'RECORDER';
		sampleCloud.recorder = new recorder();
		sampleCloud.charting = new charting();

		sampleCloud.recorder.loadRecorder(mainDiv, function() {

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
			var play = document.getElementById('recPlay');
			var load = document.getElementById('recLoad');

			sampleCloud.charting.lineChart('recorderChart', [0]);
			//Add event listeners
			startRecorder.addEventListener('click', function(evt) {
				evt.stopPropagation(); //Prevents further propagation of the current event
				evt.preventDefault();  //Prevents default action occuring for event occurence				
				sampleCloud.recorder.startRecord(function(isRecording) {
					if(isRecording === true) {
						play.disabled = true;
						startRecorder.disabled = true;
					}
					else {
						//Read in from audio inputa and add to recording 
					    sampleCloud.recorder.getJavaScriptNode().onaudioprocess = function (e) {
					    	sampleCloud.recorder.addToRecordingBuffer(e.inputBuffer);
					    	sampleCloud.charting.lineChart('recorderChart', e.inputBuffer);
					    	console.log(sampleCloud.recorder.getRecording().length);
					    	if(sampleCloud.recorder.getRecording().length > 882000)
					    	{
						    	stopRecorder.click();
					    	}	
					    }	
					}
				});
			}, false); //Start recording when button pressed

			var recorderChart = null;
			stopRecorder.addEventListener('click', function(evt) {
				evt.stopPropagation(); //Prevents further propagation of the current event
				evt.preventDefault();  //Prevents default action occuring for event occurence
				play.disabled = false;
				startRecorder.disabled = false;
				sampleCloud.recorder.stopRecord();
				var elem = document.createElement("img");
				elem.setAttribute("src", "images/loadingCols.gif");
				document.getElementById('recorderChart').innerHTML = "";
				document.getElementById('recorderChart').appendChild(elem);
				sampleCloud.charting.lineChart('recorderChart', sampleCloud.recorder.getAudioBuffer().getChannelData(0));
				recorderChart = document.getElementById('recorderChart');
				console.log(sampleCloud.recorder.getAudioBuffer());
			}, false); //Start recording when button pressed

			play.addEventListener('click', function(evt) {
				evt.stopPropagation(); //Prevents further propagation of the current event
				evt.preventDefault();  //Prevents default action occuring for event occurence
				var newSource = sampleCloud.audioContext.createBufferSource(); //Create new buffer source
				newSource.buffer = sampleCloud.recorder.getAudioBuffer();
				newSource.connect(sampleCloud.audioContext.destination); //Connect to output (speakers)

				//Connect a javascript node so that we can draw chart when audio is being played
				var javascriptNode = sampleCloud.audioContext.createScriptProcessor(1024, 1, 1); //16384 buffer size = high quality
				javascriptNode.connect(sampleCloud.audioContext.destination);
				newSource.start(0); //plays the contents of the wav

				var j = 0;
				tempChannelData = newSource.buffer.getChannelData(0);

			   	javascriptNode.onaudioprocess = function (e) {
			   		//Extract 1024 size sample to send to chart
		   			if(j < tempChannelData.length - 1024)
		   			{
				   		var tempBuff = [];
				   		for(var i = 0; i < 1024; i++){
			   				tempBuff[i] = tempChannelData[i+j];
		   					j++;	
				   		}
				    	sampleCloud.charting.lineChart('recorderChart', tempBuff);
			    	}
			    }	
			    newSource.onended = function()
			    {
			    	sampleCloud.charting.lineChart('recorderChart', tempChannelData);
			    }
			}, false); //Start recording when button pressed	


			load.addEventListener('click', function(evt) {
				evt.stopPropagation(); //Prevents further propagation of the current event
				evt.preventDefault();  //Prevents default action occuring for event occurence
				sampleCloud.recorder.removeRecorder(document.getElementById('recorder'));
				loadMainPanel(sampleCloud.recorder.getAudioBuffer(), recorderChart);
			}, false);	
		});
	}

	function loadMainPanel(buffer, chartDiv)
	{
		$('#top').hide();
		console.log(buffer);
		sampleCloud.mainPanel = new mainPanel();
		sampleCloud.charting = new charting();
		sampleCloud.audioEncode = new audioEncode();
		sampleCloud.mainPanel.loadMainPanel(mainDiv, function() {

			if(chartDiv !== null)
			{
				document.getElementById('mainChart').appendChild(chartDiv);
			}
			else
			{
				sampleCloud.charting.lineChart('mainChart', buffer);
			}

			// sampleCloud.audioEncode.wavEncode(buffer, 1, 44100, function(response) {
			// 	console.log(response);
			// });

			// sampleCloud.audioEncode.mp3Encode(buffer, 1, 1, 44100, 128, buffer.length, function(response) {
			// 	console.log(response);
			// });
		});
	}
});