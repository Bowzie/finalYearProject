var dsp = {};

dsp.LowPassFilter = function(inputBufferChannelData) {
 	var lastOut = 0.0;

    var input = inputBufferChannelData; //Single channel only currently
    var output = [];
    for (var i = 0; i < input.length; i++) {
        output[i] = (input[i] + lastOut) / 2;
        lastOut = output[i];
    }
    return output;
}

dsp.dspBitCrusher = function(inputBufferChannelData) {
    var input = inputBufferChannelData; //Single channel only currently
    var output = [];
    var bits = 4;
    var normfreq = 0.1; 
    var step = Math.pow(1/2, bits);
    var phaser = 0;
    var last = 0;
    for (var i = 0; i < input.length; i++) {
        phaser += normfreq;
        if (phaser >= 1.0) {
            phaser -= 1.0;
            last = step * Math.floor(input[i] / step + 0.5);
        }
        output[i] = last;
        
    }
    return output;
}