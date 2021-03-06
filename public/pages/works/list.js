(function(_) {
    function App() {

    };
    App.user = {};
    App.template = {
        side: `
            <ul>
                <li class="side_menu">个人中心</li>
                <li class="side_menu z-active">我的作品</li>
                <li class="side_menu">我关注的</li>
                <li class="side_menu">我的圈子</li>
                <li class="side_menu">消息提醒</li>
                <li class="side_menu">隐私设置</li>
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
                        window.location.href = "index";
                    }
                }.bind(this)
            })
        },
        initUser: function(data) {
            this.data = data;
            // 节点信息
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
                        window.location.href = "../index"
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
                <div class="u-info u-info-1">
                    <em class="age">${this.age}岁</em>
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
// 侧边栏菜单组件
!function(App) {
    function SideMenu(options) {
        
        _.extend(this, options);

        this.node = _.tempToNode(App.template.side);
        this.menus = [].slice.call(this.node.getElementsByClassName('side_menu'));

        this.init();
    }
    _.extend(SideMenu.prototype, {
        init: function() {
            this.render();
            this.addEvent();
        },
        render: function() {
            this.container.appendChild(this.node);
        },
        addEvent: function() {
            this.menus.forEach(function(menu) {
                menu.addEventListener('click', this.clickHandler);
            }.bind(this))
        },
        clickHandler: function(e) {
            var modal = new App.Modal({
                title: '提示信息'
            });
            modal.show('<br><br>此功能暂未开放，敬请期待')
        }
    })
    App.SideMenu = SideMenu;
}(window.App)
// 作品列表 *
!function(App) {
    var DEFAULT_QUERY = {
        total: 1,
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
                    // 已通过其它方式实现
                    // _.addClass(_.$('#g-bd'),'list-loaded');
                    if(!data.result.data.length) {
                        _.$('.m-works').innerHTML = '你还没有创建过作品~<br><br><br>';
                        return;
                    }
                    this.renderList(data.result.data)
                    // this.renderList(data.result.data.slice(0, this.query.limit));
                    this.addEvent();
                    // 初始化分页器组件
                    this.initPagination(data.result)
                }.bind(this)
            })
        },
        loadList: function(options) {
            _.ajax({
                data: options.query,
                url: '/api/works',
                method: 'GET',
                ContentType: 'application/json',
                callback: function(data) {
                    options.callback(data);
                },
                error: function(data) {
                    options.callback(data);
                }
            })
        },
        renderList: function(list) {
            this.worksListData = list;  //缓存作品数据，便于修改
            // 制作模板
            var html = `
                {{#each works}}
                <li class="item" data-id={{this.id}}>
                    <a href="../../works/detail/{{this.id}}">
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
                // 多次触发问题
                e.stopImmediatePropagation();
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
            var html = `<br><br> 确定要删除${works.name}吗?`;
            // 弹窗
            var modal = new App.Modal({
                title: '提示消息：',
                footer: true
            });
            modal.show(html);
            
            modal.on('confirm',function() {
                _.ajax({
                    method: 'delete',
                    ContentType: 'application/json',
                    url: '/api/works/' + works.id,
                    callback: function(data) {
                        // 删除
                        // 刷新列表
                        self.initList();
                    }
                })
            })
        },
        editWorks: function(works,worksEl) {
            var input = _.tempToNode(
                `<input type="text" id="delete_ipt" 
                placeholder="请输入新的作品名称">`
            );
            var modal = new App.Modal({
                title: '请输入新的作品名称',
                footer: true
            });
            var self = this;
            modal.show(input);
            modal.on('confirm',function() {
                var newName = input.value.trim();
                if(!newName) {
                    // 提示用户
                    var msg = new App.Modal({
                        title: '提示信息'
                    })
                    setTimeout(function() {
                        msg.show('<br><br>新的作品名称不能为空')
                    }, 0);
                    return;
                }
                // 检出修改项的具体信息
                var data = {};
                self.worksListData.forEach(function(item) {
                    if(works.id == item.id) {
                        data = item;
                        return;
                    }
                })
                data.name = newName;
                
                var data1 = {
                    name: newName
                }
                if(newName !== works.name) {
                    _.ajax({
                        method: 'PATCH',
                        ContentType: 'application/json',
                        data: data1,
                        url: '/api/works/' + works.id,
                        callback: function(data) {
                            data = JSON.parse(data);
                            _.$('h3',worksEl).innerHTML = data.result.name;
                        },
                        error: function() {
                            console.log('修改失败')
                        }
                    })
                }
            })
        },
        initPagination: function(works) {
            // 作品凑不够一页不显示分页器
            if(works.data.length < this.query.limit) return;
            if(_.$('.m-pagination')) return;
            new App.Pagination({
                parent: _.$('.g-wrap'),
                total: works.total,
                current: 1,
                showNum: 8,
                itemsLimit: this.query.limit,
                callback: function(currentPage) {
                    // 这里写分页器的事件
                    this.query.offset = (currentPage - 1) * this.query.limit; // 偏移位置
                    this.initList();
                }.bind(this)
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
            this.initSide();
            this.initNav();
        },
        initSide: function() {
            var node = _.$('.m-aside');
            new App.SideMenu({
                container: node
            });
        },
        initNav: function(argument) {
            App.nav.init({
                login: function(data) {
                    // 获取用户信息后的回调
                    this.initProfile(data);
                    this.initList();
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


// 分页器测试
// new App.Pagination({
//     parent: _.$('.g-wrap'),
//     total: 500,
//     current: 2,
//     showNum: 8,
//     itemsLimit: 10,
//     callback: function(currentPage) {
//         console.log(1)
//     }
// })