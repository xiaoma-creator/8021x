var g_nsa_support = "1";
var DirName = new Array();
var FileSubordinate_dir = new Array();
var FileName = new Array();
var FileSize = new Array();
var click_i = 0;
var ShowDir = "/mnt/";

$(document).ready(function () {

    get_5g_methods();
    get_5g_basic_info();
    get_band_lock_info();

    $("#resetConfig").click(function () {
        get_5g_methods();
        get_5g_basic_info();
    })

    $("#resetUpgradeConfig").click(function () {
        get_upgrade_setting();
    })

    $("#saveUpgradeConfig").click(function () {
        $("#upgrade_method").val("1"); //本地升级
        set_upgrade_setting();
    });

    $("#saveConfig").click(function () {
        set_config();
    });

    $("#bandlockresetConfig").click(function () {
        get_band_lock_info();
    })

    $("#bandlockConfig").click(function () {
        set_band_lock_info();
    });

    $("#pinManageConfig").click(function () {
        set_pin_manage();
    });

    $("#pinModifyConfig").click(function () {
        modify_pin_code();
    });

    $("#pinCloseConfig").click(function () {
        close_pin_code();
    });
});

//点击全选
$("#select_laber").click(function () {
    var allcheckvalue = $('#allchecked').attr('data-value');
    if (allcheckvalue == '0') {
        $('#select_laber').text(global_disselect);
        $('.row_checkbox').prop('checked', true).attr('data-value', '1');
        $('#allchecked').prop('checked', true).attr('data-value', '1');
    } else {
        $('#select_laber').text(global_selectall);
        $('.row_checkbox').prop('checked', false).attr('data-value', '0');
        $('#allchecked').prop('checked', false).attr('data-value', '0');
    }
});

$("#tab_basic_set").click(function (){
	$("#tab_li_basic_set").addClass("active");
	$("#tab_li_band_lock").removeClass("active");
	$("#tab_li_pin_manage").removeClass("active");
	$("#tab_li_status_info").removeClass("active");
	$("#tab_li_ca_info").removeClass("active");
	$("#tab_li_upgrade_info").removeClass("active");

	$("#wnd_basic_set").removeClass("hidden");
	$("#wnd_band_lock").addClass("hidden");
	$("#wnd_pin_manage").addClass("hidden");
	$("#wnd_status_info").addClass("hidden");
	$("#wnd_ca_info").addClass("hidden");
	$("#wnd_upgrade_info").addClass("hidden");
});

$("#tab_band_lock").click(function (){
	$("#tab_li_band_lock").addClass("active");
	$("#tab_li_basic_set").removeClass("active");
	$("#tab_li_pin_manage").removeClass("active");
	$("#tab_li_status_info").removeClass("active");
	$("#tab_li_ca_info").removeClass("active");
	$("#tab_li_upgrade_info").removeClass("active");

	$("#wnd_band_lock").removeClass("hidden");
	$("#wnd_basic_set").addClass("hidden");
	$("#wnd_pin_manage").addClass("hidden");
	$("#wnd_status_info").addClass("hidden");
	$("#wnd_ca_info").addClass("hidden");
	$("#wnd_upgrade_info").addClass("hidden");
});

$("#tab_pin_manage").click(function (){
	get_pin_manage_info();
	$("#tab_li_pin_manage").addClass("active");
	$("#tab_li_band_lock").removeClass("active");
	$("#tab_li_basic_set").removeClass("active");
	$("#tab_li_status_info").removeClass("active");
	$("#tab_li_ca_info").removeClass("active");
	$("#tab_li_upgrade_info").removeClass("active");

	$("#wnd_pin_manage").removeClass("hidden");
	$("#wnd_band_lock").addClass("hidden");
	$("#wnd_basic_set").addClass("hidden");
	$("#wnd_status_info").addClass("hidden");
	$("#wnd_ca_info").addClass("hidden");
	$("#wnd_upgrade_info").addClass("hidden");
});

$("#tab_status_info").click(function (){
	get_status_info();

	$("#tab_li_status_info").addClass("active");
	$("#tab_li_pin_manage").removeClass("active");
	$("#tab_li_band_lock").removeClass("active");
	$("#tab_li_basic_set").removeClass("active");
	$("#tab_li_ca_info").removeClass("active");
	$("#tab_li_upgrade_info").removeClass("active");

	$("#wnd_status_info").removeClass("hidden");
	$("#wnd_pin_manage").addClass("hidden");
	$("#wnd_band_lock").addClass("hidden");
	$("#wnd_basic_set").addClass("hidden");
	$("#wnd_ca_info").addClass("hidden");
	$("#wnd_upgrade_info").addClass("hidden");
});

$("#tab_ca_info").click(function (){
	get_ca_info();

	$("#tab_li_ca_info").addClass("active");
	$("#tab_li_pin_manage").removeClass("active");
	$("#tab_li_band_lock").removeClass("active");
	$("#tab_li_basic_set").removeClass("active");
	$("#tab_li_status_info").removeClass("active");
	$("#tab_li_upgrade_info").removeClass("active");

	$("#wnd_ca_info").removeClass("hidden");
	$("#wnd_pin_manage").addClass("hidden");
	$("#wnd_band_lock").addClass("hidden");
	$("#wnd_basic_set").addClass("hidden");
	$("#wnd_status_info").addClass("hidden");
	$("#wnd_upgrade_info").addClass("hidden");
});

$("#tab_upgrade_info").click(function (){

	get_upgrade_setting();

	$("#file_name").val(Please_select_file);
	$("#loadings_div").addClass('hide');

	$("#tab_li_upgrade_info").addClass("active");
	$("#tab_li_pin_manage").removeClass("active");
	$("#tab_li_band_lock").removeClass("active");
	$("#tab_li_basic_set").removeClass("active");
	$("#tab_li_ca_info").removeClass("active");
	$("#tab_li_status_info").removeClass("active");

	$("#wnd_upgrade_info").removeClass("hidden");
	$("#wnd_pin_manage").addClass("hidden");
	$("#wnd_band_lock").addClass("hidden");
	$("#wnd_basic_set").addClass("hidden");
	$("#wnd_ca_info").addClass("hidden");
	$("#wnd_status_info").addClass("hidden");
});

$(document).on("click","#usb_tab tr",function (){
	$(this).siblings('tr').removeClass('tr_selected');  		// 删除其他兄弟元素的样式
 	$(this).addClass('tr_selected');
})

