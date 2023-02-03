$(document).ready(function () { 
    get8021xInfo();

    $(".auth_key_show").click(function () { 
        var pass_type = $("#auth_key").attr("type");
        if(pass_type == "password"){
            $("#auth_key").attr("type","text");
            $('.auth_key_show').removeClass('fa-eye-slash').addClass('fa-eye');
        }else{
            $("#auth_key").attr("type","password");
            $('.auth_key_show').removeClass('fa-eye').addClass('fa-eye-slash');
        }
    });

    $(".acct_key_show").click(function () { 
        var pass_type = $("#acct_key").attr("type");
        if(pass_type == "password"){
            $("#acct_key").attr("type","text");
            $('.acct_key_show').removeClass('fa-eye-slash').addClass('fa-eye');
        }else{
            $("#acct_key").attr("type","password");
            $('.acct_key_show').removeClass('fa-eye').addClass('fa-eye-slash');
        }
    });

    $("#saveConfig").click(function (){
        if (!format_volide_ok()) {
            return;
        }

        var cookies = getCookie("token");
        var auth_server = $("#auth_server").val();
        var auth_port = $("#auth_port").val();
        var auth_key = $("#auth_key").val();
        var acct_server = $("#acct_server").val();
        var acct_port = $("#acct_port").val();
        var acct_key = $("#acct_key").val();

        is_setting_status = 1;

        $.ajax({
            contentType: "appliation/json",
            data: {
                auth_server:auth_server,
                auth_port:auth_port,
                auth_key:auth_key,
                acct_server:acct_server,
                acct_port:acct_port,
                acct_key:acct_key,
                token: cookies
            },
            dataType: "json",
            type: "POST",
            cache: false,
            async: false,
            url: "/goform/set_8021x",
            success: function (data) {
                if(data.ret == 0){
                    //设置成功
                    setting(20,gohref);
                }else{
                    //设置失败
                    shconfirm(set_error, 'confirm', {
                        onClose: function () {
                            gohref();
                        }
                    })
                }
            }
        });
    })


    $("#resetConfig").click(function (){
        gohref();
    })
});

function get8021xInfo(){
    var cookies = getCookie("token");
    $.ajax({
        type: "POST",
        url: "/goform/get_8021x_info",
        data: {
            token: cookies
        },
        dataType: "json",
        success: function (response) {
            $("#auth_server").val(response.auth_server);
            if (response.auth_port == ""){
                $("#auth_port").val("1812");
            }else{
                $("#auth_port").val(response.auth_port);
            }
            $("#auth_key").val(response.auth_key);

            $("#acct_server").val(response.acct_server);
            if (response.acct_port == ""){
                $("#acct_port").val("1813");
            }else{
                $("#acct_port").val(response.acct_port);
            }
            $("#acct_key").val(response.acct_key);
        }
    });
}
