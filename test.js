var rice=[];
var mouseX;
var mouseY;

$(document).ready(function(){
  $.getJSON( "https://raw.githubusercontent.com/TomatoPrince/test/gh-pages/rice.json", function( data ) {
      rice=data;
      drawTaiwan();
  });
});


function drawTaiwan(){

  //console.log(rice.length);
  var type='county';
  var scale = 12500;
  var Cname = 'C_Name';
  var map_croptype=document.getElementById("map_croptype").value;

  d3.json(type+".js", function(topodata) {
     // features = topojson.feature(topodata, topodata.objects.country).features;
      // 這裡要注意的是 topodata.objects["county"] 中的 "county" 為原本 shp 的檔名

  this.topodata = topodata;

  features = topojson.feature(topodata, topodata.objects[type]).features;
  
    var path = d3.geo.path().projection( // 路徑產生器
    d3.geo.mercator().center([121,24]).scale(scale) // 座標變換函式
  );
    /*
  d3.select("#pathCanvas").selectAll("path").data(features).enter().append("path").attr({
    d: path,
    name: function(d){
      return d.properties[Cname];
    },
    fill:'rgb(2,202,119)'
 });*/

  
    //寫入稻米
    var output = new Array();
    for(var i = 0; i < rice.length ; i++) {
        if(rice[i].稻作品項 == map_croptype){
          output[rice[i].地區別] = rice[i].產量;  //把產量跟地區連結在一起例如 "嘉義市":"5128";
          //console.log(output["嘉義市"]);
        }
    }
    for(var i=0;i<features.length;i++){  //features.length是台灣共22個縣市
      features[i].formosa=output[features[i].properties.C_Name]; //將產量寫進features
    }

    colorMap = d3.scale.linear().domain([0,200000]).range(["blue","red"]);
    d3.select("#pathCanvas").selectAll("path").data(features).enter().append("path").attr(
      "fill", function(d){
        return colorMap(d.formosa);
      }).attr("d",path);
//縣市/行政區界線
    d3.select("#pathCanvas").append("path")         
    .datum(topojson.mesh(topodata, topodata.objects[type], function(a, b) { return a !== b ; }))
    .attr("d", path)
    .attr("id", "county-boundary");

//滑鼠移入的效果
    d3.select("svg").selectAll("path").on("mouseenter", function() {          //title div 顯示滑鼠所指向的縣市/行政區
     $('#panel').css("display","inline");
      //$(this).attr("fill", 'rgb(255,184,219)');
      $('#title').html($(this).attr("name"));
      $('#panel').css({"height": "50px","width": "50px"});
    }).on("mouseout", function() {
      //$(this).attr("fill", 'rgb(2,202,119)');
      $('#panel').css('display','none');
    });
//info 區塊跟隨滑鼠移動
    $("path").mouseover(function(){      
      $("path").mousemove( function(e) {
       mouseX = e.pageX; 
       mouseY = e.pageY;
      });  
      $('#panel').css({'top':mouseY,'left':mouseX});  //拿掉淡入.fadeIn('slow')
    });
});

}
