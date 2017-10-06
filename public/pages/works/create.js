(function(_) {
    function App() {

    };
    App.user = {};
    window.App = App;
    window._ = _;
})(util)
var iconConfig = [
    'u-icon-male',
    'u-icon-female'
];
// 选项卡组件
!function(App) {
    var tabsTrack = `
        <div class="tabs_track">
            <div class="tabs_thumd"></div>
        </div>`;

    function Tabs(options) {
        _.extend(this, options);
        this.index = this.index || 0;

        this.nTab = _.$('ul', this.container);
        this.nTabs = this.nTab.children;

        this.track = this._layout.cloneNode(true);
        this.nThumb = this.track.children[0];
        this.container.appendChild(this.track);

        this.init()
    }
    _.extend(Tabs.prototype, {
        init: function() {
            for (let i = 0; i < this.nTabs.length; i++) {
                this.nTabs[i].addEventListener('mouseenter', function(index) {
                    this.highLight(index);
                }.bind(this, i))
                this.nTabs[i].addEventListener('click', function(index) {
                    this.setCurrent(index)
                }.bind(this, i))
            }
            this.nTab.addEventListener('mouseleave', function() {
                this.highLight(this.index)
            }.bind(this));

            this.setCurrent(this.index);
        },
        setCurrent: function(index) {
            _.delClass(this.nTabs[this.index], 'z-active');
            this.index = index;
            _.addClass(this.nTabs[index], 'z-active');
            this.highLight(index)
        },
        highLight: function(index) {
            var tab = this.nTabs[index];
            this.nThumb.style.width = tab.offsetWidth + 'px';
            this.nThumb.style.left = tab.offsetLeft + 'px';
        },
        _layout: _.tempToNode(tabsTrack)
    })
    App.Tabs = Tabs;
}(window.App)
 //搜索
!function(App) {
    function Search(container) {
        this.nForm = container;
        this.nKeyword = _.$('input', this.nForm);

        this.init();
    }
    _.extend(Search.prototype, {
        init: function() {
            this.nForm.addEventListener('submit', this.search.bind(this));
        },
        search: function(event) {
            if (!this.nKeyword.value.trim().replace(/\s/g, ""))
                event.preventDefault()
        }
    })
    App.Search = Search;
}(window.App)
//用户组件
!function(App) {
    function UserInfo() {
        //登录注册
        this.nLogin = document.getElementById('login');
        this.nRegister = document.getElementById('register');

        this.init();
    }
    _.extend(UserInfo.prototype, {
        init: function() {
            this.nLogin.addEventListener('click', function() {
                // 解决弹出多个弹窗bug
                if (document.getElementsByClassName('m-modal')[0]) return;
                this.showLogin();

                this.modal.on('register', function() {
                    this.modal.hide();
                    this.nRegister.click();
                }.bind(this));

            }.bind(this));

            this.nRegister.addEventListener('click', function() {
                if (document.getElementsByClassName('m-modal')[0]) return;
                //注册弹窗
                new App.RegisterModal();
            }.bind(this))
        },
        showLogin: function() {
            this.modal = new App.LoginModal();

            this.modal.on('ok', function(data) {
                App.user = data;
                App.nav.initUser.call(this, data);
                this.loginCallback && this.loginCallback(data);
            }.bind(this));
        }
    })
    App.UserInfo = UserInfo;
}(window.App)
// 导航栏
!function(App) {
    var nav = {
        init: function(options) {
            options = options || {};
            this.loginCallback = options.login;

            this.hdtab = new App.Tabs({
                container: _.$("#hdtabs"),
                index: 1
            });
            this.search = new App.Search(_.$('#search'));
            // 绑定登录，注册，登出事件
            this.userInfo = new App.UserInfo();
            this.initLoginStatus();
        },
        getTabIndex: function() {

        },
        showLogin: function() {
            var userInfo = new App.UserInfo;
            userInfo.showLogin();
        },
        initLoginStatus: function() {
            _.ajax({
                method: 'get',
                url: '/api/users?getloginuser',
                data: {},
                callback: function(res) {
                    res = JSON.parse(res);
                    if (res.code === 200) {
                        this.initUser(res.result);
                        this.loginCallback(res.result);
                    }
                }.bind(this)
            })
        },
        initUser: function(data) {
            this.data = data;
            // 节点信息
            this.nGuest = document.getElementById('guest');
            this.nUser = document.getElementById('userdropdown');
            this.nName = document.getElementById('name');
            this.nSexIcon = this.nUser.getElementsByClassName('u-icon')[0];
            this.nLogout = document.getElementById('logout');
            // 隐藏登录注册按钮，显示用户信息
            _.addClass(this.nGuest, 'f-dn');
            _.delClass(this.nUser, 'f-dn');
            //设置用户姓名和性别icon
            this.nName.innerText = data.nickname;
            _.addClass(this.nSexIcon, iconConfig[data.sex])
                // 监听退出按钮
            this.nLogout.addEventListener('click', function() {
                _.ajax({
                    method: 'post',
                    url: '/api/logout',
                    callback: function() {
                        window.location.href = "index"
                    },
                    data: this.data
                })
            })
        }
    }
    App.nav = nav;
}(window.App)
// 作品上传组件
// 作品预览组件
// !function(App) {
//     function UploadImg() {

