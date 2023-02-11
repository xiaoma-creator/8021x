$(document).ready(function () {
    $(".checkbox").simpleSwitch({
        "theme": "FlatCircular"
    });

    get_netmanager();

    $("#acs_check").click(function (){
        if($(this).attr("checked")){
            $("#Switch0").removeClass("On");
            $("#acs_check").attr("checked", false);
            $("#div_acs_username").attr("hidden", "true");
            $("#div_acs_password").attr("hidden", "true");
        }else{
            $("#Switch0").addClass("On");
            $("#acs_check").attr("checked", true);
            $("#div_acs_username").removeAttr("hidden");
            $("#div_acs_password").removeAttr("hidden");
        }
    })

    $("#cpe_check").click(function (){
        if($(this).attr("checked")){
            $("#Switch1").removeClass("On");
            $("#cpe_check").attr("checked", false);
            $("#div_cpe_username").attr("hidden", "true");
            $("#div_cpe_password").attr("hidden", "true");
        }else{
            $("#Switch1").addClass("On");
            $("#cpe_check").attr("checked", true);
            $("#div_cpe_username").removeAttr("hidden");
            $("#div_cpe_password").removeAttr("hidden");
        }
    })

    $(".acs_password_show").click(function () { 
        var pass_type = $("#acs_password").attr("type");
        if(pass_type == "password"){
            $("#acs_password").attr("type","text");
            $('.acs_password_show').removeClass('fa-eye-slash').addClass('fa-eye');
        }else{
            $("#acs_password").attr("type","password");
            $('.acs_password_show').removeClass('fa-eye').addClass('fa-eye-slash');
        }
    });

    $(".cpe_password_show").click(function () { 
        var pass_type = $("#cpe_password").attr("type");
        if(pass_type == "password"){
            $("#cpe_password").attr("type","text");
            $('.cpe_password_show').removeClass('fa-eye-slash').addClass('fa-eye');
        }else{
            $("#cpe_password").attr("type","password");
            $('.cpe_password_show').removeClass('fa-eye').addClass('fa-eye-slash');
        }
    });

    $("#netmanager_enable").change(function () {
        if ($("#netmanager_enable").val() == 1) {
            $('#netmanager_details').removeClass('hidden');
        } else {
            $('#netmanager_details').addClass('hidden');
        }
    })

    $("#apply_id").click(function () {
        if (!format_volide_ok()) {
            return;
        }
        var acs_url = $("#acs_url").val();
        var acs_auth = 0;
        var cpe_auth = 0;
        var inform_interval = $("#inform_interval").val();
        var acs_username = $("#acs_username").val();
        var acs_password = $("#acs_password").val();
        var cpe_username = $("#cpe_username").val();
        var cpe_password = $("#cpe_password").val();
        var cpe_install_location = $("#cpe_install_location").val();
        var cookies = getCookie("token");
        var this_obj = $(this);

        if ($("#acs_check").attr("checked")){
            acs_auth = 1;
        }
        if ($("#cpe_check").attr("checked")){
            cpe_auth = 1;
        }

        if( acs_url.length == 0)
        {
            shconfirm(netmanager_url_error, 'confirm', {
                    onClose: function () {
                        gohref();
                    }
                })
            return;
        }

        is_setting_status = 1;

        $.post("/goform/set_netmanager", {
            acs_url: acs_url,
            acs_auth:acs_auth,
            cpe_auth:cpe_auth,
            acs_username: acs_username,
            acs_password: acs_password,
            cpe_username: cpe_username,
            cpe_password: cpe_password,
            cpe_install_location: cpe_install_location,
            inform_interval:inform_interval,
            token: cookies
        }, function (data) {
            if (data.ret == 1) {
                setting(7, gohref);
            } else {
                shconfirm(set_error, 'confirm', {
                    onClose: function () {
                        gohref();
                    }
                })
            }
        })
    })

	function get_netmanager() {
		var cookies = getCookie("token");
		$.ajax({
			contentType: "appliation/json",
			data: {token: cookies},
			dataType: "json",
			type: "POST",
			cache: false,
			async: false,
			url: "/goform/get_netmanager",
            success: function (data) {
                if (data.connect_status){
                    $("#connect_status").text(link_yes);
                    $("#connect_status").css("color", "green");
                }else{
                    $("#connect_status").text(link_no);
                    $("#connect_status").css("color", "crimson");                          
                }
                $("#acs_url").val(data.acs_url);
                $("#acs_username").val(data.acs_username);
                $("#acs_password").val(data.acs_password);
                $("#cpe_username").val(data.cpe_username);
                $("#cpe_password").val(data.cpe_password);
                $("#cpe_install_location").val(data.cpe_install_location);
                $("#inform_interval").val(data.inform_interval);
                if (data.acs_auth == 0){
                    $("#Switch0").removeClass("On");
                    $("#acs_check").attr("checked", false);
                    $("#div_acs_username").attr("hidden", "true");
                    $("#div_acs_password").attr("hidden", "true");
                }else{
                    $("#Switch0").addClass("On");
                    $("#acs_check").attr("checked", true);
                    $("#div_acs_username").removeAttr("hidden");
                    $("#div_acs_password").removeAttr("hidden");
                }

                if (data.cpe_auth == 0){
                    $("#Switch1").removeClass("On");
                    $("#cpe_check").attr("checked", false);
                    $("#div_cpe_username").attr("hidden", "true");
                    $("#div_cpe_password").attr("hidden", "true");
                }else{
                    $("#Switch1").addClass("On");
                    $("#cpe_check").attr("checked", true);
                    $("#div_cpe_username").removeAttr("hidden");
                    $("#div_cpe_password").removeAttr("hidden");
                }
            }
        })
    }

    $("#clear_id").click(function () {
        clearall();
        window.location.reload();
    })
})
