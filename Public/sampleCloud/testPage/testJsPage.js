define([
	'backbone',
	'dspFunctions'
], function(backbone, dsp) {
	console.log(lowPassFilter());
	var userButton = document.getElementById('user');

	userButton.addEventListener('click', function() {
		User = Backbone.Model.extend({
			urlRoot: '/../finalYearProject/mvc/Controllers/User.php', //call php controller
		});

		var user = new User();

		var userDetails = {
			id: 1
		};

		console.log(userDetails);
		//POST to PHP Controller class and alert return data
		user.save(userDetails, {
			type: 'POST',
			success: function(user) {
				console.log(user);
			},
			wait: true
		});
	});
	
});
