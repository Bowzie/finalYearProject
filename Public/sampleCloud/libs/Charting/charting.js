define(function () {
    //Empty constructor
    function charting(d3) {
        this.d3 = d3;
    }

    charting.prototype = {
        lineChart: function(id, inputData)
        {
            var chart = d3.select('#' + id); //Get div with id = chart
            var data = [];

            for(var i = 0; i < inputData.length; i++)
            {
                data[i] = {'x': inputData[i], 'y': i};
            }

            //Create line function
            var line = d3.svg.line()
                .x(function(d){ return d.x; }) //x coordinates
                .y(function(d){ return d.y; }) //y coordinates
                .interpolate('linear');   //Straight line between points

            //Add svg to line, make responsive
            var svg = chart.append('svg')
                .attr('preserveAspectRatio', 'xMinYMin meet')
                .attr('viewBox', '0 0 1920 1080');

            //Add graph to svg using line function
            var graph = svg.append('path')
                .attr('d', line(data)) //draw line with data values
                .attr('stroke', 'black') 
                .attr('stroke-width', 2) 
                .attr('fill', 'none');
     
            return chart;     
        }
    };  

    return charting;
});
