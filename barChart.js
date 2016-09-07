
var barChart = function(opts){
  opts = typeof opts !== 'undefined' ? opts : {};
  this.data = opts.data || [];
  this.histogram = opts.histogram || false;
  this.units = dc.units.ordinal;
  this.paddingX = opts.paddingX || 10;
  this.binWidth = opts.binWidth || 20;
  this.width = opts.width || 1000;
  this.height = opts.height || 500;
  this.barColors = opts.barColors || ['steelblue'];
  this.element = opts.selctorName || 'body';
  this.logScale = opts.logScale || false;
  this.xAxisLabel = opts.xAxisLabel || "";
  this.yAxisLabel = opts.yAxisLabel || "";
  this.bins = opts.bins || 100;

  this.draw();
}

var _barChart = barChart.prototype;

_barChart.prepareHistogram = function(){
  this.minmax_extent =  d3.extent(this.allValues());
  this.binWidth = (this.minmax_extent[1] - this.minmax_extent[0]) / this.bins;
  this.units = dc.units.fp.precision(this.binWidth);
}

_barChart.getCrossfilterObj = function(){
   this.cFilter = crossfilter(this.data);
   return this.cFilter;
}

_barChart.allValues = function(){
  var dimension = this.getDimension();
  var allValues = [];
  dimension.top(Infinity).forEach(function(d){
      allValues.push(d[Object.keys(d)])
  })
  return allValues;
}

_barChart.getDimension = function(){
  var cFilter = this.getCrossfilterObj();
  var _this = this;
  this.dimension  = cFilter.dimension(function (d)
                      {
                        return d[Object.keys(d)];
                      })
  return this.dimension;
}

_barChart.getGroup = function(){
  var dimension = this.getDimension();
  if(this.histogram){
    this.prepareHistogram();
    var b = this.binWidth;
    this.group = dimension.group(function(d){
      return b * Math.floor(parseFloat(d)/b);
    })
  }else{
    this.group = dimension.group();
  }
  return this.group;
}


_barChart.getDomainRange = function(){
  var group = this.getGroup();
  this.oridinal_values = d3.map(this.allValues(), function(d){return d;}).keys();
  this.minmax_occurrences = [0, group.top(1)[0].value];
}

_barChart.setXY = function(){
  this.getDomainRange();
  if(this.histogram){
    this.x = d3.scale.linear().domain(this.minmax_extent).range([0, this.bins]);
  }else{
    this.x = d3.scale.ordinal().domain(this.oridinal_values);
  }
  this.y = d3.scale.linear().domain(this.minmax_occurrences);
  if (this.logScale) {
    //TODO: Finish log scale
    this.x = d3.scale.log(this.x)
  }
}

_barChart.init = function(){
  this.setXY();
}

_barChart.draw = function(){
  this.init();

  dc.barChart(this.element)
      .width(this.width)
      .height(this.height)
      .elasticY(true)
      .dimension(this.dimension)
      .group(this.group)
      .x(this.x)
      .y(this.y)
      .xUnits(this.units)
      .brushOn(false)
      .centerBar(false)
      .xAxisPadding(this.paddingX)
      .renderHorizontalGridLines(false)
      .colors(this.barColors)
      .xAxisLabel(this.xAxisLabel)
      .yAxisLabel(this.yAxisLabel);


  dc.renderAll();
}
