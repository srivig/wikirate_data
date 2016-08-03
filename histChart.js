var histChart = function(opts){
   opts = typeof opts !== 'undefined' ? opts : {};
   this.data = opts.data || [1,2,3,4,5,6,7,8,9,10,6,7,8,9,10,6,7,8,9,10];
   this.bins = opts.bins || 5;
   this.width = opts.width || 1000;
   this.height = opts.height || 500;
   this.padding = opts.padding || 100;
   this.element = opts.selctorName || 'body';
   this.barColor = opts.barColor || 'steelblue';
   this.barWidthRatio = opts.barWidthRatio || '2'

   this.draw();
}

var _histChart = histChart.prototype;

_histChart.setHistData = function(){
  var d = this.data,
      bins = this.bins;
  this.histogram = d3.layout.histogram().bins(bins)(d);
}

_histChart.setMaxMin = function(){
  var d = this.data,
      h = this.histogram;
  this.max_y = d3.max(h.map(function(i) {return i.length;}));
  this.max_x = d3.max(d);
  this.min_x = d3.min(d);
}

_histChart.setXY = function(){
  this.y = d3.scale.linear()
          .domain([0, this.max_y])
          .range([0, this.height])

  this.x = d3.scale.linear()
          .domain(d3.extent(this.data))
          .range([0, this.width])
}

_histChart.setAxes = function(){
  var max_y  = this.max_y,
      x      = this.x.copy(),
      y      = this.y.copy();

  this.xAxis = d3.svg.axis()
              .scale(x)
              .orient('bottom')

  this.yAxis = d3.svg.axis()
              .scale(y.domain([max_y, 0]))
              .orient('left')

}

_histChart.drawAxes = function(){
  var canvas = this.canvas,
      height = this.height,
      xAxis  = this.xAxis,
      yAxis  = this.yAxis;

  this.xAxisGroup = canvas.append('g')
             .attr('id', 'xAxis')
             .attr('class', 'axis')
             .attr('transform', 'translate(0,'+ height +')' )
             .call(xAxis);

  this.yAxisGroup = canvas.append('g')
            .attr('id', 'yAxis')
            .attr('class', 'axis')
            .attr('transform', 'translate(0,0)' )
            .call(yAxis);
}

_histChart.drawBars = function(){
  var canvas    = this.canvas,
      barWidthRatio  = this.barWidthRatio,
      barColor  = this.barColor,
      histogram = this.histogram,
      height    = this.height,
      x         = this.x,
      y         = this.y;

  this.bars = canvas.selectAll()
             .attr('id', 'bar')
             .data(histogram)
             .enter()
             .append('g')

  this.bars.append('rect')
     .attr('x', function(d){ return x(d.x); } )
     .attr('y', function(d){ return height - y(d.y); } )
     .attr('width', function(d) { return d.dx*barWidthRatio; } )
     .attr('height', function(d){ return y(d.y); } )
     .attr('fill', barColor);
}

_histChart.init = function(){
  this.setHistData();
  this.setMaxMin();
  this.setXY();
  this.setAxes();
}

_histChart.draw = function(){
  var element = this.element,
      width   = this.width,
      height  = this.height,
      padding = this.padding;

  d3.select(element).selectAll("svg").remove();

  this.canvas = d3.select(element).append('svg')
               .attr('width', width + 100)
               .attr('height', height + padding)
               .append('g');

  this.init();
  this.drawAxes();
  this.drawBars();
}
