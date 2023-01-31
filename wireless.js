var g_dfs="";

$(document).ready(function () {

    /**5g基本设置 拉伸 */
    $("#staffers2g4show").click(function () {
        $("#staffers2g4").removeClass("in");
    })
    $("#staffers5g8show").click(function () {
        $("#staffers5g8").removeClass("in");
    })

    $(".checkbox").simpleSwitch({
        "theme": "FlatCircular"
    });

    //点击tab
    $("#setting_box_24g").click(function () {
        $("#setting_box_58g").removeClass("active");
        $("#setting_box_24g").addClass('active');
        $("#settingbox_24g").addClass("active");
        $("#settingbox_58g").removeClass("active");
    })
    $("#setting_box_58g").click(function () {
        $("#setting_box_24g").removeClass("active");
        $("#setting_box_58g").addClass("active").removeClass("hide");
        $("#settingbox_24g").removeClass("active");
        $("#settingbox_58g").addClass("active");
    })

    $(".checkbox").bind("click", function () {

        if ($(this).attr('checked')) {
            $(this).attr('checked', false);
        } else {
            $(this).attr('checked', true);
        }
    });
    get_wifi2g_info();
    get_5g_info();
    get_wifi5G_info();

    $("#switch_wireless_24g").click(function(){
        if($(this).attr("checked")){
            $("#Switch0").addClass("On");
        }else{
            $("#Switch0").removeClass("On");
        }
    })
    $("#switch_wireless_58g").click(function(){
        if($(this).attr("checked")){
            $("#Switch2").addClass("On");
        }else{
            $("#Switch2").removeClass("On");
        }
    })
    $("#switch_hidessid_24g").click(function (){
        if($(this).attr("checked")){
            $("#Switch1").addClass("On");
        }else{
            $("#Switch1").removeClass("On");
        }
    })
    $("#switch_hidessid_58g").click(function (){
        if($(this).attr("checked")){
            $("#Switch3").addClass("On");
        }else{
            $("#Switch3").removeClass("On");
        }
    })

    $("#countrychange24g").change(function (){
        var country = $("#countrychange24g").val();
        var list = "";
        list += '<option value="0">' + auto + '</option>';
        if (country == "CN") { //CN
            for (i = 1,j = 2412; i < 14; i++) {
                list += '<option value="'+i+'">' + i + ' - '+j+'MHz</option>';
                j +=5;

            }
        }else if(country == "US"){
            for (i = 1, j = 2412; i < 12; i++) {
                list += '<option value="'+i+'">' + i + ' - '+j+'MHz</option>';
                j +=5;

            }
        } else { //欧洲
            for (i = 1,j = 2412; i < 14; i++) {
                list += '<option value="'+i+'">' + i + ' - '+j+'MHz</option>';
                j +=5;

            }
        }
        $("#channels_24g").html(list);
    })

    $("#countrychange58g").change(function (){
        var country = $("#countrychange58g").val();
        var list = "";
        list += '<option value="0">' + auto + '</option>';
        if (country == "CN") { //CN
            for (i = 36, j = 5180; i < 68; i += 4) {
				check_channel_is_dfs(i);
                list += '<option value="'+i+'">' + i + ' - '+j+'MHz'+g_dfs+'</option>';
                j += 20;
            }
            for (i = 149, j = 5745; i < 169; i += 4) {
				check_channel_is_dfs(i);
                list += '<option value="'+i+'">' + i + ' - '+j+'MHz'+g_dfs+'</option>';
                j += 20;
            }
            
        } else if(country == "US") { //US
                for (i = 36 , j = 5180; i < 68; i += 4) {
					check_channel_is_dfs(i);
                    list += '<option value="'+i+'">' + i + ' - '+j+'MHz'+g_dfs+'</option>';
                    j += 20;
                }
                for (i = 100, j = 5500; i < 144; i += 4) {
					check_channel_is_dfs(i);
                    list += '<option value="'+i+'">' + i + ' - '+j+'MHz'+g_dfs+'</option>';
                    j += 20;
                }
                for (i = 149, j = 5745; i < 169; i += 4) {
					check_channel_is_dfs(i);
                    list += '<option value="'+i+'">' + i + ' - '+j+'MHz'+g_dfs+'</option>';
                    j += 20;
                }
        }else if(country == "GB"){//GB
            for (i = 36 , j = 5180; i < 68; i += 4) {
				check_channel_is_dfs(i);
                list += '<option value="'+i+'">' + i + ' - '+j+'MHz'+g_dfs+'</option>';
                j += 20;
            }
            for (i = 100, j = 5500; i < 144; i += 4) {
				check_channel_is_dfs(i);
                list += '<option value="'+i+'">' + i + ' - '+j+'MHz'+g_dfs+'</option>';
                j += 20;
            }
        }
        $("#channels_58g").html(list);
    })
})

