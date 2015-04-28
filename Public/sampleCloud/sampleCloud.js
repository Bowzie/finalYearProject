define([
	'jquery',
	'audioEncode',
	'audioServer',
	'charting',
	'dspFunctions',
	'dspPanel',
	'fileSelection',
	'login',
	'mainPanel',
	'musicPanel',
	'recorder',
	'register',
], function($, audioEncode, audioServer, charting, dspFunctions, dspPanel, fileSelection, login, mainPanel, musicPanel, recorder, register) {

	var sampleCloud = {
		audioContext: null,
		mainDiv: null,
		h1: null,
		audioEncode: null,
		audioServer: null,
		charting: null,
		dspFunctions: null,
		dspPanel: null,
		fileSelection: null,
		initialBuffer: null,
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
	}


	function loadLogin() //Loads login panel
	{
		userPanel.style.display = "none";
		h1.innerText = 'WELCOME TO SAMPLE CLOUD';
		$('#top').show(); //Make visible if not

		//Load in login.html
		sampleCloud.login.loadLogin(function(response) {
			var loginDiv = document.getElementById('login');
			loginDiv.addEventListener('submit', validate, false); //Validate form on submission

			var registerButton = document.getElementById('registerButton');

			registerButton.addEventListener('click', function(evt) { //Switch to register panel
				evt.preventDefault();
				evt.stopImmediatePropagation();
				sampleCloud.login.removeLogin(loginDiv); //Remove login panel from view
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

			loginButton.addEventListener('click', function(evt) { //Switch to login panel
				evt.preventDefault();
				evt.stopPropagation();

				sampleCloud.register.removeRegister(); //Remove register panel from view
				loadLogin();
			}, false);
		});
	}

	function userPanelEventListeners() //Home button and logout button event listeners
	{
		var homeButton = document.getElementById('homeButton');
		var logoutButton = document.getElementById('logoutButton');

		homeButton.addEventListener('click', function(evt) { //go back to musicPanel if not there already
			evt.preventDefault();
			evt.stopPropagation();

			if(document.getElementById('musicPanel') === null)
			{
				loadMusicPanel(sampleCloud.user);	
			}

			if(sampleCloud.newSource !== null) //Stop potential music playing
			{
				stopAudio(null);	
			}
			
		}, false);

		logoutButton.addEventListener('click', function(evt){
			evt.preventDefault();
			evt.stopPropagation();

			//Reset all global sampleCloud variables
			for(var key in sampleCloud)
			{
				if(sampleCloud.hasOwnProperty(key))
				{
					sampleCloud[key] = null;
				}
			}

			init(); //restart
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
		
		//Validate login via 
		sampleCloud.login.validate(function (user) { //wait for return from db
			if(user.result === true) //Successful - load musicPanel
			{
				sampleCloud.login.removeLogin(mainDiv);
				userPanel.style.display = "block";
				sampleCloud.user = user;
				userPanelEventListeners();
				loadMusicPanel(user);
			}
			else //Unsuccessful - reload login panel
			{
				loadLogin();
			}
		});
	}

	//Process register form 
	function registerFormFunction(evt) 
	{
		evt.preventDefault();

		sampleCloud.register.register(function(response) {
			if(response.result === true) //Username was available and account was created
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
		if(document.getElementById('top').style.display === "none") //Display top panel if it is invisible
		{
			document.getElementById('top').style.display = "block";
		}
		sampleCloud.musicPanel.loadMusicPanel(mainDiv, function (response) {
			handleMusicPanel(user);
		});
	}

	function handleMusicPanel(user) //Load in music panel and wait for user input
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

		sampleCloud.audioServer.getTrackList(user.id, function(music) { //Get tracks for user from db
			if(music === null) { //Stay on musicPanel if no tracks available
				alert('You have no tracks stored here!');
			}
			else {
				sampleCloud.audioServer.loadAudioServer(mainDiv, function() //Load audioserver.html
				{
					sampleCloud.charting = new charting();

					var previewButton = document.getElementById('previewCloud');
					var loadButton = document.getElementById('loadCloud');
					var playButton = document.getElementById('playCloud');
					var stopButton = document.getElementById('stopCloud');
					var deleteButton = document.getElementById('delCloud');
					var spanCloud = document.getElementById('spanCloud');
					var select = document.getElementById('musicList');
					var prev = document.getElementById('previewArea');
					var cloudChart = document.getElementById('cloudChart');

					var currentBuffer = null;
					var currentTrack = null;
					var selectedTrack = null;

					spanCloud.innerText = '';

					select.addEventListener('change', function(evt) { //Potentially remove preview chart when track changed
						spanCloud.style.display = 'none';
						spanCloud.innerText = '';
						if(prev.style.display === 'block')
						{
							cloudChart.innerHTML ='';
							prev.style.display = 'none';
						}
					});

					previewButton.addEventListener('click', function(evt) { //Load preview (chart, play and stop)
						evt.stopPropagation(); //Prevents further propagation of the current event
						evt.preventDefault();  //Prevents default action occuring for event occurence

						spanCloud.innerText = '';
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
										prev.style.display = 'block';
										sampleCloud.charting.lineChart('cloudChart', buffer, 'normal');
										currentBuffer = buffer;
									},function(e){"Error with decoding audio data" + e.err});
								});
							});
						}
						else {
							console.log('Already Loaded That File!');
						}
					}, false);

					deleteButton.addEventListener('click', function(evt) { //Delete track from file system and delete db entry on confirmation
						var trackSel = select.value;
						var confirm = window.confirm('Delete' + trackSel + '?');

						if(confirm === true) //Delete track
						{
							var trackSel = select.value;
							
							var trackDetails = {
			    				userId: user.id,
			    				username: user.username,
			    				trackname: trackSel 
							}

							sampleCloud.audioServer.getTrackPath(trackDetails, function(result) {

								var path = result.trackPath.split("/");
								var trackPath = path[path.length-1];

								var userDetails = {
									userId: sampleCloud.user.id,
									title: trackSel,
									path: trackPath
								}

								var delTrackDetails = {
									username: user.username,
									path: trackPath
								}

								//Remove track from db and file system
								sampleCloud.audioServer.deleteDbEntry(userDetails, function() {
									sampleCloud.audioServer.deleteTrack(delTrackDetails, function() {
										//Remove track from select list
										for(var i = 0; i < musicList.length; i++)
										{
											if(musicList[i].value === trackSel)
											{
												musicList.removeChild(musicList[i]);
												if(musicList.length == 0) 
												{
													loadMusicPanel(user);
												}
											}
										}
										spanCloud.style.display = 'block';
										spanCloud.innerText = 'deleted';	
									});
								});
							});
						}
					});

					playButton.addEventListener('click', function(evt) { //Play audio
						evt.stopPropagation(); //Prevents further propagation of the current event
						evt.preventDefault();  //Prevents default action occuring for event occurence#

						playButton.disabled = true;		
						playAudio(currentBuffer, 1, 'cloudChart', playButton);
					});

					stopButton.addEventListener('click', function(evt) { //Stop audio
						evt.stopPropagation(); //Prevents further propagation of the current event
						evt.preventDefault();  //Prevents default action occuring for event occurence

						stopAudio(playButton);
					}, false);

					loadButton.addEventListener('click', function(evt) { //Load audio into main panel

						evt.stopPropagation(); //Prevents further propagation of the current event
						evt.preventDefault();  //Prevents default action occuring for event occurence
						stopAudio();
						sampleCloud.audioServer.removeAudioServer(document.getElementById('cloudList'));
						if(currentTrack !== null && currentBuffer !== null) //If already previewed, load into main panel
						{
							var chartDiv = document.getElementById('cloudChart');
							loadMainPanel(currentBuffer, chartDiv);
						}
						else //Not previewed, fetch track and load into main panel
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

	function loadUpload() { //Load upload panel
		h1.innerText = 'UPLOAD';
		sampleCloud.fileSelection = new fileSelection();
		sampleCloud.fileSelection.loadFileSelection(mainDiv, function() {

			var fileChooser = document.getElementById('fileChooser');
			var fileDropArea = document.getElementById('drop');
			var spanDiv = document.getElementById('spanFileSelector');
			var loadButton = document.getElementById('loadFileSelector');
			var fileChooserDiv = document.getElementById('fileChooser');

		 	fileChooser.addEventListener('change', function(evt) { //Get file and decode

		 		evt.stopPropagation(); //Prevents further propagation of the current event
				evt.preventDefault();  //Prevents default action occuring for event occurence

				loadButton.disabled = false;
				spanDiv.style.color = "black";
				spanDiv.innerText = "Loading...";

				var fileList = evt.target.files;	//Read fileList from target of event

				if(fileList.length > 0)
				{
					sampleCloud.fileSelection.fileReadToBuff(fileList, function(buffer) { //Decode audiobuffer
						if(buffer.length <= buffer.sampleRate * 20) //Check if track is longer than 20 seconds
						{
							loadButton.disabled = false;
							spanDiv.style.color = "blue";
							spanDiv.innerText = fileList[0]. name + " Allowed!";
							sampleCloud.fileSelection.setAudioBuffer(buffer);
						}
						else //track too long
						{
							loadButton.disabled = true;
							spanDiv.style.color = "red";
							spanDiv.innerText = fileList[0].name + " Not Allowed! Pick a file with a smaller size";
							fileChooserDiv.value = '';
						}
					});	
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
					
					if(buffer.length <= buffer.sampleRate * 20) //Check if track is longer than 20 seconds
					{
						loadButton.disabled = false;
						spanDiv.style.color = "blue";
						spanDiv.innerText = fileList[0]. name + " Allowed!";
						fileChooserDiv.value = '';
						sampleCloud.fileSelection.setAudioBuffer(buffer.getChannelData(0));
					}
					else //track too long
					{
						loadButton.disabled = true;
						spanDiv.style.color = "red";
						spanDiv.innerText = fileList[0].name + " Not Allowed! Pick a file with a smaller size";
						fileChooserDiv.value = '';
					}

				});	
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
				loadMusicPanel(sampleCloud.user);
			}

			//Set divs to variables
			var startRecorder = document.getElementById('recStart');
			var stopRecorder = document.getElementById('recStopRec');
			var playButton = document.getElementById('recPlay');
			var stopButton = document.getElementById('recStop');
			var loadButton = document.getElementById('recLoad');
			var recorderSpan = document.getElementById('recSpan');

			playButton.disabled = true;
			loadButton.disabled = true;

			sampleCloud.charting.lineChart('recorderChart', [0],'normal');
			recorderSpan.innerText = '';
			//Add event listeners
			startRecorder.addEventListener('click', function(evt) {
				evt.stopPropagation(); //Prevents further propagation of the current event
				evt.preventDefault();  //Prevents default action occuring for event occurence		
				recorderSpan.innerText = '';
				sampleCloud.recorder.startRecord(function(isRecording) {
					recorderSpan.innerText = '';
					if(isRecording === true) {
						playButton.disabled = true;
						startRecorder.disabled = true;
						loadButton.disabled = true;
						stopRecorder.disabled = false;
					}
					else {
						playButton.disabled = true;
						startRecorder.disabled = true;
						loadButton.disabled = true;
						stopRecorder.disabled = false;
						//Read in from audio inputa and add to recording 
					    sampleCloud.recorder.getJavaScriptNode().onaudioprocess = function (e) {
					    	sampleCloud.recorder.addToRecordingBuffer(e.inputBuffer);
					    	sampleCloud.charting.lineChart('recorderChart', e.inputBuffer, 'normal');
					    	if(sampleCloud.recorder.getRecording().length >= maxTime)
					    	{
					    		recorderSpan.innerText = 'REACHED TIME LIMIT!';
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

				playButton.disabled = false;
				startRecorder.disabled = false;
				loadButton.disabled = false;
				stopRecorder.disabled = true;
				sampleCloud.recorder.stopRecord();

				var elem = document.createElement("img");
				elem.setAttribute("src", "images/loadingCols.gif");
				document.getElementById('recorderChart').innerHTML = "";
				document.getElementById('recorderChart').appendChild(elem);

				sampleCloud.charting.lineChart('recorderChart', sampleCloud.recorder.getAudioBuffer().getChannelData(0), 'normal');
				recorderChart = document.getElementById('recorderChart');
			}, false); //Start recording when button pressed

			playButton.addEventListener('click', function(evt) {
				evt.stopPropagation(); //Prevents further propagation of the current event
				evt.preventDefault();  //Prevents default action occuring for event occurence
				recorderSpan.innerText = '';
				playButton.disabled = true;
				playAudio(sampleCloud.recorder.getAudioBuffer(), 1, 'recorderChart', playButton);
			}, false); //Start recording when button pressed	

			stopButton.addEventListener('click', function(evt) {
				evt.stopPropagation(); //Prevents further propagation of the current event
				evt.preventDefault();  //Prevents default action occuring for event occurence

				recorderSpan.innerText = '';
				playButton.disabled = false;
				stopAudio(playButton);

			}, false); //Start recording when button pressed	

			loadButton.addEventListener('click', function(evt) {
				evt.stopPropagation(); //Prevents further propagation of the current event
				evt.preventDefault();  //Prevents default action occuring for event occurence

				recorderSpan.innerText = '';
				stopAudio(playButton);
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
		sampleCloud.audioServer = new audioServer();
		sampleCloud.dsp = new dspFunctions();
		sampleCloud.dspPanel = new dspPanel();
		sampleCloud.mainPanel.loadMainPanel(mainDiv, function() {
			sampleCloud.initialBuffer = buffer;
			if(chartDiv !== null)
			{
				document.getElementById('mainChart').appendChild(chartDiv);
			}
			else
			{
				sampleCloud.charting.lineChart('mainChart', buffer, 'normal');
			}

			//Get channel data from buffer (max 2)
			var leftChannel = null;
			var rightChannel = null;
			var numChannels = 1;
			var chosenChannel = 1;
			if(buffer instanceof AudioBuffer)
			{
				leftChannel = buffer.getChannelData(0);
				if(buffer.numberOfChannels > 1)
				{
					numChannels = 2;
					rightChannel = buffer.getChannelData(1)
				}
			}
			else {
				alert('Data is not an audio buffer!');
				loadMusicPanel(sampleCloud.user);
			}

			//Get Spectrum for each channel
			var leftSpectrum = null;
			var rightSpectrum = null;
			sampleCloud.dsp.fft(leftChannel, sampleCloud.audioContext.samplerate, function(fft) {
				leftSpectrum = fft.spectrum;
			});
			if(numChannels === 2)
			{
				sampleCloud.dsp.fft(rightChannel, sampleCloud.audioContext.samplerate, function(fft) {
					rightSpectrum = fft.spectrum;
				});	
			}

			//Document elements
			var playButton = document.getElementById('mainPlay');
			var stopButton = document.getElementById('mainStop');
			var resetButton = document.getElementById('mainReset');
			var saveForm = document.getElementById('saveForm');
			var mainSaveSpan = document.getElementById('mainSaveUploadSpan');
			var viewSelect = document.getElementById('viewSelect');
			var channelSelect = document.getElementById('channelSelect');
			var dspSelect = document.getElementById('dspSelect');
			var dspPanel =  document.getElementById('dspPanel');
			var applyDspButton = document.getElementById('applyDsp');

			if(numChannels === 1) //Hide channel select if only one channel
			{
				channelSelect.style.display = 'none';
			}

			mainSaveSpan.style.display = 'none';
			mainSaveSpan.innerText = '';

			viewSelect.addEventListener('change', function(evt) {
				evt.stopPropagation(); //Prevents further propagation of the current event
				evt.preventDefault();  //Prevents default action occuring for event occurence
				var currentBuffer;
				var currentSpectrum;

				if(chosenChannel === 1)
				{
					currentBuffer = leftChannel;
					currentSpectrum = leftSpectrum;
				}
				else {
					currentBuffer = rightChannel;
					currentSpectrum = rightSpectrum;
				}

				switch(viewSelect.value) {
					case 'normal':
						sampleCloud.charting.lineChart('mainChart', currentBuffer, 'normal');
					break;
					case 'spectLine':
						if(currentSpectrum !== null)
						{
							sampleCloud.charting.lineChart('mainChart', currentSpectrum, 'spectral');
						}
						else
						{
							sampleCloud.dsp.fft(currentBuffer, sampleCloud.audioContext.samplerate, function(fft) {
								currentSpectrum = fft.spectrum
								sampleCloud.charting.lineChart('mainChart', currentSpectrum, 'spectral');
							});
						}
					break;
					case 'spectBar':
						if(currentSpectrum !== null)
						{
							sampleCloud.charting.barChart('mainChart', currentSpectrum, 'spectral');
						}
						else
						{
							sampleCloud.dsp.fft(currentBuffer, sampleCloud.audioContext.samplerate, function(fft) {
								currentSpectrum = fft.spectrum
								sampleCloud.charting.barChart('mainChart', currentSpectrum, 'spectral');
							});
						}
					break;
				}
			}, false);

			channelSelect.addEventListener('change', function(evt) { 
				evt.preventDefault();
				evt.stopPropagation();

				if(channelSelect.value === '1')
				{
					chosenChannel = 1;
					sampleCloud.charting.lineChart('mainChart', leftChannel, 'normal');
				}
				else {
					chosenChannel = 2;
					sampleCloud.charting.lineChart('mainChart', rightChannel, 'normal');
				}
			});

			dspSelect.addEventListener('change', function(evt) {
				evt.stopPropagation(); //Prevents further propagation of the current event
				evt.preventDefault();  //Prevents default action occuring for event occurence

				sampleCloud.dspPanel.handleSelectChange(sampleCloud.audioContext.sampleRate);
			}, false);

			applyDspButton.addEventListener('click', function(evt) {
				evt.stopPropagation(); //Prevents further propagation of the current event
				evt.preventDefault();  //Prevents default action occuring for event occurence

				applyDspButton.disabled = true;

				sampleCloud.dspPanel.handleDspApply(leftChannel, sampleCloud.audioContext.sampleRate, function(newBuffer) {
					if(newBuffer !== null){
							sampleCloud.dsp.fft(newBuffer, sampleCloud.audioContext.samplerate, function(fft) {
							leftChannel = newBuffer;
							if(chosenChannel == 1)
							{
								sampleCloud.charting.lineChart('mainChart', leftChannel, 'normal');	
							}
							applyDspButton.disabled = false;
							leftSpectrum = fft.spectrum;
						});	
					} 
					else {
						applyDspButton.disabled = false;
					}
				});

				if(numChannels === 2)
				{
					sampleCloud.dspPanel.handleDspApply(rightChannel, sampleCloud.audioContext.sampleRate, function(newBuffer) {
						if(newBuffer !== null){
								sampleCloud.dsp.fft(newBuffer, sampleCloud.audioContext.samplerate, function(fft) {
								rightChannel = newBuffer;
								if(chosenChannel == 2)
								{
									sampleCloud.charting.lineChart('mainChart', rightChannel, 'normal');	
								}
								applyDspButton.disabled = false;
								rightSpectrum = fft.spectrum;
							});	
						} 
						else {
							applyDspButton.disabled = false;
						}
					});
				}
			}, false); //Start recording when button pressed


			playButton.addEventListener('click', function(evt) {
				evt.stopPropagation(); //Prevents further propagation of the current event
				evt.preventDefault();  //Prevents default action occuring for event occurence

				viewSelect.value = 'normal';
				playButton.disabled = true;
				playAudio({left: leftChannel, right: rightChannel}, chosenChannel, 'mainChart', playButton);				
			}, false); //Start recording when button pressed	

			stopButton.addEventListener('click', function(evt) {
				evt.stopPropagation(); //Prevents further propagation of the current event
				evt.preventDefault();  //Prevents default action occuring for event occurence

				viewSelect.value = 'normal';
				stopAudio(playButton);
			}, false);

			resetButton.addEventListener('click', function(evt) {
				evt.stopPropagation(); //Prevents further propagation of the current event
				evt.preventDefault();  //Prevents default action occuring for event occurence

				leftChannel = sampleCloud.initialBuffer.getChannelData(0);
				if(numChannels > 1)
				{
					rightChannel = sampleCloud.initialBuffer.getChannelData(1);
				}

				sampleCloud.charting.lineChart('mainChart', leftChannel, 'normal');
				channelSelect.value = '1';

			}, false);

			saveForm.addEventListener('submit', function(evt) {
				evt.preventDefault();
				evt.stopPropagation();

				var saveForm = document.forms['saveForm'];
				var trackname = saveForm['tracknameInput'].value;
				var selectedNumChannels = saveForm['channels'].value;
				var format = saveForm['format'].value;
				var download = saveForm['download'].checked;

				//Check for overwrite
				sampleCloud.audioServer.checkTrackName(sampleCloud.user.id, trackname, function(response) {
					if(format === 'WAV' && selectedNumChannels > numChannels)
					{	
						mainSaveSpan.style.display = 'block';
						mainSaveSpan.innerText = "Cannot encode wav 2 channels when audio is only 1!";
					}
					else {
						mainSaveSpan.style.display = 'none';
						mainSaveSpan.innerText = "";
						if(response.result === false) //not on server
						{
							saveAudio('new', null, trackname, selectedNumChannels, format, download, leftChannel, rightChannel, numChannels);
						}
						else {
							var confirm = window.confirm("Overwrite " + trackname + "?");
							if(confirm === true) //Overwrite file with same name
							{
								var trackDetails = {
				    				userId: sampleCloud.user.id,
				    				username: sampleCloud.user.username,
				    				trackname: trackname
								}

								sampleCloud.audioServer.getTrackPath(trackDetails, function(result) {
									var path = result.trackPath.split("/");
									var trackPath = path[path.length-1];

									saveAudio('update', trackPath, trackname, selectedNumChannels, format, download, leftChannel, rightChannel, numChannels);	
								});
							}
						}
					}
				});
			}, false);
		});
	}

	function playAudio(buffer, chosenChannel, chartDiv, div)
	{	

		var audioBuffer;
		if(buffer instanceof AudioBuffer)
		{
			audioBuffer = buffer;
		}
		else { //create audio buffer
			var channels = 1;
			if(buffer.right != null)
			{
				channels = 2;
			}
			audioBuffer = sampleCloud.audioContext.createBuffer( channels, buffer.left.length, sampleCloud.audioContext.sampleRate); //Create buffer
       		audioBuffer.getChannelData(0).set(buffer.left, 0);	//Set channel data to left
       		if(channels === 2)
       		{
       			audioBuffer.getChannelData(1).set(buffer.right, 0);	//Set channel data to right
       		}
		}

		sampleCloud.newSource = sampleCloud.audioContext.createBufferSource(); //Create new buffer source
		sampleCloud.newSource.buffer = audioBuffer;

		sampleCloud.newSource.connect(sampleCloud.audioContext.destination); //Connect to output (speakers)

		//Connect a javascript node so that we can draw chart when audio is being played
		var javascriptNode = sampleCloud.audioContext.createScriptProcessor(2048, 1, 1); //16384 buffer size = high quality
		javascriptNode.connect(sampleCloud.audioContext.destination);
		

		var j = 0;
		tempChannelData = sampleCloud.newSource.buffer.getChannelData(chosenChannel-1);
		var tempBuff = [];
		var length = tempChannelData.length;
		
	   	javascriptNode.onaudioprocess = function (e) {
	   		if(sampleCloud.newSource !== null)
	   		{
		   		if(j < length - 2048) //Don't draw last frame
		   		{
			   		tempBuff = tempChannelData.subarray(j, j+2048);
					j += 2048;	
			    	sampleCloud.charting.lineChart(chartDiv, tempBuff, 'normal');	
		   		}	
	   		}
	    }	

	    sampleCloud.newSource.onended = function()
	    {
	    	//Loading gif add
	    	sampleCloud.charting.lineChart(chartDiv, tempChannelData, 'normal');
	    	sampleCloud.newSource = null;

	    	if(div != null)
	    	{
	    		div.disabled = false;
	    	}
	    	
	    }

	    sampleCloud.newSource.start(0); //plays the contents of the wav
	}

	function stopAudio(div)
	{
		if(sampleCloud.newSource !== null)
		{
			sampleCloud.newSource.stop();	
			sampleCloud.newSource = null;
			if(div != null)
			{
				div.disabled = false;
			}
		}
	}

	function saveAudio(type, prevTrackPath, trackname, channels, format, download, leftChannel, rightChannel, numChannels) 
	{
		var mainSaveSpan = document.getElementById('mainSaveUploadSpan');
		mainSaveSpan.style.display = 'block';
		mainSaveSpan.innerText = 'Saving ' + trackname + '...';
		if(format === 'WAV')
		{
			sampleCloud.audioEncode.wavEncode(leftChannel, rightChannel, numChannels, channels, sampleCloud.audioContext.sampleRate , function(blob) {
				if(download === true)
				{
			    	//Create download 
			       	var URL = window.URL || window.webkitURL;
			        var downloadUrl = URL.createObjectURL(blob);
				    var a = document.createElement("a");
				    a.href = downloadUrl;
				    a.download = trackname + '.wav';
				    document.body.appendChild(a);
				    a.click(); 	
				}

				var userDetails = {
					userId: sampleCloud.user.id,
					title: trackname,
					path: trackname + '.wav'
				}

				if(type === 'update')
				{
					var trackDetails = {
						username: sampleCloud.user.username,
						path: prevTrackPath
					}

					sampleCloud.audioServer.deleteDbEntry(userDetails, function() {
						sampleCloud.audioServer.deleteTrack(trackDetails, function() {
							sampleCloud.audioServer.addDbEntry(userDetails, function() {
								sampleCloud.audioServer.addTrack(blob, userDetails.path, sampleCloud.user.username, function() {
										mainSaveSpan.style.display = 'block';
										mainSaveSpan.innerText = trackname + ' saved!';
								});	
							});
						});
					});

				}
				else {
					sampleCloud.audioServer.addDbEntry(userDetails, function() {
						sampleCloud.audioServer.addTrack(blob, userDetails.path, sampleCloud.user.username, function(response) {
							mainSaveSpan.style.display = 'block';
							mainSaveSpan.innerText = trackname + ' saved!';
						});	
					});	
				}
			});
		}
		else{
			var bitrate = format === 'MP3_128' ? 128
				: format === 'MP3_192' ? 192
				: format === 'MP3_320' ? 320
				: 128;

			sampleCloud.audioEncode.mp3Encode(leftChannel, rightChannel, numChannels, 1, channels, sampleCloud.audioContext.sampleRate, bitrate, leftChannel.length, function(blob) {
				if(download === true)
				{
			    	//Create download 
			       	var URL = window.URL || window.webkitURL;
			        var downloadUrl = URL.createObjectURL(blob);
				    var a = document.createElement("a");
				    a.href = downloadUrl;
				    a.download =  trackname + '.mp3'
				    document.body.appendChild(a);
				   	a.click(); 
			   	}

			   	var userDetails = {
					userId: sampleCloud.user.id,
					title: trackname,
					path: trackname + '.mp3'
				}

				if(type === 'update')
				{
					var trackDetails = {
						username: sampleCloud.user.username,
						path: prevTrackPath
					}
					sampleCloud.audioServer.deleteDbEntry(userDetails, function() {
						sampleCloud.audioServer.deleteTrack(trackDetails, function() {
							sampleCloud.audioServer.addDbEntry(userDetails, function() {
								sampleCloud.audioServer.addTrack(blob, userDetails.path, sampleCloud.user.username, function() {
									mainSaveSpan.style.display = 'block';
									mainSaveSpan.innerText = trackname + ' saved!';
								});	
							});
						});
					});

				}
				else {
					sampleCloud.audioServer.addDbEntry(userDetails, function() {
						sampleCloud.audioServer.addTrack(blob, userDetails.path, sampleCloud.user.username, function() {
							mainSaveSpan.style.display = 'block';
							mainSaveSpan.innerText = trackname + ' saved!';
						});	
					});	
				}
			});
		}
	}
});