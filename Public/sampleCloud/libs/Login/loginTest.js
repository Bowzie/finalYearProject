define([
	'backbone',
], function(backbone) {

	var loginButton = document.getElementById('login');
	loginButton.addEventListener('click', validate, false);
	loginButton.click();
	console.log('Waiting for click');

	function validate()
	{
		var User = backbone.Model.extend({
			urlRoot: '/../finalYearProject/mvc/Controllers/User.php', //call php controller
		});

		var userDetails = {
			functionName: 'login',
			username: 'dafg',
			password: 'dafgd'
		};

			// username: document.getElementById('username').value,
			// password: document.getElementById('password').value

		var user = new User;

		//POST to PHP Controller class and alert return data
		user.save(userDetails, {
			type: 'POST',
			success: function(user) {
				console.log(user);
			},
			wait: true
		});

		//CALL MUSIC TO GET ALL FILES THAT BELONG TO LOGGED IN USER

	}
});