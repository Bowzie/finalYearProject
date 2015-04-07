define(function () {
    //Empty constructor
    function dsp() {

    }

    dsp.prototype = {

        lowPassFilter: function(inputBufferChannelData) {
            var lastOut = 0.0;
            var input = inputBufferChannelData; //Single channel only currently
            var output = [];

            //Algorithm for simple low pass filter 
            for (var i = 0; i < input.length; i++) {
                output[i] = (input[i] + lastOut) / 2;
                lastOut = output[i];
            }

            return output;
        },

        bitCrusher: function(inputBufferChannelData) {
            var input = inputBufferChannelData; //Single channel only currently, values between 0 and 1
            var output = []; //Create empty output array
            var bits = 4; //4 bit quality
            var normfreq = 0.1; //Value added to phaser, between 0 and 1
            var step = Math.pow(1/2, bits);
            var phaser = 0;
            var last = 0.0;

            //Currently new value quantized every 10 samples
            for (var i = 0; i < input.length; i++) {
                phaser += normfreq;
                if (phaser >= 1.0) {
                    phaser -= 1.0;
                    last = step * Math.floor(input[i] / step + 0.5); //Quantize a value when phaser reaches peak
                }
                output[i] = last; //Hold quantized value
            }

            return output;
        }
    };

    return dsp;
});

