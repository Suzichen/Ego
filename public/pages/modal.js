// 基础模态框
! function(App) {
    var template = `
    <div class="m-modal">
        <div class="modal_align"></div>
        <div class="modal_wrap">
            <div class="close">+</div>
            <div class="modal_head f-dn">标题</div>
            <div class="modal_body">内容</div>
            <div class="modal_foot f-dn">
                <a class='confirm u-btn u-btn-primary' href='#'>确认</a>
                <a class='cancel u-btn u-btn-link' href='#'>取消</a>
            </div>
        </div>
    </div>`;

    function Modal(options) {
        options = options || {};
        this.container = this._layout.cloneNode(true);
        this.body = _.$('.modal_body',this.container);
        this.wrap = _.$('.modal_wrap',this.container);

        this.title = _.$('.modal_head',this.container);
        this.footer = _.$('.modal_foot',this.container);
        // 是否传入title和footer
        if(!!options.title) {
            _.delClass(this.title,'f-dn');
            this.title.innerHTML = options.title;
        }
        
        if(options.footer !== undefined) {
            _.delClass(this.footer,'f-dn');
        }

        _.extend(this, options);
        this._initEvent();
    }
    _.extend(Modal.prototype, _.emitter);
    _.extend(Modal.prototype, {
        _layout: _.tempToNode(template),
        setContent: function(content) {
            if (!content) return;
            if (content.nodeType === 1) {
                this.body.innerHTML = '';
                this.body.appendChild(content);
            } else {
                this.body.innerHTML = content;
            }
        },
        show: function(content) {
            if (content) this.setContent(content);
            document.body.appendChild(this.container);
        },
        hide: function() {
            var container = this.container;
            document.body.removeChild(container);
        },

        _initEvent: function() {
            this.container.querySelector('.close').addEventListener(
                'click', this._onCancel.bind(this)
            );
            this.container.querySelector('.cancel').addEventListener(
                'click', this._onCancel.bind(this)
            );
            this.container.querySelector('.confirm').addEventListener(
                'click', this._onConfirm.bind(this)
            )
        },
        _onConfirm: function() {
            this.emit('confirm')
            this.hide();
        },
        _onCancel: function() {
            this.emit('cancel')
            this.hide();
        }
    })
    App.Modal = Modal;
}(window.App)
// 登录框
! function(App) {
    var html = `
        <div class="modal-login">
            <div class="modal_tt">
                <strong>欢迎回来</strong>
                <span>还没有帐号? <a href="#" class="u-link" id="goregister"> 立即注册</a></span>
            </div>
            <form class="m-form m-form-1" id="loginform">
                <div class="u-formitem">
                    <input type="text" class="formitem_ct u-ipt" id="username" placeholder="手机号"
                    maxlength="11" pattern="^0?(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$" required >
                </div>
                <div class="u-formitem u-formitem-1">
                    <input type="password" class="formitem_ct u-ipt" id="password" placeholder="密码">
                </div>
                <div class="u-formitem u-formitem-2">
                    <label for="remember" class="u-checkbox u-checkbox-remember">
                        <input type="checkbox" id="remember">
                        <i class="u-icon u-icon-checkbox"></i>
                        <i class="u-icon u-icon-checkboxchecked"></i>
                        <span>保持登录</span>
                    </label>
                    <span class="f-fr">忘记密码?</span>
                </div>
                <div class="u-error f-dn">
                    <span class="u-icon u-icon-error"></span>
                    <span id="errormsg"></span>
                </div>
                <button id="loginbtn" class="u-btn u-btn-primary" type="submit">登&nbsp;&nbsp;录</button>
            </form>
        </div>`;

    function LoginModal() {

        this.node = _.tempToNode(html);
        this.nUsername = this.node.querySelector('#username');
        this.nPassword = this.node.querySelector('#password');
        this.error = this.node.getElementsByClassName('u-error')[0];
        this.errMsg = this.node.querySelector('#errormsg');
        this.submitBtn = this.node.querySelector('#loginbtn');
        this.goregister = this.node.querySelector('#goregister');

        App.Modal.call(this, {});

        this.initLoginEvent();
    }
    LoginModal.prototype = Object.create(App.Modal.prototype);
    _.extend(LoginModal.prototype, {
        initLoginEvent: function() {
            this.show(this.node);
            // 初始化输入框交互
            this.isPhone();
            this.updataMsg();
            // 绑定提交事件
            this.submitBtn.addEventListener('click', function(e) {
                    this.submit(e);
                }.bind(this))
                // 绑定跳转注册事件
            this.goregister.addEventListener('click', function() {
                this.emit('register');
            }.bind(this))
        },
        // 信息栏
        showMsg: function(nmsg) {
            if (!nmsg) {
                _.addClass(this.error, 'f-dn');
                this.btnDisabled();
            } else {
                _.delClass(this.error, 'f-dn');
                this.errMsg.innerHTML = nmsg;
                this.btnDisabled(true);
            }
        },
        addInvalid: function(node, nmsg) {
            this.showMsg(nmsg);
            _.addClass(node, 'in-err');
        },
        // 更新信息
        updataMsg: function() {
            this.nUsername.addEventListener('input', function() {
                _.delClass(this.nUsername,'in-err');
                this.showMsg();
            }.bind(this));
            this.nPassword.addEventListener('input',function() {
                _.delClass(this.nPassword,'in-err');
                this.showMsg();
            }.bind(this));
        },
        // 按钮禁用
        btnDisabled: function(bool) {
            this.submitBtn.disabled = !!bool;
            var method = !bool ? 'remove' : 'add';
            this.submitBtn.classList[method]('z-disabled');
        },
        // 手机验证
        isPhone: function() {
            this.nUsername.addEventListener('blur', function() {
                var mobile_rule = /^0?(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/;
                if (this.nUsername.value.match(mobile_rule) == null) {
                    this.addInvalid(this.nUsername,'请输入正确的手机号!');
                    return false;
                } else {
                    return true;
                }
            }.bind(this));
            this.nUsername.addEventListener('invalid', function(e) {
                e.preventDefault();
                this.addInvalid(this.nUsername,'请输入正确的手机号!');
                this.nUsername.focus();
            }.bind(this))
        },
        // 密码验证
        isPsw: function() {
            var psw = this.nPassword.value;
            var msg = '';
            if (psw.length < 6) {
                msg = '密码长度必须大于6位!';
            } else if (!/\d/.test(psw) || !/[a-z]/.test(psw)) {
                msg = '密码必须包含字母和数字!';
            }
            if (!!msg) {
                this.addInvalid(this.nPassword,msg);
                this.nPassword.focus();
                return false;
            } else {
                return true;
            }
        },
        // 记住密码
        isRmebr: function() {
            var checkbox = _.$('#remember');
            if (checkbox.checked) {
                return 1;
            } else {
                return 0;
            }
        },
        submit: function(e) {
            e.preventDefault(); //取消默认
            if(!(this.isPsw()) || _.$('.in-err') ) {
                return;
            }
            this.isPsw(); //验证密码
            this.btnDisabled(true);
            var data = {
                username: this.nUsername.value.trim(),
                password: hex_md5(this.nPassword.value),
                remember: !!this.isRmebr()
            };
            _.ajax({
                url: '/api/login',
                method: 'post',
                ContentType: 'application/json',
                data: data,
                callback: function(data) {
                    var data = JSON.parse(data);
                    console.log(data)
                    if (data.code === 200) {
                        this.hide();
                        this.emit('ok', data.result);
                    } else {
                        this.btnDisabled();
                        switch (data.code) {
                            case 400:
                                this.showMsg('帐号或密码错误,请重新输入');
                                this.btnDisabled(true);
                                break;
                            case 404:
                                this.showMsg('网络错误');
                                break;
                        }
                    }
                }.bind(this)
            })
        }
    })
    App.LoginModal = LoginModal;
}(window.App)
// 注册框
! function(App) {
    var html = `
        <div class="modal-reg">
            <div><img src="" alt="logo">/漫画学园/</div>
            <form class="m-form" id="registerform">
                <!-- 手机 -->
                <div class="u-formitem">
                    <label for="phone" class="formitem_tt">手机号</label>
                    <input type="text" name="phone" id="phone" placeholder="请输入11位手机号码"
                    maxlength="11" class="formitem_ct u-ipt">
                </div>
                <!-- 昵称 -->
                <div class="u-formitem">
                    <label for="nickname" class="formitem_tt">昵称</label>
                    <input type="text" name="nickname" id="nickname" placeholder="中英文均可(不含空格),至少8个字符"
                    minlength="8" class="formitem_ct u-ipt">
                </div>
                <!-- 密码 -->
                <div class="u-formitem">
                    <label for="password" class="formitem_tt">密码</label>
                    <input type="password" name="password" id="password" placeholder="长度6-16个字符,不包含空格"
                    maxlength="11" class="formitem_ct u-ipt">
                </div>
                <div class="u-formitem">
                    <label for="surepsw" class="formitem_tt">确认密码</label>
                    <input type="password" name="surepsw" id="surepsw" placeholder=""
                    class="formitem_ct u-ipt">
                </div>
                <!-- 性别 -->
                <div class="u-formitem">
                    <label for="sex" class="formitem_tt">性别</label>
                    <div class="sexcheck">
                        <div>
                        <label for="boy">
                            <input type="radio" name="sex" id="boy" value="0">
                            <i class="u-icon u-icon-radio"></i>
                            <i class="u-icon u-icon-radiochecked"></i><span>少男</span>
                        </label>
                        </div>
                        <div>
                        <label for="girl">
                            <input type="radio" name="sex" id="girl" value="1">
                            <i class="u-icon u-icon-radio"></i>
                            <i class="u-icon u-icon-radiochecked"></i><span>少女</span>
                        </label>
                        </div>
                    </div>
                </div>
                <!-- 生日 -->
                <div class="u-formitem list">
                    <label for="" class="formitem_tt">生 日</label>
                    <div class="m-birthdayselect" id="birthday">
                    
                    </div>
                </div>
                <!-- 地区 -->
                <div class="u-formitem">
                    <label for="" class="formitem_tt">所在地</label>
                    <div class="m-cascadeselect" id="location">
                    
                    </div>
                </div>
                <!-- 验证码 -->
                <div class="u-formitem">
                    <label for="testcode" class="formitem_tt">验证码</label>
                    <div class="formitem_ct u-ipt">
                        <input type="text" name="testcode" id="testcode">
                        <img id="captchaimg" src="/captcha" alt="验证码">
                    </div>
                </div>
                <div class="u-error f-dn">
                    <span class="u-icon u-icon-error"></span>
                    <span id="errormsg"></span>
                </div>
                <div class="u-formitem u-formitem-2">
                    <label for="clause" class="u-checkbox u-checkbox-remember">
                        <input type="checkbox" id="clause" name="clause">
                        <i class="u-icon u-icon-checkbox"></i>
                        <i class="u-icon u-icon-checkboxchecked"></i>
                        <span>我已阅读并同意相关条款</span>
                    </label>
                    <span class="f-fr"></span>
                </div>
                <button id="registerbtn" class="u-btn u-btn-primary" type="submit">注&nbsp;&nbsp;册</button>
            </form>
        </div>`;

    function RegisterModal() {
        this.node = _.tempToNode(html);
        this.registerform = this.node.querySelector('#registerform');

        this.nPhone = this.registerform.phone;
        this.nNickname = this.registerform.nickname;
        this.nPassword = this.registerform.password;
        this.nSurepsw = this.registerform.surepsw;
        this.sexcheck = this.node.getElementsByClassName('sexcheck')[0];
        this.nSex = this.registerform.sex;
        this.nTestcode = this.node.querySelector('#captchaimg');
        this.nTestValue = this.registerform.testcode;
        this.nClause = this.registerform.clause
        this.error = this.node.getElementsByClassName('u-error')[0];
        this.errMsg = this.node.querySelector('#errormsg');
        this.submitBtn = this.node.querySelector('#registerbtn');

        App.Modal.call(this, {});
        this.initSelect();
        this.initRegisterModal();
    }
    RegisterModal.prototype = Object.create(App.Modal.prototype);
    _.extend(RegisterModal.prototype, {
        initRegisterModal: function() {
            this.show(this.node);
            this.initEvent();
        },
        initSelect: function() {
            // 渲染下拉菜单
            this.locationSelect = new App.CascadeSelect({
                container: this.node.querySelector('#location')
            });
            this.birthday = new App.BirthdaySelect({
                container: this.node.querySelector('#birthday')
            })
        },
        initEvent: function() {
            // 验证码
            this.nTestcode.addEventListener('click', function() {
                this.resetTestCode();
            }.bind(this));
            // 输入框
            this.node.addEventListener('input', function(event) {
                _.delClass(event.target, 'in-err');
                this.showMsg();
                this.btnDisabled();
            }.bind(this));
            // 条款
            this.nClause.addEventListener('click', function() {
                    this.showMsg();
                    this.btnDisabled();
                }.bind(this))
                // 性别
            this.sexcheck.addEventListener('click', function() {
                    this.showMsg();
                    this.btnDisabled();
                }.bind(this))
                // 提交
            this.submitBtn.addEventListener('click', function(e) {
                this.submit(e);
            }.bind(this))
            this.isPhone(); //手机
            this.isNikeName(); //昵称
            this.isSure(); //确认密码
        },
        // 刷新验证码
        resetTestCode: function() {
            this.nTestcode.src = "/captcha?t=" + +new Date();
        },
        // 信息栏
        showMsg: function(nmsg) {
            if (!nmsg) {
                _.addClass(this.error, 'f-dn');
                this.btnDisabled();
            } else {
                _.delClass(this.error, 'f-dn');
                this.errMsg.innerHTML = nmsg;
                this.btnDisabled(true);
            }
        },
        addInvalid: function(node, nmsg) {
            this.showMsg(nmsg);
            _.addClass(node, 'in-err');
        },
        // 按钮禁用
        btnDisabled: function(bool) {
            this.submitBtn.disabled = !!bool;
            var method = !bool ? 'remove' : 'add';
            this.submitBtn.classList[method]('z-disabled');
        },
        // 手机验证
        isPhone: function() {
            this.nPhone.addEventListener('blur', function() {
                var mobile_rule = /^0?(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/;
                if (this.nPhone.value.match(mobile_rule) == null) {
                    this.addInvalid(this.nPhone, '请输入正确的手机号!');
                    return;
                }
            }.bind(this));
        },
        // 昵称验证
        isNikeName: function() {
            this.nNickname.addEventListener('blur', function() {
                var nikename_rule = /([a-zA-Z0-9_\u4e00-\u9fa5]{8,})/gm;
                if (!nikename_rule.test(this.nNickname.value)) {
                    this.addInvalid(this.nNickname, '不支持的昵称!');
                    return;
                }
            }.bind(this))
        },
        // 密码验证:重复密码
        isSure: function(psw) {
            this.nSurepsw.addEventListener('blur', function() {
                var psw = this.nPassword.value;
                if (this.nSurepsw.value !== psw) {
                    this.addInvalid(this.nSurepsw, '密码不一致!');
                    return;
                }
            }.bind(this))
        },
        // 以下项目提交注册时校验
        // 密码验证
        isPsw: function() {
            var psw = this.nPassword.value;
            var msg = '';
            if (psw.length < 6) {
                msg = '密码长度必须大于6位!';
            } else if (!/\d/.test(psw) || !/[a-z]/.test(psw)) {
                msg = '密码必须包含字母和数字!';
            }
            if (!!msg) {
                this.addInvalid(this.nPassword, msg);
                this.nPassword.focus();
                return false;
            } else {
                return true;
            }
        },
        // 性别
        isSex: function() {
            if (!!this.nSex.value) {
                return true;
            } else {
                this.showMsg('请选择性别');
                return false
            }
        },
        // 同意条款
        isAgreeClause: function() {
            var clause = this.registerform.clause;
            if (!!this.nClause.checked) {
                return true;
            } else {
                this.showMsg('请先阅读条款');
                return false;
            }
        },
        submit: function(event) {
            event.preventDefault();
            if(!(!!this.isPsw() && !!this.isSex() && !!this.isAgreeClause()) || _.$('.in-err') ) {
                this.btnDisabled(true);
                return;
            }
            this.btnDisabled(true);
            var data = {
                username: this.nPhone.value.trim(),
                nickname: this.nNickname.value.trim(),
                sex: this.nSex.value,
                province: null,
                city: null,
                district: null,
                birthday: "",
                password: hex_md5(this.nPassword.value),
                captcha: this.nTestValue.value.trim()
            };
            data.birthday = this.birthday.getValue().join('-');
            this.location = this.locationSelect.getValue();
            data.province = this.location[0];
            data.city = this.location[1];
            data.district = this.location[2];
            _.ajax({
                url: '/api/register',
                method: 'post',
                ContentType: 'application/json',
                data: data,
                callback: function(data) {
                    var data = JSON.parse(data);
                    if (data.code == 200) {
                        this.hide();
                        new App.LoginModal();
                    } else {
                        if (data.msg === 'captcha is incorrect') {
                            this.showMsg('验证码错误');
                            this.resetTestCode();
                        } else if (data.msg === 'has same username') {
                            this.addInvalid(this.nPhone, '注册失败,该手机号已被注册')
                        } else if (data.msg === 'has same nickname') {
                            this.addInvalid(this.nNickname, '注册失败,该昵称已被注册')
                        }
                    }
                }.bind(this)
            })
        },
    })
    App.RegisterModal = RegisterModal;
}(window.App)
// 单个下拉列表模块
! function(App) {
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
                    optionsHTML += `<li data-index=${i}>${data[i][1]}</li>`
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
                this.nValue.innerText = this.options[this.selectedIndex][1];
            _.addClass(this.nOptions[this.selectedIndex], 'z-select');

            this.emit('select', this.getValue());
        }
    })
    App.Select = Select;
}(window.App)
// 地区选择器
! function(App) {
    function CascadeSelect(options) {
        _.extend(this, options);

        this.selectList = [];
        this.data = ADDRESS_CODES;
        this.init();
    }
    _.extend(CascadeSelect.prototype, {
        init: function() {
            for (var i = 0; i < 3; i++) {
                var select = new App.Select({
                    container: this.container
                });
                select.on('select', this.onChange.bind(this, i));
                this.selectList[i] = select;
            }
            this.selectList[0].render(this.data);
        },
        getListValue: function() {
            var value = [];
            // 获取第一个选择
            var selected0 = this.selectList[0].body.getElementsByClassName('z-select')[0];
            var index0 = selected0.dataset.index;
            var data1 = this.data[index0];
            value.push(data1)
                // 获取第二个选择
            var selected1 = this.selectList[1].body.getElementsByClassName('z-select')[0];
            var index1 = selected1.dataset.index;
            var data2 = data1[2][index1];
            value.push(data2)
                // 获取第三个选择
            var selected2 = this.selectList[2].body.getElementsByClassName('z-select')[0];
            var index2 = selected2.dataset.index;
            var data3 = data2[2][index2];
            value.push(data3)
            return value;
        },
        getValue: function() {
            var arr = [];
            arr.push(this.getListValue()[0][0]);
            arr.push(this.getListValue()[1][0]);
            arr.push(this.getListValue()[2][0]);

            return arr
        },
        // 响应select事件,渲染下一个Select数据
        onChange: function(index) {
            var next = index + 1;
            if (next === this.selectList.length) return;
            // 渲染下个选择框
            this.selectList[next].render(this.getList(next));
        },
        // 获取第N个选择框的数据
        getList: function(n) {
            // 获取第一个选择
            var selected0 = this.selectList[0].body.getElementsByClassName('z-select')[0];
            var index0 = selected0.dataset.index;
            var data1 = this.data[index0][2];
            if (n === 2) {
                // 判断直辖市
                if (data1[2] === undefined) {
                    return data1[0][2]
                }
                // 获取第二个选择
                var selected1 = this.selectList[1].body.getElementsByClassName('z-select')[0];
                var index1 = selected1.dataset.index;
                var data2 = data1[index1][2];
                return data2;
            }
            return data1;
        }
    })
    App.CascadeSelect = CascadeSelect;
}(window.App)
// 生日选择器
! function(App) {
    function BirthdaySelect(options) {
        _.extend(this, options);

        this.selectList = [];

        this.init();
    }
    _.extend(BirthdaySelect.prototype, {
        init: function() {
            for (var i = 0; i < 3; i++) {
                var select = new App.Select({
                    container: this.container
                });
                select.on('select', this.onChange.bind(this, i));
                this.selectList[i] = select;
            }

            var y = new Date().getFullYear(),
                ydata = [];
            for (let i = y; i > 1960; i--) {
                var arr = [];
                arr.push('value');
                arr.push(i + '年')
                ydata.push(arr);
            }
            this.selectList[0].render(ydata);
        },
        // 响应select事件,渲染下一个Select数据
        onChange: function(index) {
            var next = index + 1;
            if (next === this.selectList.length) return;
            // 渲染下个选择框
            this.selectList[next].render(this.getList(next));
        },
        // 获取结果
        getValue: function() {
            var arr = [];

            var selected_y = this.selectList[0].body.getElementsByClassName('z-select')[0];
            var year = selected_y.innerText.replace('年', '');
            arr.push(year);

            var selected_m = this.selectList[1].body.getElementsByClassName('z-select')[0];
            var month = selected_m.innerText.replace('月', '');
            arr.push(this.padding0(month));

            var selected_d = this.selectList[2].body.getElementsByClassName('z-select')[0];
            var day = selected_d.innerText.replace('日', '');
            arr.push(this.padding0(day));

            return arr;
        },
        // 补零
        padding0: function(value) {
            if (value > 9) return value;
            if (value < 10) return ('0' + value);
        },
        // 获取数据
        getList: function(n) {
            if (n === 1) {
                var mdata = [];
                for (var i = 1; i < 13; i++) {
                    var arr = [];
                    arr.push('value');
                    arr.push(i + '月');
                    mdata.push(arr);
                }
                return mdata;
            }
            if (n === 2) {
                return this.getDayData();
            }
        },
        // 获取日期数据
        getDayData: function() {
            // 判断月份
            var selected_m = this.selectList[1].body.getElementsByClassName('z-select')[0];
            var month = parseInt(selected_m.dataset.index) + 1;
            var days;
            if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
                days = 31;
            } else if (month == 4 || month == 6 || month == 9 || month == 11) {
                days = 30;
            } else {
                // 判断平闰年
                var selected_y = this.selectList[0].body.getElementsByClassName('z-select')[0];
                var year = selected_y.innerText.substring(0,4);
                if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) { // 判断是否为润二月
                    days = 29;
                } else {
                    days = 28;
                }
            }
            // 返回日期
            var ddata = [];
            for (let i = 1; i < days + 1; i++) {
                var arr = [];
                arr.push('value');
                arr.push(i + '日');
                ddata.push(arr);
            }
            return ddata;
        }
    })
    App.BirthdaySelect = BirthdaySelect;
}(window.App)

// var abc = new App.Modal({
//     title: '请输入新的作品名称',
//     footer: true
// });
// abc.show('<input type="text" id="delete_ipt">')