define(function () {
    //Empty constructor
    function register() {

    }

    register.prototype = {
    	register: function(evt, callback) {
    		require(['jquery'], function($) {
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
						callback(user);
						if(user.result === true)
						{
							console.log('On server');
						}
						else
						{
							console.log('not on server');
							register.prototype.addUser(document.forms['registration'], function(result) {
								callback(result);
							});
						}
					},
					error: function(err){
						callback(err);
					}
				});
    		});
    	}
    	addUser: function(registration, callback) {
    		require(['jquery'], function($) {
				var regElements = registration.elements;

				var regDetails = {
					functionName: 'addUser',
					username: regElements['username'].value,
					password: regElements['password'].value,
					email: regElements['email'].value,
					firstname: regElements['firstname'].value, 
					lastname: regElements['username'].value,
					country: regElements['country'].value
				}
				console.log(regDetails);
				registration.reset();

				$.ajax({
					type: "POST",
					url: '/../finalYearProject/mvc/Controllers/User.php',
					data: JSON.stringify(regDetails),
					dataType: 'json',
					contentType: 'application/json; charset=UTF-8',
					success: function(result) {
						callback(result);
						// if(user.result === true)
						// {
						// 	console.log('Added new user to database!');
						// 	console.log(user);				
						// 	//Remove registration div and go to login	
						// }
						// else
						// {
						// 	console.log('ERROR');
						// }
					},
					error: function(err){
						callback(err);
					}
				});
    		});
			
    	}
    }

    return register;
});