function lowPassFilter(sound) {
    var audioContext;

    //Determine if browser used supports web audio api
    try {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioContext();
    } catch(e) {
      alert('Web Audio API is not supported in this browser');
    }

	var bufferSize = 4096;
 	var lastOut = 0.0;
    //TODO don't use node, alter sound passed in and return 
    //node will only modify buffer when played, not useful
    var node = audioContext.createScriptProcessor(bufferSize, 1, 1);
    node.onaudioprocess = function(e) {
        var input = e.inputBuffer.getChannelData(0);
        var output = e.outputBuffer.getChannelData(0);
        for (var i = 0; i < bufferSize; i++) {
            output[i] = (input[i] + lastOut) / 2;
            lastOut = output[i];
        }
    }
    return node;
}
