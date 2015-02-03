define([
	'backbone'
], function(backbone) {
	//Initial code will be basic, and won't run until php controller branch is merged to master
	User = Backbone.Model.extend({
		urlRoot: '', //call php controller, will currently cause: Uncaught Error: A "url" property or function must be specified
		defaults: {
			id: ''
		}
	});

	var user = new User();

	var userDetails = {
		id: 1,
	};

	//POST to PHP Controller class and alert return data
	user.save(userDetails, {
		success: function(user) {
			alert(user.toJSON());
		}
	});
});
