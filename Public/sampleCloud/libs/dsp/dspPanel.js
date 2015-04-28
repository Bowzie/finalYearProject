define(function () {
    //Empty constructor
    function dspPanel() {

    }

    dspPanel.prototype = {

    	handleSelectChange: function(samplerate) {
    		var dspPanel =  document.getElementById('dspPanel');
			var biquadSelect1 = document.getElementById('biquadSelect1');
			var biquadSelect2 = document.getElementById('biquadSelect2');
			var biquadSelect3 = document.getElementById('biquadSelect3');
			var rangeForm1 = document.getElementById('range1');
			var rangeForm2 = document.getElementById('range2');
			var rangeForm3 = document.getElementById('range3');
			var rangeForm4 = document.getElementById('range4');
			var rangeForm5 = document.getElementById('range5');
			var label1 = document.getElementById('labelRangeInput1');
			var label2 = document.getElementById('labelRangeInput2');
			var label3 = document.getElementById('labelRangeInput3');
			var label4 = document.getElementById('labelRangeInput4');
			var label5 = document.getElementById('labelRangeInput5');
			var rangeInput1 = document.getElementById('rangeInput1');
			var rangeInput2 = document.getElementById('rangeInput2');
			var rangeInput3 = document.getElementById('rangeInput3');
			var rangeInput4 = document.getElementById('rangeInput4');
			var rangeInput5 = document.getElementById('rangeInput5');
			var applyDspButton = document.getElementById('applyDsp');
			var dspSpan = document.getElementById('dspSpan');

			var sampleRateHalf = samplerate/2;
			applyDsp.style.display = 'block';
			biquadSelect1.style.display = 'none';
			biquadSelect2.style.display = 'none';
			biquadSelect3.style.display = 'none';
			rangeForm1.style.display = 'none'; rangeForm1.elements[1].value = '';
			rangeForm2.style.display = 'none'; rangeForm2.elements[1].value = '';
			rangeForm3.style.display = 'none'; rangeForm3.elements[1].value = ''; 
			rangeForm4.style.display = 'none'; rangeForm4.elements[1].value = '';
			rangeForm5.style.display = 'none'; rangeForm5.elements[1].value = '';
		 	label1.style.display = 'none'; label1.innerText = '';
			label2.style.display = 'none'; label2.innerText = '';
			label3.style.display = 'none'; label3.innerText = '';
			label4.style.display = 'none'; label4.innerText = '';
			label5.style.display = 'none'; label5.innerText = '';
			dspSpan.style.display = 'none';
			dspSpan.innerText = '';

			//Make inputs visible depending on chosen filter/effect
			switch(dspSelect.value)
			{
				case '':
					applyDsp.style.display = 'none';
					dspSpan.style.display = 'none';
					dspSpan.innerText = '';
				break;
				//ADSR - 4 inputs
				case '1':
					rangeForm1.style.display = 'block'; rangeForm1.elements[1].value = '0.5';
					rangeForm2.style.display = 'block'; rangeForm2.elements[1].value = '0.5';
					rangeForm3.style.display = 'block'; rangeForm3.elements[1].value = '0.5';
					rangeForm4.style.display = 'block'; rangeForm4.elements[1].value = '0.5';

					rangeInput1.max = "1"; rangeInput1.min = "0.01"; rangeInput1.step = "0.01"; rangeInput1.value = "0.5";
					rangeInput2.max = "1"; rangeInput2.min = "0.01"; rangeInput2.step = "0.01"; rangeInput2.value = "0.5";
					rangeInput3.max = "1"; rangeInput3.min = "0.01"; rangeInput3.step = "0.01"; rangeInput3.value = "0.5";
					rangeInput4.max = "1"; rangeInput4.min = "0.01"; rangeInput4.step = "0.01"; rangeInput4.value = "0.5";

					label1.style.display = 'block'; label1.innerText = 'Attack';
					label2.style.display = 'block'; label2.innerText = 'Decay';
					label3.style.display = 'block'; label3.innerText = 'Sustain';
					label4.style.display = 'block'; label4.innerText = 'Release';
				break;
				//Biquad - 2 input
				case '2':
					biquadSelect1.style.display = 'block'; 

					rangeForm1.style.display = 'block'; rangeForm1.elements[1].value = '0.7';
					rangeForm2.style.display = 'block'; rangeForm2.elements[1].value = (sampleRateHalf/2).toString(); 

					rangeInput1.max = "1.4"; rangeInput1.min = "0.1"; rangeInput1.step = "0.01"; rangeInput1.value = "0.7";
					rangeInput2.max = sampleRateHalf.toString(); rangeInput2.min = "1"; rangeInput2.step = "1"; rangeInput2.value = (sampleRateHalf/2).toString();

					label1.style.display = 'block'; label1.innerText = 'Resonance';
					label2.style.display = 'block'; label2.innerText = 'Cutoff Frequency Hz';
				break;
				//Biquad2 - 3 inputs
				// case '3':
				// 	biquadSelect2.style.display = 'block';
				// 	// biquadSelect2Q.style.display = 'block';

				// 	rangeForm1.style.display = 'block'; rangeForm1.elements[1].value = '0.7';
				// 	rangeForm2.style.display = 'block'; rangeForm2.elements[1].value = '0.7';
				// 	rangeForm3.style.display = 'block'; rangeForm3.elements[1].value = '0.7';

				// 	rangeInput1.max = "1.4"; rangeInput1.min = "0.1"; rangeInput1.step = "0.01"; rangeInput1.value = "0.7";
				// 	rangeInput2.max = sampleRateHalf.toString(); rangeInput2.min = "1"; rangeInput2.step = "1"; rangeInput2.value = (sampleRateHalf/2).toString();
				// 	rangeInput3.max = "1.4"; rangeInput3.min = "0.1"; rangeInput3.step = "0.01"; rangeInput3.value = "0.7";

				// 	label1.style.display = 'block'; label1.innerText = 'dbGain';
				// 	label2.style.display = 'block'; label2.innerText = 'Norm Freq';
				// 	label3.style.display = 'block'; label3.innerText = 'Bandwidth';
				// break;
				//Biquad3 - 3 inputs
				case '4':
					biquadSelect3.style.display = 'block';
					rangeForm1.style.display = 'block'; rangeForm1.elements[1].value = '0';
					rangeForm2.style.display = 'block'; rangeForm2.elements[1].value = '0.5';
					rangeForm3.style.display = 'block'; rangeForm3.elements[1].value = '15';

					rangeInput1.max = "10"; rangeInput1.min = "-10"; rangeInput1.step = "0.01"; rangeInput1.value = "0";
					rangeInput2.max = "1"; rangeInput2.min = "0"; rangeInput2.step = "0.01"; rangeInput2.value = "0.5";
					rangeInput3.max = "50"; rangeInput3.min = "1"; rangeInput3.step = "1"; rangeInput3.value = "15";

					label1.style.display = 'block'; label1.innerText = 'dbGain';
					label2.style.display = 'block'; label2.innerText = 'Norm Freq';
					label3.style.display = 'block'; label3.innerText = 'Q';
				break;
				//Bit Crusher - 2 inputs
				case '5':
					rangeForm1.style.display = 'block'; rangeForm1.elements[1].value = '0.5';
					rangeForm2.style.display = 'block'; rangeForm2.elements[1].value = '8';

					rangeInput1.max = "1"; rangeInput1.min = "0"; rangeInput1.step = "0.01"; rangeInput1.value = "0.5";
					rangeInput2.max = '16'; rangeInput2.min = "1"; rangeInput2.step = "1"; rangeInput2.value = '8';

					label1.style.display = 'block'; label1.innerText = 'Norm Frequency';
					label2.style.display = 'block'; label2.innerText = 'Bit Quality';
				break;
				//Decimator - 2 inputs
				case '6':
					rangeForm1.style.display = 'block'; rangeForm1.elements[1].value = '0.5';
					rangeForm2.style.display = 'block'; rangeForm2.elements[1].value = '8';

					rangeInput1.max = "1"; rangeInput1.min = "0"; rangeInput1.step = "0.01"; rangeInput1.value = "0.5";
					rangeInput2.max = '32'; rangeInput2.min = "1"; rangeInput2.step = "1"; rangeInput2.value = '16';

					label1.style.display = 'block'; label1.innerText = 'Rate';
					label2.style.display = 'block'; label2.innerText = 'Bit Quality';
				break;
				//Delay1 - 2 inputs
				case '7':
					rangeForm1.style.display = 'block'; rangeForm1.elements[1].value = '0.5';
					rangeForm2.style.display = 'block'; rangeForm2.elements[1].value = '0.5';

					rangeInput1.max = "1"; rangeInput1.min = "0.01"; rangeInput1.step = "0.01"; rangeInput1.value = "0.5";
					rangeInput2.max = '1'; rangeInput2.min = "0.01"; rangeInput2.step = "0.01"; rangeInput2.value = '0.5';

					label1.style.display = 'block'; label1.innerText = 'Amount';
					label2.style.display = 'block'; label2.innerText = 'Decay';
				break;
				//Delay2 - 2 inputs
				case '8':
					rangeForm1.style.display = 'block'; rangeForm1.elements[1].value = '0.5';
					rangeForm2.style.display = 'block'; rangeForm2.elements[1].value = '0.5';

					rangeInput1.max = "1"; rangeInput1.min = "0.01"; rangeInput1.step = "0.01"; rangeInput1.value = "0.5";
					rangeInput2.max = '1'; rangeInput2.min = "0"; rangeInput2.step = "0.1"; rangeInput2.value = '0.5';

					label1.style.display = 'block'; label1.innerText = 'Master Volume';
					label2.style.display = 'block'; label2.innerText = 'Delay Volume';
				break;
				//Distortion - 1 input
				case '9':
					rangeForm1.style.display = 'block'; rangeForm1.elements[1].value = '0.5';

					rangeInput1.max = "1"; rangeInput1.min = "0.0"; rangeInput1.step = "0.01"; rangeInput1.value = "0.5";

					label1.style.display = 'block'; label1.innerText = 'Amount';
				break;
				//Distortion Foldback - 1 input
				case '10':
					rangeForm1.style.display = 'block'; rangeForm1.elements[1].value = '0.5';

					rangeInput1.max = "1"; rangeInput1.min = "0.01"; rangeInput1.step = "0.01"; rangeInput1.value = "0.5";

					label1.style.display = 'block'; label1.innerText = 'Threshold';
				break;
				//Flanger - 3 inputs
				case '11':
					rangeForm1.style.display = 'block'; rangeForm1.elements[1].value = '7.5';
					rangeForm2.style.display = 'block'; rangeForm2.elements[1].value = '2.5';
					rangeForm3.style.display = 'block'; rangeForm3.elements[1].value = '0.5';

					rangeInput1.max = "15"; rangeInput1.min = "0.1"; rangeInput1.step = "0.1"; rangeInput1.value = "7.5";
					rangeInput2.max = "5"; rangeInput2.min = "0.1"; rangeInput2.step = "0.01"; rangeInput2.value = "2.5";
					rangeInput3.max = "1"; rangeInput3.min = "0.1"; rangeInput3.step = "0.01"; rangeInput3.value = "0.5";

					label1.style.display = 'block'; label1.innerText = 'Delay Time Seconds';
					label2.style.display = 'block'; label2.innerText = 'Rate Hz';
					label3.style.display = 'block'; label3.innerText = 'Amp';

				break;
				//Fuzz - 1 input
				case '12':
					rangeForm1.style.display = 'block'; rangeForm1.elements[1].value = '0.5';

					rangeInput1.max = "1"; rangeInput1.min = "0.01"; rangeInput1.step = "0.01"; rangeInput1.value = "0.5";

					label1.style.display = 'block'; label1.innerText = 'Gain Amount';
				break;
				//Gain - 1 input
				case '13':
					rangeForm1.style.display = 'block'; rangeForm1.elements[1].value = '0.5';

					rangeInput1.max = "1"; rangeInput1.min = "0.01"; rangeInput1.step = "0.01"; rangeInput1.value = "0.5";

					label1.style.display = 'block'; label1.innerText = 'Gain Amount';
				break;
				//Limiter - 3 inputs
				case '14':
					rangeForm1.style.display = 'block'; rangeForm1.elements[1].value = '0.5';
					rangeForm2.style.display = 'block'; rangeForm2.elements[1].value = '7.5';
					rangeForm3.style.display = 'block'; rangeForm3.elements[1].value = '2500';

					rangeInput1.max = "1"; rangeInput1.min = "0.1"; rangeInput1.step = "0.01"; rangeInput1.value = "0.5";
					rangeInput2.max = "15"; rangeInput2.min = "0.1"; rangeInput2.step = "0.01"; rangeInput2.value = "7.5";
					rangeInput3.max = "5000"; rangeInput3.min = "1"; rangeInput3.step = "1"; rangeInput3.value = "2500";

					label1.style.display = 'block'; label1.innerText = 'Threshold';
					label2.style.display = 'block'; label2.innerText = 'Attack Time in ms';
					label3.style.display = 'block'; label3.innerText = 'Release Time in ms';
				break;
				//Moog - 2 inputs
				case '15':
					rangeForm1.style.display = 'block'; rangeForm1.elements[1].value = '0.05';
					rangeForm2.style.display = 'block'; rangeForm2.elements[1].value = '2';

					rangeInput1.max = "1"; rangeInput1.min = "0"; rangeInput1.step = "0.01"; rangeInput1.value = "0.5";
					rangeInput2.max = "4"; rangeInput2.min = "0"; rangeInput2.step = "0.01"; rangeInput2.value = "2";

					label1.style.display = 'block'; label1.innerText = 'Cutoff Frequency';
					label2.style.display = 'block'; label2.innerText = 'Resonance';
				break;
				//Overdrive - 1 input
				case '16':
					rangeForm1.style.display = 'block'; rangeForm1.elements[1].value = '0';

					rangeInput1.max = "1"; rangeInput1.min = "-1.0"; rangeInput1.step = "0.0000001"; rangeInput1.value = "0";

					label1.style.display = 'block'; label1.innerText = 'Threshold';
				break;
				//WahWah - 5 inputs
				case '17':
					rangeForm1.style.display = 'block'; rangeForm1.elements[1].value = (sampleRateHalf/2).toString();
					rangeForm2.style.display = 'block'; rangeForm2.elements[1].value = (sampleRateHalf/2).toString();
					rangeForm3.style.display = 'block'; rangeForm3.elements[1].value = (sampleRateHalf/2).toString();
					rangeForm4.style.display = 'block'; rangeForm4.elements[1].value = '0.05';

					rangeInput1.max = sampleRateHalf.toString(); rangeInput1.min = "0"; rangeInput1.step = "1"; rangeInput1.value = (sampleRateHalf/2).toString();
					rangeInput2.max = sampleRateHalf.toString(); rangeInput2.min = "1"; rangeInput2.step = "1"; rangeInput2.value = (sampleRateHalf/2).toString();
					rangeInput3.max = sampleRateHalf.toString(); rangeInput3.min = "1"; rangeInput3.step = "1"; rangeInput3.value = (sampleRateHalf/2).toString();
					rangeInput4.max = "0.1"; rangeInput4.min = "0.01"; rangeInput4.step = "0.01"; rangeInput4.value = "0.05";

					label1.style.display = 'block'; label1.innerText = 'Min Frequency';
					label2.style.display = 'block'; label2.innerText = 'Max Frequency';
					label3.style.display = 'block'; label3.innerText = 'Centre Frequency';
					label4.style.display = 'block'; label4.innerText = 'Damping';
				break;
			}
			dspPanel.style.display = 'block';
    	},

    	handleDspApply: function(buffer, samplerate, callback) {
    		require(['dspFunctions'], function(dsp) {
    			var dsp = new dsp();
				var dspPanel =  document.getElementById('dspPanel');
				var biquadSelect1 = document.getElementById('biquadSelect1');
				var biquadSelect2 = document.getElementById('biquadSelect2');
				var biquadSelect3 = document.getElementById('biquadSelect3');
				var rangeForm1 = document.getElementById('range1');
				var rangeForm2 = document.getElementById('range2');
				var rangeForm3 = document.getElementById('range3');
				var rangeForm4 = document.getElementById('range4');
				var rangeForm5 = document.getElementById('range5');
				var label1 = document.getElementById('labelRangeInput1');
				var label2 = document.getElementById('labelRangeInput2');
				var label3 = document.getElementById('labelRangeInput3');
				var label4 = document.getElementById('labelRangeInput4');
				var label5 = document.getElementById('labelRangeInput5');
				var rangeInput1 = document.getElementById('rangeInput1');
				var rangeInput2 = document.getElementById('rangeInput2');
				var rangeInput3 = document.getElementById('rangeInput3');
				var rangeInput4 = document.getElementById('rangeInput4');
				var rangeInput5 = document.getElementById('rangeInput5');
				var applyDspButton = document.getElementById('applyDsp');
				var dspSpan = document.getElementById('dspSpan');
				var values = {};
				//Obtain values from visible 
				switch(dspSelect.value)
				{
					case '':
					break;
					//ADSR - 4 inputs
					case '1':
						values.attack = parseFloat(rangeInput1.value); 
						values.decay = parseFloat(rangeInput2.value);
						values.sustain = parseFloat(rangeInput3.value);
						values.release = parseFloat(rangeInput4.value); 
						dsp.adsr(buffer, samplerate, values.attack, values.decay, values.sustain, values.release, function(adsrBuff) {
							callback(adsrBuff);
						});
					break;
					//Biquad1- 2 input
					case '2':
						values.filt = biquadSelect1.value;
						values.res = parseFloat(rangeInput1.value); 
						values.cutoff = parseFloat(rangeInput2.value);

						dspSpan.style.display = 'none';
						if(values.filt === 'LPF' || values.filt === 'HPF')
						{
							dsp.biquad1(buffer, values.filt, samplerate, values.res, values.cutoff, function(biquad1Buff) {
								callback(biquad1Buff);
							});	
						}
						else {
							dspSpan.style.display = 'block';
							dspSpan.innerText = "Select a filter!";
							callback(null);
						}

						
					break;
					// //Biquad2 - 3 inputs
					// case '3':
					// 	values.filt = biquadSelect2.value;
					// 	values.gain = rangeInput1.value; 
					// 	values.cutoff = rangeInput2.value/2;
					// 	values.bandwidth = rangeInput3.value;
					// 	dsp.biquad2(buffer, values.filt, samplerate, values.gain, values.cutoff, values.bandwidth, function(biquad2Buff) {
					// 		callback(biquad2Buff);
					// 	});
					// break;
					//Biquad3 - 3 inputs
					case '4':
						values.filt = biquadSelect3.value;
						values.gain = parseFloat(rangeInput1.value); 
						values.cutoff = parseFloat(rangeInput2.value /2);
						values.q = parseFloat(rangeInput3.value);

						dspSpan.style.display = 'none';
						if(values.filt === 'LPF' || values.filt === 'HPF' || values.filt === 'BPF'|| values.filt === 'NOTCH' || values.filt === 'PEAK' || values.filt === 'LSH' || values.filt === 'HSH')
						{
							dsp.biquad3(buffer, values.filt, values.gain, values.cutoff, values.q, function(biquad3Buff) {
								callback(biquad3Buff);
							});
						}
						else {
							dspSpan.style.display = 'block';
							dspSpan.innerText = "Select a filter!";
							callback(null);
						}
					break;
					//Bit Crusher - 2 inputs
					case '5':
						values.normfreq = parseFloat(rangeInput1.value); 
						values.bits = parseFloat(rangeInput2.value);

						dsp.bitCrusher(buffer, values.normfreq, values.bits, function(bitCrusherBuff) {
							console.log(bitCrusherBuff);
							callback(bitCrusherBuff);
						});
					break;
					//Decimator - 2 inputs
					case '6':
						values.rate = parseFloat(rangeInput1.value); 
						values.bits = parseFloat(rangeInput2.value);
						dsp.decimator(buffer, values.rate, values.bits, function(decimatorBuff) {
							callback(decimatorBuff);
						});
					break;
					//Delay1 - 2 inputs
					case '7':
						values.amount = parseFloat(rangeInput1.value); 
						values.decay = parseFloat(rangeInput2.value);
						dsp.delay1(buffer, samplerate, values.amount, values.decay, function(delay1Buff) {
							callback(delay1Buff);
						});
					break;
					//Delay2 - 2 inputs
					case '8':
						values.masterVol = parseFloat(rangeInput1.value); 
						values.delayVol = parseFloat(rangeInput2.value);
						dsp.delay2(buffer, samplerate, values.masterVol, values.delayVol, function(delay2Buff) {
							callback(delay2Buff);
						});
					break;
					//Distortion - 1 input
					case '9':
						values.distAmount = parseFloat(rangeInput1.value); 
						dsp.distortion(buffer, values.distAmount, function(distortionBuff) {
							callback(distortionBuff);
						});
					break;
					//Distortion Foldback - 1 input
					case '10':
						values.threshold = parseFloat(rangeInput1.value); 
						dsp.foldbackDistortion(buffer, values.threshold, function(foldbackDistortionBuff) {
							callback(foldbackDistortionBuff);
						});
					break;
					//Flanger - 3 inputs
					case '11':
						values.delayTime = parseFloat(rangeInput1.value); 
						values.rate = parseFloat(rangeInput2.value);
						values.amp = parseFloat(rangeInput3.value);
						dsp.flanger(buffer, samplerate, values.delayTime, values.rate, values.amp, function(flangerBuff) {
							callback(flangerBuff);
						});	
					break;
					//Fuzz - 1 input
					case '12':
						values.gain = parseFloat(rangeInput1.value) * 10;
						dsp.fuzz(buffer, values.gain, 0, function(fuzzBuff) {
							callback(fuzzBuff);
						}); 
					break;
					//Gain - 1 input
					case '13':
						values.gain = parseFloat(rangeInput1.value) * 10; 
						dsp.gain(buffer, values.gain, function(gainBuff) {
							callback(gainBuff);
						});
					break;
					//Limiter - 3 inputs
					case '14':
						values.threshold = parseFloat(rangeInput1.value); 
						values.rt = parseFloat(rangeInput2.value)/1000;
						values.at = parseFloat(rangeInput3.value)/1000;
						dsp.limiter(buffer, values.threshold, values.rt, values.at, function(limiterBuff) {
							callback(limiterBuff);
						}); 
					break;
					//Moog - 2 inputs
					case '15':
						values.cutoff = parseFloat(rangeInput1.value)/10; 
						values.resonance = parseFloat(rangeInput2.value);
						dsp.moog(buffer, values.cutoff, values.resonance, function(moogBuff) {
							callback(moogBuff);
						});
					break;
					//Overdrive - 1 input
					case '16':
						values.threshold = parseFloat(rangeInput1.value);
						dsp.overdrive(buffer, values.threshold, function(overdriveBuff) {
							callback(overdriveBuff);
						});
					break;
					//WahWah - 4 inputs
					case '17':
						values.minf = parseFloat(rangeInput1.value); 
						values.maxf = parseFloat(rangeInput2.value);
						values.fw = parseFloat(rangeInput3.value);
						values.damp = parseFloat(rangeInput4.value);
						dspSpan.style.display = 'none';
						if(values.minf < values.maxf)
						{
							dsp.wahwah(buffer, samplerate, values.minf, values.maxf, values.fw, values.damp, function(wahBuff) {
								callback(wahBuff);
							});
						}
						else {
							dspSpan.style.display = 'block';
							dspSpan.innerText = "Min Frequency must be lower than Max Freqency!";
							callback(null);
						}
					break;
				}
    		});
    	}
    }

	return dspPanel;

});