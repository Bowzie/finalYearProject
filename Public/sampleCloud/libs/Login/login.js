define(function () {
    //Empty constructor
    function login() {

    }

    login.prototype = {
    	validate : function(evt, callback) {
    		require('jquery', function($) {
				evt.preventDefault();
		
				var userDetails = {
					functionName: 'login',
					username: document.getElementById('usernameLogin').value,
					password: document.getElementById('passwordLogin').value
				};

				document.forms['login'].reset(); //Clear form entry
				console.log('Validating Login');

				$.ajax({
					type: "POST",
					url: '/../finalYearProject/mvc/Controllers/User.php',
					data: JSON.stringify(userDetails),
					dataType: 'json',
					contentType: 'application/json; charset=UTF-8',
					success: function(result) {
						callback(result);
						// if(user.result === 'Successful')
						// {
						// 	loginDiv.style.display = 'none';
						// 	// document.cookie = 'username=dafg; expires=Thu, 01 Jan 2016 00:00:00 UTC';
						// 	console.log(user);

						// }
						// else
						// {
						// 	loginDiv.style.display = 'block';
						// 	console.log('Failure to login');
						// 	// document.getElementById('loginFailed').innerHTML = 'Login Failed Bro';					loginAttempts++;

						// 	//Prevent brute force of password by only allowing 5 attempts (per username??)
						// 	if(loginAttempts > 5)
						// 	{
						// 		console.log('Lock out here');
						// 	}
						// }
					},
					error: function() {
					}
				});
    		})
    	},
    	logout: function(evt) {
    		evt.preventDefault();
    	}
    	//recover, change password and register should be implemented
    }

    return Login;
});