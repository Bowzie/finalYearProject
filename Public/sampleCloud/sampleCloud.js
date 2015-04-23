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
		newSource: null,
		recorder: null,
		register: null,
		user: null
	}

	mainDiv = document.getElementById('main');
	var userPanel = document.getElementById('userPanel');
	h1 = document.getElementById('header1');
	var maxTime; 
	init();

	function init()
	{
		//Determine if browser used supports web audio api
		try {
		  window.AudioContext = window.AudioContext || window.webkitAudioContext;
		  sampleCloud.audioContext = new AudioContext();
		} catch(e) {
		  alert('Web Audio API is not supported in this browser');
		}
		maxTime = sampleCloud.audioContext.sampleRate * 20; //Max 20 seconds
		sampleCloud.login = new login();
		sampleCloud.register = new register();
	 	loadLogin();
		//loadMainPanel(null);		
	}


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
			loginButton.addEventListener('click', function(evt) {
				evt.preventDefault();
				evt.stopPropagation();
				sampleCloud.register.removeRegister();
				loadLogin();
			}, false);
		});
	}

	function userPanelEventListeners()
	{
		var homeButton = document.getElementById('homeButton');
		var logoutButton = document.getElementById('logoutButton');

		homeButton.addEventListener('click', function(evt){
			evt.preventDefault();
			evt.stopPropagation();

			if(document.getElementById('musicPanel') === null)
			{
				loadMusicPanel(sampleCloud.user);	
			}

			if(sampleCloud.newSource !== null)
			{
				stopAudio(null);	
			}
			
		}, false);

		logoutButton.addEventListener('click', function(evt){
			evt.preventDefault();
			evt.stopPropagation();

			for(var key in sampleCloud)
			{
				if(sampleCloud.hasOwnProperty(key))
				{
					sampleCloud[key] = null;
				}
			}

			init();
		}, false);
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
		
		sampleCloud.login.validate(function (user) {
			if(user.result === true)
			{
				sampleCloud.login.removeLogin(mainDiv);
				userPanel.style.display = "block";
				sampleCloud.user = user;
				userPanelEventListeners();
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
		sampleCloud.musicPanel = new musicPanel();
		h1.innerText = 'SELECT AUDIO SOURCE';
		if(document.getElementById('top').style.display === "none")
		{
			document.getElementById('top').style.display = "block";
		}
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
					var playButton = document.getElementById('playCloud');
					var stopButton = document.getElementById('stopCloud');
					var select = document.getElementById('musicList');

					var currentBuffer = null;
					var currentTrack = null;
					var selectedTrack = null;

					previewButton.addEventListener('click', function(evt) {
						evt.stopPropagation(); //Prevents further propagation of the current event
						evt.preventDefault();  //Prevents default action occuring for event occurence
						selectedTrack = select.value;

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
										sampleCloud.charting.lineChart('cloudChart', buffer);
										currentBuffer = buffer;
									},function(e){"Error with decoding audio data" + e.err});
								});
							});
						}
						else {
							console.log('Already Loaded That File!');
						}
					}, false);

					playButton.addEventListener('click', function(evt) {
						evt.stopPropagation(); //Prevents further propagation of the current event
						evt.preventDefault();  //Prevents default action occuring for event occurence	
						playButton.disabled = true;		
						playAudio(currentBuffer, 'cloudChart', playButton);
					});

					stopButton.addEventListener('click', function(evt) {
						evt.stopPropagation(); //Prevents further propagation of the current event
						evt.preventDefault();  //Prevents default action occuring for event occurence

						stopAudio(playButton);
					}, false);

					loadButton.addEventListener('click', function(evt) {
						evt.stopPropagation(); //Prevents further propagation of the current event
						evt.preventDefault();  //Prevents default action occuring for event occurence
						stopAudio();
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
					}, false);

					console.log(music);
					var musicList = document.getElementById('musicList');
					music.forEach(function(track) {
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

				loadButton.disabled = false;
				spanDiv.style.color = "black";
				spanDiv.innerText = "Loading...";

				var fileList = evt.target.files;	//Read fileList from target of event
				
				if(fileList.length > 0)
				{
					sampleCloud.fileSelection.fileReadToBuff(fileList, function(buffer) {
						
						if(buffer.length <= buffer.sampleRate * 20)
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
							fileChooserDiv.value = '';
						}
					});	//Send fileList to function that will read file contents as array buffer
				}
		 	}, false);	

		 	fileDropArea.addEventListener('dragover', function(evt) {
		 		evt.stopPropagation(); //Prevents further propagation of the current event
				evt.preventDefault();  //Prevents default action occuring for event occurence

				evt.dataTransfer.dropEffect = 'copy'; //Copy file when it is dropped into fileDropArea (default is download)
		 	}
		 	, false);

		 	fileDropArea.addEventListener('drop', function(evt) {
		 		evt.stopPropagation(); //Prevents further propagation of the current event
				evt.preventDefault();  //Prevents default action occuring for event occurence

				loadButton.disabled = false;
				spanDiv.style.color = "black";
				spanDiv.innerText = "Loading...";

				var fileList = evt.dataTransfer.files; //Read fileList from data transfer event

				sampleCloud.fileSelection.fileReadToBuff(fileList, function(buffer) { 
					
					if(buffer.length <= buffer.sampleRate * 20)
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
					}
				});	//Send fileList to function that will read file contents as array buffer
		 	}, false);	

		 	loadButton.addEventListener('click', function(evt) {
		 		stopAudio();
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
			play.disabled = false;

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
						play.disabled = true;
						startRecorder.disabled = true;
						
						//Read in from audio inputa and add to recording 
					    sampleCloud.recorder.getJavaScriptNode().onaudioprocess = function (e) {
					    	sampleCloud.recorder.addToRecordingBuffer(e.inputBuffer);
					    	sampleCloud.charting.lineChart('recorderChart', e.inputBuffer);
					    	if(sampleCloud.recorder.getRecording().length >= maxTime)
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
			}, false); //Start recording when button pressed

			play.addEventListener('click', function(evt) {
				evt.stopPropagation(); //Prevents further propagation of the current event
				evt.preventDefault();  //Prevents default action occuring for event occurence
				play.disabled = true;
				playAudio(sampleCloud.recorder.getAudioBuffer(), 'recorderChart');
			}, false); //Start recording when button pressed	


			load.addEventListener('click', function(evt) {
				evt.stopPropagation(); //Prevents further propagation of the current event
				evt.preventDefault();  //Prevents default action occuring for event occurence
				stopAudio(play);
				sampleCloud.recorder.removeRecorder(document.getElementById('recorder'));
				loadMainPanel(sampleCloud.recorder.getAudioBuffer(), recorderChart);
			}, false);	
		});
	}

	function loadMainPanel(buffer, chartDiv)
	{
		$('#top').hide();
		sampleCloud.mainPanel = new mainPanel();
		sampleCloud.charting = new charting();
		sampleCloud.audioEncode = new audioEncode();

		sampleCloud.mainPanel.loadMainPanel(mainDiv, function() {
			var playButton = document.getElementById('mainPlay');
			var stopButton = document.getElementById('mainStop');
			var resetButton = document.getElementById('mainReset');
			var saveForm = document.getElementById('saveForm');

			if(chartDiv !== null)
			{
				document.getElementById('mainChart').appendChild(chartDiv);
			}
			else
			{
				sampleCloud.charting.lineChart('mainChart', buffer);
			}

			playButton.addEventListener('click', function(evt) {
				evt.stopPropagation(); //Prevents further propagation of the current event
				evt.preventDefault();  //Prevents default action occuring for event occurence

				playButton.disabled = true;
				playAudio(sampleCloud.recorder.getAudioBuffer(), 'mainChart', playButton);
			}, false); //Start recording when button pressed	

			stopButton.addEventListener('click', function(evt) {
				evt.stopPropagation(); //Prevents further propagation of the current event
				evt.preventDefault();  //Prevents default action occuring for event occurence

				stopAudio(playButton);
			}, false);

			saveForm.addEventListener('submit', function(evt) {
				evt.preventDefault();
				evt.stopPropagation();
				var saveForm = document.forms['saveForm'];
				var trackname = saveForm['tracknameInput'].value;
				var channels = saveForm['channels'].value;
				var format = saveForm['format'].value;



				if(format === 'WAV')
				{
					sampleCloud.audioEncode.wavEncode(buffer.getChannelData(0), channels, sampleCloud.audioContext.sampleRate , function(blob) {
				    	var fileReader = new FileReader()	//Create new file reader
						var fileToArrayBuffer = fileReader.readAsArrayBuffer(blob); //Read file contents as array buffer

						//Decode file array buffer contents as audio buffer
						fileReader.onload = function() {
							var arrayBuffer = fileReader.result;
							sampleCloud.audioContext.decodeAudioData(fileReader.result, function(buffer){

							});
						}	
				    	//Create download 
				       	var URL = window.URL || window.webkitURL;
				        var downloadUrl = URL.createObjectURL(blob);
					    var a = document.createElement("a");
					    a.href = downloadUrl;
					    a.download = trackname + '.wav';
					    document.body.appendChild(a);
					    a.click(); 
					});
				}
				else{
					var bitrate = format === 'MP3_128' ? 128
						: format === 'MP3_192' ? 192
						: format === 'MP3_320' ? 320
						: null;

					sampleCloud.audioEncode.mp3Encode(buffer.getChannelData(0), 1, channels, sampleCloud.audioContext.sampleRate, bitrate, buffer.length, function(response) {
				    	//Create download 
				    	console.log(response);

				       	var URL = window.URL || window.webkitURL;
				        var downloadUrl = URL.createObjectURL(response);
					    var a = document.createElement("a");
					    a.href = downloadUrl;
					    a.download =  trackname + '.mp3'
					    document.body.appendChild(a);
					   // a.click(); 
					});
				}
				console.log(trackname + " " + channels + " " + format);
			}, false);




		});
	}

	function playAudio(buffer, chartDiv, div)
	{
		sampleCloud.newSource = sampleCloud.audioContext.createBufferSource(); //Create new buffer source
		sampleCloud.newSource.buffer = buffer;
		sampleCloud.newSource.connect(sampleCloud.audioContext.destination); //Connect to output (speakers)

		//Connect a javascript node so that we can draw chart when audio is being played
		var javascriptNode = sampleCloud.audioContext.createScriptProcessor(2048, 1, 1); //16384 buffer size = high quality
		javascriptNode.connect(sampleCloud.audioContext.destination);
		sampleCloud.newSource.start(0); //plays the contents of the wav

		var j = 0;
		tempChannelData = sampleCloud.newSource.buffer.getChannelData(0);
		var tempBuff = [];
		var length = tempChannelData.length;
		
	   	javascriptNode.onaudioprocess = function (e) {
	   		if(sampleCloud.newSource !== null)
	   		{
		   		if(j < length - 2048) //Don't draw last frame
		   		{
			   		tempBuff = tempChannelData.subarray(j, j+2048);
					j += 2048;	
			    	sampleCloud.charting.lineChart(chartDiv, tempBuff);	
		   		}	
	   		}
	    }	

	    sampleCloud.newSource.onended = function()
	    {
	    	//Loading gif add
	    	sampleCloud.charting.lineChart(chartDiv, tempChannelData);
	    	sampleCloud.newSource = null;
	    	if(div !== null)
	    	{
	    		div.disabled = false;
	    	}
	    	
	    }
	}

	function stopAudio(div)
	{
		if(sampleCloud.newSource !== null)
		{
			sampleCloud.newSource.stop();	
			sampleCloud.newSource = null;
			if(div !== null)
			{
				div.disabled = false;
			}
		}
	}
});