//         this.fileInput = _.$('#upload');
//         this.progressBar = _.$('progress');

//         this.maxSize = 1024 * 1024;

//         this.changeHandler();
//     }
//     _.extend(UploadImg.prototype,{
//         // 监听fileInput事件
//         changeHandler: function() {
//             var changeHandler = function(e) {
//                 var files = [].slice.call(e.target.files,0);
//                 var sizeExceedFiles = [];
//                 var sizeOKFiles = [];
//                 // 遍历files,如果大于maxsize，放入exceedfiles数组；
//                 // 否则放入sizeOKfiles数组
//                 files.forEach(function(item) {
//                     item.size > this.maxSize
//                         ? sizeExceedFiles.push(item)
//                         : sizeOKFiles.push(item);
//                 }.bind(this))
//                 this.files = sizeOKFiles;
//                 // 如果exceedfiles数组中有文件，进行弹窗提示
//                 if(!!sizeExceedFiles.length) this.showMsg(sizeExceedFiles);
//                 this.uploadFiles(sizeOKFiles);
//             }.bind(this);
//             this.fileInput.addEventListener('change',changeHandler);
//         },
//         // 文件过大提示
//         showMsg: function(badfiles) {
//             console.log(badfiles)
//             var msg = new App.Modal({
//                 title: '提示信息'
//             })
//             var tpl = `
//             <br><br>
//             文件"${badfiles[0].name}"超过1M，无法上传
//             `;
//             msg.show(tpl);
//         },
//         // 上传文件
//         uploadFiles: function(files) {
//             var progressInfo;   //进度条后边的提示信息
//             // 计算所有文件的总长度
//             this.initProgress(files);
//             // 更改样式，让用户知道正在上传文件
//             _.addClass(this.fileInput.parentNode,'z-disabled');