/**
 *判断是否是双频
 *
 */
function get_5g_info() {
	var wl_band = "<% getUciWlband("");%>";
	if (wl_band == "1") {
        $('#setting_box_58g').removeClass('hide');

    } else {
        $('#setting_box_58g').remove();
        $('#settingbox_58g').remove();
        $('#box-header').addClass('hide');
    }
	$('#setting_box_24g').removeClass('hide');
    $('#wifitab>li:first').click();
  
}

function check_channel_is_dfs(channel)
{
	if ((channel>=52) && (channel<=140))
	{
		g_dfs = "(DFS)";
	}
	else
	{
		g_dfs = "";
	}
}

/**
 * 获取多5G数据
 */
var bcast_58g,channel_58g,country_58g,disabled_58g,htmode_58g,hwmode_58g,maxsta_58g,power_58g,encrypt_58g,ssid_58g,wpa_psk_58g;
function get_wifi5G_info() {
    var list = "";
    var idx;
    var i = 0;
    $.getJSON("/goform/get_wireless5g_settings", function (data) {
		bcast_58g = data.bcast;
		channel_58g = data.channel;
		country_58g = data.country;
		disabled_58g = data.disabled;
		htmode_58g = data.htmode;
		maxsta_58g = data.maxsta;
		power_58g = data.power;
        wifi_mode = data.wifimode;
        if (data == null || data.length == 0) {
            list += '';
            $("#wifilist_58g").html(list);
            return false;
        }
        //wifi开关
        if (data.disabled == 0) {
            $("#switch_wireless_58g").attr("checked", true);
            $("#Switch2").addClass("On");
            $("#switch_wireless_58g").addClass('switchopen').removeClass("switchclose");
        } else {
            $("#switch_wireless_58g").attr("checked", false);
            $("#Switch2").removeClass("On");
            $("#switch_wireless_58g").addClass("switchclose").removeClass("switchopen");
        }
        //ssid广播
        if (data.bcast == 1) {
            $("#switch_hidessid_58g").attr("checked", true);
            $("#Switch3").addClass("On");
            $("#switch_hidessid_58g").addClass('switchopen');
        } else {
            $("#switch_hidessid_58g").attr("checked", false);
            $("#Switch3").removeClass("On");
            $("#switch_hidessid_58g").addClass('switchclose');
        }
        //国家
        if (data.country) {
            $("#countrychange58g").val(data.country);
        }
        //信道
        var list3 = "";
        var channel = data.channel;
        list3 += '<option value="0">'+auto+'</option>';
        if (data.country == "CN") { //CN
            for (i = 36, j = 5180; i < 68; i += 4) {
				check_channel_is_dfs(i);
                list3 += '<option value="'+i+'">' + i + ' - '+j+'MHz'+g_dfs+'</option>';
                j += 20;
            }
            for (i = 149, j = 5745; i < 169; i += 4) {
				check_channel_is_dfs(i);
                list3 += '<option value="'+i+'">' + i + ' - '+j+'MHz'+g_dfs+'</option>';
                j += 20;
            }
            
        } else if(data.country == "US") { //US
                for (i = 36 , j = 5180; i < 68; i += 4) {
					check_channel_is_dfs(i);
                    list3 += '<option value="'+i+'">' + i + ' - '+j+'MHz'+g_dfs+'</option>';
                    j += 20;
                }
                for (i = 100, j = 5500; i < 144; i += 4) {
					check_channel_is_dfs(i);
                    list3 += '<option value="'+i+'">' + i + ' - '+j+'MHz'+g_dfs+'</option>';
                    j += 20;
                }
                for (i = 149, j = 5745; i < 169; i += 4) {
					check_channel_is_dfs(i);
                    list3 += '<option value="'+i+'">' + i + ' - '+j+'MHz'+g_dfs+'</option>';
                    j += 20;
                }
        }else if(data.country == "GB"){
            for (i = 36 , j = 5180; i < 68; i += 4) {
				check_channel_is_dfs(i);
                list3 += '<option value="'+i+'">' + i + ' - '+j+'MHz'+g_dfs+'</option>';
                j += 20;
            }
            for (i = 100, j = 5500; i < 144; i += 4) {
				check_channel_is_dfs(i);
                list3 += '<option value="'+i+'">' + i + ' - '+j+'MHz'+g_dfs+'</option>';
                j += 20;
            }
        }
        $("#channels_58g").html(list3);
        $("#channels_58g").val(channel);
        //功率
        var power = data.power;
        switch (power) {
            case "100":
                $("#txpower_58g").val("100");
                break;
            case "75":
                $("#txpower_58g").val("75");
                break;
            case "50":
                $("#txpower_58g").val("50");
                break;
            case "25":
                $("#txpower_58g").val("25");
                break;
            case "12.5":
                $("#txpower_58g").val("12.5");
                break;
            case "0":
                $("#txpower_58g").val("0");
                break;
        }
        //带宽
        var htmode = data.htmode;
        switch (htmode) {
            case "HT20":
                $("#bandwidth_58g").val("HT20");
                break;
            case "HT40":
                $("#bandwidth_58g").val("HT40");
                break;
            case "HT80":
                $("#bandwidth_58g").val("HT80");
                break;
            // case "HT160":
            //     $("#bandwidth_58g").val("HT160");
            //     break;
        }
        //最大用户数
        $("#maxassoc_58g").val(data.maxsta);

        // 无线协议
        if (wifi_mode >= 0 && wifi_mode <= 17){
            $("#wirelessMode_58g").val(wifi_mode);
        }else{
            $("#wirelessMode_58g").val("17");
        }

        $.each(data.wifis, function (idx, item) {
			encrypt_58g = item.encrypt;
			ssid_58g = item.ssid;
			wpa_psk_58g = item.wpa_psk;
            if (item.ssid != "") {
                list += ' <tr class="text-center" id="wifi_58g_' + idx + '">';
                list += ' <td class="form_right form_td">';
                list += '<span class="tip_name hide" sh_lang="name_or_ssid">SSID</span>';
                list += '<input class="form-control require notip isSSID" type="text" value="' + item.ssid + '" id="ssid_58g_' + idx + '" maxlength="30">';
                list += '</td>';
                list += '<td class="form_td">';

                list += '<select class="form-control" onchange="changeencrypt(this)" id="encrypt_58g_' + idx + '">';
                list += '<option value="1" sh_lang="wpa3_sae">'+wpa3_sae+'</option>';
                list += '<option value="2" sh_lang="wpa2_psk__wpa3_sae">'+wpa2_psk__wpa3_sae+'</option>';
                list += '<option value="3" sh_lang="wpa2_psk">'+wpa2_psk+'</option>';
                list += '<option value="4" sh_lang="wpa__wpa2_psk">'+wpa__wpa2_psk+'</option>';
                list += '<option value="5" sh_lang="wpa_psk">'+wpa_psk+'</option>';
                if (support_8021x){
                    list += '<option value="6" sh_lang="wpa__wpa2_enterprise">'+wpa__wpa2_enterprise+'</option>';
                }
                list += '<option value="0" sh_lang="close_txt">'+close_txt+'</option>';
                list += '</select>';
                list += ' </td>';

                list += '<td class="form_right form_td">';
                list += '<div class="col-lg-17 col-sm-1 col-xs-1 form_right" style="float:right">'
                list +=     '<i class="show_passwd_58g_' + idx + ' fa fa-eye-slash" style="margin-left:2%" onclick="show_passwd_58g_click('+idx+');"></i>'
                list += '</div>'
                list += '<span class="tip_name hide" sh_lang="global_password">'+global_password+'</span>';
                list += '<input style="display:inline-block;width:90%" type="password" class="form-control require notip isSSIDPwd" value="' + item.wpa_psk + '" id="passwd_58g_' + idx + '" maxlength="63">';
                list += ' </td>';

                //开启访客网络后，此界面不再添加wifi接口
                if (0 == support_guest_network){
                    list += ' <td class="form_td">';
                    if (idx == 0) {
                        list += '<a class="table-link" data-value="58g" et="click tap:wifi_add" onclick="wifi_add(this)">';
                    } else {
                        list += '<a class="table-link" data-value="58g" et="click tap:wifi_del" onclick="wifi_del(this)">';
                    }
                    list += '<span class="fa-stack">';
                    if (idx == 0) {
                        list += '<i class="fa fa-plus-square-o fa-stack-2x"></i>';
                    } else {
                        list += '<i class="fa fa-minus-square-o fa-stack-2x"></i>';
                    }
                    list += '<i></i>';
                    list += '</span>';
                    list += '</a>';
                    list += '</td>';
                }

                list += '</tr>';
            }
        })
        $("#wifilist_58g").html(list);
        volide('body');

        $.each(data.wifis, function (idx, item) {
            var encrypt_58g = item.encrypt;
            var id_encrypt= "encrypt_58g_"+idx;
            var id_passwd = "passwd_58g_"+idx;
            
            switch (encrypt_58g) {
                case "none":
                    $("#"+id_encrypt).val("0");
                    $("#"+id_passwd).attr("disabled", "disabled");
                    break;
                case "sae":
                    $("#"+id_encrypt).val("1");
                    break;
                case "sae-mixed":
                    $("#"+id_encrypt).val("2");
                    break;
                case "psk2":
                    $("#"+id_encrypt).val("3");
                    break;
                case "psk-mixed":
                case "psk+psk2":
                    $("#"+id_encrypt).val("4");
                    break; 
                case "psk":
                    $("#"+id_encrypt).val("5");
                    break; 
                case "wpa-mixed":
                    $("#"+id_encrypt).val("6");
                    break;                         
            }
        })
    })
}


