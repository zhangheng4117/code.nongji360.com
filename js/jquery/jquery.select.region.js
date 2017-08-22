/**
 * @purpose 下拉裂变
 * @author heyaohua
 * @Copyright (c) 2016 www.nongji360.com,All Rights Reserved
 * @created 2016-04-29
 */
/**
 * 排序及地区样式化
 * @obj obj（ul对象），type(data的key)，value, region(是否是地区连级)，ani地区动画效果
 * */
/*
* style-bg选择的样式,其他的为弹窗框的样式可以改动，弹窗
* */
function formatOrder(obj) {
    var $obj = obj.obj;
    $obj.empty();
    $obj.append('<li><div data-'+obj.type+'="" class="style-bg">全部</li></div>');
    for(var i=0;i< obj.value.length;i++) {
        var value = obj.value[i];
        var _val = value.n;
        var $li = '<li><div data-'+obj.type+'="'+value.i+'">' + _val + '</div></li>';
        $obj.append($li);
    }
    if(obj.ani) {
        $obj.animate(50,function(){
            $obj.animate({width:"show"},100,function() {
                $obj.scrollTop("0");
            })
        });
    }
}
function sortSelect(e){
    var $this = $(this);
    e.preventDefault();
    if(!$this.hasClass("style-bg")){
        $this.closest("ul").find("li").each(function(i,e) {
            $(e).find("div").eq(0).removeClass("style-bg");
        });
        $this.addClass("style-bg");
        var _list = null;
        if($this.closest("ul").hasClass("classification-province")) {
            $this.closest(".classification-inner-content").removeClass("classification-content-city").removeClass("classification-content-village");
            if($this.text() != "全部") {
                var index = $this.closest("li").index(), $city = $this.closest("ul").next();
                _list = province[index-1];
                if(_list.c != null) {
                    $this.closest(".classification-inner-content").addClass("classification-content-city");
                    var _city = {
                        obj : $city,
                        type : "region_id3",
                        value : _list.c,
                        region : true,
                        ani : true
                    };
                    formatOrder(_city);
                }
                _paramsJSON.region_id2 = $this.data('region_id2');
                _paramsJSON.list = _list.c;
            } else {
                _paramsJSON.region_id2 = "";
                _paramsJSON.list = province;
            }
        }
    } else {
        if($this.text() == "全部") {
            _paramsJSON.region_id2 = "";
            _paramsJSON.region_id3 = "";
            _paramsJSON.list = province;
        }
    }
    console.log(_paramsJSON.list);
}
function sortSelectCity(e) {
    var $this = $(this),$target = $(e.target),$province = $(".classification-province");
    if(!$target.hasClass("style-bg") && $target[0].tagName != 'UL') {
        $this.find("li").each(function(i,e) {
            $(e).find("div").eq(0).removeClass("style-bg");
        });
        $target.addClass("style-bg");
        var _index = $province.find(".style-bg").closest("li").index();
        var index1 = $target.closest("li").index();
        $(".region").addClass("select-active").text($target.text() == "全部" ? $province.find(".style-bg").text() : $target.text());
        if(index1 > 0) {
            var _list = province[_index-1].c[index1 - 1];
            _paramsJSON.region_id3 = $target.data('region_id3');
            _paramsJSON.list = _list.c;
        } else {
            var _list = province[_index-1];
            _paramsJSON.region_id3 = "";
            _paramsJSON.list = _list.c;
        }
    } else {
        var _index = $province.find(".style-bg").closest("li").index();
        if($target.text() == "全部") {
            _paramsJSON.region_id3 = "";
            _paramsJSON.list = province[_index-1].c;
        }
    }
    console.log(_paramsJSON.list);
}
var _paramsJSON = {
    region_id2:'',
    region_id3:'',
    list:null
};
var province = regionLibs[0].c;
var _province = {
    obj : $(".classification-inner-content:eq(0) ul:eq(0)"),
    type : "region_id2",
    value : province,
    region : true,
    ani : false
};
formatOrder(_province);

