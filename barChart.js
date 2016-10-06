
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
  this.xAxisLabel = opts.xAxisLabel || '';
  this.yAxisLabel = opts.yAxisLabel || '';
  this.bins = opts.bins || 15;

  this.draw();
}

var _b = barChart.prototype;

_b.getCrossfilterObj = function(){
   this.cFilter = crossfilter(this.data);
   return this.cFilter;
}

_b.allValues = function(){
  var dimension = this.getDimension();
  var allValues = [];
  dimension.top(Infinity).forEach(function(d){
      allValues.push(d[Object.keys(d)])
  })
  return allValues;
}

_b.getDimension = function(){
  var cFilter = this.getCrossfilterObj();
  var _this = this;
  this.dimension  = cFilter.dimension(function (d)
                      {
                        return d[Object.keys(d)];
                      })
  return this.dimension;
}

_b.prepareHistogram = function(){
  this.minmax_extent =  d3.extent(this.allValues());
  this.binWidth = (this.minmax_extent[1] - this.minmax_extent[0]) / this.bins;
  this.units = dc.units.fp.precision(this.binWidth);
}

_b.getGroup = function(){
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


_b.getDomainRange = function(){
  var group = this.getGroup();
  this.oridinal_values = d3.map(this.allValues(), function(d){return d;}).keys();
  this.minmax_occurrences = [0, group.top(1)[0].value];
}

_b.setXY = function(){
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

_b.init = function(){
  this.setXY();
  this.chartInit();
}

_b.mouseEvents = function(){
  this.mouseClick();
  this.mouseMove();
}

_b.mouseClick = function(){
  _this = this;
  this.dcChart.selectAll('rect.bar').on('click.custom', function(d) {
    _this.filterByValue(d, 'mouseClick');
  });
}

_b.mouseMove = function(){
  _this = this;
  this.dcChart.selectAll('rect.bar').on('mouseover.custom', function(d) {
      _this.filterByValue(d,'mouseMove');
  });
}

_b.filterByValue = function(d, event){
  var filteredVal = {
    event : event,
    data : _this.dimension.filter(d.data.key).top(Infinity)
  };
  console.log(JSON.stringify(filteredVal));
  return filteredVal
}

_b.chartInit = function(){
  _this = this
  _this.dcChart = dc.barChart(_this.element);
  _this.dcChart
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
      .yAxisLabel(this.yAxisLabel)
      .brushOn(false)
      .on('renderlet.barclicker', function(chart, filter)
        {
          _this.mouseEvents();
        });
}


_b.draw = function(){
  this.init();
  dc.renderAll();
}
