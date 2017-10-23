var util = (function() {
    return {
        // 选择器
        $: function(selector, node) {
            return (node || document).querySelector(selector);
        },
        // 字符串转模板
        tempToNode: function(str) {
            var cont = document.createElement('div');
            cont.innerHTML = str;
            return cont.children[0];
        },
        // 拷贝对象(原型扩展)
        extend: function(o1, o2) {
            for (var i in o2) {
                if (typeof o1[i] === 'undefined') o1[i] = o2[i];
            }
        },
        // Ajax相关
        // URL添加后缀
        serialize: function(url,data) {
            if(!data) return url;
            for (var name in data) {
                if (!data.hasOwnProperty(name)) continue;
                if (typeof data[name] === 'function') continue;
                var value = data[name].toString();
                name = encodeURIComponent(name);
                value = encodeURIComponent(value);
                url += (url.indexOf("?") == -1 ? "?" : "&");
                url += name + "=" + value;
            }
            return url;
        },
        setRequestHeader: function(xhr,item,value) {
            if(!value) return;
            xhr.setRequestHeader('Content-Type', value)
        },
        //ajax调用
        //参数：method:'get',//设置方法
        //     url:'http://localhost:3000',//设置地址
        //     callback:function(res){//设置回调函数
        //        alert(res)
        //     },
        //     data: data//需要传递的数据
        //     ContentType: //自定义请求头
        ajax: function(obj) {
            var xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        obj.callback(xhr.responseText);
                    } else {
                        if(obj.error)  obj.error(xhr.responseText);
                        console.log('错误代码：' + xhr.responseText);
                    }
                }
            }
            if (obj.method.toUpperCase() === 'GET') { //如果是get方法，需要把data中的数据转化作为url传递给服务器
                obj.url = this.serialize(obj.url, obj.data)
                xhr.open(obj.method, obj.url, true);
                this.setRequestHeader(xhr, 'Content-Type', obj.ContentType);
                xhr.send(null);
            } else if (obj.method.toUpperCase() === 'POST') {
                xhr.open(obj.method, obj.url, true);
                this.setRequestHeader(xhr, 'Content-Type', obj.ContentType);
                // obj.ContentType ?
                //     xhr.setRequestHeader('Content-Type', obj.ContentType) :
                //     xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.send(JSON.stringify(obj.data));
            } else if(obj.method.toUpperCase() === 'DELETE') {
                xhr.open(obj.method, obj.url, true);
                this.setRequestHeader(xhr, 'Content-Type', obj.ContentType);
                xhr.send(null);
            } else if(obj.method.toUpperCase() === 'PATCH') {
                xhr.open(obj.method, obj.url, true);
                this.setRequestHeader(xhr, 'Content-Type', obj.ContentType);
                xhr.send(JSON.stringify(obj.data));
            } else {
                console.log('不识别的方法:' + obj.method);
                return fasle;
            }
        },
        // 添加/删除/查询类名
        addClass: function(node, className) {
            var current = node.className || '';
            if ((' ' + current + ' ').indexOf(' ' + className + ' ') === -1) {
                node.className = current ? (current + ' ' + className) : className;
            }
        },
        delClass: function(node, className) {
            var current = node.className || '';
            node.className = (' ' + current + ' ').replace(' ' + className + ' ', ' ').trim();
        },
        hasClass: function(elem, cls) {
            cls = cls || '';
            if (cls.replace(/\s/g, '').length == 0) return false;
            return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
        },
        // 添加节点
        createElement: function(node,klass,inner) {
            var node = document.createElement(node);
            if(!!klass) this.addClass(node,klass);
            if(!!inner) node.innerHTML = inner;
            return node;
        },
        emitter: {
            //注册事件
            on: function(e, fn) {
                var handles = this._handles || (this._handles = {}),
                    calls = handles[e] || (handles[e] = []);
                calls.push(fn);
                return this;
            },
            //注销事件
            off: function(e, fn) {
                if (!e || !this._handles) this._handles = {};
                if (!this._handles) return;
                var handles = this._handles,
                    calls;
                if (calls = handles[e]) {
                    if (!fn) {
                        handles[e] = [];
                        return this;
                    }
                    for (var i = 0; i < calls.length; i++) {
                        // console.log(fn === calls[i])//false
                        // if(fn === calls[i]) {
                        calls.splice(i, 1);
                        calls.push(fn);
                        return this;
                        // }
                    }
                }
                return this;
            },
            //触发事件
            emit: function(e) {
                var args = [].slice.call(arguments, 1),
                    handles = this._handles,
                    calls;
                if (!handles || !(calls = handles[e])) return this;
                //触发listeners
                for (var i = 0; i < calls.length; i++) {
                    calls[i].apply(this, args)
                }
                return this;
            }
        }
    }
})()