$(document).on("click", ".td_return", function () { //返回上级目录
	click_i++;
	setTimeout(function () {
		click_i = 0;
		$(".rm_dir_file").attr("rm_dir_file", "");
		$("#mv_dir_file").attr("mv_dir_file", "");
	}, 300);
	if (click_i > 1) {
		ShowDir = $(this).attr("sup_dir");
		show_file(ShowDir);
		$("#rm_dir_file").attr("rm_dir_file", ""); //返回上级时清空掉选中目录
		$("#mv_dir_file").attr("mv_dir_file", "");
		click_i = 0;
	}
})

$(document).on("click", ".table_dir", function () { //进入选择目录
	var buf = $(this).attr("sup_dir");
	var dir = $(this).attr("dir");
	click_i++;
	setTimeout(function () {
		if (click_i == 1) {
			$("#select_file").attr("select_file", buf); //单击时选中目录或文件。用于删除文件夹或文件和重命名文件夹或文件
			click_i = 0;
		}
	}, 300);
	if (click_i > 1) {
		if (dir == 1) {
			ShowDir = buf;
			show_file(ShowDir); //进入目录
		}
		click_i = 0;
	}
})

$("#upgrade_method").change(function(){
	if($("#upgrade_method").val() == "0")
	{
		$("#server_type_row").show();

		if($("#upgrade_server_type").val() == "0")
		{
			$("#username_row").show();
			$("#password_row").show();
			$("#serverurl_row").show();
			$("#port_row").show();
			$("#filepath_row").show();
		}
		else
		{
			$("#username_row").hide();
			$("#password_row").hide();
			$("#serverurl_row").show();
			$("#port_row").show();
			$("#filepath_row").show();
		}

		$("#upgrade").hide();
	}
	else
	{
		$("#server_type_row").hide();
		$("#username_row").hide();
		$("#password_row").hide();
		$("#serverurl_row").hide();
		$("#port_row").hide();
		$("#filepath_row").hide();

		$("#upgrade").show();
	}

});

$("#upgrade_server_type").change(function(){
	if($("#upgrade_server_type").val() == "0")
	{
		$("#username_row").show();
		$("#password_row").show();
		$("#serverurl_row").show();
		$("#port_row").show();
		$("#filepath_row").show();
	}
	else
	{
		$("#username_row").hide();
		$("#password_row").hide();
		$("#serverurl_row").show();
		$("#port_row").show();
		$("#filepath_row").show();
	}
});

// 添加和修改
$("#savemethod").click(function () {
	url = ""; // 请求地址
	var cookies = getCookie("token");
	console.log(format_volide_ok())
	if (!format_volide_ok()) {
		return;
	}

	var data = {
		"token" : cookies,
		"id" : $("#lte_id").val(),
		"name" : $("#lte_name").val(),
		"apn" : $("#lte_apn").val(),
		"username" : $("#lte_username").val(),
		"password" : $("#lte_passwd").val(),
		"type": $("#lte_type").val(),
	}

	if(data.id ==''){
		url = "/goform/add_5g_methods"
	}else{
		url = "/goform/set_5g_methods"
	}

	is_setting_status = 1;

	$.post(url, data, function (data) {
		// 根据返回结果处理
		if (data.ret == 1) {
			close();
			setting(3, gohref);
		}else if (data.ret == 2) {
			shconfirm(lte_set_error, 'confirm', {
				onOk: function () {
					  return;
				}
			})
			return;
		}else if (data.ret == 3) {
			shconfirm(lte_add_error, 'confirm', {
				onOk: function () {
					  return;
				}
			})
			return;
		}else{
			shconfirm(set_error, 'confirm', {
				onOk: function () {
					  return;
				}
			})
			return;
		}
	})
});

// 删除
function delselect() {
    const url= "/goform/del_5g_methods";
    var list, this_checked, cookies;
    this_checked = $('#tbody_info').find('input:checked');
    if (this_checked.length < 1) {
        shconfirm(del_comfirm, 'confirm', {
            onOk: function () {
                return;
            }
        })
    } else {
        shconfirm(del_sure, 'confirm', {
            onOk: function () {
                cookies = getCookie("token");
                list = '';
                this_checked.each(function (n, m) {
                    list += $(m).parents('tr').find('.id').text() + ',';
                });

                is_setting_status = 1;

                $.post(url, {
                    delvalue: list,
                    token : cookies
                }, function (data) {
                    console.log('data.ret', data.ret)
                    if (data.ret == 1) {
                        close();
                        setting(3, gohref);
                    } else {
                        shconfirm(set_error, 'confirm', {
                            onClose: function () {
                                gohref();
                            }
                        })
                    }
                })
            }
        })
    }
}

function addlist(){
    $('#mobile_setting_header').text(global_add)
    clearall();
}

function editConfig(evt) {
    var name = $(evt).parents('tr').find('.name').text().trim()
    $('#mobile_setting_header').text(global_edit + " " + name)
    clearall();
    setform(evt);
}

function setform(evt) {
    var id, name, apn, username, password, type;
    id = $(evt).parents('tr').find('.id').text().trim();
    name = $(evt).parents('tr').find('.name').text().trim();
    apn = $(evt).parents('tr').find('.apn').text().trim();
    username = $(evt).parents('tr').find('.username').text().trim();
    password = $(evt).parents('tr').find('.password').text().trim();
    type = $(evt).parents('tr').find('.type').text().trim();
    $("#lte_id").val(id);
    $("#lte_name").val(name);
    $("#lte_apn").val(apn);
    $("#lte_username").val(username);
    $("#lte_passwd").val(password);
    if(type == "NONE")
        $("#lte_type").val("0");
    else if(type == "PAP")
        $("#lte_type").val("1");
    else if(type == "CHAP")
        $("#lte_type").val("2");
    else
        $("#lte_type").val("3");
}


function show_5g_passwd_click() {
    var pass_type = $("#lte_passwd").attr("type");
    if(pass_type == "password"){
        $("#lte_passwd").attr("type","text");
        $('.5g_passwd_show').removeClass('fa-eye-slash').addClass('fa-eye');
    }else{
        $("#lte_passwd").attr("type","password");
        $('.5g_passwd_show').removeClass('fa-eye').addClass('fa-eye-slash');
    }
}

function changeState(name, isChecked)
{
    var chk_list=document.getElementsByName(name);

    for (var i=0; i<chk_list.length;++i)
    {
        if (chk_list[i].type=="checkbox")
        {
            chk_list[i].checked=isChecked;
        }
    }
}

function changeItemState(name, isChecked)
{
	var chk_list=document.getElementsByName(name);

	if (isChecked == false)
	{
		chk_list[0].checked=isChecked;
	}
}

