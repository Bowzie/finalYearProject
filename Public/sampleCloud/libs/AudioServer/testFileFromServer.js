define([
	'jquery',
	'audio'
], function($,audio) {
	audio = new audio();
	console.log(audio);

	// audio.getTrackList(1, function(response) {
	// 	console.log(response);
	// });

	// trackDetails = {
	// 	functionName: 'getTrack',
	// 	userId: 1,
	// 	username: 'dafg',
	// 	trackname: 'track1'
	// }

	// audio.getTrackPath(trackDetails, function(response) {
	// 	console.log(response);
	// 	var audioContext = new AudioContext();
	// 	audio.getTrack(response.trackPath, function(track) {
	// 		// audioContext.decodeAudioData(track, function(buffer){
	// 		// 	console.log(buffer);
	// 		// },function(e){"Error with decoding audio data" + e.err});
	// 	});
	// });

	// userDetails = {
	// 	userId: 1,
	// 	title: 'track3',
	// 	path: 'track3.wav'
	// }

	// audio.addDbEntry(userDetails, function(response) {
	// 	console.log(response);
	// }); 


	// audio.deleteDbEntry(userDetails, function(response) {
	// 	console.log(response);
	// });

	// trackDetails = {
	// 	username: 'dafg',
	// 	path: 'track1.wav'
	// }

	// audio.deleteTrack(trackDetails, function(response) {
	// 	console.log(response);
	// })
	
	var blob = new Blob([1,2,3], { type: 'audio/mp3' });

	audio.addTrack(blob, function(response) {
		console.log(response);
	})
});