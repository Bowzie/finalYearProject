define([
    'd3',
], function(d3) {
    console.log(d3);
    var chart = d3.select('#chart');

    var data = []; //dummy data to draw

    for(var i = 0; i < 10; i++) {
        data[i] = {'x':Math.floor((Math.random() * 400) + 1), 'y': Math.floor((Math.random() * 400) + 1)};
    }

    var line = d3.svg.line()
        .x(function(d){ return d.x; })
        .y(function(d){ return d.y; })
        .interpolate('linear');   

    var svg = chart.append('svg')
        .attr('width', '400')
        .attr('height', '400');

    var graph = svg.append('path')
        .attr('d', line(data))
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .attr('fill', 'none');

    console.log(chart);
});