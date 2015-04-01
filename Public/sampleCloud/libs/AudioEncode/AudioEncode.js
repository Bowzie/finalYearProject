define(function () {
    //Empty constructor
    function audioEncode() {

    }

    audioEncode.prototype = {   
        wavEncode: function (data, callback) {
            require(['wavEncoder'], function(wavEncoder){
                var wavDataBase64 = WavEncoder.encode(data); //encode data to wav format

                var split = wavDataBase64.split(',');   //Split string to get necessary base-64 encoded data
                console.log(split[1].length);
                var binary = atob(split[1]); //Decodes base-64 encoded string
                console.log(binary.length);
                var array = []; 

                //Fill array with unicode values 
                for(var i = 0; i < binary.length; i++) {
                    array.push(binary.charCodeAt(i));
                }
                console.log(array.length);
                //Make blob of audio (new file)
                var blob = new Blob([new Uint8Array(array)], { type: 'audio/wav' });

                callback(blob);
            });
        },
        mp3Encode: function (data, mode, numChannels, samplerate, bitrate, callback) {
            require(['mp3Encoder'], function(){
                console.log("Start MP3 encoding");

                var mp3codec = Lame.init();
                Lame.set_mode(mp3codec, mode);
                Lame.set_num_channels(mp3codec, numChannels);
                Lame.set_out_samplerate(mp3codec, samplerate);
                Lame.set_bitrate(mp3codec, bitrate);
                Lame.init_params(mp3codec);

                var mp3data = Lame.encode_buffer_ieee_float(mp3codec, data, data, data.length);

                blob = new Blob([mp3data.data], { type: "audio/mp3" });

                console.log(mp3data.data);
                console.log("Done MP3 encoding");

                callback(blob);
            });
        }
    };  

    return audioEncode;
});