/**
 * 获取2.4Gwifi数据
 */
var bcast_24g,channel_24g,country_24g,disabled_24g,htmode_24g,hwmode_24g,maxsta_24g,power_24g,encrypt_24g,ssid_24g,wpa_psk_24g;
function get_wifi2g_info() {
    var list = "";
    var idx;
    var i = 0;
    $.getJSON("/goform/get_wireless2g_settings", function (data) {
		bcast_24g = data.bcast;
		channel_24g = data.channel;
		country_24g = data.country;
		disabled_24g = data.disabled;
		htmode_24g = data.htmode;
		maxsta_24g = data.maxsta;
		power_24g = data.power;
		wifi_mode = data.wifimode;
        
        if (data == null || data.length == 0) {
            list += '';
            $("#wifilist_24g").html(list);
            return false;
        }
        //wifi开关
        if (data.disabled == 0) {
            $("#switch_wireless_24g").attr("checked", true);
            $("#Switch0").addClass("On");
            $("#switch_wireless_24g").addClass('switchopen').removeClass("switchclose");
        } else {
            $("#switch_wireless_24g").attr("checked", false);
            $("#Switch0").removeClass("On");
            $("#switch_wireless_24g").addClass("switchclose").removeClass("switchopen");
        }
        //ssid广播
        if (data.bcast == 1) {
            $("#switch_hidessid_24g").attr("checked", true);
            $("#Switch1").addClass("On");
            $("#switch_hidessid_24g").addClass('switchopen').removeClass('switchclose');
        } else {
            $("#switch_hidessid_24g").attr("checked", false);
            $("#Switch1").removeClass("On");
            $("#switch_hidessid_24g").addClass('switchclose').removeClass('switchopen');
        }
        //国家
        if (data.country) {
            $("#countrychange24g").val(data.country);
        }
        //信道
        var channel = data.channel;
        var list2 = "";
        list2 += '<option value="0">' + auto + '</option>';
        if (data.country == "CN") { //CN
            for (i = 1,j = 2412; i < 14; i++) {
                list2 += '<option value="'+i+'">' + i + ' - '+j+'MHz</option>';
                j +=5;

            }
        }else if(data.country == "US"){
            for (i = 1, j = 2412; i < 12; i++) {
                list2 += '<option value="'+i+'">' + i + ' - '+j+'MHz</option>';
                j +=5;

            }
        } else { //欧洲
            for (i = 1,j = 2412; i < 14; i++) {
                list2 += '<option value="'+i+'">' + i + ' - '+j+'MHz</option>';
                j +=5;

            }
        }
        $("#channels_24g").html(list2);
        $("#channels_24g").val(channel);
        
        //功率
        var power = data.power;
        switch (power) {
            case "100":
                $("#txpower_24g").val("100");
                break;
            case "75":
                $("#txpower_24g").val("75");
                break;
            case "50":
                $("#txpower_24g").val("50");
                break;
            case "25":
                $("#txpower_24g").val("25");
                break;
            case "12.5":
                $("#txpower_24g").val("12.5");
                break;
            case "0":
                $("#txpower_24g").val("0");
                break;
        }
        //带宽
        var htmode = data.htmode;
        switch (htmode) {
            case "HT20":
                $("#bandwidth_24g").val("HT20");
                break;
            case "HT40":
                $("#bandwidth_24g").val("HT40");
                break;
            case "auto":
                $("#bandwidth_24g").val("auto");
                break;
        }
        //最大用户数
        $("#maxassoc_24g").val(data.maxsta);

        // 无线协议
        if (wifi_mode >= 0 && wifi_mode <= 16){
            $("#wirelessMode_24g").val(wifi_mode);
        }else{
            $("#wirelessMode_24g").val("16");
        }

        $.each(data.wifis, function (idx, item) {
            encrypt_24g = item.encrypt;
            ssid_24g = item.ssid;
            wpa_psk_24g = item.wpa_psk;
            if (item.ssid != "") {
                list += ' <tr class="text-center" id="wifi_24g_' + idx + '">';
                list += ' <td class="form_right form_td">';
                list += '<span class="tip_name hide" sh_lang="name_or_ssid">SSID</span>';
                list += '<input  class="form-control require notip isSSID" type="text" value="' + item.ssid + '" id="ssid_24g_' + idx + '" maxlength="30">';
                list += '</td>';
                list += '<td class="form_td">';
                list += '<select class="form-control" onchange = "changeencrypt(this)"  id="encrypt_24g_' + idx + '">';
                
                list += '<option value="1" sh_lang="wpa3_sae">'+wpa3_sae+'</option>';
                list += '<option value="2" sh_lang="wpa2_psk__wpa3_sae">'+wpa2_psk__wpa3_sae+'</option>';
                list += '<option value="3" sh_lang="wpa2_psk">'+wpa2_psk+'</option>';
                list += '<option value="4" sh_lang="wpa__wpa2_psk">'+wpa__wpa2_psk+'</option>';
                list += '<option value="5" sh_lang="wpa_psk">'+wpa_psk+'</option>';
                if (support_8021x){
                    list += '<option value="6" sh_lang="wpa__wpa2_enterprise">'+wpa__wpa2_enterprise+'</option>';
                }
                list += '<option value="0" sh_lang="close_txt">'+close_txt+'</option>';
                list += '</select>';
                list += '</td>';
                
                list += '<td class="form_right form_td">';
                list += '<div class="col-lg-17 col-sm-1 col-xs-1 form_right" style="float:right">'
                list +=     '<i class="show_passwd_24g_' + idx + ' fa fa-eye-slash" style="margin-left:2%" onclick="show_passwd_24g_click('+idx+');"></i>'
                list += '</div>'
                list += '<span class="tip_name hide" sh_lang="global_password">'+global_password+'</span>';
                list += '<input  style="display:inline-block;width:90%" type="password" class="form-control require notip isSSIDPwd" value="' + item.wpa_psk + '" id="passwd_24g_' + idx + '" maxlength="63">';
                list += ' </td>';
                
                //开启访客网络后，此界面不再添加wifi接口
                if (0 == support_guest_network)
                {
                    list += ' <td class="form_td">';
                    if (idx == 0) {
                        list += '<a class="table-link" data-value="24g" et="click tap:wifi_add" onclick="wifi_add(this)">';
                    } else {
                        list += '<a class="table-link" data-value="24g" et="click tap:wifi_del" onclick="wifi_del(this)">';
                    }
                    list += '<span class="fa-stack">';
                    if (idx == 0) {
                        list += '<i class="fa fa-plus-square-o fa-stack-2x"></i>';
                        list += '<i></i>';
                    } else {
                        list += '<i class="fa fa-minus-square-o fa-stack-2x"></i>';
                        list += '<i></i>';
                    }
                    list += '</span>';
                    list += '</a>';
                    list += '</td>';
                }

                list += '</tr>';

            }
        })
        $("#wifilist_24g").html(list);
        volide('body');

        $.each(data.wifis, function (idx, item) {
            var encrypt_24g = item.encrypt;
            var id_encrypt= "encrypt_24g_"+idx;
            var id_passwd = "passwd_24g_"+idx;
            
            switch (encrypt_24g) {
                case "none":
                    $("#"+id_encrypt).val("0");
                    $("#"+id_passwd).attr("disabled", "disabled");
                    break;
                case "sae":
                    $("#"+id_encrypt).val("1");
                    break;
                case "sae-mixed":
                    $("#"+id_encrypt).val("2");
                    break;
                case "psk2":
                    $("#"+id_encrypt).val("3");
                    break;
                case "psk-mixed":
                case "psk+psk2":
                    $("#"+id_encrypt).val("4");
                    break; 
                case "psk":
                    $("#"+id_encrypt).val("5");
                    break; 
                case "wpa-mixed":
                    $("#"+id_encrypt).val("6");
                    break;                         
            }
        })
    })
}

