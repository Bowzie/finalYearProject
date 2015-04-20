define(function () {
    //Empty constructor
    function charting() {

    }

    charting.prototype = {
        lineChart: function(id, inputData)
        {
            var d3 = require(['d3'], function(d3) {

                // define dimensions of graph
                var m = [80, 80, 80, 80]; // margins
                var w = 1000 - m[1] - m[3]; // width
                var h = 400 - m[0] - m[2]; // height
                var data = [];

                if(inputData instanceof AudioBuffer)
                {
                    inputData = inputData.getChannelData(0);
                }
                
                var j = 0;
                for(var i = 0; i < inputData.length; i+=16)
                {
                    data[j] = inputData[i] + 1;  
                    j++;  
                }

                var x = d3.scale.linear().domain([0, data.length]).range([0, w]);                
                var y = d3.scale.linear().domain([0, 2]).range([h, 0]);

                // create a line function that can convert data[] into x and y points
                var line = d3.svg.line()
                    // assign the X function to plot our line as we wish
                    .x(function(d,i) { 
                        return x(i); 
                    })
                    .y(function(d) { 
                        return y(d); 
                    })

                    //Clear graph
                    var div = document.getElementById(id);
                    div.innerHTML = "";

                    //Add svg to graph
                    var graph = d3.select('#' + id).append("svg:svg")
                          .attr("width", w + m[1] + m[3])
                          .attr("height", h + m[0] + m[2])
                          .append("svg:g")
                          .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

                    // create xAxis
                    var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true);
                    
                    //Append xAxis graphic
                    graph.append("svg:g")
                          .attr("class", "x axis")
                          .attr("transform", "translate(0," + h + ")")
                          .call(xAxis);
                    
                    //Draw data on graph
                    graph.append("svg:path").attr("d", line(data));
            });
        }
    };  

    return charting;
});
