window.onload = function()
{
	var loginButton = document.getElementById('login');
	loginButton.addEventListener('click', validate, false);
	console.log('Waiting for click');

	function validate()
	{
		var username = document.getElementById('username').value;
		var password = document.getElementById('password').value;
		//DO POST TO USER LOGIN AND GET DETAILS BACK
		//CALL MUSIC TO GET ALL FILES THAT BELONG TO LOGGED IN USER
	}
}