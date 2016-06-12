$(document).ready(function(){
	drawTaiwan()
});
function drawTaiwan(){

	var type='county';
	var scale = 12500;
	var Cname = 'C_Name';

	d3.json("county.json", function(topodata) {
      var features = topojson.feature(topodata, topodata.objects["county"]).features;
      // 這裡要注意的是 topodata.objects["county"] 中的 "county" 為原本 shp 的檔名
    });

	 var path = d3.geo.path().projection( // 路徑產生器
    d3.geo.mercator().center([121,24]).scale(scale) // 座標變換函式
  );
  d3.select("svg").selectAll("path").data(features)
    .enter().append("path").attr("d",path);

}