/**
 * 点击开关
 * @param {*} evt 
 */
function changestatus(evt) {
    if ($(evt).attr("data-value") == undefined && !$(evt).hasClass('switch_ext')) {
        evt = $(evt).parent();
    }
    var swich_status = $(evt).attr('data-value');
    var swich_defaut = $(evt).attr('data-default');
    if (swich_status == 1) {
        swich_status = 0;
    } else {
        swich_status = 1;
    }
    swich(evt, swich_status, swich_defaut);
}

/**点击加密方式 */
function changeencrypt(evt) {
    // var evt_change = $(evt).parents('tr').find('.isSSIDPwd');
    // if (evt_change.attr('disabled')) {
    //     evt_change.attr('disabled', false);
    // } else {
    //     evt_change.attr('disabled', true).removeClass('borError');
    // }

    var evt_change = $(evt).parents('tr').find('.isSSIDPwd');
    var value = $(evt).val();

    if (0 == value){
        evt_change.removeClass('borError');
        evt_change.attr('disabled', true);    
    }else{
        evt_change.attr('disabled', false);
    }
    
}

var wifi_array, no_ht80 = 0,
    config, radios_info, rwinfo, wifis_info, wwan_info, rep_flag, wifi_langht,
    distance_auth_enable, distance_auth_distance, rep_config;
