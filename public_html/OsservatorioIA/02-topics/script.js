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

    $("#exportData1").attr("href","http://164.132.225.138/~hefotov/OsservatorioIA/data/hashtagCloud.json" );

});


function doSomething(){

    getTopics(true);

}


//getTopics()
function getTopics( clearGraph ){
    var tcbleed, tcwidth, tcheight;
        var tcpack;
        var tcsvg;

        tcbleed = 100;
        tcwidth = $("#topics").width();
        tcheight = $("body").height()-25;
        $("#topics").height(tcheight);

            tcpack = d3.layout.pack()
            .sort(null)
            .size([tcwidth, tcheight + tcbleed * 2])
            .padding(2);

            tcsvg = d3.select("#topics").append("svg")
            .attr("width", tcwidth)
            .attr("height", tcheight)
            .append("g")
            .attr("transform", "translate(0," + -tcbleed + ")");


    $.getJSON("http://164.132.225.138/~hefotov/OsservatorioIA/data/hashtagCloud.json")
    .done(function(data){

        //console.log(data);


              var node = tcsvg.selectAll(".node")
                .data(tcpack.nodes(data)
                .filter(function(d) { return !d.children; }))
                .enter().append("g")
                .attr("class", "node")
                .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

              node.append("circle")
                .attr("class" , "tccircle")
                .attr("r", function(d) { return d.r; });

              node.append("text")
                .text(function(d) { return d.name; })
                .attr("class" , "tctext")
                .style("font-size", function(d) { var vv = (2 * d.r - 8) / this.getComputedTextLength() * 24; if(vv<0){vv=0;} var v = Math.min(2 * d.r, vv); if(v<0){v=0;} return v + "px"; })
                .attr("dy", ".35em");




                var cont = "<a href='http://164.132.225.138/~hefotov/HEv3/api/getHashtagCloud?researches=" + reserchesstring + "&limit=" + (limit*2) +  "&language=" + language + "&mode=" + mode + "' target='_blank' class='btn btn-default btn-xs'>Export</a>";
                $("#topics-export").html(cont);

        
    })
    .fail(function( jqxhr, textStatus, error ){
        //fare qualcosa in caso di fallimento
    });
}
//getTopics() end








