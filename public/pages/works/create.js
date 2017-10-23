(function(_) {
    function App() {

    };
    App.user = {};
    App.imgData = {
        data: [],
        coverImg: {
            id: null,
            url: null
        }
    };
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
            this.initLoginStatus();
        },
        getTabIndex: function() {

        },
        initLoginStatus: function() {
            _.ajax({
                method: 'get',
                url: '/api/users?getloginuser',
                data: {},
                callback: function(res) {
                    res = JSON.parse(res);
                    if (res.code === 200) {
                        App.user = res.result;
                        this.initUser(res.result);
                        this.loginCallback(res.result);
                    } else {
                        window.location.href = "../index";
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
            //设置用户姓名和性别icon
            this.nName.innerText = data.nickname;
            _.addClass(this.nSexIcon, iconConfig[data.sex])
                // 监听退出按钮
            this.nLogout.addEventListener('click', function() {
                _.ajax({
                    method: 'post',
                    url: '/api/logout',
                    callback: function() {
                        window.location.href = "../index";
                    },
                    data: this.data
                })
            })
        }
    }
    App.nav = nav;
}(window.App)
// 图片上传及预览
!function(App) {
    function UploadImg() {

        this.fileInput = _.$('#upload');
        this.progressBar = _.$('progress');
        this.progressInfo = _.$('#progressInfo');

        this.maxSize = 1024 * 1024;

        this.changeHandler();
    }
    _.extend(UploadImg.prototype,{
        // 监听fileInput事件
        changeHandler: function() {
            var changeHandler = function(e) {
                var files = [].slice.call(e.target.files,0);
                if(files.length > 10) {
                    var msg = new App.Modal({
                        title: '提示信息'
                    });
                    var tpl = `
                    <br><br>
                    文件数量多于10张，，无法上传
                    `;
                    msg.show(tpl);
                    return;
                }
                var sizeExceedFiles = [];
                var sizeOKFiles = [];
                // 遍历files,如果大于maxsize，放入exceedfiles数组；
                // 否则放入sizeOKfiles数组
                files.forEach(function(item) {
                    item.size > this.maxSize
                        ? sizeExceedFiles.push(item)
                        : sizeOKFiles.push(item);
                }.bind(this))
                this.files = sizeOKFiles;
                // 如果exceedfiles数组中有文件，进行弹窗提示
                if(!!sizeExceedFiles.length) {
                    this.showMsg(sizeExceedFiles);
                    return;
                } 
                this.uploadFiles(sizeOKFiles);
            }.bind(this);
            this.fileInput.addEventListener('change',changeHandler);
        },
        // 文件过大提示
        showMsg: function(badfiles) {
            var msg = new App.Modal({
                title: '提示信息'
            })
            var tpl = `
            <br><br>
            文件"${badfiles[0].name}"超过1M，无法上传
            `;
            msg.show(tpl);
        },
        // 上传文件流程
        uploadFiles: function(files) {
            this.sizeOKFiles = files;
            // 计算所有文件的总长度
            this.initProgress(files);
            // 更改样式，让用户知道正在上传文件
            _.addClass(this.fileInput.parentNode,'z-disabled');

            var readyStateHandler = function(e) {
                if(this.readyState === this.DONE) {
                    // 将图片添加到图片列表中
                    // 更新uploadingFileIndex的值
                    this.upload();
                }
            };
            this.upload();
        },
        // 进度条的控制
        initProgress: function(files) {
            if(!files) {
                _.addClass(this.progressBar,'f-dn');
                return;
            }
            // 显示进度条
            _.delClass(this.progressBar,'f-dn')
        },
        // 多文件依次开始上传
        upload: function() {
            // 定义一个数组，保存所有的请求对象
            var uploadRequests = [];
            this.uploadNth = 0;
            var progressHandler = this.progressHandler.bind(this);

            this.files.forEach(function(file) {
                // return;
                uploadRequests.push(
                    new Promise(function(resolve,reject) {
                        var fd = new FormData();
                        fd.append('file',file,file.name);
                        var xhr = new XMLHttpRequest();
                        xhr.addEventListener('readystatechange',function() {
                            if(this.readyState === this.DONE) {
                                if(xhr.status === 200) {
                                    // 上传成功执行回调 
                                    resolve(this.responseText);
                                } else {
                                    reject(this.responseText)
                                }
                            }
                        });
                        // 上传过程中监听事件 
                        xhr.upload.addEventListener('progress',progressHandler,false);
                        xhr.open('POST','/api/works?upload');
                        xhr.send(fd);
                    })
                );
            });
            Promise.all(uploadRequests).then(
                function(data) {
                    // 上传完毕，恢复按钮状态
                    _.delClass(this.fileInput.parentNode,'z-disabled');
                    // 恢复进度条信息为空
                    setTimeout(function() {
                        this.initProgress();
                        this.progressInfo.innerHTML = '上传成功，您可以继续上传~';
                    }.bind(this), 800);
                    // 保存图片信息
                    var num = 0;
                    data.forEach(function(item) {
                        var imgData = {};
                        var data = JSON.parse(item).result;
                        imgData.id = data.id;
                        imgData.name = data.name;   
                        imgData.url = data.url;
                        imgData.position = num;   
                        imgData.worksId = data.worksId; 
                        imgData.creatorId = data.creatorId; 
                        imgData.createTime = data.createTime;
                        imgData.updateTime = data.updateTime;
                        // 添加到预览列表
                        this.appendPreview(imgData);
                        // 添加图片信息到缓存
                        App.imgData.data.push(imgData);
                        num++;
                    }.bind(this));
                }.bind(this),
                function(data) {
                    // 上传失败
                    _.delClass(this.fileInput.parentNode,'z-disabled');
                    this.progressInfo.innerHTML = '啊哦~！上传失败了，服务器君出了点状况...';
                }.bind(this)
            )
        },
        // 更新进度条及提示信息 
        progressHandler: function(e) {
            if(e.lengthComputable) {

                // 更新progressBar
                this.progressBar.value = e.loaded;
                this.progressBar.max = e.total;

                // 更新上传进度信息
                var percent = parseInt((this.progressBar.value / this.progressBar.max) * 100);
                this.uploadNth = Math.ceil(this.sizeOKFiles.length * (e.loaded / e.total))
                var html = `
                    <span>共 ${this.sizeOKFiles.length} 个文件，正在上传第 ${this.uploadNth} 个，上传进度 ${percent}%...</span>
                `;
                this.progressInfo.innerHTML = html;
            }
            
        },
        // 作品预览
        appendPreview: function(data) {
            var data = data;
            var html = _.tempToNode(
                `
                <li class="item">
                    <img src=${data.url} alt="作品预览">
                    <span class="u-btn f-setcover">设为封面</span>
                    <i class="u-icon u-icon-delete"></i>
                </li>`
            );
            _.$('.m-preview').appendChild(html);
            // 设置设为封面事件
            var setCoverImg = this.setCoverImg;
            _.$('.f-setcover',html).addEventListener('click',function() {
                setCoverImg(data);  // 更新封面信息到缓存
                var all = [].slice.call(document.getElementsByClassName('f-setcover'));
                all.forEach(function(item) {
                    item.innerHTML = '设为封面';
                    _.delClass(item,'z-select')
                })
                this.innerHTML = '已设为封面';
                _.addClass(this,'z-select')
            });
        },
        // 更新封面信息
        setCoverImg: function(data) {
            App.imgData.coverImg.id = data.id;
            App.imgData.coverImg.url = data.url;
        }
        /* // 拖拽上传示例
        drop: function() {
            // var drop = _.$('.drop');
            var drop = _.$('#preview');
            console.log(drop)
            drop.addEventListener('dragover',function(e) {
                e.preventDefault(); console.log(1)
                _.addClass(this,'over');
            });
            drop.addEventListener('drop',function(e) {
                e.preventDefault;
                _.delClass(this,'over');    console.log(2)
                console.log(e.dataTransfer.files);
            })
        } */
    })
    App.UploadImg = UploadImg;
}(window.App)
// 标签组件
!function(App) {
    var template = `
        <div>
            <div class="u-formitem">
                <label>标签</label>
                <ul class="m-tag"></ul>
            </div>
            <div class="u-formitem">
                <label class="f-green">推荐标签</label>
                <ul class="m-recommend"></ul>
            </div>
        </div>
    `
    function Tag(options) {
        // 参数
        this.options = options;
        if(!this.options.parent) {
            console.log('未传入父容器');
            return;
        }
        this.list = [];
        // 节点
        this.node = _.tempToNode(template);
        this.element = _.$('.m-tag',this.node);
        this.options.parent.appendChild(this.node);
        // 初始化
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
                        <span class="tag_name">${tag}</span>
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
            this.recommendParent = _.$('.m-recommend',this.node);
            this.recommendTags = [];
            for (var i = 0; i < data.length; i++) {
                var tag = _.createElement('li','tag',`+${data[i]}`);
                this.recommendTags.push(data[i]);
                this.recommendParent.appendChild(tag);
            }
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
// 下拉列表组件
!function(App) {
    var template = `
        <div class="m-select">
            <div class="select_hd">
                <div class="formitem_ct">
                    <span class="select_val"></span>
                    <span class="u-icon-dropdown"></span>
                </div>
            </div>
            <ul class="select_opt f-dn"> </ul>
        </div>`;

    function Select(options) {
        _.extend(this, options);
        this.body = _.tempToNode(template);
        // 节点...
        this.nOption = this.body.getElementsByClassName('select_opt')[0];
        this.nValue = this.body.getElementsByClassName('select_val')[0];

        this.container.appendChild(this.body);

        this.init();
    }
    _.extend(Select.prototype, _.emitter);
    _.extend(Select.prototype, {
        init: function() {
            // 1.绑定事件
            this.initEvent();
            // 2.渲染列表
            this.render(this.data);

        },
        initEvent: function() {

            this.body.addEventListener('click', this.clickHandler.bind(this));
            document.addEventListener('click', function() {
                this.close();
            }.bind(this));
        },
        // 渲染列表
        render: function(data, defaulIndex) {
            var optionsHTML = '';
            if (data === null) {
                optionsHTML += `<li data-index="0">暂无信息</li>`
            } else {
                for (let i = 0; i < data.length; i++) {
                    // 渲染的是数据的第1项的值
                    optionsHTML += `<li data-index=${i}>${data[i]}</li>`
                }
            }
            this.nOption.innerHTML = optionsHTML;
            this.nOptions = this.nOption.children;
            this.options = data;
            // 默认选中项
            this.setSelect(defaulIndex || 0);
        },
        clickHandler: function(event) {
            event.stopPropagation();

            if (event.target.nodeName === "LI") {
                var index = event.target.dataset.index;
                this.setSelect(index);
                this.toggle(event);
            } else {
                this.toggle(event);
            }
        },
        open: function() {
            _.delClass(this.nOption, 'f-dn');
        },
        close: function() {
            if (_.hasClass(this.nOption, 'f-dn')) return
            _.addClass(this.nOption, 'f-dn')
        },
        toggle: function(event) {
            _.hasClass(this.nOption, 'f-dn') ?
                this.open() :
                this.close()
        },
        // 获取当前选中项的值
        getValue: function() {
            return this.options === null ?
                null :
                this.options[this.selectedIndex].value;
        },
        // 设置选中状态
        setSelect: function(index) {
            // 取消上次选中效果
            if (this.nOptions[this.selectedIndex] !== undefined) {
                _.delClass(this.nOptions[this.selectedIndex], 'z-select');
            }
            // 设置选中
            this.selectedIndex = index;

            // 当前选中项的名称放到选择框内
            this.options === null ?
                this.nValue.innerText = '暂无信息' :
                this.nValue.innerText = this.options[this.selectedIndex];
            _.addClass(this.nOptions[this.selectedIndex], 'z-select');

            this.emit('select', this.getValue());
        }
    })
    App.Selector = Select;
}(window.App)
// 作品上传
!function(App) {
    function UploadWorks() {
        this.nForm = document.forms[1];
        // 缓存节点
        this.nWorksName = this.nForm.works_name;
        this.nError = _.$('.u-error',this.nForm);
        this.nSubmitBtn = this.nForm.upload_btn;
        this.description = this.nForm.works_info;
        
        this.init();
    }
    _.extend(UploadWorks.prototype,{
        init: function() {
            this.nWorksName.addEventListener('input',function() {
                this.showMsg();
            }.bind(this))
            this.nSubmitBtn.addEventListener('click',function(e) {
                this.upload(e);
            }.bind(this))
        },
        showMsg: function(msg) {
            if(!msg) {
                this.nError.innerText = '';
                _.addClass(this.nError,'f-dn');
            } else {
                _.delClass(this.nError,'f-dn');
                this.nError.innerText = msg;
            }
        },
        upload: function(e) {
            e.preventDefault();
            if(!this.testValue()) return;  // 判断必填字段
            this.getTags();             // 获取标签
            this.getAuthorization();    // 获取授权信息

            // 须发送的数据
            var data = {
                name: this.nWorksName.value.trim(),
                tag: this.tags,
                coverId: App.imgData.coverImg.id || App.imgData.data[0].id,
                coverUrl: App.imgData.coverImg.url || App.imgData.data[0].url,
                pictures: App.imgData.data,
                category: parseInt(this.nForm.category.value),
                description: this.description.value,
                privilege: parseInt(this.nForm.privilege.value),
                authorization: parseInt(this.authorization)
            };
            _.ajax({
                method: 'post',
                url: '/api/works',
                ContentType: 'application/json',
                data: data,
                callback: function(data) {
                    window.location.href = './'
                }
            })
        },
        // 判断必填字段
        testValue: function() {
            if(!this.nWorksName.value.trim()) {
                this.showMsg('给作品起个名字吧~!');
                return 0;
            } else if(!App.imgData.data.length) {
                this.showMsg('你还没有上传图片哦~!');
                return 0;
            }
            return 1;
        },
        // 获取标签内容
        getTags: function() {
            this.tags = [];
            var tagsNode = document.getElementsByClassName('tag_name');
            if(!tagsNode) return;
            [].slice.call(tagsNode).forEach(function(item) {
                this.tags.push(item.innerText);
            }.bind(this))
            this.tags = this.tags.join(',');
        },
        // 获取授权信息
        getAuthorization: function() {
            var list = _.$('.select_opt');
            this.authorization = _.$('.z-select',list).dataset.index;
        }
    })
    App.UploadWorks = UploadWorks;
}(window.App)
// 页面
!function(App) {
    var page = {
        init: function() {
            this.initNav();
            this.initUploadForm();
            
            new App.UploadWorks();
        },
        initNav: function(argument) {
            App.nav.init({
                login: function(data) {
                    // 获取用户信息后的回调
                }.bind(this)
            });
        },
        initUploadForm: function() {
            // 获取推荐标签
            var tags = _.$('.tags');
            new App.Tag({
                parent: tags,
                tags: []
            });
            // 初始化图片上传及预览
            new App.UploadImg();
            // 初始化作品授权
            var selectOptions = [
                '不限制作品用途',
                '禁止匿名转载，禁止商业使用'
            ];
            new App.Selector({
                container: _.$('.authorization'),
                data: selectOptions
            })
            
        }
    };
    document.addEventListener('DOMContentLoaded', function(e) {
        page.init();
    })
}(window.App)
