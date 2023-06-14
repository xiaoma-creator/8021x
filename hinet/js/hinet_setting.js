$(document).ready(function () {
    get_telnet_setting();
    get_ssh_setting();

	$(".checkbox").simpleSwitch({
        "theme": "FlatCircular"
    });

    $("#telnet_enable").click(function(){
        var enable = 0;
        var cookies = getCookie("token");

		if($(this).attr("checked")){
			$("#Switch0").removeClass("On");
			$("#telnet_enable").attr("checked", false);
            enable = 0;
		}else{
            $("#Switch0").addClass("On");
			$("#telnet_enable").attr("checked", true);
            enable = 1;
		}

        $.post("/goform/hinet_set_telnet", {
            enable: enable,
            token: cookies
        }, function(data) {
            if (data.ret == 1) {
                alert("设置成功");
            }else{
                alert("设置失败");
            }
        })
	})

    $("#ssh_enable").click(function(){
        var enable = 0;
        var cookies = getCookie("token");

		if($(this).attr("checked")){
			$("#Switch1").removeClass("On");
			$("#ssh_enable").attr("checked", false);
            enable = 0;
		}else{
            $("#Switch1").addClass("On");
			$("#ssh_enable").attr("checked", true);
            enable = 1;
		}

        $.post("/goform/hinet_set_ssh", {
            enable: enable,
            token: cookies
        }, function(data) {
            if (data.ret == 1) {
                alert("设置成功");
            }else{
                alert("设置失败");
            }
        })
	})
});

function get_telnet_setting() {
    var cookies = getCookie("token");

    $.ajax({
        type: "post",
        url: "/goform/hinet_get_telnet",
        data: {
            tocken: cookies
        },
        dataType: "json",
        async: false,
        Cache: false,
        success: function (response) {
            if (response.enable == 1){
                $("#Switch0").addClass("On");
                $("#telnet_enable").attr("checked", true);
            }else{
                $("#Switch0").removeClass("On");
                $("#telnet_enable").attr("checked", false);
            }
        }
    });
}

function get_ssh_setting() {
    var cookies = getCookie("token");

    $.ajax({
        type: "post",
        url: "/goform/hinet_get_ssh",
        data: {
            tocken: cookies
        },
        dataType: "json",
        async: false,
        Cache: false,
        success: function (response) {
            if (response.enable == 1){
                $("#Switch1").addClass("On");
                $("#ssh_enable").attr("checked", true);
            }else{
                $("#Switch1").removeClass("On");
                $("#ssh_enable").attr("checked", false);
            }
        }
    });
}

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
