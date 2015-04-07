define(function () {
    //Empty constructor
    function fileFromServer() {

    }

    fileFromServer.prototype = {
    	audioBuffer: null,
    	getTrackList: function(id, callback) {
    		require(['jquery'], function($) {
    			var userId = {
    				functionName: 'getTrackList',
					id: user.id
				}	

				$.ajax({
					type: "POST",
					url: '/../finalYearProject/mvc/Controllers/Music.php',
					data: JSON.stringify(userId),
					dataType: 'json',
					contentType: 'application/json; charset=UTF-8',
					success: function(music) {
						callback(user);
						// var label = document.createElement('label');
						// label.innerHTML = 'Your tracks stored on SampleCloud';
						// musicList.appendChild(label);
						// music.forEach(function(track) {
						// 	console.log(track);
						// 	var ul = document.createElement('ul');
						// 	ul.innerHTML = track.title;
						// 	musicList.appendChild(ul);
						// });		
					},
					error: function(err) {
						callback(err);
					}
				});
    		});
    	},
    	getTrack: function(userId, username, trackName, callback) {
    		require(['jquery'], function() {
    			var track = {
    				functionName: 'getTrack',
    				id: userId,
    				username: username,
    				trackName: trackName;
    			}

				$.ajax({
					type: "POST",
					url: '/../finalYearProject/mvc/Controllers/Music.php',
					data: JSON.stringify(userId),
					dataType: 'json',
					contentType: 'application/json; charset=UTF-8',
					success: function(music) {
						callback(music);
						// var label = document.createElement('label');
						// label.innerHTML = 'Your tracks stored on SampleCloud';
						// musicList.appendChild(label);
						// music.forEach(function(track) {
						// 	console.log(track);
						// 	var ul = document.createElement('ul');
						// 	ul.innerHTML = track.title;
						// 	musicList.appendChild(ul);
						// });		
					},
					error: function(err) {
						callback(err);
					}
				});
    		});
    	},
    	addTrack: function(trackname, username, blob, callback) {
    		require(['jquery'], function() {
    			var newTrack = {
    				functionName: 'addTrack',
    				id: userId,
    				username: username,
    				trackName: trackName;
    			}
    		});
    	}
    }

    return fileFromServer;
});


// var fileFromServer = {
// 	audioBuffer: null,
// };

// fileFromServer.init = function(trackPath) {
// 	//Determine if browser used supports web audio api
// 	try {
// 	  window.AudioContext = window.AudioContext || window.webkitAudioContext;
// 	  audioContext = new AudioContext();
// 	} catch(e) {
// 	  alert('Web Audio API is not supported in this browser');
// 	}

// 	//Get file from server only if web audio supported
// 	if(audioContext !== null)
// 	{
// 		fileFromServer.GetFile(trackPath); 
// 	}
// }

// fileFromServer.GetFile = function(trackPath) {
// 	//Get audio track from file and Get as an arraybuffer
// 	var xmlHttpGet = new XMLHttpRequest();
// 	xmlHttpGet.open("Get", '/../finalYearProject/music/'+trackPath, true); 
// 	xmlHttpGet.responseType = "arraybuffer"; //arraybuffer = raw binary data

// 	//Decode audio and set to buffer
// 	xmlHttpGet.onload = function() {
// 		var data = xmlHttpGet.response;

// 		audioContext.decodeAudioData(xmlHttpGet.response, function(buffer){
// 			audioBuffer = buffer;
// 		},function(e){"Error with decoding audio data" + e.err});
// 	}

// 	xmlHttpGet.send();
// };

