define([
	'backbone',
], function(backbone) {

	var loginDiv = document.getElementById('login');
	var loginButton = document.getElementById('loginButton');
	loginButton.addEventListener('click', validate, false);
	var loginAttempts = 0;
	// loginButton.click();
	console.log('Waiting for click');

	function validate()
	{
		console.log('Validating Login');
		var User = backbone.Model.extend({
			urlRoot: '/../finalYearProject/mvc/Controllers/User.php', //call php controller
		});

		var userDetails = {
			functionName: 'login',
			username: document.getElementById('username').value,
			password: document.getElementById('password').value
		};

		var user = new User;

		//POST to PHP Controller class and alert return data
		user.save(userDetails, {
			type: 'POST',
			success: function(user) {
				if(user.attributes.result === 'Successful')
				{
					var loggedInUser = {
						id: user.attributes.id,
						username: user.attributes.username,
						firstname: user.attributes.firstname,
						lastname: user.attributes.lastname,
						country: user.attributes.country,
						about: user.attributes.about
					}
					user.destroy();
					console.log(user);
					console.log('Login Successful');
					handleLoginSuccess(loggedInUser);
				}
				else
				{
					console.log('Failure to login');
					loginAttempts++;
					if(loginAttempts > 5)
					{
						console.log('Lock out here');
					}
				}
			},
			wait: true
		});
	}

	function handleLoginSuccess(user)
	{
		//Remove Log in 
		loginDiv.parentNode.removeChild(loginDiv);
		console.log(loginDiv);

		//GET ALL TRACKS INFO OWNED BY USER
		var User = backbone.Model.extend({
			urlRoot: '/../finalYearProject/mvc/Controllers/Music.php', //call php controller
		});

		var musicDetails = {
			id: user.id
		};
	}
});