function get_5g_basic_info() {
    var cookies = getCookie("token");
    $.ajax({
        contentType: "appliation/json",
        data: {token: cookies},
        dataType: "json",
        type: "POST",
        cache: false,
        async: false,
        url: "/goform/get_5g_basic_info",
        success: function (data) {
            if ("0" == data.bandlock_support)
            {
                $("#tab_li_band_lock").addClass("hidden");
            }
            if ("0" == data.statusInfo_support)
            {
                $("#tab_li_status_info").addClass("hidden");
            }
            if ("0" == data.pin_support)
            {
                $("#tab_li_pin_manage").addClass("hidden");
            }
            if ("0" == data.caInfo_support)
            {
                $("#tab_li_ca_info").addClass("hidden");
            }
            if ("0" == data.upgrade_support)
            {
                $("#tab_li_upgrade_info").addClass("hidden");
            }
            if ("1" == data.pageset)
            {
                $("#tab_li_band_lock").addClass("active");
                $("#tab_li_basic_set").removeClass("active");
                $("#tab_li_pin_manage").removeClass("active");
                $("#tab_li_ca_info").removeClass("active");
                $("#tab_li_upgrade_info").removeClass("active");

                $("#wnd_band_lock").removeClass("hidden");
                $("#wnd_basic_set").addClass("hidden");
                $("#wnd_pin_manage").addClass("hidden");
                $("#wnd_ca_info").addClass("hidden");
                $("#wnd_upgrade_info").addClass("hidden");
            }
            else if ("2" == data.pageset)
            {
                get_pin_manage_info();
                $("#tab_li_pin_manage").addClass("active");
                $("#tab_li_band_lock").removeClass("active");
                $("#tab_li_basic_set").removeClass("active");
                $("#tab_li_ca_info").removeClass("active");
                $("#tab_li_upgrade_info").removeClass("active");

                $("#wnd_pin_manage").removeClass("hidden");
                $("#wnd_band_lock").addClass("hidden");
                $("#wnd_basic_set").addClass("hidden");
                $("#wnd_ca_info").addClass("hidden");
                $("#wnd_upgrade_info").addClass("hidden");
            }
            else if ("3" == data.pageset)
            {
                get_ca_info();
                $("#tab_li_ca_info").addClass("active");
                $("#tab_li_upgrade_info").removeClass("active");
                $("#tab_li_pin_manage").removeClass("active");
                $("#tab_li_band_lock").removeClass("active");
                $("#tab_li_basic_set").removeClass("active");

                $("#wnd_ca_info").removeClass("hidden");
                $("#wnd_upgrade_info").addClass("hidden");
                $("#wnd_pin_manage").addClass("hidden");
                $("#wnd_band_lock").addClass("hidden");
                $("#wnd_basic_set").addClass("hidden");
            }
            else if ("4" == data.pageset)
            {
                get_upgrade_setting();
                $("#tab_li_upgrade_info").addClass("active");
                $("#tab_li_pin_manage").removeClass("active");
                $("#tab_li_band_lock").removeClass("active");
                $("#tab_li_basic_set").removeClass("active");
                $("#tab_li_ca_info").removeClass("active");

                $("#wnd_upgrade_info").removeClass("hidden");
                $("#wnd_pin_manage").addClass("hidden");
                $("#wnd_band_lock").addClass("hidden");
                $("#wnd_basic_set").addClass("hidden");
                $("#wnd_ca_info").addClass("hidden");
            }
            else
            {
                $("#select_lte_id").val(data.szLteId);
                $("#select_5g_mode").val(data.szMode);
            }
        }
    })
}

function get_5g_methods(){
    const url = "/goform/get_5g_methods"; // 请求地址
    var cookies = getCookie("token");
    var list = '';
    var options = '<option value="-1">None</option>';
    $.ajax({
        contentType: "appliation/json",
        data: {token: cookies},
        dataType: "json",
        type: "POST",
        cache: false,
        async: false,
        url: url,
        success: function (data) {
            data=data.methods;
            $("#tbody_info").empty();
            $("#select_lte_id").empty();
            $.each(data, function (idx, item) {
                list += '<tr class="text-center">';
                list += '<td><input class="row_checkbox" onclick="select_row(this)" type="checkbox"/></td>';
                list += '<td class="id" style="display:none">' + item.id.trim()+ '</td>';
                list += '<td class="name">' + item.name.trim()+ '</td>';
                list += '<td class="apn">' + item.apn.trim() + '</td>';
                list += '<td class="username">' + item.username.trim() + '</td>';
                list += '<td class="password hidden">' + item.password.trim() + '</td>';
                if(item.type == "0")
                    list += '<td class="type">NONE</td>';
                else if(item.type == "1")
                    list += '<td class="type">PAP</td>';
                else if(item.type == "2")
                    list += '<td class="type">CHAP</td>';
                else
                    list += '<td class="type">PAP/CHAP</td>';
                list += '<td><a data-toggle="modal" data-target="#modal_one" onclick="editConfig(this);" class="table-link"><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i title="' + global_edit + '" class="fa fa-pencil fa-stack-1x fa-inverse"></i></span></a>' +
                    '</td>';
                list += '</tr>';
                options += '<option value="' + idx + '">'+ item.name.trim() + '</option>';
            })
            $("#tbody_info").append(list);
            $("#select_lte_id").append(options);
        }
    })
}

function get_ca_info(){
    const url = "/goform/get_ca_info"; // 请求地址
    var cookies = getCookie("token");
    var list = '';
    $.ajax({
        contentType: "appliation/json",
        data: {token: cookies},
        dataType: "json",
        type: "POST",
        cache: false,
        async: false,
        url: url,
        success: function (data) {
            var language = data.language;
            data = data.data;
            $("#ca_tbody_info").empty();
            $.each(data, function (idx, item) {
                list += '<tr class="text-center">';

                if(item.community_type == "PCC")
                {
                    // 主小区
                    if(language == "cn")
                    {
                        list += '<td class="community_type"> 主小区 </td>';

                        // 主小区状态
                        if(item.state == "1")
                        {
                            // 已注册
                            list += '<td class="state"> 已注册 </td>';
                        }
                        else
                        {
                            list += '<td class="state"> 无服务 </td>';
                        }
                    }
                    else
                    {
                        list += '<td class="community_type"> Primary </td>';

                        // 主小区状态
                        if(item.state == "1")
                        {
                            // 已注册
                            list += '<td class="state"> Registered </td>';
                        }
                        else
                        {
                            list += '<td class="state"> No Service </td>';
                        }
                    }
                }
                else
                {
                    // 辅小区
                    if(language == "cn")
                    {
                        list += '<td class="community_type"> 辅小区 </td>';

                        // 辅小区状态
                        if(item.state == "1")
                        {
                            list += '<td class="state"> 配置已去激活 </td>';
                        }
                        else if(item.state == "2")
                        {
                            list += '<td class="state"> 配置已激活 </td>';
                        }
                        else
                        {
                            list += '<td class="state"> 配置解除 </td>';
                        }
                    }
                    else
                    {
                        list += '<td class="community_type"> Secondary </td>';

                        // 辅小区状态
                        if(item.state == "1")
                        {
                            list += '<td class="state"> Not Working </td>';
                        }
                        else if(item.state == "2")
                        {
                            list += '<td class="state"> Configuration Activated </td>';
                        }
                        else
                        {
                            list += '<td class="state"> Configuration Removed </td>';
                        }
                    }
                }

                // 下行频带信息
                list += '<td class="band">' + item.band.trim() + '</td>';

                // 信号接手功率
                list += '<td class="rsrp">' + item.rsrp.trim() + '</td>';

                // RSSNR对数值
                list += '<td class="sinr">' + item.sinr.trim() + '</td>';

                // 接收信号强度指示
                list += '<td class="rssi">' + item.rssi.trim() + '</td>';

                // 物理小区ID
                list += '<td class="pcid">' + item.pcid.trim() + '</td>';

                // 信号接收质量
                list += '<td class="rsrq">' + item.rsrq.trim() + '</td>';

                // 带宽
                if(item.bandwidth == "6")
                {
                    list += '<td class="bandwidth"> 1.4MHz </td>';
                }
                else
                {
                    list += '<td class="bandwidth"> ' + parseInt(item.bandwidth) / 5 + 'MHz </td>';
                }

                // EARFCN
                list += '<td class="freq">' + item.freq.trim() + '</td>';

                list += '</tr>';
            })
            $("#ca_tbody_info").append(list);
        }
    })
}

