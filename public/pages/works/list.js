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
// 个人信息
!function(App) {
    function Profile(options) {
        _.extend(this, options);
        
        this.birthday = this.user.birthday.split('-');
        this.cityCode = this.user.city;
        this.address = ADDRESS_CODES;

        this.age = this.getAge();
        this.constellation = this.getConstellation();
        this.city = this.getCity(this.cityCode);

        // 初始化
        this.init();
    }
    _.extend(Profile.prototype,{
        init: function() {
            var html = `
                <img class="my-avatar" src="../../res/images/myavatar.jpg" alt="我的头像">
                <div class="u-info">
                    <em class="name" title="name">${this.user.nickname}</em>
                    <span class="sex">
                        <em class="u-icon ${iconConfig[this.user.sex]}"></em>
                    </span>
                </div>
                <div class="u-info">
                    <em class="age">${this.age}</em>
                    <em class="constellation">${this.constellation}座</em>
                    <span class="address-info">
                        <em class="u-icon u-icon-address"></em>
                        <em class="address">${this.city}</em>
                    </span>
                </div>`;
            this.container.innerHTML = html;
        },
        // 获取年龄
        getAge: function() {
            var year = this.birthday[0],
                now = new Date().getFullYear();
            return (now - year)
        },
        // 获取星座
        getConstellation: function() {
            var month = this.birthday[1],
                date = this.birthday[2],
                constellations = ['摩羯','水瓶','双鱼','白羊','金牛',
                '双子','巨蟹','狮子','处女','天秤','天蝎','射手','摩羯'];
            
                return constellations[month - (date - 14 < '657778999988'.charAt(month - 1))];
        },
        // 获取地区
        getCity: function(code) {
            var result = '';
            this.address.forEach(function(item) {
                item[2].forEach(function(item) {
                    if(code == item[0]) {
                        result = item[1];
                        return;
                    }
                })
            })
            return !!result ?
                result :
                '火星'
        }
    })
    App.Profile = Profile;
}(window.App)
// 作品列表 *
!function(App) {
    var DEFAULT_QUERY = {
        total: 0,
        offset: 0,
        limit: 10
    }
    function WorksList(options) {
        options = options || {};
        this.query = options.query || DEFAULT_QUERY;

        this.initList();
        // 测试
        this.addEvent();
        
    }
    _.extend(WorksList.prototype,{
        initList: function() {
            this.loadList({
                query: this.query,
                callback: function(data) {
                    data = JSON.parse(data);
                    // 加载过程中显示旋转图标
                    // _.addClass(_.$('#g-bd'),'list-loaded');
                    if(!data.result.data.length) {
                        _.$('.m-works').innerHTML = '你还没有创建过作品~';
                        return;
                    }
                    
                    this.renderList(data.result.data);
                    this.addEvent();
                }.bind(this)
            })
        },
        loadList: function(options) {
            _.ajax({
                data: options.query,
                url: '../../res/datatest/works.json',
                method: 'get',
                ContentType: 'application/json',
                callback: function(data) {
                    options.callback(data);
                }
            })
        },
        renderList: function(list) {
            // 制作模板
            var html = `
                {{#each works}}
                <li class="item">
                    <a href="#">
                        {{#if this.coverUrl}}
                        <img src="{{this.coverUrl}}" alt="作品默认封面">
                        {{else}}
                        <img src="../../res/images/list-1.jpg" alt="作品默认封面">
                        {{/if}}
                        <h3>{{this.name}}</h3>
                    </a>
                    <div class="icons">
                        <i class="u-icon u-icon-edit"></i>
                        <i class="u-icon u-icon-delete"></i>
                    </div>
                </li>
                {{/each}}
            `;
            // 渲染模板
            var data = {
                "works": list
            }
            var template = Handlebars.compile(html);
            _.$('.m-works').innerHTML = template(data);
        },
        addEvent: function() {
            // 给编辑和删除图标添加点击事件
            var self = this;
            _.$('.m-works').addEventListener('click',function(e) {
                var target = e.target;
                if(target.classList.contains('u-icon')) {
                    var worksEl = target.parentNode.parentNode;
                    var options = {
                        name: _.$('h3',worksEl).innerHTML,
                        id: worksEl.dataset.id
                    }
                    if(target.classList.contains('u-icon-delete')) {
                        self.deleteWorks(options);
                    } else if(target.classList.contains('u-icon-edit')) {
                        self.editWorks(options,worksEl);
                    }
                }
            })
        },
        deleteWorks: function(works) {
            var self = this;
            var html = `确定要删除${works.name}吗?`;
            // 弹窗
            var modal = new App.Modal({
                title: '提示消息：',
                footer: true
            });
            modal.show(html);
            
            modal.on('confirm',function() {
                this.hide();
                _.ajax({
                    method: 'delete',
                    url: '/api/wprks/:' + works.id,
                    callback: function(data) {
                        // 删除

                        // 刷新列表
                        self.initList();
                    }
                })
            })
        },
        editWorks: function(works,worksEl) {
            var input = _.tempToNode('<input type="text" id="delete_ipt">');
            var modal = new App.Modal({
                title: '请输入新的作品名称',
                footer: true
            });
            modal.show(input)
            modal.on('confirm',function() {
                var newName = input.value.trim();
                if(!newName) {
                    // 提示用户

                    return;
                }
                if(newName !== works.name) {
                    _.ajax({
                        method: 'patch',
                        // data: {name: newName},
                        url: '/api/works/:' + works.id,
                        callback: function(data) {
                            data = JSON.parse(data);
                            _.$('h3',worksEl).innerHTML = data.result.name;
                        }
                    })
                }
            })
        }
    })
    App.WorksList = WorksList;
}(window.App)
// 分页器
!function(App) {
    // 默认选中的页码
    var DEFAULT_CURRENT_PAGE = 1;
    // 默认显示的页码个数
    var DEFAULT_SHOW_NUM = 8;
    // 每页显示的默认数量
    var DEFAULT_ITEMS_LIMIT = 10;
    function Pagination(options) {
        this.options = options;
        this.current = options.current || DEFAULT_CURRENT_PAGE;
        this.showNum = options.showNum || DEFAULT_SHOW_NUM;
        this.itemsLimit = options.itemsLimit || DEFAULT_ITEMS_LIMIT;


        this.render();
    }
    _.extend(Pagination.prototype,{
        render: function() {
            // 防止重复渲染
            this.destroy();
            // 节点
            var ul = _.createElement('ul','m-pagination');
            this.first = _.createElement('li','','第一页');
            this.first.dataset.page = 1;
            ul.appendChild(this.first);
            this.prev = _.createElement('li','','上一页');
            ul.appendChild(this.prev);

            this.pageNum = Math.ceil(this.options.total / this.itemsLimit);
            this.starNum = Math.floor((this.current - 1) / this.showNum) * this.showNum + 1;
            this.numEls = [];
            for (var i = 0; i < this.showNum; i++) {
                var numEl = _.createElement('li'),
                    num = this.starNum + i;
                if(num <= this.pageNum) {
                    numEl.innerHTML = num;
                    numEl.dataset.page = num;
                    this.numEls.push(numEl); 
                    ul.appendChild(numEl);
                }            
            }
            // 节点
            this.next = _.createElement('li','','下一页');
            ul.appendChild(this.next);
            this.last = _.createElement('li','','尾页');
            this.last.dataset.page = this.pageNum
            ul.appendChild(this.last);
            this.container = ul;

            this.options.parent.appendChild(ul);
            // 设置页码状态
            this.setStatus();
            // 添加事件
            this.addListEvent();
        },
        destroy: function() {
            if(this.container) {
                this.options.parent.removeChild(this.container);
                this.container = null;  //手动释放事件
            }
        },
        setStatus: function() {
            // 判断第一页，设置class
            if(this.current === 1) {
                _.addClass(this.prev,'disabled');
                _.addClass(this.first,'disabled');
            } else {
                _.delClass(this.prev,'disabled');
                _.delClass(this.first,'disabled');
            }
            // 判断最后一页，设置class
            if(this.current === this.pageNum) {
                _.addClass(this.next,'disabled');
                _.addClass(this.last,'disabled');
            } else {
                _.delClass(this.next,'disabled');
                _.delClass(this.last,'disabled');
            }
            // 设置prev和next的datapage值
            this.prev.dataset.page = this.current - 1;
            this.next.dataset.page = this.current + 1;
            this.numEls.forEach(function(numEl) {
                numEl.className = '';
                if(this.current === parseInt(numEl.dataset.page)) {
                    numEl.className = 'active';
                }
            }.bind(this));
        },
        addListEvent: function() {
            var clickHandler = function(e) {
                var numEl = e.target;
                // 如果已经是disabled状态或active状态，则不操作
                if(_.hasClass(numEl,'disabled') || _.hasClass(numEl,'active')) {
                    return;
                }
                this.current = parseInt(numEl.dataset.page);
                // 判断是否翻篇
                if (this.current < this.starNum || this.current >= this.starNum + this.showNum) {
                    this.render();
                } else {
                    this.setStatus();
                }
                // 执行回调函数
                this.options.callback(this.current);
            }.bind(this);
            this.container.addEventListener('click',clickHandler);
        }
    })
    App.Pagination = Pagination;
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
                        this.initProfile(App.user);
                        this.initList();
                    }
                }.bind(this)
            });
        },
        initProfile: function(data) {
            new App.Profile({
                container: _.$('.g-profile'),
                user: data
            })
        },
        initList: function() {
            new App.WorksList();
        }
    };
    document.addEventListener('DOMContentLoaded', function(e) {
        page.init();
    })
}(window.App)

// 模板测试
// var node  = document.getElementById('entry-template');
// var template = Handlebars.compile(node.innerHTML);
// var data = {title: 'hellasdsdsdsfsdfsdo'};
// node.parentNode.innerHTML = template(data)
// 分页器测试
new App.Pagination({
    parent: _.$('.g-wrap'),
    total: 500,
    current: 2,
    showNum: 8,
    itemsLimit: 10,
    callback: function(currentPage) {
        console.log(1)
    }
})