var wilrmaxnum = 4;
/**点击添加 */
function wifi_add(evt) {
    $('.require').unbind('blur');
    var rflag, n, uid, obj;
    rflag = $(evt).attr('data-value');
    uid = 'wifilist_' + rflag;
    obj = $('#' + uid).children(2);
    if (!wifi_langht) {
        wifi_langht = obj.length + 1;
    }
    n = obj.length + 1;
    if (n > wilrmaxnum) {
        volide('body');
        return;
    }
    var $html = wifihtml(rflag, wifi_langht);
    wifi_langht++;
    $('#' + uid).append($html);
    if (distance_auth_enable) {
        $('.auth_distance').val(distance_auth_distance);
    }
    volide('body');
}

/** 点击删除*/
function wifi_del(evt) {
    $(evt).parents('tr').remove();
}

/**
 *
 *增加的子wifi
 * @param {*} n
 * @param {*} i
 * @returns
 */
function wifihtml(n, i) {
    var this_html = '';
    this_html += '<tr class="text-center" id="wifi_' + n + '_' + i + '">';
    this_html += '<td class="form_right form_td"><span class="tip_name hide" sh_lang="name_or_ssid">' + name_or_ssid + '</span><input type="text" id="ssid_' + n + '_' + i + '" class="form-control require notip isSSID" maxlength="30"></td>';
    this_html += '<td class="form_td"><select id="encrypt_' + n + '_' + i + '" class="form-control changeencrypt" onchange="changeencrypt(this)">';
        this_html +=     '<option value="1" sh_lang="wpa3_sae">'+wpa3_sae+'</option>';
        this_html +=     '<option value="2" sh_lang="wpa2_psk__wpa3_sae">'+wpa2_psk__wpa3_sae+'</option>';
        this_html +=     '<option value="3" sh_lang="wpa2_psk">'+wpa2_psk+'</option>';
        this_html +=     '<option value="4" selected sh_lang="wpa__wpa2_psk">'+wpa__wpa2_psk+'</option>';
        this_html +=     '<option value="5" sh_lang="wpa_psk">'+wpa_psk+'</option>';
        // this_html +=     '<option value="6" sh_lang="wpa__wpa2_enterprise">'+wpa__wpa2_enterprise+'</option>';
        this_html +=     '<option value="0" sh_lang="close_txt">'+close_txt+'</option>';
    this_html += '</td>';
    this_html += '<td class="form_right form_td">\
                    <div class="col-lg-17 col-sm-1 col-xs-1 form_right" style="float:right">\
                        <i class="show_passwd_'+ n +'_' + i + ' fa fa-eye-slash" style="margin-left:2%" onclick="show_passwd_'+n+'_click('+i+');"></i>\
                    </div>\
                    <span class="tip_name hide" sh_lang="global_password">' + global_password + '</span>\
                    <input style="display:inline-block;width:90%" type="password"  class="form-control require isSSIDPwd" id="passwd_' + n + '_' + i + '" maxlength="63">\
                    </td>';
    
    this_html += '<td class="form_td"><a class="table-link" et="click tap:wifi_del" onclick="wifi_del(this)" id="wifi_del"><span class="fa-stack"><i class="fa fa-minus-square-o fa-stack-2x"></i></span></a></td>';
    this_html += '</tr>';
    return this_html;
}