function refresh_ca_info(){
    const url = "/goform/refresh_ca_info"; // 请求地址
    const enable = "1";
    var cookies = getCookie("token");
    console.log(format_volide_ok())
    if (!format_volide_ok()) {
        return;
    }

    var data = {
        "token" : cookies,
        "enable" : enable,
    }

    is_setting_status = 1;

    $.post(url, data, function (data) {
        // 根据返回结果处理
        if (data.ret == 1) {
            setting(20, gohref);
        }else{
            shconfirm(set_error, 'confirm', {
                onOk: function () {
                    return;
                }
            })
            return;
        }
    });
}

$("#btn_check_upgrade").click(function () {
    var cookies = getCookie("token");

    is_setting_status = 1;
    $("#loadings_div2").addClass("loading");
    $("#loadings_div2").removeClass("hide");
    $("#online_loading_pic").removeClass("hide");

    $.ajax({
        contentType: "appliation/json",
        data: {token: cookies},
        dataType: "json",
        type: "POST",
        cache: false,
        async: true,
        url: "/goform/mobile_check_upgrade",
        success: function (data) {
            $("#online_loading_pic").addClass("hide");
            $("#loadings_div2").addClass("hide");
            $("#loadings_div2").removeClass("loading");
            get_upgrade_setting();
            if (data.ret == 1) {
                var version = data.version;
                var message = g_version + ': ' + version + '\n' + confirm_upgrade + ' ?';
                shconfirm(message, 'upgrade', {
                    onOk: function () {
                        $("#upgrade_method").val("0"); //在线升级
                        set_upgrade_setting();
                    }
                });
            }
            else{
                shconfirm(is_latest_version, "success", {
                })
            }
        }
    })

});
function get_upgrade_setting() {
    var cookies = getCookie("token");
    $.ajax({
        contentType: "appliation/json",
        data: {token: cookies},
        dataType: "json",
        type: "POST",
        cache: false,
        async: false,
        url: "/goform/get_upgrade_setting",
        success: function (data) {
            $("#version").text(data.version);
            $("#upgrade_method").val(data.method);
            $("#upgrade_server_type").val(data.server_type);
            $("#mobile_username").val(data.username);
            $("#mobile_password").val(data.password);
            $("#mobile_serverurl").val(data.server_url);
            $("#mobile_port").val(data.port);
            $("#mobile_filepath").val(data.filepath);

            if(data.method == "1")
            {
                // $("#server_type_row").hide();
                // $("#username_row").hide();
                // $("#password_row").hide();
                // $("#serverurl_row").hide();
                // $("#port_row").hide();
                // $("#filepath_row").hide();

                // $("#upgrade").show();
            }
            else
            {
                // $("#server_type_row").show();

                // if(data.server_type == "0")
                // {
                //     $("#username_row").show();
                //     $("#password_row").show();
                //     $("#serverurl_row").show();
                //     $("#port_row").show();
                //     $("#filepath_row").show();
                // }
                // else
                // {
                //     $("#username_row").hide();
                //     $("#password_row").hide();
                //     $("#serverurl_row").show();
                //     $("#port_row").show();
                //     $("#filepath_row").show();
                // }

                // $("#upgrade").hide();
            }
        }
    })
}

function set_upgrade_setting(){
    if (!format_volide_ok()) {
        return;
    }

    var data = {};
    var time = 0;
    var cookies = getCookie("token");
    var method = $("#upgrade_method").val();
    if(method == "0")
    {
        time = 40;
        var server_type = $("#upgrade_server_type").val();
        var username = $("#mobile_username").val();
        var password = $("#mobile_password").val();
        var server_url = $("#mobile_serverurl").val();
        var port = $("#mobile_port").val();
        var filepath = $("#mobile_filepath").val();

        data = {
            method: method,
            server_type: server_type,
            username: username,
            password: password,
            server_url: server_url,
            port: port,
            filepath: filepath,
            token: cookies
        };
    }
    else
    {
        time = 3;

        var filepath = $("#select_file").val();
        $("#select_file").removeClass('borError');
        $("#select_file").parents('.list').find(".icon_margin").remove();
        if(filepath == "")
        {
            $("#select_file").parents('.list').append('<i class="fa fa-times-circle col-lg-1 col-md-1 col-xs-1 icon_margin icon-error"></i>');
            $("#select_file").addClass("borError");
            return;
        }
        else
        {
            $("#select_file").parents('.list').append('<i class="fa fa-check-circle col-lg-1 col-md-1 col-xs-1 icon_margin icon-success"></i>');
            $("#select_file").removeClass('borError');
        }

        if(filepath.length > 90)
        {
            shconfirm("the length of filepath is too long!", 'confirm', {
                onClose: function () {
                    gohref();
                }
            });
            return;
        }

        data = {
            method: method,
            filepath: filepath,
            token: cookies
        };
    }

    is_setting_status = 1;

    $.post("/goform/set_upgrade_setting", data, function (data) {
        if (data.ret == 1) {
            setting(time, show_upgrade_result);
        }
        else {
            shconfirm(set_error, 'confirm', {
                onClose: function () {
                    gohref();
                }
            })
        }
    })

}

