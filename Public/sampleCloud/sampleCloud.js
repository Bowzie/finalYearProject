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

	function registerFormFunction(evt) {
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
		sampleCloud.musicPanel.loadMusicPanel(mainDiv, function () {
			console.log('loaded');
		});
	}
});