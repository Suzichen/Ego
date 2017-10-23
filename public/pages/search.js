(function(_) {
    function App() {

    };
    // 存用户信息
    App.user = {};
    window.App = App;
    window._ = _;
})(util)
document.addEventListener('DOMContentLoaded', function(e) {
    var msg = new App.Modal({
        title: '提示信息'
    })
    msg.show('<br><br>你好，此页面暂未开放')
});