function select_file()
{
    samba_init();
    $("#modal_select_file").addClass("in");
    $("#modal_select_file").css('display', 'block');
}

function save_select()
{
    $("#select_file").text($("#select_file").attr("select_file"));
    $("#select_file").val($("#select_file").attr("select_file"));
    close_select();
}

function close_select()
{
    $("#modal_select_file").removeClass("in");
    $("#modal_select_file").css('display', 'none');
}

var mobile_upgrade_timer;
function show_upgrade_result(){
    var $setbox = (!$('.loading').length) ? $('<div>').addClass('loading') : $('.loading');
    var $backdrop = $('<div>').addClass('loading-backdrop');
    var $loadcont = $('<div>').addClass('loadcont');
    $setbox.empty();
    $setbox.append($backdrop, $loadcont).appendTo('body');

    $("#upgrade_result_box").addClass("in");
    $("#upgrade_result_box").css('display', 'block');
    get_upgrade_result();
    mobile_upgrade_timer = setInterval(get_upgrade_result, 2000);
}

function show_server_upgrade_result(data)
{
    var list = '';

    if(data.cmd_correct == "1"){
        list += '<p>upgrade command correct</p>';
        if(data.server_start == "1"){
            list += '<p>get upgrade package</p>';
            if(data.server_end_code == "0")
            {
                list += '<p>got upgrade package successfully</p>';
                if(data.upgrade_start == "1")
                {
                    list += '<p>upgrade start</p>';
                    if(data.upgrade_process != "")
                    {
                        list += '<p>upgrading ' + data.upgrade_process + '%</p>';
                    }
                }

                if(data.upgrade_end_code != "")
                {
                    if(data.upgrade_end_code == "0")
                    {
                        list += '<p>upgrade success</p>';
                        list += '<p>module init</p>';
                        if(data.upgrade_end == "1")
                        {
                            clearInterval(mobile_upgrade_timer);
                            $("#upgrade_result_box").css('display', 'none');
                            shconfirm(dfota_upgrade_success, 'confirm', {
                                onClose: function () {
                                    gohref();
                                }
                            });
                        }
                    }
                    else if(data.upgrade_end_code == "505")
                    {
                        list += '<p>upgrade failed : the delta firmware package check failed</p>';
                        list += '<p>module reset</p>';
                        if(data.upgrade_end == "1")
                        {
                            clearInterval(mobile_upgrade_timer);
                            $("#upgrade_result_box").css('display', 'none');
                            shconfirm(dfota_upgrade_error505, 'confirm', {
                                onClose: function () {
                                    gohref();
                                }
                            })
                        }
                    }
                    else if(data.upgrade_end_code == "502")
                    {
                        list += '<p>upgrade failed : unkown error or exceptions, or package is incorrect</p>';
                        list += '<p>module reset</p>';
                        if(data.upgrade_end == "1")
                        {
                            clearInterval(mobile_upgrade_timer);
                            $("#upgrade_result_box").css('display', 'none');
                            shconfirm(dfota_upgrade_error502, 'confirm', {
                                onClose: function () {
                                    gohref();
                                }
                            })
                        }
                    }
                    else if(data.upgrade_end_code == "510")
                    {
                        list += '<p>upgrade failed : package file does not match the source package file of the module</p>';
                        list += '<p>module reset</p>';
                        if(data.upgrade_end == "1")
                        {
                            clearInterval(mobile_upgrade_timer);
                            $("#upgrade_result_box").css('display', 'none');
                            shconfirm(dfota_upgrade_error510, 'confirm', {
                                onClose: function () {
                                    gohref();
                                }
                            })
                        }
                    }
                    else if(data.upgrade_end_code == "511")
                    {
                        list += '<p>upgrade failed : no enough space for upgrade</p>';
                        list += '<p>module reset</p>';
                        if(data.upgrade_end == "1")
                        {
                            clearInterval(mobile_upgrade_timer);
                            $("#upgrade_result_box").css('display', 'none');
                            shconfirm(dfota_upgrade_error511, 'confirm', {
                                onClose: function () {
                                    gohref();
                                }
                            })
                        }
                    }
                    else
                    {
                        list += '<p>upgrade failed : the module will reboot and retry to upgrade the firmware until the upgrade is successful</p>';
                        list += '<p>module reset</p>';
                        if(data.upgrade_end == "1")
                        {
                            clearInterval(mobile_upgrade_timer);
                            $("#upgrade_result_box").css('display', 'none');
                            shconfirm(dfota_upgrade_errors, 'confirm', {
                                onClose: function () {
                                    gohref();
                                }
                            })
                        }
                    }
                }
            }
            else if(data.server_end_code == "601" || data.server_end_code == "701")
            {
                list += '<p>get upgrade package failed : unkown error (maybe try to check the network)</p>';
                list += '<p>module reset</p>';
                if(data.upgrade_end == "1")
                {
                    clearInterval(mobile_upgrade_timer);
                    $("#upgrade_result_box").css('display', 'none');
                    shconfirm(dfota_upgrade_error601_or_error701, 'confirm', {
                        onClose: function () {
                            gohref();
                        }
                    });
                }
            }
        }
    }
    else
    {
        if(data.upgrade_end == "1")
        {
            list += '<p>upgrade command error</p>';
            list += '<p>module reset</p>';

            clearInterval(mobile_upgrade_timer);

            $("#upgrade_result_box").css('display', 'none');
            shconfirm(dfota_upgrade_cmd_error, 'confirm', {
                onClose: function () {
                    gohref();
                }
            });
        }
    }

    list+='<span>.</span>';
    $("#upgrade_result_body").empty();
    $("#upgrade_result_body").append(list);

    setTimeout(
        function(){
            list+='<span>.</span>';
            $("#upgrade_result_body").empty();
            $("#upgrade_result_body").append(list);
        },500);
    setTimeout(
        function(){
            list+='<span>.</span>';
            $("#upgrade_result_body").empty();
            $("#upgrade_result_body").append(list);
        },1000);
    setTimeout(
        function(){
            list+='<span>.</span>';
            $("#upgrade_result_body").empty();
            $("#upgrade_result_body").append(list);
        },1500);
}

