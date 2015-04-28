define(function () {
    //Empty constructor
    function audioEncode() {

    }

    audioEncode.prototype = {   
        //MAX DATA SIZE 8600000 (5 CHANNELS MAX)
        wavEncode: function (leftChannel, rightChannel, numChannels, selectedNumChannels, samplerate, callback) {
            require(['wavEncoder'], function(){
                console.log('Starting WAV Encode, ' + numChannels + ' channels @ ' + samplerate );
                
                var options = {   
                    sampleRateHz: samplerate,
                    numChannels: selectedNumChannels,
                    bytesPerSample: 2 //Maybe be able to change this (1 = 8bit encode, 2 = 16 bit encode)
                }

                var data = [];
                if(selectedNumChannels === 2 && numChannels === 2 && rightChannel != null)
                {
                    //Interleave data
                    var index = 0;
                    for(var i = 0; i < leftChannel.length; ) {
                        data[i++] = leftChannel[index];
                        data[i++] = rightChannel[index];
                        index++;
                    }
                }
                else if(selectedNumChannels === 2 && numChannels === 1)
                {
                     //Interleave data
                    var index = 0;
                    for(var i = 0; i < leftChannel.length; ) {
                        data[i++] = leftChannel[index];
                        data[i++] = leftChannel[index];
                        index++;
                    }
                }
                else {
                    data = leftChannel;
                }

                var wavDataBase64 = WavEncoder.encode(data, options); //encode data to wav format

                var split = wavDataBase64.split(',');   //Split string to get necessary base-64 encoded data

                var binary = atob(split[1]); //Decodes base-64 encoded string
                var array = []; 
               // Fill array with unicode values 
                for(var i = 0; i < binary.length; i++) {
                    array.push(binary.charCodeAt(i));
                }
                
                var wavData = new Uint8Array(array);
                // //Make blob of audio (new file)
                var blob = new Blob([wavData], { type: 'audio/wav' });

                console.log('Done encoding wav');
                callback(blob);
            });
        },
        //2 Channels ONLY
        mp3Encode: function (leftChannel, rightChannel, numChannels, mode, selectedNumChannels, samplerate, bitrate, dataLength, callback) {
            require(['mp3Encoder'], function(){
                console.log('Start MP3 encoding ' + numChannels + ' channel(s) @ ' + samplerate + ' , bitrate ' + bitrate + 'kbps');

                var data = {

                }
                if(numChannels == 2) 
                {
                    data.left = leftChannel;
                    data.right = rightChannel;
                }
                else {
                    data.left = leftChannel;
                    data.right = leftChannel;
                }

                var mp3codec = Lame.init();
                Lame.set_mode(mp3codec, mode);
                Lame.set_num_channels(mp3codec, selectedNumChannels);
                Lame.set_out_samplerate(mp3codec, samplerate);
                Lame.set_bitrate(mp3codec, bitrate);
                Lame.init_params(mp3codec);
                var mp3data = Lame.encode_buffer_ieee_float(mp3codec, data.left, data.right, dataLength);

                var blob = new Blob([mp3data.data], { type: 'audio/mp3' });

                console.log('Done MP3 encoding');

                callback(blob);
            });
        }
    };  

    return audioEncode;
});