//             var readyStateHandler = function(e) {
//                 if(this.readyState === this.DONE) {
//                     // 将图片添加到图片列表中
//                     // 更新uploadingFileIndex的值
//                     this.upload();
//                 }
//             };
//             this.upload();
//         },
//         // 初始化进度条
//         initProgress: function(files) {
//             this.totalSize = 0;
//             files.forEach(function(item) {
//                 this.totalSize += item.size;
//             }.bind(this));
//             // 设置progressBar的value(0)和max(totalsize)
//             this.progressBar.value = 0;
//             this.progressBar.max = this.totalSize;
//         },
//         // 多文件依次上传
//         upload: function() {
//             // 定义一个数组，保存所有的请求对象
//             var uploadRequests = [];
//             var progressHandler = this.progressHandler;
//             // var resolve = this.resolve;
//             this.files.forEach(function(file) {
//                 uploadRequests.push(
//                     new Promise(function(resolve,reject) {
//                         var fd = new FormData();
//                         fd.append('file',file,file.name);
//                         console.log(file)   // 一个图片文件
//                         console.log(file.name)// xxxx.jpg
//                         var xhr = new XMLHttpRequest();
//                         xhr.addEventListener('readystatechange',function() {
//                             if(this.readyState === this.DONE) {
//                                 // resolve(JSON.parse(this.responseText).result);
//                                 resolve(this.responseText);
//                             }
//                         });
//                         xhr.upload.addEventListener('progress',progressHandler,false);
//                         xhr.open('POST','/api/works?upload');
//                         xhr.send(fd);   // 504 or 500
//                     })
//                 );
//             });
//             Promise.all(uploadRequests).then(function(data) {
//                 // 上传完毕，恢复按钮状态
//                 console.log(data)
//                 _.delClass(this.fileInput.parentNode,'z-disabled')
//             }.bind(this))
//         },
//         resolve: function(data) {
//             console.log(data)
//         },
//         progressHandler: function(e) {
//             if(e.lengthComputable) {
//                 console.log(e.total);
//                 console.log(e.loaded)
//                 // 更新progressBar的value为getLoadedSize()
//                 // 设置progressInfo, 共X个文件，正在上传y个，上传进度z%...
//             }
//         },
//         getLoadedSize: function() {
//             // 计算已经上传的资源总长度
//         },
//         // 一次性上传多张
//         /* upload2: function() {
//             var fd = new FormData();
//             files.forEach(function(file) {
//                 fd.append('file',file,file.name);
//             })
//             var xhr = new XMLHttpRequest();
//             xhr.addEventListener('readystatechange',function() {
//                 if(this.readyState === this.DONE) {
//                     var pictures = JSON.parse(this.responseText).result;
//                     // 上传单张的时候,pictures是一个对象，否则它是一个数组
//                 }
//             });
//             xhr.upload.addEventListener('progress',progressHandler,false);
//             xhr.open('POST','/api/works?upload');
//             xhr.send(fd); 
//         }, */
//         // 拖拽上传
//         drop: function() {
//             var drop = _.$('.drop');
//             drop.addEventListener('dragover',function(e) {
//                 e.preventDefault();
//                 _.addClass(this,'over');
//             });
//             drop.addEventListener('drop',function(e) {
//                 e.preventDefault;
//                 _.delClass(this,'over');
//                 console.log(e.dataTransfer.files);
//             })
//         }
//     })
//     App.UploadImg = UploadImg;
// }(window.App)
// 标签组件
!function(App) {
    function Tag(options) {
        this.options = options;
        if(!this.options.parent) {
            console.log('未传入父容器');
            return;
        }
        this.list = [];
        this.element = _.createElement('ul','m-tag');
        this.options.parent.appendChild(this.element);
        this.initList();
        this.addEvent();
        this.getRecommend();
    }
    _.extend(Tag.prototype,{
        initList: function() {
            // 创建自定义标签按钮
            this.addTag = _.createElement('li','tag tag-add');
            this.tagInput = _.createElement('input','u-inp');
            this.tagTxt = _.createElement('span','txt','+ 自定义标签');
            this.addTag.appendChild(this.tagInput);
            this.addTag.appendChild(this.tagTxt);
            this.element.appendChild(this.addTag);
            // 初始化时传入的标签
            this.add(this.options.tags);
        },
        add: function(tags) {
            var add = function (tag) {
                // 判断标签是否已存在
                if(this.list.includes(tag)) return;
                // 组装元素
                var tagEl = _.tempToNode(`
                    <li class="tag">
                        <span class="close">+</span>
                        <span>${tag}</span>
                    </li>
                `)
                this.element.insertBefore(tagEl,this.addTag);
                // 将标签存入数组
                this.list.push(tag);
            }
            // tags参数，支持单个对象，也支持数组
            if(tags && !Array.isArray(tags)) {
                tags = [tags];
            }
            (tags || []).forEach(add, this);
        },
        remove: function(tag) {
            for (var i = 0; i < this.list.length; i++) {
                if(this.list[i] === tag.innerText) {
                    // 从this.list 数组中删除
                    this.list.splice(i,1);
                    // 删除dom元素
                    this.element.removeChild(tag.parentNode)
                    // 退出循环
                    break;
                }
            }
        },
        addEvent: function() {
            var clickHandler = function(e) {
                var target = e.target;
                if(_.hasClass(target,'close')) {
                    // 调用删除方法
                    this.remove(target.nextElementSibling);
                    // target.parentNode是li
                } else if(_.hasClass(target,'txt')) {
                    // 给this.addTag添加focused类
                    _.addClass(this.addTag,'focused');
                }
            }.bind(this);
            this.element.addEventListener('click',clickHandler);

            // tag输入框失焦事件
            var inputBlurHandler = function(e) {
                this.tagInput.value = '';
                _.delClass(this.addTag,'focused');
            }.bind(this);
            // tag输入框回车事件
            var inputKeydownHandler = function(e) {
                if(e.keyCode === 13) {
                    e.preventDefault();
                    var value = this.tagInput.value.trim();
                    if(this.list.indexOf(value) === -1) {
                        // 添加这个标签
                        this.add(value);
                        this.tagInput.value = '';
                    }
                }
            }.bind(this);

            this.tagInput.addEventListener('blur',inputBlurHandler);
            this.tagInput.addEventListener('keydown',inputKeydownHandler);
        },
        getValue: function() {
            return this.list;
        },
        // 获取推荐标签
        getRecommend: function() {
            _.ajax({
                method: 'get',
                data: {},
                url: '/api/tags?recommend',
                callback: function(data) {
                    data = JSON.parse(data);
                    if(data.code === 200) {
                        this.renderRecommend(data.result);
                    }
                }.bind(this)
            })
        },
        // 渲染推荐标签
        renderRecommend: function(data) {
            data = data.split(',');
            this.recommendParent = _.createElement('ul','m-recommend');
            this.recommendTags = [];
            for (var i = 0; i < data.length; i++) {
                var tag = _.createElement('li','tag',`+${data[i]}`);
                this.recommendTags.push(data[i]);
                this.recommendParent.appendChild(tag);
            }
            this.options.parent.appendChild(this.recommendParent);
            this.addRecommendEvent();
        },
        // 推荐标签的事件
        addRecommendEvent: function() {
            var recommendClickHandler = function(e) {
                var target = e.target;
                var cont = target.innerText.replace('+','');
                // 推荐列表删除
                this.recommendTags.splice(this.recommendTags.indexOf(cont),1);
                // 节点删除
                this.recommendParent.removeChild(target);
                // 标签区添加
                this.add(cont);
            }.bind(this);
            this.recommendParent.addEventListener('click',recommendClickHandler);
        }
    })
    App.Tag = Tag;
}(window.App)
// 页面
!function(App) {
    var page = {
        init: function() {
            this.initNav();
        },
        initNav: function(argument) {
            App.nav.init({
                login: function(data) {
                    if (!App.user.username) {
                        App.user = data;
                    }
                }.bind(this)
            });
        }
    };
    document.addEventListener('DOMContentLoaded', function(e) {
        page.init();
    })
}(window.App)
// 标签组件测试
var node = _.$('.tags');
new App.Tag({
    parent: node,
    tags: ['Ego','标签组件']
})

