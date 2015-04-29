define(function () {
    //Empty constructor
    function AudioServer() {

    }
    
    AudioServer.prototype = {
    	audioBuffer: null,

    	getAudioBuffer: function()
		{
			return this.audioBuffer;
		},

		setAudioBuffer: function(input)
		{
			this.audioBuffer = input;
		},

    	loadAudioServer: function(div, callback)
		{
			require(['jquery'], function($) {
				$(div).load('libs/audioServer/audioServer.html', function() {
					callback(true);
				});
			});
		},

		removeAudioServer: function(div)
		{
			div.parentNode.removeChild(div);
		},

		checkTrackName: function(id, trackname, callback) {
			require(['jquery'], function($) {
    			var userId = {
    				functionName: 'checkTrackName',
					_userId: id,
					title: trackname
				}	

				$.ajax({
					type: "POST",
					url: '/../finalYearProject/mvc/Controllers/Music.php',
					data: JSON.stringify(userId),
					dataType: 'json',
					contentType: 'application/json; charset=UTF-8',
					success: function(result) {
						callback(result);	
					},
					error: function(err) {
						callback(err);
					}
				});
    		});
		},

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
    				_userId: trackDetails.userId,
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
    		//Not using jquery.ajax as arraybuffer is desired response type 
			var xmlHttpGet = new XMLHttpRequest();

			xmlHttpGet.open("Get", trackPath, true); 
			xmlHttpGet.responseType = "arraybuffer"; //arraybuffer = raw binary data

			xmlHttpGet.onload = function() {
				callback(xmlHttpGet.response);
			}

			xmlHttpGet.send();
    	},

    	addTrack: function(blob, trackname, username, callback) {
    		require(['jquery'], function() {
    			var formData = new FormData();
    			var textblob = new Blob([], { type: 'text' });

    			formData.append('file[0]', blob, trackname); 
				formData.append('file[1]', textblob, username); //Kind of a hack

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

    	updateTrack: function (trackDetails, blob, callback) //NOT USED
    	{
    		require(['jquery'], function() {
    			AudioServer.prototype.deleteTrack(tracDetails, function() {
    				AudioServer.prototype.addTrack(blob, trackDetails.username, function(response) {
    					callback(response);
    				});
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