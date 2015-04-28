define(function () {
    //Empty constructor
    function charting() {

    }

    charting.prototype = {
        lineChart: function(id, inputData, type)
        {
            require(['d3'], function(d3) {

                // define dimensions of graph
                var m = [60, 30, 60, 80]; // margins
                var w = 800 - m[1] - m[3]; // width
                var h = 300 - m[0] - m[2]; // height
                var data = [];

                if(inputData instanceof AudioBuffer)
                {
                    inputData = inputData.getChannelData(0);
                }
                
                var j = 0;
                var step = 4;
                if(inputData.length > 1024 && inputData.length <= 2048)
                {
                    step = 16;
                }
                else if(inputData.length > 2048)
                {
                    step = 32;
                }
                for(var i = 0; i < inputData.length; i+=step)
                {
                    if(type === 'normal')
                    {
                        data[j] = inputData[i] + 1;      
                    }
                    else {
                        data[j] = inputData[i] * 125;
                    }
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
                    if(div !== null)
                    {
                        div.innerHTML = "";   
                        div.style.marginTop = "0px"; 
                    }
                    
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
        },
        barChart: function(id, inputData)
        {
             require(['d3'], function(d3) {
                // define dimensions of graph
                var m = [60, 30, 60, 80]; // margins
                var w = 900;
                var h = 300 - m[0] - m[2]; // height
                var data = [];

                if(inputData instanceof AudioBuffer)
                {
                    inputData = inputData.getChannelData(0);
                }
                
                var j = 0;
                var step = 4;
                if(inputData.length > 1024 && inputData.length <= 2048)
                {
                    step = 16;
                }
                else if(inputData.length > 2048)
                {
                    step = 64;
                }
                for(var i = 0; i < inputData.length; i+=step)
                {
                    data[j] = inputData[i];  
                    j++;  
                }

                //Clear graph
                var div = document.getElementById(id);
                if(div !== null)
                {
                    div.innerHTML = "";    
                }

                div.style.marginTop = "50px";

                var x = d3.scale.linear()
                    .domain([0, 1])
                     .range([0, 2]);

                var y = d3.scale.linear()
                    .domain([0, data.length])
                    .rangeRound([0, h]);

                var color = d3.scale.linear()
                    .domain([h, 0])
                    .range(["#0ca3d2", "steelblue"]);

                var amplitude = d3.scale.linear()
                    .domain([0,d3.max(data)])
                    .range([0, h]);

                var chart = d3.select('#' + id).append("svg")
                    .attr("class", "chart")
                    .attr("width", w)
                    .attr("height", h);

                chart.selectAll("rect")
                    .data(data)
                    .enter().append("rect")
                    .attr("fill", function(d) { return color(d); } )
                    .attr("x", function(d, i) { return x(i) + 80 ; })
                    .attr("y", function(d) { return 0; })
                    .attr("width", 2)
                    .attr("height", function(d) { return amplitude(d); } );

                // var borderPath = chart.append("rect")
                //   .attr("x", 75)
                //   .attr("y", 0)
                //   .attr("height", h)
                //   .attr("width", 770)
                //   .style("stroke", 'steelblue')
                //   .style("fill", "none")
                //   .style("stroke-width", '1px');
           });
        }
    };  

    return charting;
});
