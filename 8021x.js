$(document).ready(function () { 
    
    $("#enable").change(function () { 
        if ($("#enable").val() == "1"){
            $("#guest_details").removeClass("hidden");
        }else{
            $("#guest_details").addClass("hidden");
        }
        
    });

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

    $(".count_key_show").click(function () { 
        var pass_type = $("#count_key").attr("type");
        if(pass_type == "password"){
            $("#count_key").attr("type","text");
            $('.count_key_show').removeClass('fa-eye-slash').addClass('fa-eye');
        }else{
            $("#count_key").attr("type","password");
            $('.count_key_show').removeClass('fa-eye').addClass('fa-eye-slash');
        }
    });
    $("#saveConfig").click(function (){
        if (!format_volide_ok()) {
            return;
        }
        
        var cookies = getCookie("token");
        var enable = $("#enable").val();
        var ssid_24g = $("#ssid_24g").val();
        var password_24g = $("#passwd_24g").val();
        var encryption_24g = $("#encrypt_24g").val();
        var open_time = $("#guest_open_time").val();
        var lan_isolate;

        if ($("#lan_isolate").prop("checked")){
            lan_isolate = 1;
        }else{
            lan_isolate = 0;
        }

        is_setting_status = 1;

        $.ajax({
            contentType: "appliation/json",
            data: {
                enable:enable,
                ssid_24g:ssid_24g,
                password_24g:password_24g,
                encryption_24g:encryption_24g,
                lan_isolate:lan_isolate,
                open_time:open_time,
                token: cookies
            },
            dataType: "json",
            type: "POST",
            cache: false,
            async: false,
            url: "/goform/set_guest_network",
            success: function (data) {

            }
        });
    })


    $("#resetConfig").click(function (){
        gohref();
    })
});

function getGuestInfo(){
    var cookies = getCookie("token");
    $.ajax({
        type: "POST",
        url: "/goform/get_guest_network",
        data: {
            token: cookies
        },
        dataType: "json",
        success: function (response) { 

        }
    });
}
