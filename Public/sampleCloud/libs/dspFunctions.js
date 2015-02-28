function lowPassFilter(sound) {
	var bufferSize = 4096;
 	var lastOut = 0.0;
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