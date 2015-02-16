window.onload = function() {
	var userDiv = document.getElementById('outputInfo');

	console.log(userDiv);

	var xmlHttpGet = new XMLHttpRequest();
	var userId = JSON.stringify({userId: 1});
	xmlHttpGet.open("GET", 'mvc/Controllers/User.php', true);
	xmlHttpGet.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	xmlHttpGet.send(userId);

	xmlHttpGet.onload = function() {
		document.getElementById('outputInfo').innerHTML = xmlHttpGet.responseText;
	}
}
