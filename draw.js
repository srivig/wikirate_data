var extractedData = JSON.parse(metricData.card.content)

var valueData = [];
// var dataType = 'numerical2';
var dataType = 'categorical2';
var year = 2014;

var formattedValueData = [];
var dcobj;
var cobj;
$(document).ready(function(){

 switch (dataType) {
   case 'categorical':
       for(var key in extractedData) {
                   if(extractedData.hasOwnProperty(key)) {
                     extractedData[key].forEach(function(subKey){
                     if(subKey.year == year){
                       var val = subKey.value;
                       var objVal = new Object();
                           objVal[key] = val;
                         valueData.push(val);
                         formattedValueData.push(objVal);
                      }
                    })
                   }
               }
               var opts = {
                 data: formattedValueData,
                 paddingX: 10,
                 histogram: false,
                 width: 500,
                 height: 200,
                 barColors: ['#674ea7'],
                 yAxisLabel: 'Frequency'
               };
              //  opts.width = 250;
              //  opts.height = 100;
               dcobj = new barChart(opts);
               break
 case 'numerical1':
     for(var key in extractedData) {
                 if(extractedData.hasOwnProperty(key)) {
                  var val = parseFloat(extractedData[key][0].value)
                  var objVal = new Object();
                      objVal[key] = val;
                    if(!isNaN(val)){
                      valueData.push(val);
                      formattedValueData.push(objVal);
                  }
                 }
             }
             var opts = {
               data: formattedValueData,
               binWidth: 1,
               paddingX: 10,
               histogram: true ,
               logScale: false,
               yAxisLabel: 'Frequency'
             };
            //  opts.width = 1000;
            //  opts.height = 600;
             opts.barColors= ['#674ea7'];

             dcobj = new barChart(opts);
             break
   case 'numerical2' :
           for(var key in extractedData) {
               if(extractedData.hasOwnProperty(key)) {
                 floatVal = parseInt(extractedData[key][0].value)
                 if(!isNaN(floatVal))
                  valueData.push(floatVal);
               }
           }
           var opts = {
               data: valueData,
               bins: valueData.length,
               barWidthRatio: 5,
               width: 500,
               height: 300,
               ordinal: false
           };
           cobj = new histChart(opts);
           break
   case 'categorical2':
       for(var key in extractedData) {
             if(extractedData.hasOwnProperty(key)) {
               val = extractedData[key][0].value;
                valueData.push(val);
             }
         }
         break
 }

})


// Borrowed from Jason Davies science library https://github.com/jasondavies/science.js/blob/master/science.v1.js
variance = function(x) {
  var n = x.length;
  if (n < 1) return NaN;
  if (n === 1) return 0;
  var mean = d3.mean(x),
      i = -1,
      s = 0;
  while (++i < n) {
    var v = x[i] - mean;
    s += v * v;
  }
  return s / (n - 1);
};

//A test for outliers http://en.wikipedia.org/wiki/Chauvenet%27s_criterion
function chauvenet (x) {
    var dMax = 3;
    var mean = d3.mean(x);
    var stdv = Math.sqrt(variance(x));
    var counter = 0;
    var temp = [];

    for (var i = 0; i < x.length; i++) {
        if(dMax > (Math.abs(x[i] - mean))/stdv) {
            temp[counter] = x[i];
            counter = counter + 1;
        }
    };

    return temp
}
