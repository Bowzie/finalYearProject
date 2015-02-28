define([
	'backbone',
	'dspFunctions'
], function(backbone, dsp) {
	//Initial code will be basic, and won't run until php controller branch is merged to master
	User = Backbone.Model.extend({
		urlRoot: '/../mvc/Controllers/User.php', //call php controller
		userId: '1'
	});

	var user = new User();

	var userDetails = {
		id: 1,
	};
	
	//POST to PHP Controller class and alert return data
	user.fetch(userDetails, {
		success: function(user) {
			console.log("bleyh");
			alert(user.toJSON());
		}
	});
});
