
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

  this.draw();
}

var _barChart = barChart.prototype;

_barChart.prepareHistogram = function(){
  var b = this.binWidth;
  this.units = dc.units.fp.precision(b);
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
                        if(_this.histogram){
                          _this.prepareHistogram();
                          var b = _this.binWidth;
                          d = d[Object.keys(d)]
                          d = parseFloat(d);
                          return b * Math.floor(d/b);
                        }else{
                          return d[Object.keys(d)];
                        }
                      })
  return this.dimension;
}

_barChart.getGroup = function(){
  var dimension = this.getDimension();
  this.group = dimension.group();
  return this.group;
}

_barChart.getDomainRange = function(){
  var group = this.getGroup();
  this.oridinal_values = d3.map(this.allValues(), function(d){return d;}).keys();
  this.minmax_occurrences = [0, group.top(1)[0].value];
  this.minmax_value = d3.extent(this.allValues());
}

_barChart.setXY = function(){
  this.getDomainRange();
  if(this.histogram){
    this.x = d3.scale.linear().domain(this.minmax_value);
  }else{
    this.x = d3.scale.ordinal().domain(this.oridinal_values);
  }
  this.y = d3.scale.linear().domain(this.minmax_occurrences);
  if (this.logScale) {
    //TODO: Finish log scale
    // this.x = d3.scale.log().range(this.minmax_value);
  this.x = d3.scale.log()
    .domain([0, 1000])
    .range([0, this.width]);
  // this.units = dc.units.integers;
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