function show_local_upgrade_result(data)
{
    var list = '';

    if(data.unzip_start == "1")
    {
        list += '<p>start unzip upgrade package</p>';
        if(data.unzip_end == "1")
        {
            if(data.unzip_end_code == "0")
            {
                list += '<p>unzip successfully</p>';
            }
            else
            {
                list += '<p>unzip upgrade package failed: unkonw error!</p>';

                clearInterval(mobile_upgrade_timer);

                $("#upgrade_result_box").css('display', 'none');

                shconfirm("unzip failed: unkonw error!", 'confirm', {
                    onClose: function () {
                        gohref();
                    }
                });
            }
        }
    }

    if(data.upgrade_start == "1")
    {
        list += '<p>upgrade start</p>';
        if(data.upgrade_process != "")
        {
            list += '<p>upgrading ' + data.upgrade_process + '</p>';
        }

        if(data.upgrade_end_code == "0")
        {
            list += '<p>upgrade successfully</p>';
            list += '<p>module init</p>';

            if(data.upgrade_end == "1")
            {
                clearInterval(mobile_upgrade_timer);
                $("#upgrade_result_box").css('display', 'none');

                shconfirm(local_upgrade_success, 'confirm', {
                    onClose: function () {
                        gohref();
                    }
                });
            }
        }
        else if(data.upgrade_end_code == "101")
        {
            if(data.upgrade_end == "1")
            {
                list += '<p>upgrade failed: invalid file or directory</p>';
                list += '<p>module reset</p>';

                clearInterval(mobile_upgrade_timer);
                $("#upgrade_result_box").css('display', 'none');

                shconfirm(local_upgrade_error101, 'confirm', {
                    onClose: function () {
                        gohref();
                    }
                });
            }
        }
        else if(data.upgrade_end_code == "201")
        {
            if(data.upgrade_end == "1")
            {
                list += '<p>upgrade failed: unknow module</p>';
                list += '<p>module reset</p>';

                clearInterval(mobile_upgrade_timer);
                $("#upgrade_result_box").css('display', 'none');

                shconfirm(local_upgrade_error201, 'confirm', {
                    onClose: function () {
                        gohref();
                    }
                });
            }
        }
        else
        {
            if(data.upgrade_end == "1")
            {
                list += '<p>upgrade failed: unknown error</p>';
                list += '<p>module reset</p>';

                clearInterval(mobile_upgrade_timer);
                $("#upgrade_result_box").css('display', 'none');

                shconfirm(local_upgrade_error_unknown, 'confirm', {
                    onClose: function () {
                        gohref();
                    }
                });
            }
        }
    }

    list+='<span>.</span>';
    $("#upgrade_result_body").empty();
    $("#upgrade_result_body").append(list);

    setTimeout(
        function(){
            list+='<span>.</span>';
            $("#upgrade_result_body").empty();
            $("#upgrade_result_body").append(list);
        },500);
    setTimeout(
        function(){
            list+='<span>.</span>';
            $("#upgrade_result_body").empty();
            $("#upgrade_result_body").append(list);
        },1000);
    setTimeout(
        function(){
            list+='<span>.</span>';
            $("#upgrade_result_body").empty();
            $("#upgrade_result_body").append(list);
        },1500);
}

function get_upgrade_result(){
    var cookies = getCookie("token");
    $.ajax({
        contentType: "appliation/json",
        data: {token: cookies},
        dataType: "json",
        type: "POST",
        cache: false,
        async: false,
        url: "/goform/get_upgrade_result",
        success: function (data) {
            if(data.upgrade_method == "0")
            {
                show_server_upgrade_result(data);
            }
            else
            {
                show_local_upgrade_result(data);
            }
        }
    })
}

function set_config() {
    if (!format_volide_ok()) {
        return;
    }
    var cookies = getCookie("token");
    var szMode = $("#select_5g_mode").val();
    var szLteId = $("#select_lte_id").val();

    is_setting_status = 1;

    $.post("/goform/set_5g_basic_info", {
        szMode: szMode,
        szLteId: szLteId,
        token: cookies
    }, function (data) {
        if (data.ret == 1) {
            setting(25,gohref);
        }
        else if (data.ret == 2){
            shconfirm(lte_select_error, 'confirm', {
                onClose: function () {
                    gohref();
                }
            })
        }
        else {
            shconfirm(set_error, 'confirm', {
                onClose: function () {
                    gohref();
                }
            })
        }
    })
}

function display_band_list(title, pre, bandlistdef, curlist)
{
	var arr=bandlistdef.split(":");
	if (arr.length > 0)
	{
		var html = '<div class="row list">';
		html += '<div class="col-lg-3 col-sm-3 col-xs-3 form_left text-right">';
		html += '<span>'+title+'</span>';
		html += '</div>';
		html += '<div class="col-lg-5 col-sm-5 col-xs-5 form_right">';

		html += '<span style="width: 58px; display: inline-block;">';
		if (curlist.indexOf(bandlistdef) > -1)
		{
			html += '<input type="checkbox" name="'+title+"_grp"+'" value="0" style="margin-left:10px;" checked="checked" onclick="changeState(this.name,this.checked)">'+band_all;
		}
		else
		{
			html += '<input type="checkbox" name="'+title+"_grp"+'" value="0" style="margin-left:10px;" onclick="changeState(this.name,this.checked)">'+band_all;
		}
		html += '</span>';
		for (var i=0;i<arr.length; ++i)
		{
			html += '<span style="width: 58px; display: inline-block;">';
			if (curlist.indexOf(":"+arr[i]+":") > -1)
			{
				html += '<input type="checkbox" name="'+title+"_grp"+'" value='+arr[i]+' style="margin-left:10px;" checked="checked" onclick="changeItemState(this.name,this.checked)">'+pre+arr[i];
			}
			else
			{
				html += '<input type="checkbox" name="'+title+"_grp"+'" value='+arr[i]+' style="margin-left:10px;" onclick="changeItemState(this.name,this.checked)">'+pre+arr[i];
			}
			html += '</span>';
		}
		html += '</div>';
		html += '</div>';
		$("#band_list").prepend(html);
	}
}

function get_band_lock_info() {
    var cookies = getCookie("token");
    $.ajax({
        contentType: "appliation/json",
        data: {token: cookies},
        dataType: "json",
        type: "POST",
        cache: false,
        async: false,
        url: "/goform/get_band_lock_info",
        success: function (data) {
        	$("#band_list").html("");
			display_band_list(band_lock_lte_tdd, "B", data.def.szLteTdd, data.cur.szLteTdd);
			display_band_list(band_lock_lte_fdd, "B", data.def.szLteFdd, data.cur.szLteFdd);
			if ("0" == data.def.nsa_support)
			{
				display_band_list(band_lock_5g_nr, "N", data.def.szSa, data.cur.szSa);
			}
			else
			{
				display_band_list(band_lock_sa, "N", data.def.szSa, data.cur.szSa);
				display_band_list(band_lock_nsa, "N", data.def.szNsa, data.cur.szNsa);
			}
			g_nsa_support = data.def.nsa_support;
        }
    })
}

function getAllCheckedState(name)
{
	var chk_list=document.getElementsByName(name);
	var isAll="0";

	if (true == chk_list[0].checked)
	{
		isAll="1";
	}

	return isAll;
}

