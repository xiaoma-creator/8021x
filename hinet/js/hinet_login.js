$(document).ready(function () {

    /** 退出登录*/
    function logout() {
        $.ajax({
            contentType: "appliation/json",
            data: "{}",
            dataType: "json",
            type: "POST",
            url: "/goform/logout"
        })
    }

    $("#login").click(function () {
        var username = $("#username").val();
        var password = $("#password").val();
        var cookies = getCookie("token");
        var hash = CryptoJS.HmacSHA256(password, cookies);
        var hashInHex = CryptoJS.enc.Hex.stringify(hash);

        $.post("/goform/hinet_login", {
            username: username,
            password: hashInHex,
            token: cookies
        }, function(data) {
            if (data.ret == 1) {
                window.location.reload();
            } else if (data.ret == 2) {
                alert("设备已登录");
            } else {
                alert("登录失败, 账号或密码错误");
            }
        })
    });
});

function getCookie (name) {
    var strcookie = document.cookie;
    var arrcookie = strcookie.split("; ");
    for(var i = 0; i < arrcookie.length;i++){
        var arr = arrcookie[i].split("=");
        if(arr[0] == name){
            return arr[1];
        }
    }
    return "";
}
