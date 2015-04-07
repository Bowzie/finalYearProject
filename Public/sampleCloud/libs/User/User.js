var user = {
	userData: null
};

user.GetUserData = function(userId)
{
	var userDiv = document.getElementById('outputInfo');

	var xmlHttpGet = new XMLHttpRequest();
	var userId = 1;
	xmlHttpGet.open("POST", 'mvc/Controllers/User.php', true);
	xmlHttpGet.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	xmlHttpGet.send(userId);

	xmlHttpGet.onload = function() {
		userData = JSON.parse(xmlHttpGet.responseText);
	}
}

