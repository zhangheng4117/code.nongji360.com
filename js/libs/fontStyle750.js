//移动端字体适配
(function(win, doc) {
    var h;
    win.addEventListener('resize', function() {
        clearTimeout(h);
        h = setTimeout(setUnitA, 300);
    }, false);
    win.addEventListener('pageshow', function(e) {
        if (e.persisted) {
            clearTimeout(h);
            h = setTimeout(setUnitA, 300);
        }
    }, false);
    var setUnitA = function() {
        doc.documentElement.style.fontSize = doc.documentElement.clientWidth / 37.5 + 'px';
    };
    setUnitA();
})(window, document);/**
 * Created by wuren on 2017-04-22.
 */