function change_auth_distance(evt) {
    $('.auth_distance').val(evt.val());
}


var oThis, listsinfo, disabled, hidden, ssid_value, distance_auth_enable;
/**
 *
 *组2.4G数据
 * @returns
 */
function get_post2g_data() {
    var cookies = getCookie("token");
	var collapse_24val1 = $("#staffers2g4show").attr("aria-expanded");
	var collapse_24val2= $("#moreset2g4show").attr("aria-expanded");
	if(collapse_24val1 == "false"){
		var disabled = disabled_24g;
		var bcast = bcast_24g;
	}else{
		var disabled = 0;
		if ($("#switch_wireless_24g").attr("checked")) {
			disabled = 0;
		} else {
			disabled = 1;
		}
		var bcast = 0;
		if ($("#switch_hidessid_24g").attr("checked")) {
			bcast = 1;
		} else {
			bcast = 0;
		}
	}
	if( collapse_24val2 == "false"){
		var channel = channel_24g;
		var htmode = htmode_24g;
		var power = power_24g;
		var country = country_24g;
	}else{
		var channel = $("#channels_24g").val();
		var htmode = $("#bandwidth_24g").val();
		var power = $("#txpower_24g").val();
		var country = $("#countrychange24g").val();
	}
    listsinfo = $("[id^='wifi_24g" + "_']");
    listlength = listsinfo.length;
    
    //wifi mode
    var wifi_mode = $("#wirelessMode_24g").val();

    var arr = [];
    for (var i = 0; i < listlength; i++) {
        oThis = $(listsinfo[i]);
        hidden = $('#switch_hidessid_24g').attr('data-value');
        if(collapse_24val1 == "false"){
			var ssid = ssid_24g;
			var encrypt = encrypt_24g;
			var wpa_psk = wpa_psk_24g;
		}else{
			var ssid = oThis.find('[id^="ssid_24g' + '_"]').val();
			var encrypt = oThis.find('[id^="encrypt_24g' + '_"]').val();
			var wpa_psk = oThis.find('[id^="passwd_24g' + '_"]').val();
		}
		var hwmode = "";
		if(collapse_24val2 == "false"){
			var maxsta = maxsta_24g;
		}else{
			var maxsta = $("#maxassoc_24g").val();
		}
		arr[i] = iface_config(disabled, ssid, bcast, encrypt, wpa_psk, hwmode, maxsta, i);
		
    }
    var postData = "";
    $.each(arr, function (x, y) {

        postData += $.param(y) + "&";

    })
    // console.log(postData);
    iface_com = new Object();
    iface_com.country = country;
    iface_com.channel = channel;
    iface_com.power = power;
    iface_com.htmode = htmode;
    iface_com.token = cookies;
    iface_com.wifi_mode = wifi_mode;
    var data = postData + $.param(iface_com) + "&";
    return data;
}
/**
 *组5G数据
 *
 * @returns
 */
