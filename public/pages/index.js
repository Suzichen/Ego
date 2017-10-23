(function(_) {
    function App() {

    };
    // 存用户信息
    App.user = {};
    // 模板库
    App.template = {
        diamond: `
            <ul class="section_cnt m-list f-cb">
                <li><img src="../res/images/work1.png" alt="work1"></li>
                <li><img src="../res/images/work2.png" alt="work2"></li>
                <li><img src="../res/images/work3.png" alt="work3"></li>
                <li><img src="../res/images/work4.png" alt="work4"></li>
            </ul>
        `,
        star: `
            <ul class="section m-list m-card f-cb" id="starList">
                <!-- 动态渲染 -->
            </ul>
        `,
        work: `
            <ul class="section m-list m-list-1 f-cb">
                <li><img src="../res/images/work5.png" alt="">
                    <div>作品名称作品名称作品名称</div>
                </li>
                <li><img src="../res/images/work6.png" alt="">
                    <div>作品名称</div>
                </li>
                <li><img src="../res/images/work5.png" alt="">
                    <div>作品名称</div>
                </li>
                <li><img src="../res/images/work6.png" alt="">
                    <div>作品名称</div>
                </li>
                <li><img src="../res/images/work5.png" alt="">
                    <div>作品名称</div>
                </li>
                <li><img src="../res/images/work6.png" alt="">
                    <div>作品名称</div>
                </li>
                <li><img src="../res/images/work6.png" alt="">
                    <div>作品名称</div>
                </li>
                <li><img src="../res/images/work6.png" alt="">
                    <div>作品名称</div>
                </li>
                <li><img src="../res/images/work6.png" alt="">
                    <div>作品名称</div>
                </li>
                <li><img src="../res/images/work6.png" alt="">
                    <div>作品名称</div>
                </li>
            </ul>
        `,
        event: `
            <div class="m-event">
                <div class="content event-1">
                    <span class="title-1">第五期 | 我是活动主题名称</span>
                    <span class="date-1">7.23-8.21</span>
                </div>
                <div class="btns">
                    <button class="u-btn u-btn-sm u-btn-primary">快来PK</button>
                    <button class="u-btn u-btn-sm u-btn-primary">邀请小伙伴</button>
                </div>
            </div>
            <div class="m-event">
                <div class="content content-1 event-2">
                    <img src="../res/images/event-2_title.jpg" alt="活动封面">
                    <span class="title-2">第五期 | 我是活动主题名称</span>
                    <span class="date-2">7.30-8.23</span>
                    <div class="rules">
                        我是活动规则我是活动规则我是活动规则我是活动规则 我是活动规则我是活动规则我是活动规则我是活动规则 我是活动规则我是活动规则我是活动规则我是活动规则
                    </div>
                </div>
                <div class="btns">
                    <button class="u-btn u-btn-sm u-btn-primary">快来PK</button>
                    <button class="u-btn u-btn-sm u-btn-primary">邀请小伙伴</button>
                </div>
            </div>
        `,
        original: `
            <ul class="section m-list m-list-2 f-cb">
                <li><img src="../res/images/work7.png" alt="">
                    <div>作品名称作品名称作品名称</div>
                </li>
                <li><img src="../res/images/work5.png" alt="">
                    <div>作品名称</div>
                </li>
                <li><img src="../res/images/work6.png" alt="">
                    <div>作品名称</div>
                </li>
                <li><img src="../res/images/work5.png" alt="">
                    <div>作品名称</div>
                </li>
                <li><img src="../res/images/work6.png" alt="">
                    <div>作品名称</div>
                </li>
                <li><img src="../res/images/work6.png" alt="">
                    <div>作品名称</div>
                </li>
                <li><img src="../res/images/work6.png" alt="">
                    <div>作品名称</div>
                </li>
                <li><img src="../res/images/work6.png" alt="">
                    <div>作品名称</div>
                </li>
                <li><img src="../res/images/work6.png" alt="">
                    <div>作品名称</div>
                </li>
            </ul>
        `,
        fanfiction: `
            <ul class="section m-list m-list-2 f-cb">
                <li><img src="../res/images/work7.png" alt="">
                    <div>作品名称作品名称作品名称</div>
                </li>
                <li><img src="../res/images/work5.png" alt="">
                    <div>作品名称</div>
                </li>
                <li><img src="../res/images/work6.png" alt="">
                    <div>作品名称</div>
                </li>
                <li><img src="../res/images/work5.png" alt="">
                    <div>作品名称</div>
                </li>
                <li><img src="../res/images/work6.png" alt="">
                    <div>作品名称</div>
                </li>
                <li><img src="../res/images/work6.png" alt="">
                    <div>作品名称</div>
                </li>
                <li><img src="../res/images/work6.png" alt="">
                    <div>作品名称</div>
                </li>
                <li><img src="../res/images/work6.png" alt="">
                    <div>作品名称</div>
                </li>
                <li><img src="../res/images/work6.png" alt="">
                    <div>作品名称</div>
                </li>
            </ul>
        `,
        copy: `
            <ul class="section m-list m-list-2 f-cb">
                <li><img src="../res/images/work7.png" alt="">
                    <div>作品名称作品名称作品名称</div>
                </li>
                <li><img src="../res/images/work5.png" alt="">
                    <div>作品名称</div>
                </li>
                <li><img src="../res/images/work6.png" alt="">
                    <div>作品名称</div>
                </li>
                <li><img src="../res/images/work5.png" alt="">
                    <div>作品名称</div>
                </li>
                <li><img src="../res/images/work6.png" alt="">
                    <div>作品名称</div>
                </li>
                <li><img src="../res/images/work6.png" alt="">
                    <div>作品名称</div>
                </li>
                <li><img src="../res/images/work6.png" alt="">
                    <div>作品名称</div>
                </li>
                <li><img src="../res/images/work6.png" alt="">
                    <div>作品名称</div>
                </li>
                <li><img src="../res/images/work6.png" alt="">
                    <div>作品名称</div>
                </li>
            </ul>
        `
    }
    window.App = App;
    window._ = _;
})(util)
var iconConfig = [
    'u-icon-male',
    'u-icon-female'
];
var followConfig = [{
            text: '+ 关 注',
            class: 'z-unflow'
        },
        {
            text: '已关注',
            class: 'z-flowed',
        }
    ]
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
                    if(this.nTabs[i].id === "link-my-work") return;
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
// 搜索
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
// 用户组件
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

            this.modal.on('register', function() {
                this.modal.hide();
                this.nRegister.click();
            }.bind(this));

        }
    })
    App.UserInfo = UserInfo;
}(window.App)
// banner
!function(App) {
    var template = `<div class="m-slider"></div>`;

    function Slider(options) {
        _.extend(this, options);
        // ...
        this.pageNum = this.images.length;
        // 组件节点
        this.slider = this._layout.cloneNode(true);
        this.sliders = [].slice.call(this.buildSlider());
        this.cursors = [].slice.call(this.buildCursor());
        // 初始化事件
        this.slider.addEventListener('mouseenter', this.stop.bind(this));
        this.slider.addEventListener('mouseleave', this.autoPlay.bind(this));
        // 初始化事件
        this.container.appendChild(this.slider);
        this.nav(this.initIndex || 0);
        this.autoPlay();
    };
    _.extend(Slider.prototype, {
        _layout: _.tempToNode(template),
        buildSlider: function() {
            var sliders = document.createElement('ul'),
                html = '';
            sliders.className = 'm-slider';
            for (let i = 0; i < this.pageNum; i++) {
                html += `
            <li class="slider_img">
                <img src=${this.images[i]} alt="banner">
            </li>`;
            };
            sliders.innerHTML = html;
            this.slider.appendChild(sliders);
            return sliders.children;
        },
        buildCursor: function() {
            var cursor = document.createElement('ul'),
                html = '';
            cursor.className = 'm-cursor';
            for (let i = 0; i < this.pageNum; i++) {
                cursor.innerHTML += `<li data-index=${i}></li>`;
            }
            this.slider.appendChild(cursor);
            for (let i = 0; i < this.pageNum; i++) {
                cursor.children[i].addEventListener('click', function(event) {
                    index = event.target.dataset.index;
                    this.nav(index);
                }.bind(this))
            }

            return cursor.children;
        },
        // 下一页
        next: function() {
            var index = (this.index + 1) % this.pageNum;
            this.nav(index);
        },
        // 跳到指定页
        nav: function(index) {
            if (this.index === index) return;
            this.last = this.index;
            this.index = index;
            this.fade();
            this.setCurrent();
        },
        // 设置选中状态
        setCurrent: function() {
            _.addClass(this.cursors[this.index], 'z-active');
            _.addClass(this.sliders[this.index], 'z-active');
            if (this.last !== undefined) {
                _.delClass(this.cursors[this.last], 'z-active');
                _.delClass(this.sliders[this.last], 'z-active');
            }
        },
        autoPlay: function() {
            this.timer = setInterval(function() {
                this.next();
            }.bind(this), this.interval)
        },
        stop: function() {
            clearInterval(this.timer);
        },
        // 切换效果
        fade: function() {
            if (this.last !== undefined) {
                this.sliders[this.last].style.opacity = 0;
            }
            this.sliders[this.index].style.opacity = 1;
        }
    })
    App.Slider = Slider;
}(window.App)
// 明日之星
!function(App) {
    function StarList(container, data) {
        this.listInfo = data;
        this.container = container;
        // 绑定事件
        this.container.addEventListener('click', this.followHandler.bind(this));
        this.render(data);
    }
    _.extend(StarList.prototype, _.emitter)
    _.extend(StarList.prototype, {
        // 渲染列表
        render: function(data) {
            var html = "";
            data.forEach(function(item) {
                html += this.renderItem(item);
            }.bind(this));
            this.container.innerHTML = html;
        },
        renderItem: function(data) {
            var config = followConfig[Number(!!data.isFollow)];
            var html = `
            <li>
                <img src="../res/images/avatar.png" alt="头像" class="avatar">
                <div class="section author-info">
                    <div class="author">${data.nickname}</div>
                    <div class="info">
                        <div class="works">作品 <span>${data.workCount}</span></div>
                        <div class="fans">粉丝 <span>${data.followCount}</span></div>
                    </div>
                </div>
                <button class="u-btn u-btn-sm u-btn-primary ${config.class}" data-userid="${data.id}">
                    <span class="u-icon u-icon-ok"></span>${config.text}
                </button>
            </li>`;
            return html;
        },
        // 关注
        followHandler: function(event) {
            var target = event.target;
            if (target.tagName === 'BUTTON') {
                var user = App.user;
                // 处理未登录
                if (user.username === undefined) {
                    this.emit('login');
                    return;
                }
                // 处理已登录
                var userId = target.dataset.userid,
                    data;
                for (var i = 0; i < this.listInfo.length; i++) {
                    if (this.listInfo[i].id == target.dataset.userid) {
                        // data=点击的用户信息
                        data = this.listInfo[i];
                    }
                }
                _.hasClass(target, 'z-unflow') ?
                    this.follow(data, target.parentNode) :
                    this.unFollow(data, target.parentNode)
            }
        },
        follow: function(followInfo, replaceNode) {
            _.ajax({
                url: '/api/users?follow',
                method: 'post',
                ContentType: 'application/json',
                data: { id: followInfo.id },
                callback: function(data) {
                    data = JSON.parse(data);
                    if (data.code === 200) {
                        followInfo.isFollow = true;
                        followInfo.followCount++;
                        var newNode = _.tempToNode(this.renderItem(followInfo));
                        replaceNode.parentNode.replaceChild(newNode, replaceNode);
                    }
                }.bind(this)
            });
        },
        unFollow: function(followInfo, replaceNode) {
            var data = { id: followInfo.id };
            _.ajax({
                url: '/api/users?unfollow',
                method: 'post',
                ContentType: 'application/json',
                data: data,
                callback: function(data) {
                    followInfo.isFollow = false;
                    followInfo.followCount--;
                    var newNode = _.tempToNode(this.renderItem(followInfo));
                    replaceNode.parentNode.replaceChild(newNode, replaceNode);
                }.bind(this)
            })
        }
    })
    App.StarList = StarList;
}(window.App)
// 导航栏
!function(App) {
    var nav = {
        init: function(options) {
            options = options || {};

            this.loginCallback = options.login;

            this.hdtab = new App.Tabs({
                container: _.$("#hdtabs"),
                index: this.getTabIndex()
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
                        window.location.href = "index";
                    },
                    data: this.data
                })
            });
            // 刷新明日之星列表
            App.page.initStarList();
        }
    }
    App.nav = nav;
}(window.App)
// 页面
!function(App) {
    var page = {
        init: function() {
            this.initNav();
            this.slider = new App.Slider({
                container: _.$('#g-banner'),
                images: [
                    "../res/images/banner0.jpg",
                    "../res/images/banner1.jpg",
                    "../res/images/banner2.jpg",
                    "../res/images/banner3.jpg"
                ],
                interval: 5000
            });
            this.initSection();
            this.initStarList();
            this.sideTab = new App.Tabs({
                container: _.$("#sidetabs")
            });
            this.initMyWork();
        },
        initNav: function(argument) {
            App.nav.init({
                login: function(data) {
                    if (!App.user.username) {
                        App.user = data;
                    }
                }
            });
        },
        initSection: function() {
            // 精选推荐
            new App.Section({
                icon: 'diamond',
                title: '精选推荐',
                cont: App.template.diamond,
                container: _.$('.g-main')
            });
            // 明日之星
            new App.Section({
                icon: 'star',
                title: '明日之星',
                cont: App.template.star,
                container: _.$('.g-main')
            });
            // 最新作品
            new App.Section({
                icon: 'work',
                title: '最新作品',
                cont: App.template.work,
                container: _.$('.g-main')
            });
            // 活动进行时
            new App.Section({
                icon: 'event',
                title: '活动进行时',
                cont: App.template.event,
                container: _.$('.g-main')
            });
            // 我们都爱原创
            new App.Section({
                icon: 'original',
                title: '我们都爱原创',
                cont: App.template.original,
                container: _.$('.g-main')
            });
            // 我们都是同人粉
            new App.Section({
                icon: 'fanfiction',
                title: '我们都是同人粉',
                cont: App.template.fanfiction,
                container: _.$('.g-main')
            });
            // 看谁临摹得最好
            new App.Section({
                icon: 'copy',
                title: '看谁临摹得最好',
                cont: App.template.copy,
                container: _.$('.g-main')
            });
        },
        initStarList: function() {
            _.ajax({
                url: '/api/users?getstarlist',
                method: 'get',
                callback: function(data) {
                    // 不管登录与否,获取到的数据是一样的?
                    var data = JSON.parse(data);
                    // 未登录情况
                    if (!this.starList) {
                        this.starList = new App.StarList(_.$('#starList'), data.result);
                        this.starList.on('login', function() {
                            App.nav.showLogin();
                        }.bind(this))
                    } else {
                    // 已登录情况
                        this.starList.render(data.result);
                    }
                }.bind(this)
            })
        },
        initMyWork: function() {
            var myWorkHandler = function() {
                if(App.user.id === undefined) {
                    App.nav.showLogin();
                    return;
                } else {
                    window.location.href = "works";
                }
            }.bind(this)
            var myWork = _.$('.mywork'),
                tabMyWork = _.$('#link-my-work');
            myWork.addEventListener('click',myWorkHandler);
            tabMyWork.addEventListener('click',myWorkHandler);
        }

    };
    document.addEventListener('DOMContentLoaded', function(e) {
        page.init();
    });
    App.page = page;
}(window.App)
// Section组件
!function(App) {
    function Section(options) {
        _.extend(this,options);
        this.init();
    }
    _.extend(Section.prototype,{
        init: function() {
            var html = `
                <div class="m-section">
                    <h4 class="section_head">
                        <i class="u-icon u-icon-${this.icon}"></i>/${this.title}/
                        <span class="section_more">更多
                            <i class="u-icon u-icon-moretight"></i>
                        </span>
                    </h4>
                    ${this.cont}
                </div>
            `;
            this.container.appendChild(_.tempToNode(html));
        }
    })
    App.Section = Section;
}(window.App)