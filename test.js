var rice=[];
var topodata;
var mouseX;
var mouseY;
var scale = 12500;
var type='county';
var Cname = 'C_Name';

$(document).ready(function(){

  $.getJSON( "https://raw.githubusercontent.com/TomatoPrince/test/gh-pages/rice.json", function( data ) {
      rice=data;
      init();
  });
  $.getJSON("https://raw.githubusercontent.com/TomatoPrince/test/gh-pages/county.json", function(data) {
    topodata=data;
  })
});

//開始時呼叫
var init = function(){
  
  d3.json(type+".js", function(topodata) {
     // features = topojson.feature(topodata, topodata.objects.country).features;
      // 這裡要注意的是 topodata.objects["county"] 中的 "county" 為原本 shp 的檔名

    this.topodata = topodata;

    features = topojson.feature(topodata, topodata.objects[type]).features;
    
      var path = d3.geo.path().projection( // 路徑產生器
      d3.geo.mercator().center([121,24]).scale(scale) // 座標變換函式
    );
  
    d3.select("#pathCanvas").selectAll("path").data(features).enter().append("path").attr({
      d: path,
      name: function(d){
        return d.properties[Cname];
      },
      fill:'rgb(2,202,119)'
    });
  

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
      
      $('#panel').css({"height": "20px","width": "50px"});
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

//台灣地圖資料上色
var drawTaiwan = function(type,button){
    
    if(type == "預設"){
      $('path').attr("fill",'rgb(2,202,119)');
      d3.select("svg").selectAll("path").on("mouseenter", function() {
        $('#panel').css("display","inline");
        $('#panel').css({"height": "20px","width": "50px"});
        $('#area').text("");
        $('#output').text("");
      });
    }else{
      console.log(type);

      features = topojson.feature(topodata, topodata.objects.county).features;
      var path = d3.geo.path().projection( // 路徑產生器
        d3.geo.mercator().center([121,24]).scale(scale) // 座標變換函式
      );
      
      var output = new Array();
      for(var i = 0; i < rice.length ; i++) {
        //console.log(rice.length);
          if(rice[i].稻作品項 == type){
            output[rice[i].地區別] = rice[i].收穫面積;  //把產量跟地區連結在一起例如 "嘉義市":"5128"; 
          }
      }
      for(var i=0;i<features.length;i++){  //features.length是台灣共22個縣市
        features[i].formosa=output[features[i].properties.C_Name]; //將產量寫進features
        //console.log(features[i].formosa);
      }
      
      d3.select("svg").selectAll("path").on("mouseenter", function(d,i) {
        $('#panel').css("display","inline");
        $('#panel').css({"height": "70px","width": "150px"});
        $('#title').html($(this).attr("name"));
        for(var i = 0; i < rice.length; i++){
          if(rice[i].地區別 == d.properties.C_Name && rice[i].稻作品項==type){
            console.log(rice[i].地區別+rice[i].收穫面積);
            $('#area').text("收穫面積："+rice[i].收穫面積);
            $('#output').text("產量："+rice[i].產量);
          }
        }
      });
      //colorMap = d3.scale.linear().domain([0,20000]).range(["blue","red"]);
      
      for (var i = 0; i < features.length ; i++){
        //console.log(features[i].formosa);
        $('path').each(function() {
          
          if ($(this).attr( "name" ) == features[i].properties.C_Name){
            if (features[i].formosa>=20000)
              $(this).attr("fill", '#b9b3fa');
            else if (features[i].formosa>=18000)
              $(this).attr("fill", '#e5fcc2');
            else if (features[i].formosa>=16000)
              $(this).attr("fill", '#A4EAE8');
            else if (features[i].formosa>=14000)
              $(this).attr("fill", '#bdf765');
            else if (features[i].formosa >= 12000)
              $(this).attr("fill", '#7ffe9d' );
            else if (features[i].formosa >= 10000)
              $(this).attr("fill", '#9de0ad' );
            else if (features[i].formosa >= 8000)
              $(this).attr("fill", '#52c86f' );
            else if (features[i].formosa >= 6000)
              $(this).attr("fill", '#20d2ca' );
            else if (features[i].formosa >= 4000)
              $(this).attr("fill", '#45ADA8' );
            else if (features[i].formosa >= 2000)
              $(this).attr("fill", '#3390A3' );
            else if (features[i].formosa > 0)
              $(this).attr("fill", '#547980' );
            else $(this).attr("fill", '#504f4f' );
            }
          })
      }

  }
}
