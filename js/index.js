/**
 * Created by Administrator on 2016/9/21.
 */
//通用函数
function g(selector){
    var method = selector.substr(0,1) =='.' ? 'getElementsByClassName':'getElementById';
    return document[method](selector.substr(1));
}

//随机数发生器 0-20 random([min,max])
function random(range){
    var max = Math.max(range[0], range[1]);
    var min = Math.min(range[0], range[1]);
    var diff = max - min;
    var number = Math.floor(Math.random() * diff + min);
    return number;
}

//输出所有海报
var data = data;
function addPhotos(){
    var template = g('#warp').innerHTML;
    var html = [];
    var nav = [];
    for(var s in data){
        //替换关键字
        var _html = template
            .replace('{{index}}',s)
            .replace('{{img}}',data[s].img)
            .replace('{{caption}}',data[s].caption)
            .replace('{{desc}}',data[s].desc);
        html.push(_html);
        nav.push('<span id="nav_' + s + '" class="i"  onclick = "turn(g(\'#photo_' + s + '\'))"></span>')
    }
    html.push('<div class="nav">' + nav.join('') + '</div>');
    //输出到页面，数组到字符串
    g('#warp').innerHTML = html.join('');
    rsort(random([0,data.length]));
}
addPhotos();

//计算左右分区的范围
function range(){
    var range = {
        left:{
            x:[],
            y:[]
        },
        right:{
            x:[],
            y:[]
        }
    };
    var warp = {
        w:g("#warp").clientWidth,
        h:g("#warp").clientHeight
    };

    var photo = {
        w:g(".photo")[0].clientWidth,
        h:g(".photo")[0].clientHeight
    };
    range.warp = warp;
    range.photo = photo;

    range.left.x = [ 0-photo.w , warp.w/2-photo.w ];
    range.left.y = [ 0-photo.h , warp.h ];

    range.right.x = [ warp.w/2+photo.w/2 , warp.w ];
    range.right.y = range.left.y;

    return range;
}

//排序海报
function rsort(n){
    var _photo = g(".photo");
    var photos = [];
    //初始化所有海报样式
    for(s = 0 ; s < _photo.length ; s++){
        _photo[s].className = _photo[s].className.replace(/\s*photo-center\s*/," ");
        _photo[s].className = _photo[s].className.replace(/\s*photo-front\s*/," ");
        _photo[s].className = _photo[s].className.replace(/\s*photo-back\s*/," ");
        _photo[s].className += 'photo-front';
        _photo[s].style.left="";
        _photo[s].style.top="";
        _photo[s].style['-webkit-transform']='rotate(0deg) scale(1.3)';
        //转化为数组
        photos.push(_photo[s]);
    }
    var photo_center = g("#photo_"+n);
    photo_center.className +=" photo-center ";
    //从数组中删除中间海报
    photo_center = photos.splice(n,1)[0];
    //剩下海报分为左右两个部分
    var photo_left = photos.splice(0,Math.ceil(photos.length/2));
    var photo_right = photos;
    //分配海报
    var ranges = range();
    for(var s in photo_left){
        var photo = photo_left[s];
        //位置
        photo.style.left = random(ranges.left.x) + 'px';
        photo.style.top = random(ranges.left.y) + 'px';
        //角度
        photo.style['-webkit-transform'] = 'rotate('+random([-150,150])+'deg) scale(1)';
    }
    for(var s in photo_right){
        var photo = photo_right[s];
        photo.style.left = random(ranges.right.x) + 'px';
        photo.style.top = random(ranges.right.y) + 'px';
        photo.style['-webkit-transform'] = 'rotate('+random([-150,150])+'deg) scale(1)';
    }

    //按钮对应样式,控制按钮
    var navs = g('.i');
    for (var i = 0; i < navs.length; i++) {
        navs[i].className = navs[i].className.replace(/\s*i_current\s*/,' ');
        navs[i].className = navs[i].className.replace(/\s*i_back\s*/,' ');
    }
    g('#nav_'+n).className += ' i_current ';
}

//点击翻面函数
function turn(elem){
    var cls = elem.className;
    var n = elem.id.split('_')[1];
    if( !/photo-center/.test(cls) ){
        return rsort(n);
    }
    if(/photo-front/.test(cls)){
        cls = cls.replace(/photo-front/, 'photo-back');
        g('#nav_'+n).className += 'i_back';
    }
    else{
        cls = cls.replace(/photo-back/, 'photo-front');
        g('#nav_'+n).className = g('#nav_'+n).className.replace(/\s*i_back\s*/, ' ');
    }
    return elem.className = cls;
}