function getCheckedState(name)
{
	var chk_list=document.getElementsByName(name);
	var bandlist="";
	var num=0;

	for (var i=1; i<chk_list.length;++i)
	{
		if (true == chk_list[i].checked)
		{
			if (num>0)
			{
				bandlist += ":";
			}
			num++;
			bandlist += chk_list[i].value;
		}
	}

	return bandlist;
}

function set_band_lock_info() {
    if (!format_volide_ok()) {
        return;
    }
    var cookies = getCookie("token");
	var lte_fdd_all=getAllCheckedState(band_lock_lte_fdd+"_grp");
	var lte_tdd_all=getAllCheckedState(band_lock_lte_tdd+"_grp");
	var lte_fdd_list=getCheckedState(band_lock_lte_fdd+"_grp");
	var lte_tdd_list=getCheckedState(band_lock_lte_tdd+"_grp");

	if ("1" == g_nsa_support)
	{
		var sa_all=getAllCheckedState(band_lock_sa+"_grp");
		var nsa_all=getAllCheckedState(band_lock_nsa+"_grp");
		var sa_list=getCheckedState(band_lock_sa+"_grp");
		var nsa_list=getCheckedState(band_lock_nsa+"_grp");

		if ("" == sa_list)
		{
			alert(band_sa_empty);
			return;
		}

		if ("" == nsa_list)
		{
			alert(band_nsa_empty);
			return;
		}
	}
	else
	{
		var sa_all=getAllCheckedState(band_lock_5g_nr+"_grp");
		var nsa_all="0";
		var sa_list=getCheckedState(band_lock_5g_nr+"_grp");
		var nsa_list="";

		if ("" == sa_list)
		{
			alert(band_nr_5g_empty);
			return;
		}
	}

	if (("" == lte_fdd_list)&&("" == lte_tdd_list))
	{
		alert(band_lte_empty);
		return;
	}

	is_setting_status = 1;

    $.post("/goform/set_band_lock_info", {
        sa_all: sa_all,
		nsa_all: nsa_all,
		lte_fdd_all: lte_fdd_all,
		lte_tdd_all: lte_tdd_all,
		sa_list: sa_list,
		nsa_list: nsa_list,
		lte_fdd_list: lte_fdd_list,
		lte_tdd_list: lte_tdd_list,
        token: cookies
    }, function (data) {
        if (data.ret == 1) {
            setting(6,gohref);
        }
		else {
            shconfirm(set_error, 'confirm', {
                onClose: function () {
                    gohref();
                }
            })
        }
    })
}

function get_pin_manage_info() {
    var cookies = getCookie("token");
    $.ajax({
        contentType: "appliation/json",
        data: {token: cookies},
        dataType: "json",
        type: "POST",
        cache: false,
        async: false,
        url: "/goform/get_pin_manage_info",
        success: function (data) {
        	$("#pin_num").text(data.pin_num);
        	$("#puk_num").text(data.puk_num);

			//锁卡状态
			if ("1" == data.clckEn)
			{
				$("#div_pin_close").removeClass("hidden");
				if ("0" == data.isPinLock)
				{
					$("#div_pin_modify").removeClass("hidden");
					$("#div_puk_input").addClass("hidden");
					$("#div_pin_cfg").addClass("hidden");
				}
				else if ("1" == data.isPinLock)
				{
					$("#pin_lock").text(pin_unlock);
					$("#pinManageConfig").html((pin_unlock));
					$("#div_pin_modify").addClass("hidden");
					$("#div_puk_input").addClass("hidden");
				}
				else if ("2" == data.isPinLock)
				{
					$("#pin_lock").text(puk_unlock);
					$("#pinManageConfig").html((puk_unlock));
					$("#div_pin_modify").addClass("hidden");
					$("#div_puk_input").removeClass("hidden");
				}
			}
			else
			{
				$("#div_pin_close").addClass("hidden");
				$("#div_pin_modify").addClass("hidden");
				$("#div_puk_input").addClass("hidden");
				$("#pin_lock").text(pin_enable);
				$("#pinManageConfig").html(pin_enable);
			}

			if ("0" != data.pinOp)
			{
				shconfirm(pin_cfg_error, 'confirm', {
	                onClose: function () {
	                    gohref();
	                }
	            })
			}
			if ("1" == data.szErrCode)
			{
				shconfirm(pin_cfg_pin_err, 'confirm', {
	                onClose: function () {
	                    gohref();
	                }
	            })
			}
			else if ("2" == data.szErrCode)
			{
				shconfirm(pin_cfg_puk_err, 'confirm', {
	                onClose: function () {
	                    gohref();
	                }
	            })
			}
			else if ("3" == data.szErrCode)
			{
				shconfirm(sim_error, 'confirm', {
	                onClose: function () {
	                    gohref();
	                }
	            })
			}
        }
    })
}

function set_pin_manage() {
	$("#pin_modify_input").removeClass("isNumLen");
	$("#pin_modify_input_new").removeClass("isNumLen");
	$("#pin_close_input").removeClass("isNumLen");
    if (!format_volide_ok()) {
        return;
    }

	$("#pin_modify_input").addClass("isNumLen");
	$("#pin_modify_input_new").addClass("isNumLen");
	$("#pin_close_input").addClass("isNumLen");

    var cookies = getCookie("token");
	var szCurPin = $("#pin_input").val();
	var szCurPuk = $("#puk_input").val();

	is_setting_status = 1;

    $.post("/goform/set_pin_manage", {
		szCurPin: szCurPin,
		szCurPuk: szCurPuk,
        token: cookies
    }, function (data) {
        if (data.ret == 1) {
            setting(40,gohref);
        }
		else if(data.ret == 2) {
            shconfirm(pin_cfg_error, 'confirm', {
                onClose: function () {
                    gohref();
                }
            })
        }
		else if (data.ret == 3)
		{
			shconfirm(sim_error, 'confirm', {
                onClose: function () {
                    gohref();
                }
            })
		}
		else {
            shconfirm(set_error, 'confirm', {
                onClose: function () {
                    gohref();
                }
            })
        }
    })
}

function modify_pin_code() {
	$("#pin_input").removeClass("isNumLen");
	$("#puk_input").removeClass("isNumLen");
	$("#pin_close_input").removeClass("isNumLen");

    if (!format_volide_ok()) {
        return;
    }

	$("#pin_input").addClass("isNumLen");
	$("#puk_input").addClass("isNumLen");
	$("#pin_close_input").addClass("isNumLen");

    var cookies = getCookie("token");
	var szCurPin = $("#pin_modify_input").val();
	var szNewPin = $("#pin_modify_input_new").val();

	is_setting_status = 1;

    $.post("/goform/modify_pin_code", {
		szCurPin: szCurPin,
		szNewPin: szNewPin,
        token: cookies
    }, function (data) {
        if (data.ret == 1) {
            setting(40,gohref);
        }
		else if(data.ret == 2) {
            shconfirm(pin_cfg_error, 'confirm', {
                onClose: function () {
                    gohref();
                }
            })
        }
		else if (data.ret == 3)
		{
			shconfirm(sim_error, 'confirm', {
                onClose: function () {
                    gohref();
                }
            })
		}
		else {
            shconfirm(set_error, 'confirm', {
                onClose: function () {
                    gohref();
                }
            })
        }
    })
}

