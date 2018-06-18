var researches;

//put here the researches for which you want the dashboard
var reserchesstring;

// can be day, week, month or all
var mode = "month";

var maxn = 1;

var limit = 20000;

var language = "XXX";


$( document ).ready(function() {

  $("#messageboxcontainer").css('visibility', 'hidden');

  $("#messageboxcontainer").click(function(){
    $("#messageboxcontainer").css('visibility', 'hidden');
  });  
 
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

    $("#exportData1").attr("href","http://164.132.225.138/~hefotov/OsservatorioIA/data/relations.json" );

});


function doSomething(){

    getUserRelations(true);

}


//getUserRelations()
var ugwidth, ugheight;
var ugcolor;
var ugforce;
var ugsvg1,ugsvg;
var maxnu = 1;
function redrawusers() {
    //console.log("here", d3.event.translate, d3.event.scale);
    ugsvg.attr("transform",
        "translate(" + d3.event.translate + ")"
        + " scale(" + d3.event.scale + ")");
}
function getUserRelations(clearGraph){
        $("#user-relations").html("");
        ugwidth = $("#user-relations").width();
        ugheight = $("body").height()-25;
        $("#user-relations").height( ugheight );

        ugcolor = d3.scale.category20();

        ugforce = d3.layout.force()
          .linkDistance(40)
          .linkStrength(0.5)
          .charge(-90)
          .size([ugwidth, ugheight]);

        ugforce.drag()
          .on("dragstart", function() { d3.event.sourceEvent.stopPropagation(); });

        ugsvg1 = d3.select("#user-relations").append("svg")
          .attr("width", ugwidth)
          .attr("height", ugheight)
          .attr("pointer-events", "all");

        ugsvg = ugsvg1
          .append('svg:g')
          .call(d3.behavior.zoom().on("zoom", redrawusers))
          .append('svg:g');


          ugsvg
          .append('svg:rect')
          .attr('x', -10000)
          .attr('y', -10000)
          .attr('width', 20000)
          .attr('height', 20000)
          .attr('fill', 'white');


        /*

        Remove?

        var numero = Math.min(8,wordstats.length);
        var idstring = "";

        for(var i = 0; i<numero; i++){
          idstring = idstring + wordstats[i].id;
          if(i<(numero-1)){
            idstring = idstring + ",";
          }
        }
        */

        //
        $.getJSON("http://164.132.225.138/~hefotov/OsservatorioIA/data/relations.json")
        .done(function(data){

            var graph = data;

            var nodes = graph.nodes.slice(),
              links = [],
              bilinks = [];

            maxnu = 1;

            
            graph.links.forEach(function(link) {

                var founds = false;
                var foundt = false;
                for(var k = 0; k<nodes.length && (!founds || !foundt); k++){
                    if(nodes[k].nick==link.source){
                        founds = true;
                        link.source = k;
                    }
                    if(nodes[k].nick==link.target){
                        foundt = true;
                        link.target = k;
                    }
                }

              var s = nodes[link.source],
                  t = nodes[link.target],
                  i = {n: 1, weight: 1}; // intermediate node
              nodes.push(i);
              links.push({source: s, target: i}, {source: i, target: t});
              bilinks.push([s, i, t]);
            });


            nodes.forEach(function(node){
              node.c = +node.weight;
              if(node.c>maxn){ maxn = node.c; }
            });

            //console.log(bilinks);
            
            ugforce
              .nodes(nodes)
              .links(links)
              .start();

            
            var link = ugsvg.selectAll(".link")
              .data(bilinks)
              .enter().append("path")
              .attr("class", "link");

            var node = ugsvg.selectAll(".node")
              .data(graph.nodes);


            var nodeEnter = node
                            .enter()
                            .append("svg:g")
                            .attr("class", "node")
                            .call(ugforce.drag);

            ugsvg.selectAll(".node")
              .on("click",function(d){
                //console.log(d);
                if (d3.event.shiftKey) {
                  window.open(d.pu);
                } else {
                  var contento = "<a href='" + d.pu + "' class='treemainlink'>" + d.nick + "</a> is connected to ";
                  for(var i = 0; i<bilinks.length; i++){
                    if(bilinks[i][0].nick == d.nick ){
                      contento = contento + "<a href='" + bilinks[i][2].pu + "' class='treechildlink'>" + bilinks[i][2].nick + "</a> ";
                    } else if(bilinks[i][2].nick == d.nick ){
                      contento = contento + "<a href='" + bilinks[i][0].pu + "' class='treechildlink'>" + bilinks[i][0].nick + "</a> ";
                    }
                  }
                  $("#messagebox").html(contento);
                  $("#messageboxcontainer").css('visibility', 'visible');

                }
              });

            nodeEnter.append("circle")
              .attr("r", function(d){ return 4+(100*d.c/maxn); });
              //.style("fill", function(d) { return wgcolor(d.n); });

            var ugtexts = nodeEnter.append("svg:text")
              .attr("class", "nodetext")
              .attr("dx", function(d){  return 12; })
              .attr("dy", ".35em")
              .style("font-size",function(d){ return 4 + (40*d.c/maxn); })
              .text(function(d) { return d.nick });

            node.append("title")
              .text(function(d) { return d.nick; });

            ugforce.on("tick", function() {

              link.attr("d", function(d) {
                return "M" + d[0].x + "," + d[0].y + "S" + d[1].x + "," + d[1].y + " " + d[2].x + "," + d[2].y;
              });
              
              

              node.attr("transform", function(d) {

                var ddx = d.x;
                var ddy = d.y;
                //if(ddx<0){ddx=0;} else if(ddx>wgwidth){ddx=wgwidth;}
                //if(ddy<0){ddy=0;} else if(ddy>wgheight){ddy=wgheight;}

                return "translate(" + ddx + "," + ddy + ")";
              });
              

              //node.attr("cx", function(d) { return d.x = Math.max(radius, Math.min( wgwidth - radius, d.x)); })
              //    .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(wgheight - radius, d.y)); });

              link.attr("x1", function(d) { return d[0].x; })
                  .attr("y1", function(d) { return d[0].y; })
                  .attr("x2", function(d) { return d[1].x; })
                  .attr("y2", function(d) { return d[1].y; });

              ugtexts
                  .attr("dx", function(d) {   

                    val = 0;

                    if(d.x>ugwidth/2){
                      val = -12;// - d.n/4 - this.getComputedTextLength();
                    } else {
                      val = 12;// + d.n/4;
                    }

                    return val;

                  });


            });

        })
        .fail(function( jqxhr, textStatus, error ){
            //fare qualcosa in caso di fallimento
        });
        //
}
//getUserRelations() end






