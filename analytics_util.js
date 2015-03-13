(function(){
    var cookie=(function(){

        var pluses = /\+/g;

        function encode(s) {
            return config.raw ? s : encodeURIComponent(s);
        }

        function decode(s) {
            return config.raw ? s : decodeURIComponent(s);
        }

        function stringifyCookieValue(value) {
            return encode(config.json ? JSON.stringify(value) : String(value));
        }

        function parseCookieValue(s) {
            if (s.indexOf('"') === 0) {
                // This is a quoted cookie as according to RFC2068, unescape...
                s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
            }

            try {
                // Replace server-side written pluses with spaces.
                // If we can't decode the cookie, ignore it, it's unusable.
                // If we can't parse the cookie, ignore it, it's unusable.
                s = decodeURIComponent(s.replace(pluses, ' '));
                return config.json ? JSON.parse(s) : s;
            } catch(e) {}
        }

        function read(s, converter) {
            var value = config.raw ? s : parseCookieValue(s);
            return $.isFunction(converter) ? converter(value) : value;
        }

        var config  = function (key, value, options) {

            // Write

            if (value !== undefined && !$.isFunction(value)) {
                options = $.extend({}, config.defaults, options);

                if (typeof options.expires === 'number') {
                    var days = options.expires, t = options.expires = new Date();
                    t.setTime(+t + days * 864e+5);
                }

                return (document.cookie = [
                    encode(key), '=', stringifyCookieValue(value),
                    options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                    options.path    ? '; path=' + options.path : '',
                    options.domain  ? '; domain=' + options.domain : '',
                    options.secure  ? '; secure' : ''
                ].join(''));
            }

            // Read

            var result = key ? undefined : {};

            // To prevent the for loop in the first place assign an empty array
            // in case there are no cookies at all. Also prevents odd result when
            // calling $.cookie().
            var cookies = document.cookie ? document.cookie.split('; ') : [];

            for (var i = 0, l = cookies.length; i < l; i++) {
                var parts = cookies[i].split('=');
                var name = decode(parts.shift());
                var cookie = parts.join('=');

                if (key && key === name) {
                    // If second argument (value) is a function it's a converter...
                    result = read(cookie, value);
                    break;
                }

                // Prevent storing a cookie that we couldn't decode.
                if (!key && (cookie = read(cookie)) !== undefined) {
                    result[name] = cookie;
                }
            }

            return result;
        };

        config.defaults = {};


        return config;
    }());

    var storage;
    if(window.localStorage){
        storage=function(key,value){
            if(value==null){
                return localStorage.getItem(key);
            }else{
                localStorage.setItem(key,value);
            }
        };
    }else{
        storage=cookie;
    }

    function send(type,action){
        if(window.ga){
            window.ga('send', 'event',type,action);
        }
        if(window._hmt){
            window._hmt.push(['_trackEvent',type,action]);
        }
    }
    function build(jele){
        var key='ga';
        var arr=[];
        while(true){
            var attr=jele.attr(key);
            key='gap';
            if(attr){
                var gaps=attr.split('|');
                arr.unshift(gaps);

                if(gaps[0][0]==='^'){
                    gaps[0]=gaps[0].slice(1);
                    break;
                }
            }

            jele=jele.parent();
        }
        // 展开数组
        var res=[];
        for (var i = 0; i < arr.length; i++) {
            var _gaps=arr[i];
            for (var j = 0; j < _gaps.length; j++) {
                res.push(_gaps[j]);
            }
        }
        // 下个页面发
        res=res.join('　');
        var pending=res[res.length-1]==='$';
        if(pending){
            res=res.slice(0,-1);
        }
        return [pending,res];
    }
    $(function() {
        var jbody = $('body');
        var pageName = jbody.attr('gap');
        if (pageName) {
            pageName=pageName.replace(/^\^/,'');
        }else{
            pageName=document.title;
        }
        jbody.attr('gap','^'+pageName);
        send('PV','PV　'+pageName);

        
        jbody.on('mousedown', '[ga]', function() {
            var data=build($(this));
            var pending=data[0];
            var action=data[1];

            if(pending){
                // 暂缓发送
                storage('ga',action);
            }else{
                // 立即发送
                send('click',action);
            }
        });

        var action=storage('ga');
        if (action) {
            storage('ga','');
            send('click',action);
        }
    });
}());