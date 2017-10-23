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
            if(_.$('.m-modal')) return;
            if (content) this.setContent(content);
            document.body.appendChild(this.container);
        },
        hide: function() {
            if(!_.$('.m-modal')) return;
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
        _onConfirm: function(e) {
            this.emit('confirm')
            this.hide();
        },
        _onCancel: function(e) {
            this.emit('cancel')
            this.hide();
        }
    })
    App.Modal = Modal;
}(window.App)
// var abc = new App.Modal({
//     title: '请输入新的作品名称',
//     footer: true
// });
// abc.show('<input type="text" id="delete_ipt">')