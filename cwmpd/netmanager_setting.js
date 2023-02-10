$(document).ready(function () {
    $(".checkbox").simpleSwitch({
        "theme": "FlatCircular"
    });

    get_netmanager();

    $("#acs_check").click(function (){
        if($(this).attr("checked")){
            $("#Switch0").removeClass("On");
            $("#acs_check").attr("checked", false);
            $("#acs_username").attr("disabled", "true");
            $("#acs_password").attr("disabled", "true");
        }else{
            $("#Switch0").addClass("On");
            $("#acs_check").attr("checked", true);
            $("#acs_username").removeAttr("disabled");
            $("#acs_password").removeAttr("disabled");
        }
    })

    $("#cpe_check").click(function (){
        if($(this).attr("checked")){
            $("#Switch1").removeClass("On");
            $("#cpe_check").attr("checked", false);
            $("#cpe_username").attr("disabled", "true");
            $("#cpe_password").attr("disabled", "true");
        }else{
            $("#Switch1").addClass("On");
            $("#cpe_check").attr("checked", true);
            $("#cpe_username").removeAttr("disabled");
            $("#cpe_password").removeAttr("disabled");
        }
    })

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
                    $("#acs_username").attr("disabled", "true");
                    $("#acs_password").attr("disabled", "true");
                }

                if (data.cpe_auth == 0){
                    $("#Switch1").removeClass("On");
                    $("#cpe_check").attr("checked", false);
                    $("#cpe_username").attr("disabled", "true");
                    $("#cpe_password").attr("disabled", "true");
                }
            }
        })
    }

    $("#clear_id").click(function () {
        clearall();
        window.location.reload();
    })
})
