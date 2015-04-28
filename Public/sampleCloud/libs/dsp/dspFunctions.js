define(function () {
    //Empty constructor
    function dsp() {

    }

    dsp.prototype = {
        adsr: function(buffer, samplerate, attack, decay, sustain, release, callback) {
            var envelope = [];

            attack  *= samplerate;
            decay   *= samplerate;
            release *= samplerate;
    
            for(var i = 0; i<buffer.length; i++)
            {
                if(i<=attack) 
                {
                    envelope[i] = i/attack;
                }
                else if(i<=(attack+decay)) {
                    envelope[i] = 1-(1-sustain)*((i-attack)/decay);
                }
                else if(i<=(buffer.length-release))
                {
                envelope[i] = sustain;
                }
                else
                {
                    envelope[i] = sustain*(((buffer.length-i)/release));
                }
            }

            var output = new Float32Array(buffer.length);

            for(i=0; i<buffer.length; i++)
            {
              output[i] = buffer[i] * envelope[i];
            }
            callback(output, envelope);
        },

        biquad1: function(buffer, type, samplerate, res, cutoff, callback) {
            var c = a1 =  a2 = a3 =  b1 =  b2 = 0;

            var input = buffer;
            var output = new Float32Array(buffer.length);;

            switch(type)
            {
                case 'LPF':
                    c = 1.0 / Math.tan(Math.PI * cutoff / samplerate);
                    a1 = 1.0 / ( 1.0 + res * c + c * c);
                    a2 = 2* a1;
                    a3 = a1;
                    b1 = 2.0 * ( 1.0 - c*c) * a1;
                    b2 = ( 1.0 - res * c + c * c) * a1;
                break;
                case 'HPF':
                    c = Math.tan(Math.PI * cutoff / samplerate);
                    a1 = 1.0 / ( 1.0 + res * c + c * c);
                    a2 = -2*a1;
                    a3 = a1;
                    b1 = 2.0 * ( c*c - 1.0) * a1;
                    b2 = ( 1.0 - res * c + c * c) * a1;
                break;
            }

            output[0] = a1 * input[0]; //a2 * 0 + a3 * 0 - b1*0 - b2*0
            output[1] = a1 * input[1] + a2 * input[0] - b1*output[0];

            for(var i = 2; i < input.length; i++)
            {
                output[i] = a1 * input[i] + a2 * input[i-1] + a3 * input[i-2] - b1*output[i-1] - b2*output[i-2];
            }

            callback(output);
        },

        biquad2: function(buffer, type, samplerate, dbGain, cutoff, bandwidth, callback) {
            var output = new Float32Array(buffer.length);
            var input = buffer;

            var a0 = a1 =  a2 = a3 = a4 = b0 = b1 =  b2 = x1 = x2 = y1 = y2 = 0 ;

            var A = Math.pow(10, dbGain /40);
            var omega = 2 * Math.PI * cutoff /samplerate;
            var sn = Math.sin(omega);
            var cs = Math.cos(omega);
            var alpha = sn * Math.sinh(Math.log(2) /2 * bandwidth * omega /sn);
            var beta = Math.sqrt(A + A);

            switch (type) {
                case 'LPF':
                    b0 = (1 - cs) /2;
                    b1 = 1 - cs;
                    b2 = (1 - cs) /2;
                    a0 = 1 + alpha;
                    a1 = -2 * cs;
                    a2 = 1 - alpha;
                    break;
                case 'HPF':
                    b0 = (1 + cs) /2;
                    b1 = -(1 + cs);
                    b2 = (1 + cs) /2;
                    a0 = 1 + alpha;
                    a1 = -2 * cs;
                    a2 = 1 - alpha;
                    break;
                case 'BPF':
                    b0 = alpha;
                    b1 = 0;
                    b2 = -alpha;
                    a0 = 1 + alpha;
                    a1 = -2 * cs;
                    a2 = 1 - alpha;
                    break;
                case 'NOTCH':
                    b0 = 1;
                    b1 = -2 * cs;
                    b2 = 1;
                    a0 = 1 + alpha;
                    a1 = -2 * cs;
                    a2 = 1 - alpha;
                    break;
                case 'PEQ':
                    b0 = 1 + (alpha * A);
                    b1 = -2 * cs;
                    b2 = 1 - (alpha * A);
                    a0 = 1 + (alpha /A);
                    a1 = -2 * cs;
                    a2 = 1 - (alpha /A);
                    break;
                case 'LSH':
                    b0 = A * ((A + 1) - (A - 1) * cs + beta * sn);
                    b1 = 2 * A * ((A - 1) - (A + 1) * cs);
                    b2 = A * ((A + 1) - (A - 1) * cs - beta * sn);
                    a0 = (A + 1) + (A - 1) * cs + beta * sn;
                    a1 = -2 * ((A - 1) + (A + 1) * cs);
                    a2 = (A + 1) + (A - 1) * cs - beta * sn;
                    break;
                case 'HSH':
                    b0 = A * ((A + 1) + (A - 1) * cs + beta * sn);
                    b1 = -2 * A * ((A - 1) + (A + 1) * cs);
                    b2 = A * ((A + 1) + (A - 1) * cs - beta * sn);
                    a0 = (A + 1) - (A - 1) * cs + beta * sn;
                    a1 = 2 * ((A - 1) - (A + 1) * cs);
                    a2 = (A + 1) - (A - 1) * cs - beta * sn;
                    break;
            }

            if(input instanceof AudioBuffer)
            {
                input = buffer.getChannelData(0);
            }

            for(var i = 0; i < buffer.length; i++)
            {
                output[i] = a0 * buffer[i] + a1 * x1 + a2 * x2 - a3 * y1 - a4 * y2;

                /* shift x1 to x2, sample to x1 */
                x2 = x1;
                x1 = buffer[i];

                /* shift y1 to y2, result to y1 */
                y2 = y1;
                y1 = output[i];
            }

            callback(output);
        },

        biquad3: function(buffer, type, peakGainDB, cutoff, Q,callback) {
            var input = buffer;
            var output = new Float32Array(buffer.length);
            
            var a0 = 1.0;
            var a1 = a2 = b1 = b2 = 0.0;
            var z1 = z2 = 0.0;
            var norm;
            var V = Math.pow(10, Math.abs(peakGainDB) / 20.0);
            var K = Math.tan(Math.PI * cutoff);

            switch (type) {
                case 'LPF':
                    norm = 1 / (1 + K / Q + K * K);
                    a0 = K * K * norm;
                    a1 = 2 * a0;
                    a2 = a0;
                    b1 = 2 * (K * K - 1) * norm;
                    b2 = (1 - K / Q + K * K) * norm;
                    break;
                    
                case 'HPF':
                    norm = 1 / (1 + K / Q + K * K);
                    a0 = 1 * norm;
                    a1 = -2 * a0;
                    a2 = a0;
                    b1 = 2 * (K * K - 1) * norm;
                    b2 = (1 - K / Q + K * K) * norm;
                    break;
                    
                case 'BPF':
                    norm = 1 / (1 + K / Q + K * K);
                    a0 = K / Q * norm;
                    a1 = 0;
                    a2 = -a0;
                    b1 = 2 * (K * K - 1) * norm;
                    b2 = (1 - K / Q + K * K) * norm;
                    break;
                    
                case 'NOTCH':
                    norm = 1 / (1 + K / Q + K * K);
                    a0 = (1 + K * K) * norm;
                    a1 = 2 * (K * K - 1) * norm;
                    a2 = a0;
                    b1 = a1;
                    b2 = (1 - K / Q + K * K) * norm;
                    break;
                    
                case 'PEAK':
                    if (peakGainDB >= 0) {    // boost
                        norm = 1 / (1 + 1/Q * K + K * K);
                        a0 = (1 + V/Q * K + K * K) * norm;
                        a1 = 2 * (K * K - 1) * norm;
                        a2 = (1 - V/Q * K + K * K) * norm;
                        b1 = a1;
                        b2 = (1 - 1/Q * K + K * K) * norm;
                    }
                    else {    // cut
                        norm = 1 / (1 + V/Q * K + K * K);
                        a0 = (1 + 1/Q * K + K * K) * norm;
                        a1 = 2 * (K * K - 1) * norm;
                        a2 = (1 - 1/Q * K + K * K) * norm;
                        b1 = a1;
                        b2 = (1 - V/Q * K + K * K) * norm;
                    }
                    break;
                case 'LSH':
                    if (peakGainDB >= 0) {    // boost
                        norm = 1 / (1 + Math.sqrt(2) * K + K * K);
                        a0 = (1 + Math.sqrt(2*V) * K + V * K * K) * norm;
                        a1 = 2 * (V * K * K - 1) * norm;
                        a2 = (1 - Math.sqrt(2*V) * K + V * K * K) * norm;
                        b1 = 2 * (K * K - 1) * norm;
                        b2 = (1 - Math.sqrt(2) * K + K * K) * norm;
                    }
                    else {    // cut
                        norm = 1 / (1 + Math.sqrt(2*V) * K + V * K * K);
                        a0 = (1 + Math.sqrt(2) * K + K * K) * norm;
                        a1 = 2 * (K * K - 1) * norm;
                        a2 = (1 - Math.sqrt(2) * K + K * K) * norm;
                        b1 = 2 * (V * K * K - 1) * norm;
                        b2 = (1 - Math.sqrt(2*V) * K + V * K * K) * norm;
                    }
                    break;
                case 'HSH':
                    if (peakGainDB >= 0) {    // boost
                        norm = 1 / (1 + Math.sqrt(2) * K + K * K);
                        a0 = (V + Math.sqrt(2*V) * K + K * K) * norm;
                        a1 = 2 * (K * K - V) * norm;
                        a2 = (V - Math.sqrt(2*V) * K + K * K) * norm;
                        b1 = 2 * (K * K - 1) * norm;
                        b2 = (1 - Math.sqrt(2) * K + K * K) * norm;
                    }
                    else {    // cut
                        norm = 1 / (V + Math.sqrt(2*V) * K + K * K);
                        a0 = (1 + Math.sqrt(2) * K + K * K) * norm;
                        a1 = 2 * (K * K - 1) * norm;
                        a2 = (1 - Math.sqrt(2) * K + K * K) * norm;
                        b1 = 2 * (K * K - V) * norm;
                        b2 = (V - Math.sqrt(2*V) * K + K * K) * norm;
                    }
                    break;
            }

            for(var i = 0; i < buffer.length; i++)
            {
                output[i] = input[i] * a0 + z1;
                z1 = input[i] * a1 + z2 - b1 * output[i];
                z2 = input[i] * a2 - b2 * output[i];
            }
            callback(output);
        },

        bitCrusher: function(buffer, normfreq, bits, callback) {
            var input = buffer; 
            var output = new Float32Array(buffer.length);
            // bits = 4; // between 1 and 16
            normfreq = normfreq/10;

            var step = Math.pow(1/2, bits);
            var phaser = 0;
            var last = 0.0;

            for (var i = 0; i < input.length; i++) {
                phaser += normfreq;
                if (phaser >= 1.0) {
                    phaser -= 1.0;
                    last = step * Math.floor(input[i] / step + 0.5);
                }
                output[i] = last;
            }
            callback(output);
        },

        decimator: function(buffer, rate, bits, callback) {
            var input = buffer;
            var output = new Float32Array(buffer.length);
            var m = 1<<(bits-1);
            var cnt = 0;

            for(var i = 0; i < input.length; i++) {
                cnt += rate;
                if (cnt>=1)
                {
                    cnt -= 1;
                    output[i]= input[i]*m/m;
                }
                else {
                    output[i] = 0;
                }
            }

            callback(output);
        },

        delay1: function(buffer, samplerate, delayAmount, decay, callback) {
            var input = buffer;

            var delaytime = delayAmount; 
            var delaySamples = Math.round(delaytime * samplerate);

            for (var i = 0; i < buffer.length - delaySamples; i++)
            {
                input[i + delaySamples] += input[i] * decay;
            }
            callback(input);
        },

        delay2: function(buffer, samplerate, masterVol, delayVol, callback) {
             require(['dsp'], function () {
                var delay = new MultiDelay(samplerate * 5, samplerate, masterVol, delayVol);
                delay.process(buffer);  
                callback(delay.delayBufferSamples);
             });
        },

        distortion: function(buffer, distAmount, callback) {
            var input = buffer;
            var output = new Float32Array(buffer.length);
            var z = Math.PI * distAmount;
            var s = 1/Math.sin(z);
            var b = 1/distAmount;

            for(var i = 0; i < input.length; i++) {
                if (input[i] > b)
                    output[i] = 1;
                else {
                    output[i] = Math.sin(z*input[i])*s;
                    if(output[i] > 1)
                    {
                        output[i] = 1;
                    }

                    if(output[i] < -1)
                    {
                        output[i] = -1;
                    }
                }
            }
            callback(output);
        },

        foldbackDistortion: function(buffer, threshold, callback)
        {
            var input = buffer;
            var output = new Float32Array(buffer.length);
            var j = 0;
            for(var i = 0; i < input.length; i++)
            {
                if (input[i]>threshold || input[i] < -threshold)
                {
                    output[i] = Math.abs(Math.abs(Number((input[i] - threshold) - (Math.floor((input[i] - threshold) / threshold) * threshold).toPrecision(8))) - threshold) - threshold;
                    j++;
                }
                else
                {
                    output[i] = input[i];
                    if(output[i] > 1)
                    {
                        output[i] = 1;
                    }

                    if(output[i] < -1)
                    {
                        output[i] = -1;
                    }
                }
            }
            
            callback(output);
        },

        flanger: function(buffer, samplerate, delaytime, rate, amp, callback) {
            var output = new Float32Array(buffer.length);;

            var sinReferenceTable = [];
            for(var i = 0; i < buffer.length; i++)
            {
                sinReferenceTable[i] = Math.sin(2*Math.PI*i*(rate/samplerate));
            }
            
            var maxSampleDelay = Math.round(delaytime*samplerate);
            
            var cur_sin;
            var cur_delay;

            for(var i = 0; i < maxSampleDelay; i++) {
                output[i] = buffer[i];
            }

            for (var i = (maxSampleDelay+1); i < buffer.length; i++) {
                output[i] = (amp*buffer[i]) + amp*(buffer[i-Math.ceil(Math.abs(sinReferenceTable[i]) * maxSampleDelay)]);   //add delayed sample
            }

            callback(output);
        },

        fft: function(buffer, samplerate, callback) {
            require(['dsp'], function () {
                var tempBuff = [];
                var bufferData = [];
                var power;
                var selectedPower = 0;

                if(buffer instanceof AudioBuffer)
                {
                    bufferData = buffer.getChannelData(0);
                }
                else
                {
                    bufferData = buffer;
                }

                for(i = 1; i <= 20; i++)
                {
                    power = Math.pow(2, i);
                    if(buffer.length >= power)
                    {
                        selectedPower = power;
                    }
                }

                for(var i = 0; i < selectedPower; i++)
                {
                    tempBuff[i] = bufferData[i];
                }

                var fft = new FFT(tempBuff.length, samplerate);
                fft.forward(tempBuff);

                callback(fft);
            });
        },

        fuzz: function(buffer, gain, mix, callback) {
            var input = buffer;
            var output = new Float32Array(buffer.length);
            var q = []
            var z = [];
            var sign;

            var maxBuffVal =  0;

            for(var i = 0; i < input.length; i++)
            {
                if(maxBuffVal < input[i])
                {
                    maxBuffVal = input[i];
                }
            }

            for(var i = 0; i < buffer.length; i++)
            {
                q[i] = input[i] * gain / maxBuffVal;
                sign = q[i] > 0 ? 1 : -1; 
                z[i]=sign*(1-Math.exp(sign*q[i]));
            }

            var maxZVal = z[0];
            for(var i = 0; i < input.length; i++)
            {
                if(maxZVal < z[i])
                {
                    maxZVal = z[i];
                }
            }

            for(var i = 0; i < buffer.length; i++)
            {
                output[i]= mix * z[i] * maxBuffVal/maxZVal + (1-mix) *input[i];
            }

            var maxOutputVal = output[0];
            for(var i = 0; i < input.length; i++)
            {
                if(maxOutputVal < output[i])
                {
                    maxOutputVal = output[i];
                }
            }

            for(var i = 0; i < buffer.length; i++)
            {
                output[i] = output[i] * gain;
            }

            callback(output);
        },

        gain: function(buffer, gain, callback) {
            var input = buffer;
            var output = new Float32Array(buffer.length);

            for(var i = 0; i < input.length; i++) {
                output[i] = input[i] * gain;
            }
            callback(output);
        },


        limiter: function(buffer, threshold, rt, at, callback) {
            var output = new Float32Array(buffer.length);
            var xd = []
            var f = [];
            var a = 0;
            xd[0] = 0;

            for(var i = 1; i < buffer.length; i++)
            {
                a = Math.abs(buffer[i]) - xd[i-1];
                if(a < 0)
                {
                    a = 0;
                }
                xd[i] = xd[i-1]*(1-rt)+at*a;

                if(xd[i] > threshold)
                {
                    f[i] = Math.pow(10, (-1 * (Math.log10(xd[i]) - Math.log10(threshold)))); 
                }
                else {
                    f[i] = 1;
                }
                output[i] = buffer[i] * f[i];
            } 
            callback(output);
        },

        moog: function(buffer, cutoff, resonance, callback) {
            if(buffer instanceof AudioBuffer)
            {
                buffer = buffer.getChannelData(0);
            }

            var in1, in2, in3, in4, out1, out2, out3, out4;
            in1 = in2 = in3 = in4 = out1 = out2 = out3 = out4 = 0.0;

            // var cutoff = 0.01; //Make variable
            // var resonance = 4.0; //Make variable

            var input = buffer;
            var output = [];

            var f = cutoff * 1.16;
            var fb = resonance * (1.0 - 0.15 * f * f);

            for (var i = 0; i < buffer.length; i++) {
                input[i] -= out4 * fb;
                input[i] *= 0.35013 * (f*f)*(f*f);
                out1 = input[i] + 0.3 * in1 + (1 - f) * out1; // Pole 1
                in1 = input[i];
                out2 = out1 + 0.3 * in2 + (1 - f) * out2; // Pole 2
                in2 = out1;
                out3 = out2 + 0.3 * in3 + (1 - f) * out3; // Pole 3
                in3 = out2;
                out4 = out3 + 0.3 * in4 + (1 - f) * out4; // Pole 4
                in4 = out3;

                if(out4 > 2)
                {
                    output[i] = 2; //limit output gain
                }
                else{
                    output[i] = out4;    
                }
                
            }
            callback(output);
        },

        overdrive: function(buffer, threshold, callback)
        {
            var input = buffer;
            var output = new Float32Array(buffer.length);

            for(var i = 0; i < input.length; i++)
            {
                if(Math.abs(input[i]) < threshold)
                {
                    output[i] = 2 * input[i];
                }

                if(Math.abs(input[i] >= threshold))
                {
                    if(input[i] > 0)
                    {
                        output[i] = Math.pow(3 - (2 - input[i] * 3), 2) / 3;
                    }
                    else {
                        output[i] =-(Math.pow(3 - (2 - input[i] * 3), 2) / 3);
                    }
                }
                
                if(Math.abs(input[i]) > 2 * threshold)
                {
                    if(input[i] > 0)
                    {
                        output[i] = 1;
                    }
                    else {
                        output[i] = -1;
                    }
                }
            }

            callback(output);
        },

        // phaser: function(buffer, cutoff, samplerate, callback) {
        //     if(buffer instanceof AudioBuffer)
        //     {
        //         buffer = buffer.getChannelData(0);
        //     }

        //     var input = buffer;
        //     var output = new Float32Array(buffer.length);

        //     var wp = (Math.PI * cutoff) / samplerate;

        //     var A = (1 - wp)/(1 + wp);
        //    
        //     output[0] = A * input[0];

        //     for (var i = 1; i < buffer.length; i++) {
        //         output[i] = A * input[0] + A * output[i-1] - input[i-1];
        //     }

        //     callback(output);
        // },


        // pinking: function(buffer, callback) {
        //     if(buffer instanceof AudioBuffer)
        //     {
        //         buffer = buffer.getChannelData(0);
        //     }

        //     var b0, b1, b2, b3, b4, b5, b6;
        //     b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
            
        //     var input = buffer;
        //     var output = [];
        //     for (var i = 0; i < buffer.length; i++) {
        //         b0 = 0.99886 * b0 + input[i] * 0.0555179;
        //         b1 = 0.99332 * b1 + input[i] * 0.0750759;
        //         b2 = 0.96900 * b2 + input[i] * 0.1538520;
        //         b3 = 0.86650 * b3 + input[i] * 0.3104856;
        //         b4 = 0.55000 * b4 + input[i] * 0.5329522;
        //         b5 = -0.7616 * b5 - input[i] * 0.0168980;
        //         output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + input[i] * 0.5362;
        //         output[i] *= 0.11; // (roughly) compensate for gain
        //         b6 = input[i] * 0.115926;
        //     }

        //     callback(output);
        // },

        // reverb: function(buffer, delay, decay, callback) {
        //     require(['dsp'], function () {
        //         var input = buffer;
        //         var reverb = new Reverb(20000, 6500, 0.8, 0.5, 0.9, 4500);
        //         reverb.process(input); 
        //         callback(reverb);
        //     });
        // },

        wahwah: function(buffer, Fs, minf, maxf, fw, damp, callback) {
            // var damp = 0.1;
            var minf=500;
            var maxf=4000;
            var Fw = 2000;
            var delta = Fw/Fs;

            var Fc=[];

            var initVal = minf;
            var increase = true;

            for(var i = 0; i < buffer.length; i++) {
                Fc[i] = initVal;
                if(increase === true)
                {
                    initVal+=delta;
                    if(initVal > maxf)
                    {
                        increase = false;
                    }
                }   
                else {
                    initVal-=delta;
                    if(initVal < minf)
                    {
                        increase = true;
                    }
                }
            }
            var F1 = 2*Math.sin((Math.PI*Fc[1])/Fs);
            var Q1 = 2*damp;

            var yh = new Float32Array(buffer.length); 
            var yb = new Float32Array(buffer.length);
            var yl = new Float32Array(buffer.length);

            yh[0] = buffer[0];
            yb[0] = F1*yh[0];
            yl[0] = F1*yb[0];

            for (var n=1; n < buffer.length; n++)
            {
                yh[n] = buffer[n] - yl[n-1] - Q1*yb[n-1];
                yb[n] = F1*yh[n] + yb[n-1];
                yl[n] = F1*yb[n] + yl[n-1];
                F1 = 2*Math.sin((Math.PI*Fc[n])/Fs);      
            }
            callback(yb);
        }
    };

    return dsp;
});

