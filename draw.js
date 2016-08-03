var extractedData = JSON.parse(metricData.card.content)

var valueData = [];
var dataType = "numerical";
// var dataType = "categorical";
var year = 2012;

var formattedValueData = [];
var dcobj;
var cobj;
$(document).ready(function(){

 switch (dataType) {
   case "categorical":
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
                 height: 300,
                 barColors: ["#674ea7"],
                 yAxisLabel: "Frequency"
               };
              //  opts.width = 250;
              //  opts.height = 100;
               dcobj = new barChart(opts);
               break
 case "numerical":
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
               paddingX: 10,
               histogram: true,
               logScale: true,
               yAxisLabel: "Frequency"
             };
            //  opts.width = 1000;
            //  opts.height = 600;
             opts.barColors= ["#674ea7"];

             dcobj = new barChart(opts);
             break
   case "numerical2" :
           for(var key in extractedData) {
               if(extractedData.hasOwnProperty(key)) {
                 floatVal = parseInt(extractedData[key][0].value)
                 if(!isNaN(floatVal))
                  valueData.push(floatVal);
               }
           }
           var opts = {data: valueData, bins: 10, barWidthRatio: 3, width: 500, height: 300, ordinal: true};
           cobj = new histChart(opts);
           break
   case "categorical2":
       for(var key in extractedData) {
             if(extractedData.hasOwnProperty(key)) {
               val = extractedData[key][0].value;
                valueData.push(val);
             }
         }
         break
 }

})
