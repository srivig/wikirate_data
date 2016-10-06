
// d3.csv("testdata.csv", function(data) {
//  var map = data.map(function(i){
//  return parseInt(i.value)
// })

//

function drawHistChart(){
var width = 1000,
    height = 500,
    padding = 100,
    bins = 20; //valueData.length

var histogram = d3.layout.histogram().bins(bins)(valueData)

var max_y = d3.max(histogram.map(function(i) {return i.length;}))
var max_x = d3.max(valueData)
var min_x = d3.min(valueData)


var y = d3.scale.linear()
        .domain([0, max_y])
        .range([0, height])

var x = d3.scale.linear()
        .domain([min_x, max_x])
        .range([0, width])

var canvas = d3.select('body').append('svg')
             .attr('width', width + 100)
             .attr('height', height + padding)
             .append('g')
            //  .attr('transform', 'translate(20,0)');
var bars = canvas.selectAll()
           .attr('id', 'bar')
           .data(histogram)
           .enter()
           .append('g')

bars.append('rect')
   .attr('x', function(d){return x(d.x); })
   .attr('y', function(d){return height - y(d.y); })
   .attr('width', function(d) {return x(d.dx)/2; })
   .attr('height', function(d){return y(d.y); })
   .attr('fill','steelblue')

// bars.append('text')
//    .attr('x', function(d){return x(d.x) - 20; })
//    .attr('y', function(d){return height - y(d.y) - 20; })
//    .attr('dy', '10px')
//    .attr('dx', function(d){return x(d.dx)/50;})
//    .attr('fill','#000')
//    .text(function(d){return y(d.y); })

var xAxis = d3.svg.axis()
            .scale(x)
            .orient('bottom')

var yAxis = d3.svg.axis()
            .scale(y.domain([max_y, 0]))
            .orient('left')

var xAxisGroup = canvas.append('g')
           .attr('id', 'xAxis')
           .attr('class', 'axis')
           .attr('transform', 'translate(0,'+ height +')' )
           .call(xAxis)

var yAxisGroup = canvas.append('g')
          .attr('id', 'yAxis')
          .attr('class', 'axis')
          .attr('transform', 'translate(0,0)' )
          .call(yAxis)


}
