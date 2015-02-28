window.onload = function() {
	var userDiv = document.getElementById('outputInfo');

	console.log(userDiv);

	var xmlHttpGet = new XMLHttpRequest();
	var userId = 1;
	xmlHttpGet.open("POST", 'mvc/Controllers/User.php', true);
	xmlHttpGet.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	xmlHttpGet.send(userId);

	xmlHttpGet.onload = function() {
		response = JSON.parse(xmlHttpGet.responseText);
		console.log(response);

		document.getElementById('outputInfo').innerHTML = response.id + ' ' + response.userName;
	}
}
