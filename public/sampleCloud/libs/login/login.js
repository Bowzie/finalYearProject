define(function () {
    //Empty constructor
    function login() {

    }

    login.prototype = {
    	loadLogin: function(callback)
		{
			require(['jquery'], function($) {
				$('#main').load('libs/login/login.html', function() {
					callback(true);
				});
			});
		},

		removeLogin: function(div)
		{
			require(['jquery'], function($) {
				$('#login').hide();
			});
		},

    	validate : function(callback) { //Check is username/password matches on dB
    		require(['jquery'], function($) {

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
					},
					error: function() {
					}
				});
    		})
    	},
    	logout: function(main) { //NOT USED
    		// remove all divs in main
    		while (main.firstChild) {
			  main.removeChild(main.firstChild);
			}
			//load login
    	}
    	//recover, change password and register should be implemented
    }

    return login;
});