function get_post5g_data() {
    var cookies = getCookie("token");
	var collapse_58val1 = $("#staffers5g8show").attr("aria-expanded");
	var collapse_58val2= $("#moreset5g8show").attr("aria-expanded");
	if(collapse_58val1 == "false"){
		var disabled = disabled_58g;
		var bcast = bcast_58g;
	}else{
		var disabled = 0;
		if ($("#switch_wireless_58g").attr("checked")) {
			disabled = 0;
		} else {
			disabled = 1;
		}
		var bcast = 0;
		if ($("#switch_hidessid_58g").attr("checked")) {
			bcast = 1;
		}else{
			bcast = 0;
		}
	}
	if(collapse_58val2 == "false"){
		var country = country_58g;
		var channel = channel_58g;
		var power = power_58g;
		var htmode = htmode_58g;
	}else{
		var country = $("#countrychange58g").val();
		var channel = $("#channels_58g").val();
		var power = $("#txpower_58g").val();
		var htmode = $("#bandwidth_58g").val();
	}

    listsinfo = $("[id^='wifi_58g" + "_']");
    listlength = listsinfo.length;

    //wifi mode
    var wifi_mode = $("#wirelessMode_58g").val();

    var arr = [];
    for (var i = 0; i < listlength; i++) {
        oThis = $(listsinfo[i]);
        hidden = $('#switch_hidessid_58g').attr('data-value');
        if(collapse_58val1 == "false"){
			var ssid = ssid_58g;
			var encrypt = encrypt_58g;
			var wpa_psk = wpa_psk_58g;
		}else{
			var ssid = oThis.find('[id^="ssid_58g' + '_"]').val();
			var encrypt = oThis.find('[id^="encrypt_58g' + '_"]').val();
			var wpa_psk = oThis.find('[id^="passwd_58g' + '_"]').val();
		}
        var hwmode = "";
		if(collapse_58val2 == "false"){
			var maxsta = maxsta_58g;
		}else{
			var maxsta = $("#maxassoc_58g").val();
		}
        
        arr[i] = iface_config(disabled, ssid, bcast, encrypt, wpa_psk, hwmode, maxsta, i);
    }

    var postData = "";
    $.each(arr, function (x, y) {
        postData += $.param(y) + "&";
    })

    iface_com = new Object();
    iface_com.country = country;
    iface_com.channel = channel;
    iface_com.power = power;
    iface_com.htmode = htmode;
    iface_com.token = cookies;
    iface_com.wifi_mode = wifi_mode;
    var data = postData + $.param(iface_com) + "&";
    return data;
}

