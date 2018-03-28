/**
 * @purpose 多选框插件
 * @author heyaohua
 * @Copyright (c) 2016 www.nongji360.com,All Rights Reserved
 * @created 2016-07-08
 */

(function () {
    (function (e, t, n) {
        var r, i, s, c;
        s = "checkChoice";
        i = {
            checkAll:e('[data-rel=checkbox-checkAll]'),
            noCheckAll:e('[data-rel=checkbox-noCheckAll]'),
            checkInverse:e('[data-rel=checkbox-checkInverse]'),
            checkAllOrNot:e('[data-rel=checkbox-checkAllOrNot]'),
            checkbox:e('input[type=checkbox]')
        };
        r = function () {
            function t(t, n) {
                this.element = t;
                this.options = e.extend(!0, {}, i, n);
                this._defaults = i;
                this._name = s;
                this.init()
            }
            return t
        }();
        r.prototype.init = function () {
            var a = this,o=this.options;
            o.checkAll.on('click',function() {return a.checkAll();});
            o.noCheckAll.on('click',function() {return a.noCheckAll();});
            o.checkInverse.on('click',function() {return a.checkInverse();});
            o.checkAllOrNot.on('click',function() {return a.checkAllOrNot(o.checkAllOrNot);});
            return a;
        };
        r.prototype.checkAll = function (t) {
            var o = this.options;
            return o.checkbox.prop('checked',true);
        };
        r.prototype.noCheckAll = function (t) {
            var o = this.options;
            return o.checkbox.prop('checked',false);
        };
        r.prototype.checkInverse = function (t) {
            var o = this.options;
            return o.checkbox.each(function(i, e){
                $(e).prop("checked", !$(e).prop("checked"));
            });
        };
        r.prototype.checkAllOrNot = function (t) {
            var a = this,o = this.options;
            if($(t).is(":checked"))
            {
                return a.checkAll();
            }
            else
            {
                return a.noCheckAll();
            }
        };

        return e.fn[s] = function (t) {
            return e.data(this, "plugin_" + s, new r(this, t));
        }
    })(jQuery, window, document)
}).call(this);