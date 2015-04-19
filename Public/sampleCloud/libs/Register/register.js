define(function () {
    //Empty constructor
    function register() {

    }

    register.prototype = {

    	loadRegister: function(div, callback)
		{
			require(['jquery'], function($) {
				$(div).load('libs/register/register.html', function() {
					callback(true);
				});
			});
		},

		removeRegister: function()
		{
			require(['jquery'], function($) {
				$('#registration').hide();
			});
		},

    	register: function(callback) {
    		require(['jquery'], function($) {
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
							callback(user.result);
						}
						else
						{
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
    	},
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