// new App.UploadImg();

var fileInput = _.$('#upload');
var progressBar = _.$('progress');
function changeHandler(e) {
    var files = e.target.files;
    var sizeExceedFiles = [];
    var sizeOKFiles = [];
    var maxSize = 1024 * 1024;
    // 遍历files,如果大于maxsize，放入exceedfiles数组；
    // 否则放入sizeOKfiles数组
    [].slice.call(files).forEach(function(item) {
        item.size > maxSize
            ? sizeExceedFiles.push(item)
            : sizeOKFiles.push(item);
    }.bind(this))
    
    uploadFiles(sizeOKFiles);
}
fileInput.addEventListener('change',changeHandler);

function uploadFiles(files) {
    var progressInfo;   //进度条后边的提示信息
    // 计算所有文件的总长度
    initProgress(files);
    // 更改样式，让用户知道正在上传文件
    _.addClass(this.fileInput.parentNode,'z-disabled');

    var progressHandler = function(e) {
        if(e.lengthComputable) {
            // console.log(e.total);
            // console.log(e.loaded)
            // 更新progressBar的value为getLoadedSize()
            // 设置progressInfo, 共X个文件，正在上传y个，上传进度z%...
        }
    }

    var readyStateHandler = function(e) {
        if(this.readyState === this.DONE) {
            // 将图片添加到图片列表中
            // 更新uploadingFileIndex的值
            upload();
        }
    };
    upload();

    var uploadRequests = [];
    files.forEach(function(file) {
        uploadRequests.push(
            new Promise(function(resolve,reject) {
                var fd = new FormData();
                fd.append('file',file,file.name);
                var xhr = new XMLHttpRequest();
                xhr.withCredentials = true;
                xhr.addEventListener('readystatechange',function() {
                    if(this.readyState === this.DONE) {
                        resolve(this.responseText);
                    }
                });
                xhr.upload.addEventListener('progress',progressHandler,false);
                xhr.open('POST','/api/works?upload');
                xhr.send(fd);
                console.log(fd.get('file'))
            })
        )
    });
    Promise.all(uploadRequests).then(function(data) {
        console.log(data)
    })
}
function initProgress(files) {
    var totalSize = 0;
    files.forEach(function(item) {
        totalSize += item.size;
    });
    // 设置progressBar的value(0)和max(totalsize)
    progressBar.value = 0;
    progressBar.max = totalSize;
}
function upload() {

}