function close_pin_code() {
	$("#pin_input").removeClass("isNumLen");
	$("#puk_input").removeClass("isNumLen");
	$("#pin_modify_input").removeClass("isNumLen");
	$("#pin_modify_input_new").removeClass("isNumLen");

    if (!format_volide_ok()) {
        return;
    }

	$("#pin_input").addClass("isNumLen");
	$("#puk_input").addClass("isNumLen");
	$("#pin_modify_input").addClass("isNumLen");
	$("#pin_modify_input_new").addClass("isNumLen");

    var cookies = getCookie("token");
	var szCurPin = $("#pin_close_input").val();

	is_setting_status = 1;

    $.post("/goform/close_pin_code", {
		szCurPin: szCurPin,
        token: cookies
    }, function (data) {
        if (data.ret == 1) {
            setting(40,gohref);
        }
		else if(data.ret == 2) {
            shconfirm(pin_cfg_error, 'confirm', {
                onClose: function () {
                    gohref();
                }
            })
        }
		else if (data.ret == 3)
		{
			shconfirm(sim_error, 'confirm', {
                onClose: function () {
                    gohref();
                }
            })
		}
		else {
            shconfirm(set_error, 'confirm', {
                onClose: function () {
                    gohref();
                }
            })
        }
    })
}

function get_status_info() {
    var cookies = getCookie("token");
    $.ajax({
        contentType: "appliation/json",
        data: {token: cookies},
        dataType: "json",
        type: "POST",
        cache: false,
        async: false,
        url: "/goform/get_status_info",
        success: function (data) {
            $("#model_version").html(data.version);
            $("#model_imei").html(data.imei);
            $("#model_mcc").html(data.mcc);
            $("#model_mnc").html(data.mnc);
            $("#model_cell").html(data.cell);
            $("#model_pci").html(data.pci);
            $("#model_rssi").html(data.rssi);
            $("#model_rsrp").html(data.rsrp);
            $("#model_rsrq").html(data.rsrq);
            $("#model_sinr").html(data.sinr);
            $("#model_band").html(data.band);
        }
    })
}

function samba_init() { //初始化
	var i = 0,
		j = 0;
	DirName = [];
	FileName = [];
	FileSize = [];
	FileSubordinate_dir = [];
	click_i = 0;
	var cookies = getCookie("token");
	$.getJSON("/goform/get_samba_server", {
		token: cookies
	}, function (data) {
		$.each(data.samba_server, function (idx, item) {
			if (item.file_size == "file_size") {
				DirName[i] = item.dir_name; // 将目录名称全部保存起来
				i++;
			} else {
				FileName[j] = item.file_name; // 将文件名称全部保存起来
				FileSize[j] = item.file_size; // 将文件大小全部保存起来
				FileSubordinate_dir[j] = item.dir_name + '/'; // 将文件所属目录全部保存起来
				j++;
			}
		})
		show_file(ShowDir);
	})
}

function show_file(dir) { //显示文件列表
	var i;
	var buf;
	var sup_dir;
	var dir_name; //目录名称
	var file_name; //文件名称
	var list = "";
	sup_dir = dir.split("/");
	sup_dir.pop();
	sup_dir.pop();
	$("#mk_dir").attr("mk_dir", dir);
	$("#upgrade_dir_name").val(dir);

	//增加一个返回上级目录条目
	if (dir != "/mnt/") {
		list += '<tr class="td_return" sup_dir="' + sup_dir.join("/") + '/">';
		list += '<td class="fa fa-folder-open" style=" cursor:default;"></td><td style="width: 100%; cursor:default;" class="top_td" colspan="3">' + samba_return_sup_dir + '</td>';
		list += '</tr>';
	}

	for (i = 0; i < DirName.length; i++) {
		buf = DirName[i].substr(dir.length); //选择dir之后的目录名称
		if (buf == "") {
			continue;
		}

		if (DirName[i].indexOf(dir) == -1) //剔除掉不是dir的目录
		{
			continue;
		}

		dir_name = buf.split("/"); //目录名称

		if (dir_name[1] == undefined) //dir_name[1]等于空则表示是dir当前目录下的目录
		{
			list += '<tr class="table_dir" sup_dir="' + dir + dir_name[0] + '/" dir="1"><td></td>';
			list += '<td class="fa fa-folder" style="cursor:default;"></td><td style="width: 100%; cursor:default;" class="td_dir">' + dir_name[0] + '</td><td></td>';
			list += '</tr>';
		}
	}

	for (i = 0; i < FileName.length; i++) {
		if (FileSubordinate_dir[i] == dir) //对比文件所属目录是否是dir目录
		{
			list += '<tr class="table_dir" sup_dir="' + FileSubordinate_dir[i] + FileName[i] + '" dir="0">';
			if (Math.round(parseInt(FileSize[i]) / 1024) > 1024) {
				list += '<td></td><td class="fa fa-file" style="cursor:default;"></td><td style="width: 100%; cursor:default;"><xmp style="margin: 0px;">' + FileSubordinate_dir[i] + FileName[i] + '</xmp></td><td style="text-align: right; ">' + Math.round(Math.round(parseInt(FileSize[i]) / 1024) / 1024) + 'MB</td>';
			} else {
				list += '<td></td><td class="fa fa-file" style="cursor:default;"></td><td style="width: 100%; cursor:default;" ><xmp style="margin: 0px;">' + FileSubordinate_dir[i] + FileName[i] + '</xmp></td><td style="text-align: right;">' + Math.round(parseInt(FileSize[i]) / 1024) + 'KB</td>';
			}
			list += '</tr>';
		}
	}

	$("#usb_tab").html(list);
}

function format_setting_ok(obj){
	if (!obj || obj == undefined) {
        obj = 'modal-content'
    }
    var requires = $(obj).find('.require');
    for (var i = 0; i < requires.length; i++) {
        var _this = requires[i];
        if ($(_this).is(":visible") && $(_this).attr('disabled') != 'disabled') {
            $(_this).trigger('blur');
            if ($(_this).hasClass('borError')) {
                return false;
            }
        }
    }
    return true;
}

function gohref() {
    window.location.reload();
}