function iface_config(disabled, ssid, bcast, encrypt, wpa_psk, hwmode, maxsta, i) {

    var iface_config = {};
    iface_config["disabled" + i] = disabled;
    iface_config["ssid" + i] = ssid;
    iface_config["bcast" + i] = bcast;
    iface_config["encryption" + i] = encrypt;
    iface_config["key" + i] = wpa_psk;
    iface_config["hwmode" + i] = hwmode;
    iface_config["maxsta" + i] = maxsta;

    return iface_config;
}

/**点击保存 */
$("#apply").click(function () {
    if (!format_volide_ok()) {
        return;
    }

    if ($("#setting_box_24g").hasClass("active")) {

        if (support_8021x){
            /**WPA need config radius server */
            if ($("#encrypt_24g_0").val() == 6){
                shconfirm(wpa_confirm, "confirm", {
                    onClose: function (){
                        return;
                    },
                    onOk: function(){
                        is_setting_status = 1;

                        $.ajax({
                            type: 'post',
                            url: '/goform/set_wireless2g_settings',
                            data: get_post2g_data(),
                            success: function (data) {
                                if (data.ret == 1) {
                                    setting(data.init_time, gohref);
                                } else {
                                }
                            }
                        })
                    }
                  })
                
            }
        }

    }
    if ($("#setting_box_58g").hasClass("active")) {
        if (support_8021x){
            /**WPA need config radius server */  
            if ($("#encrypt_58g_0").val() == 6){
                shconfirm(wpa_confirm, "confirm", {
                    onClose: function (){
                        return;
                    },
                    onOk: function(){
                        is_setting_status = 1;
                
                        $.ajax({
                            type: 'post',
                            url: '/goform/set_wireless5g_settings',
                            data: get_post5g_data(),
                            success: function (data) {
                                if (data.ret == 1) {
                                    setting(data.init_time, gohref);
                                } else {
                                }
                            }
                        })                 
                    }
                })
            }
        }
    }

})

function show_passwd_24g_click(idx) {
    var pass_type = $("#passwd_24g_" + idx).attr("type");
    if(pass_type == "password"){
        $("#passwd_24g_" + idx).attr("type","text");
        $('.show_passwd_24g_' + idx).removeClass('fa-eye-slash').addClass('fa-eye');
    }else{
        $("#passwd_24g_" + idx).attr("type","password");
        $('.show_passwd_24g_' + idx).removeClass('fa-eye').addClass('fa-eye-slash');
    }
}

function show_passwd_58g_click(idx) {
    var pass_type = $("#passwd_58g_" + idx).attr("type");
    if(pass_type == "password"){
        $("#passwd_58g_" + idx).attr("type","text");
        $('.show_passwd_58g_' + idx).removeClass('fa-eye-slash').addClass('fa-eye');
    }else{
        $("#passwd_58g_" + idx).attr("type","password");
        $('.show_passwd_58g_' + idx).removeClass('fa-eye').addClass('fa-eye-slash');
    }
}
