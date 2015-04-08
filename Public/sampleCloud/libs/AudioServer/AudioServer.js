define(function () {
    //Empty constructor
    function AudioServer() {

    }

    AudioServer.prototype = {
    	audioBuffer: null,
    	getTrackList: function(id, callback) {
    		require(['jquery'], function($) {
    			var userId = {
    				functionName: 'getTrackList',
					_userId: id
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
    	getTrackPath: function(trackDetails, callback) {
    		require(['jquery'], function() {
    			var track = {
    				functionName: 'getTrackPath',
    				id: trackDetails.userId,
    				username: trackDetails.username,
    				trackname: trackDetails.trackname
    			}

				$.ajax({
					type: "POST",
					url: '/../finalYearProject/mvc/Controllers/Music.php',
					data: JSON.stringify(track),
					dataType: 'json',
					success: function(music) {
						callback(music);
					},
					error: function(err) {
						callback(err);
					}
				});
    		});
    	},
    	getTrack: function(trackPath, callback) {
    		console.log(trackPath);
    		//Not using ajax as arraybuffer is desired response type 
			var xmlHttpGet = new XMLHttpRequest();
			xmlHttpGet.open("Get", trackPath, true); 
			xmlHttpGet.responseType = "arraybuffer"; //arraybuffer = raw binary data

			//Decode audio and set to buffer
			xmlHttpGet.onload = function() {
				callback(xmlHttpGet.response);
				// audioContext.decodeAudioData(xmlHttpGet.response, function(buffer){
				// 	audioBuffer = buffer;
				// },function(e){"Error with decoding audio data" + e.err});
			}

			xmlHttpGet.send();
    	},
    	addTrack: function(blob, callback) {
    		require(['jquery'], function() {
    			var formData = new FormData();
    			var textblob = new Blob([], { type: 'text' });

    			formData.append('file[0]', blob, 'bleh.wav'); 
				formData.append('file[1]', textblob, 'dafg'); //Kind of a hack

    			console.log(formData);
    			$.ajax({
    				type: "POST",
					url: '/../finalYearProject/mvc/Controllers/Music.php',
					contentType: false,
					processData: false,
					data: formData,
					success: function(music) {
						callback(music);
					},
					error: function(err) {
						callback(err);
					}
    			});
    		});	
    	},
    	deleteTrack: function(trackDetails, callback) {
    		require(['jquery'], function() {
    			var track = {
    				functionName: 'deleteTrack',
    				username: trackDetails.username,
    				path: trackDetails.path
    			}

				$.ajax({
					type: "POST",
					url: '/../finalYearProject/mvc/Controllers/Music.php',
					data: JSON.stringify(track),
					dataType: 'json',
					success: function(music) {
						callback(music);
					},
					error: function(err) {
						callback(err);
					}
				});
    		});
    	},
    	addDbEntry: function(userDetails, callback) {
    		require(['jquery'], function() {

    			var newDbEntry = {
    				functionName: 'addDbEntry',
    				_userId: userDetails.userId,
    				title: userDetails.title,
    				path: userDetails.path
    			}
    			console.log(newDbEntry);
				$.ajax({
					type: "POST",
					url: '/../finalYearProject/mvc/Controllers/Music.php',
					data: JSON.stringify(newDbEntry),
					dataType: 'json',
					success: function(music) {
						callback(music);
					},
					error: function(err) {
						callback(err);
					}
				});

    		});
    	},
    	deleteDbEntry: function(userDetails, callback) {
    		require(['jquery'], function() {
    			var deleteDbEntry = {
    				functionName: 'deleteDbEntry',
    				_userId: userDetails.userId,
    				title: userDetails.title,
    				path: userDetails.path
    			}

				$.ajax({
					type: "POST",
					url: '/../finalYearProject/mvc/Controllers/Music.php',
					data: JSON.stringify(deleteDbEntry),
					dataType: 'json',
					success: function(music) {
						callback(music);
					},
					error: function(err) {
						callback(err);
					}
				});
    		});
    	}
    }

    return AudioServer;
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

