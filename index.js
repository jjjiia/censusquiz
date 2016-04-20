//# dc.js Getting Started and How-To Guide
'use strict';

//charts - divs

//var gainOrLossChart = dc.pieChart("#gain-loss-chart");
//var fluctuationChart = dc.barChart("#fluctuation-chart");
//var moveChart = dc.lineChart("#monthly-move-chart");
//var volumeChart = dc.barChart("#monthly-volume-chart");
//var yearlyBubbleChart = dc.bubbleChart("#yearly-bubble-chart");
//var rwChart = dc.geoChoroplethChart("#choropleth-map-chart");

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}


queue()
.defer(d3.csv, "reducedFile.csv")
.await(ready);

//filters for text
var nypd = "NYPD"
var weekend = ["0.Sun","6.Sat"]
var noise = "Loud Music/Party"
var tlc = "TLC"

function ready(error, data){
	//format dates
    //console.log(data)
    //### Create Crossfilter Dimensions and Groups
    //See the [crossfilter API](https://github.com/square/crossfilter/wiki/API-Reference) for reference.

    var ndx = crossfilter(data);
    var all = ndx.groupAll();        
    dc.dataCount("#count")
        .dimension(ndx)
        .group(all)
        .html({
            some:"Congratulations, you are %filter-count out of %total-count! <a href='javascript:dc.filterAll(); dc.renderAll();''>Reset</a>",
            all:"Testing you against %total-count people."
        })

    	d3.select("#loader").remove();
        var width = 900
        var height = 200
//        drawChart("ANC",topics["ANC"],ndx,width,100)
//        drawChart("COW",topics["COW"],ndx,width,300)
        
    for(var t in topics){
        drawChart(t,topics[t],ndx,width,height)
    }
    
    dc.renderAll();
};
function drawChart(category,categoryName,ndx,width,height){
    var chart = d3.select("#row").append("div").attr("id",category)
    chart.append("div").attr("id","title").html(category+" "+categoryName).attr("class","chartTitle")
    var complaintChart = dc.rowChart("#"+category);
    
  //  console.log(category)
    var complaint = ndx.dimension(function (d) {
        return d[category];
    });
    var complaintGroup = complaint.group();
    var bottomRowHeight = height

	complaintChart.width(width)
        .height(bottomRowHeight)
        .margins({top: 0, left: 400, right: 10, bottom: 20})
        .group(complaintGroup)
        .dimension(complaint)
		.labelOffsetX(-395)
		.labelOffsetY(12)		
		.data(function(complaintGroup){return complaintGroup.top(50)})
		.ordering(function(d){ return -d.value })
        .ordinalColors(["#63D965"])
        .label(function (d){
			var keyString = topicsCategories[category][d.key]
			return keyString
        })
       // .elasticX(true)
//        .xAxis().ticks(4)
        dc.renderAll();
        d3.selectAll("text").attr("font-size","28px")
    
}
//#### Version
//Determine the current version of dc with `dc.version`
d3.selectAll("#version").text(dc.version);
