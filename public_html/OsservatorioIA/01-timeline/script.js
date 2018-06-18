var researches;

//put here the researches for which you want the dashboard
var reserchesstring;

// can be day, week, month or all
var mode = "month";


var limit = 20000;

var language = "XXX";


$( document ).ready(function() {
 
  reserchesstring = "120"; //getUrlParameter("researches");
    //mode = getUrlParameter("mode");
    if(!mode){
      mode = "day";
    }
    researches = reserchesstring.split(",");

    /*
    if(getUrlParameter("limit")!=null){
        limit = getUrlParameter("limit");
    }

    if(getUrlParameter("language")!=null){
        language = getUrlParameter("language");
    }
    */


    
    // prepare your javascript environment here
    // now that the document has loaded
   
    // .. and then start to create your visualisation
    doSomething();

    $("#exportData1").attr("href","http://164.132.225.138/~hefotov/OsservatorioIA/data/sentimenttimelinepositive.json" );
    $("#exportData2").attr("href","http://164.132.225.138/~hefotov/OsservatorioIA/data/sentimenttimelinenegative.json" );
    $("#exportData3").attr("href","http://164.132.225.138/~hefotov/OsservatorioIA/data/sentimenttimelineneutral.json" );

});


function doSomething(){

    getSentiment();

    getSentimentTimeline();

}


function getSentiment(){

    
    $.getJSON("http://164.132.225.138/~hefotov/OsservatorioIA/data/sentiment.json")
    .done(function(data){

        var positive = +data.positive;
        var negative = +data.negative;
        var neutral = +data.neutral;
            
        var total = positive + neutral + negative;

        var perc_positive = 0;
        var perc_negative = 0;
        var perc_neutral = 0;  

        if(total!=0){
            perc_positive = 100*positive/total;
            perc_negative = 100*negative/total;
            perc_neutral = 100*neutral/total;
        }

        $("#positive").text(   perc_positive.toFixed(2)  + "%");
        $("#neutral").text(   perc_neutral.toFixed(2)  + "%");
        $("#negative").text(   perc_negative.toFixed(2)  + "%");
        
    })
    .fail(function( jqxhr, textStatus, error ){
        //fare qualcosa in caso di fallimento
    });

}


// sentimentseries
var sentimentseriesOptions = [],
    sentimentseriesCounter = 0,
    sentimentnames = ['positive', 'negative', 'neutral'];

function getSentimentTimeline(){
    
    var cont = "";

    $.each(sentimentnames, function (i, name) {

        $.getJSON("http://164.132.225.138/~hefotov/OsservatorioIA/data/sentimenttimeline" + name.toLowerCase() + ".json" , function(data){


            for(var k = 0; k<data.results.length; k++){
                data.results[k][0] = parseFloat( data.results[k][0] ) * 1000;
                data.results[k][1] = parseFloat( data.results[k][1] );
            }

            sentimentseriesOptions[i] = {
                name: name,
                data: data.results
            };

            // As we're loading the data asynchronously, we don't know what order it will arrive. So
            // we keep a counter and create the chart when all the data is loaded.
            sentimentseriesCounter += 1;

            cont = cont + "<a class='btn btn-default btn-xs' href='../api/getSentimentSeries?researches=" + reserchesstring + "&limit=" + limit + "&mode=" + mode + "&sentiment=" + name.toLowerCase() + "' target='_blank'>Export " + name.toLowerCase() + " timeseries</a> ";

            if (sentimentseriesCounter === sentimentnames.length) {
                sentimentseriescreateChart();

                $("#sentiment-export").html(cont);
            }
        });
    });
}
function sentimentseriescreateChart(){
    Highcharts.stockChart('sentiment-time', {

            rangeSelector: {
                enabled: false
            },

            yAxis: {
                labels: {
                    formatter: function () {
                        return this.value ;
                    }
                },
                plotLines: [{
                    value: 0,
                    width: 2,
                    color: 'silver'
                }]
            },

            plotOptions: {
                series: {
                    compare: 'value',
                    connectNulls: true,
                    showInNavigator: true
                }
            },

            tooltip: {
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
                valueDecimals: 2,
                split: true
            },

            series: sentimentseriesOptions
        });
}
// sentimentseries end




