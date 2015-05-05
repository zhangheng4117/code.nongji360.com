/**
 *
 * @param l_box_width 大图外围div宽度
 * @param s_box_width 小图导航外围div宽度
 * @param swidth      小图宽度
 * @param sheight     小图高度
 * @param border      当前小图边框宽度, 需要在css的current样式中，也相应的加以修改
 */
function slider(l_box_width, s_box_width, swidth, sheight, border)
{
    var len = $(".slider_con li").length;  //图片总个数
    var index = 0; //初始化序列号
    var scroll_width = swidth+2*border; //移动的最小宽度
    var show_num = Math.floor(s_box_width/scroll_width); //能够完整显示的小图个数


    $("#slider_img_box").css('width',l_box_width); //设置图片外围div宽度
    $("#slider_img_box li img").css('width',l_box_width); //设置图片宽度，与外围div宽度相同
    $(".slider_con").css('width',l_box_width * len); //设置包裹图片的ul的总长度

    $("#simg_box").css('width', s_box_width); //设置包裹小图的外围div宽度
    $("#simg_box").css('height', sheight + 4*border); //设置包裹小图的外围div高度
    $(".slider_nav").css('width', (swidth + 3*border)*len); //设置小图ul总宽度
    $(".slider_nav li").css('width', swidth);   //小图宽度
    $(".slider_nav li").css('height', sheight); //小图高度

    /*点击小图，切换大图*/
    $(".slider_nav li").click(function() {
        index = $(this).index();
        showPics(index);
    });

    // Prev 点击左箭头
    $(".btn_left").click(function() {
        if(!$(".slider_con").is(':animated'))
        {
            index -= 1;
            if(index == -1) {index = len - 1;} //如果是第一张图片，点击之后，跳转到最后一张图片
            showPics(index);
        }
    });

    // Next 点击右箭头
    $(".btn_right").click(function() {
        if(!$(".slider_con").is(':animated'))
        {
            index += 1;
            if(index == len) {index = 0;} //如果是最后一张图片，点击之后，跳转到第一张图片
            showPics(index);
        }
    });


    $(".Left").click(function(){

        var turnL = parseInt($(".slider_nav").css('margin-left')) || 0;

        if(turnL == 0 && len > show_num)
        {
            if(!$(".slider_nav").is(':animated'))
            {
                $(".slider_nav").stop(true,false).animate({'margin-left': -scroll_width*len + show_num * scroll_width + 'px' });
            }
        }
        else
        {
            if(len > show_num)
            {
                if(!$(".slider_nav").is(':animated'))
                {
                    $(".slider_nav").stop(true,false).animate({'margin-left': turnL+scroll_width+'px' });
                }
            }
        }

    });
    $(".Right").click(function(){
        var turnL = parseInt($(".slider_nav").css('margin-left')) || 0;

        if(scroll_width * len + turnL <= scroll_width * show_num)
        {
            if(!$(".slider_nav").is(':animated'))
                $(".slider_nav").stop(true,false).animate({'margin-left': 0});
        }
        else
        {
            if(!$(".slider_nav").is(':animated'))
                $(".slider_nav").stop(true,false).animate({'margin-left': turnL -scroll_width});
        }

    });


    // showPics
    function showPics(index) {

        var nowLeft = -index*l_box_width;   //大图移动宽度
        var total = (swidth+2*border)*len;  //小图总宽度（包含边框、margin）
        var leftLen = parseInt($(".slider_nav").css('margin-left')) || 0; //小图左侧隐藏宽度
        var count = -leftLen / scroll_width;    //计算左边隐藏的个数

        /*大图滚动*/
        if(!$(".slider_con").is(':animated'))
        {
            $(".slider_con").stop(true,false).animate({margin:'0 0 0 '+nowLeft+'px'});
            $(".slider_nav li").removeClass("current").eq(index).addClass("current");
        }


        /*文字切换*/
        $("#summary").find('p:eq('+index+')').show();
        $("#summary").find('p:eq('+index+')').siblings('p').hide();

       // alert(((index+1)*scroll_width + leftLen) + '  || '+(scroll_width * show_num));

        if(index+1 == count && len > show_num)
        {
            if(!$(".slider_nav").is(':animated'))
            {
                $(".slider_nav").stop(true,false).animate({margin:'0 0 0 '+(leftLen+scroll_width)+'px'});
            }
        }
        else if(index == len-1 && len > show_num)
        {
            if(!$(".slider_nav").is(':animated'))
                $(".slider_nav").stop(true,false).animate({margin:'0 0 0 '+(-total + show_num * scroll_width)+'px' });
        }
        else if(( (index+1)*scroll_width + leftLen) > (scroll_width * show_num) && len > show_num )
        {
            if(!$(".slider_nav").is(':animated'))
            {
                $(".slider_nav").stop(true,false).animate({margin:'0 0 0 '+(leftLen-scroll_width)+'px' });
            }
        }
        else if(index == 0 && len > show_num)
        {
            if(!$(".slider_nav").is(':animated'))
                $(".slider_nav").stop(true,false).animate({margin: 0 });
        }
    }
}