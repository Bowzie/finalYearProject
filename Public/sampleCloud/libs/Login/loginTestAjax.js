define([
	'jquery',
], function($) {
	var loginDiv = document.getElementById('login');
	var loginButton = document.getElementById('loginButton');
	var logoutButton = document.getElementById('logoutButton');
	var registerButton = document.getElementById('registerButton');
	var top = document.getElementById('top');
	var registerForm = document.getElementById('registration');
	var musicList = document.getElementById('musicList');
	console.log(registerButton);
	// var header1 = document.getElementById('header');
	loginDiv.addEventListener('submit', validate, false);
	registerForm.addEventListener('submit', register, false);
	// registerButton.click();

	var loginAttempts = 0;
	// loginButton.click();
	console.log('Waiting for click');
	location.hash = 'SampleCloud';

	var regDetails = {
			functionName: 'addUser',
			username: 'abcdefg',
			password: 'a',
			email: 'a',
			firstname: 'a', 
			lastname: 'a',
			country: 'a'
	}

	addUser();
	function validate(evt)
	{
		evt.preventDefault();
		
		var userDetails = {
			functionName: 'login',
			username: document.getElementById('usernameLogin').value,
			password: document.getElementById('passwordLogin').value
		};

		document.forms['login'].reset();
		console.log('Validating Login');

		$.ajax({
			type: "POST",
			url: '/../finalYearProject/mvc/Controllers/User.php',
			data: JSON.stringify(userDetails),
			dataType: 'json',
			contentType: 'application/json; charset=UTF-8',
			success: function(user) {
				if(user.result === 'Successful')
				{
					loginDiv.style.display = 'none';
					// document.cookie = 'username=dafg; expires=Thu, 01 Jan 2016 00:00:00 UTC';
					console.log(user);
					handleLoginSuccess(user);
					// loginButton.innerHTML = 'SUCCESS';
				}
				else
				{
					loginDiv.style.display = 'block';
					console.log('Failure to login');
					// document.getElementById('loginFailed').innerHTML = 'Login Failed Bro';					loginAttempts++;

					//Prevent brute force of password by only allowing 5 attempts (per username??)
					if(loginAttempts > 5)
					{
						console.log('Lock out here');
					}
				}
			},
			error: function() {

			}
		});
		console.log('Ajax');
	}

	function register(evt)
	{
		//CHECK MATCHING PASSWORDS
		evt.preventDefault();
		//display register form
		//add event listener to button click
		console.log('Checking if username exists on db');
		var userDetails = {
			functionName: 'checkUsername',
			username: document.getElementById('usernameRegister').value
		}

		$.ajax({
			type: "POST",
			url: '/../finalYearProject/mvc/Controllers/User.php',
			data: JSON.stringify(userDetails),
			dataType: 'json',
			contentType: 'application/json; charset=UTF-8',
			success: function(user) {
				if(user.result === true)
				{
					console.log('On server');
				}
				else
				{
					console.log('not on server');
					addUser(document.forms['registration']);
				}
			},
			error: function(err){
				console.log(err);
			}
		});
		// registerForm.style.display = 'none';
		//send data to user.php 

		//add to user table
		//show that register was successful
		//go to login
	}

	function addUser()
	{
		// var regElements = reg.elements;

		// var regDetails = {
		// 	functionName: 'addUser',
		// 	username: regElements['username'].value,
		// 	password: regElements['password'].value,
		// 	email: regElements['email'].value,
		// 	firstname: regElements['firstname'].value, 
		// 	lastname: regElements['username'].value,
		// 	country: regElements['country'].value
		// }
		console.log(regDetails);
		// reg.reset();

		$.ajax({
			type: "POST",
			url: '/../finalYearProject/mvc/Controllers/User.php',
			data: JSON.stringify(regDetails),
			dataType: 'json',
			contentType: 'application/json; charset=UTF-8',
			success: function(user) {
				if(user.result === true)
				{
					console.log('Added new user to database!');
					console.log(user);				
					//Remove registration div and go to login	
				}
				else
				{
					console.log('ERROR');
				}

			},
			error: function(err){
				console.log(err);
			}
		});
	}

	function handleLoginSuccess(user)
	{
		//create cookie
		//Remove Log in 
		// loginDiv.parentNode.removeChild(loginDiv);
		// console.log(loginDiv);
		loginDiv.style.display = 'none';
		logoutButton.addEventListener('click', logout, false);
		//Get Tracks and list
		var userId = {
			id: user.id
		}	

		console.log(user);

		$.ajax({
			type: "POST",
			url: '/../finalYearProject/mvc/Controllers/Music.php',
			data: JSON.stringify(userId),
			dataType: 'json',
			contentType: 'application/json; charset=UTF-8',
			success: function(music) {
				var label = document.createElement('label');
				label.innerHTML = 'Your tracks stored on SampleCloud';
				musicList.appendChild(label);
				music.forEach(function(track) {
					console.log(track);
					var ul = document.createElement('ul');
					ul.innerHTML = track.title;
					musicList.appendChild(ul);
				});		
			},
		});
	}

	function logout()
	{
		console.log('logout');
		console.clear();
		loginDiv.style.display = 'block';
		musicList.innerHTML = '';
		document.body.innerHTML = ''; //Delete instead
		
		document.body.appendChild(top);
		console.log(top);
		document.body.appendChild(loginDiv);
		document.body.appendChild(logoutButton);
		document.body.appendChild(musicList);
	}
});