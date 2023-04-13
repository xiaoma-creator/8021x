var features_support = "<% getUciFeaturesSupport("");%>";

var support_4g = features_support & (1 << 0) ? 1 : 0;
var support_5g = features_support & (1 << 1) ? 1 : 0;
var support_vlan = features_support & (1 << 2) ? 1 : 0;
var support_loadbalanced = features_support & (1 << 3) ? 1 : 0;
var support_message = features_support & (1 << 5) ? 1 : 0;
var support_cwmp = features_support & (1 << 6) ? 1 : 0;
var support_bridge_wired_first = features_support & (1 << 7) ? 1 : 0;
var support_mesh = features_support & (1 << 8) ? 1 : 0;
var support_snmp = features_support & (1 << 9) ? 1 : 0;
var support_guest_network = features_support & (1 << 10) ? 1 : 0;
var support_wlan = features_support & (1 << 11) ? 1 : 0;
var support_wps_setting = features_support & (1 << 12) ? 1 : 0;
var support_msg = features_support & (1 << 13) ? 1 : 0;
var support_8021x = features_support & (1 << 14) ? 1:0;
var support_qos = features_support & (1 << 15) ? 1:0;
var support_mqttcli = features_support & (1 << 16) ? 1 : 0;
var support_half_bridge = features_support & (1 << 17) ? 1 : 0;

var curr_wan_connected = '<% getCurrWanConnected("");%>';
var is_setting_status = 0;
var timer;

document.write("<script language=javascript src='/js/image_data.js'></script>");

$(document).ready(function () {
    getmenu();
    $('#sidebar-nav').on('click', '.dropdown-toggle', function (e) {
        e.preventDefault();
        var $item = $(this).parent();
        if (!$item.hasClass('open')) {
            $item.parent().find('.open .submenu').slideUp('fast');
            $item.parent().find('.open').toggleClass('open');
        }
        $item.toggleClass('open');
        if ($item.hasClass('open')) {
            $item.children('.submenu').slideDown('fast');
        } else {
            $item.children('.submenu').slideUp('fast');
        }
    });
    volide();

    RefreshHeader();
    timer = setInterval(RefreshHeader, 3000);

    var loading = document.getElementById("loading");
    if (document.readyState == "complete") {
        // 页面加载完毕
        loading.style.display = "none";
    }
    $("img").attr("draggable",false);
})

var rssi = 0;
var mode = "";
var netSer = "";
var wifi_switch = 0;
var wifi_use_num = 0;
var message_num = 0;
var user_num = 0;
var wire_status = 0;

function RefreshHeader(){
    if(is_setting_status == 1)
    {
        clearInterval(timer);
    }
    else
    {
        //清空
        $("#header-nav").empty();

        var html ='';
        var cookies = getCookie("token");
        $.ajax({
            contentType: "appliation/json",
            data: {token: cookies},
            dataType: "json",
            type: "POST",
            cache: false,
            async: false,
            url: "/goform/get_web_header_info",
            success: function (data) {
                // 5g info
                if (support_5g)
                {
                    if ((data.mode == "NR") || (data.mode == "LTE") || (data.mode == "WCDMA"))
                    {
                        mode = ( data.mode == "NR" )? "5g" : (( data.mode == "WCDMA" )?"3g":"4g");
                        netSer = data.szNetSer;
						rssi = data.sigval;
                    }
					else
					{
						mode = "";
						rssi = 0;
					}
                }

                // wifi info
                if(support_wlan)
                {
                    wifi_switch = data.wifi_switch;
                    wifi_use_num = data.wifi_user_num;
                }

                // user info
                user_num = data.user_num;

                //message info
                if (support_msg)
                {
                    message_num = data.message_num;
                }

                // wire status
                wire_status = data.wire_status;
            }
        })

        if(support_5g)
        {
            //5g info
            html='';
            html+='<ul class="nav navbar-nav pull-right">';
            html+='<li class="hidden-xs" sh_title="header_5g_txt">';
            html+='<a href="/mobile_setting.html" >';
            html+='<i id="5g_signal"></i>';
            html+='</a>';
            html+='</li>';
            html+='</ul>';
            $("#header-nav").prepend(html);

            html ='';
            html += '<div class="RSSI_box">';
            html += '<ul class="rssi_ul">';
            if (parseInt(rssi)  > 70 && parseInt(rssi)  <= 99){
                html += '<li class="rssi_li rssi_green"></li><li class="rssi_li"></li><li class="rssi_li"></li><li class="rssi_li"></li><li class="rssi_li"></li>';
            }
            else if (parseInt(rssi) <= 70 && parseInt(rssi) > 60){
                html += '<li class="rssi_li rssi_green"></li><li class="rssi_li rssi_green"></li><li class="rssi_li"></li><li class="rssi_li"></li><li class="rssi_li"></li>';
            }
            else if (parseInt(rssi) <= 60 && parseInt(rssi) > 40){
                html += '<li class="rssi_li rssi_green"></li><li class="rssi_li rssi_green"></li><li class="rssi_li rssi_green"></li><li class="rssi_li"></li><li class="rssi_li"></li>';
            }
            else if (parseInt(rssi) <= 40 && parseInt(rssi) > 20){
                html += '<li class="rssi_li rssi_green"></li><li class="rssi_li rssi_green"></li><li class="rssi_li rssi_green"></li><li class="rssi_li rssi_green"></li><li class="rssi_li"></li>';
            }
            else if (parseInt(rssi) <= 20 && parseInt(rssi) > 0){
                html += '<li class="rssi_li rssi_green"></li><li class="rssi_li rssi_green"></li><li class="rssi_li rssi_green"></li><li class="rssi_li rssi_green"></li><li class="rssi_li rssi_green"></li>';
            }
            else  //未连接
            {
                html += '<li class="rssi_li rssi_yellow"></li><li class="rssi_li"></li><li class="rssi_li"></li><li class="rssi_li"></li><li class="rssi_li"></li>';
                html += '<li class="rssi_li rssi_yellow"></li><li class="rssi_li rssi_yellow"></li><li class="rssi_li"></li><li class="rssi_li"></li><li class="rssi_li"></li>';
                html += '<li class="rssi_li rssi_yellow"></li><li class="rssi_li rssi_yellow"></li><li class="rssi_li rssi_yellow"></li><li class="rssi_li"></li><li class="rssi_li"></li>';
                html += '<li class="rssi_li rssi_yellow"></li><li class="rssi_li rssi_yellow"></li><li class="rssi_li rssi_yellow"></li><li class="rssi_li rssi_yellow"></li><li class="rssi_li"></li>';
                html += '<li class="rssi_li rssi_yellow"></li><li class="rssi_li rssi_yellow"></li><li class="rssi_li rssi_yellow"></li><li class="rssi_li rssi_yellow"></li><li class="rssi_li rssi_yellow"></li>';
            }

            html+='<span class="badge2">' + netSer + '</span>';
            html+='<span class="badge3">' + mode + '</span>';
            html += '</ul> </div>';
            $("#5g_signal").html(html);
        }

        // wifi info
        if(support_wlan)
        {
            html ='';
            html+='<ul class="nav navbar-nav pull-right">';
            html+='<li class="hidden-xs" sh_title="header_wifi_txt">';
            html+='<a href="/users_real.html" >';
            if(wifi_switch != 0)
            {
                html+='<i class="fa fa fa-wifi" style="font-size:24px;color:rgb(0, 208, 185)"></i>';
                html+='<span class="badge" style="background-color:#e39103;">' + wifi_use_num + '</span>';
            }
            else
            {
                html+='<i class="fa fa fa-wifi" style="font-size:24px"></i>';
            }
            html+='</a>';
            html+='</li>';
            html+='</ul>';
            $("#header-nav").prepend(html);
        }

        // users info
        html ='';
        html+='<ul class="nav navbar-nav pull-right">';
        html+='<li class="hidden-xs" sh_title="header_user_txt">';
        html+='<a href="/user_list.html" >';
        html+='<i class="fa fa-user-o" style="font-size:24px"></i>';
        html+='<span class="badge" style="background-color:#e39103;">' + user_num + '</span>';
        html+='</a>';
        html+='</li>';
        html+='</ul>';
        $("#header-nav").prepend(html);

		if (support_msg)
		{
			// message info
			html ='';
			html+='<ul class="nav navbar-nav pull-right">';
			html+='<li class="hidden-xs" sh_title="header_message_txt">';
			html+='<a href="/message.html?tab=1" >';
			html+='<i class="fa fa-envelope-o" style="font-size:24px"></i>';
			html+='<span class="badge" style="background-color:#e39103;">' + message_num + '</span>';
			html+='</a>';
			html+='</li>';
			html+='</ul>';
			$("#header-nav").prepend(html);
		}

        // wire status
        html ='';
        html+='<ul class="nav navbar-nav pull-right">';
        html+='<li class="hidden-xs" sh_title="logout_txt">';
        html+='<a href="/internet.html" >';
        if(wire_status == 1)
        {
            html+=wire_online;
        }
        else
        {
            html+=wire_offline;
        }
        html+='</a>';
        html+='</li>';
        html+='</ul>';
        $("#header-nav").prepend(html);

        //logout
        html ='';
        html+='<ul class="nav navbar-nav pull-right">';
        html+='<li class="hidden-xs" sh_title="logout_txt">';
        html+='<a href="/login.html" >';
        html+='<i class="fa fa-power-off" style="font-size:24px"></i>';
        html+='</a>';
        html+='</li>';
        html+='</ul>';
        $("#header-nav").prepend(html);
    }
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

/**菜单 start */
function get_config(a, b) {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        cache: false,
        async: false,
        url: '/js/menu.json',
        success: a,
        error: b
    });
}

function getmenu() {
    var workmode;
    get_config(function (config) {
        var mode = "<% getUciGeneral("goahead.@system[0].mode ");%>";
        var usb_mode = "<% getUciUSB("");%>";
        var no_wlan = "<% getUciWlan("");%>";
        if (mode == 0) {
            workmode = 'router';
        }else {
            workmode = 'ap';
        }
        $('#sidebar-nav').html(pathmenu(config, workmode,usb_mode,no_wlan));
    });
}

function pathmenu(arg, workmode,usb_mode,no_wlan) {
    var this_url = location.pathname;
    var menu_html;
    var sh_lang;
	var device_model = "<% getDeviceModel("");%>";
    menu_html = '<ul class="nav nav-pills nav-stacked" >';
    $.each(arg, function (n, q) {
        sh_lang = eval(q.name);
        if (q.childs.length > 0) {
            if ((q.name.indexOf('ads_firewall') > -1 || q.name.indexOf('internet_network_set') > -1 || q.name.indexOf('dns') > -1 || q.name.indexOf('route_table') > -1) && workmode != 'router') {
                return;
            }
            if((q.name.indexOf('usb_application') > -1) && usb_mode != 1){
                return;
            }
            if((q.name.indexOf('wireless_network_set') > -1) && no_wlan != "1")
            {
                return;
            }
            if ((q.name.indexOf('vpn_header') > -1) && (workmode != 'router' || device_model == 0))
            {
                 return;
            }
            var tmp_key = "";
            var i;

            for (i = 0; i < q.childs.length; i++) {
                if (this_url == q.childs[i].urls) {
                    tmp_key = q.childs[i].keyword;
                }
            }
            if (q.urls == tmp_key) {
                menu_html += '<li class="active open">';
            } else {
                menu_html += '<li>';
            }
            menu_html += '<a class="dropdown-toggle"><i class="fa ' + q.icon + '"></i>' +
                '<span sh_lang = ' + q.name + '>' + sh_lang + '</span>';
            menu_html += '<i class="fa fa-chevron-circle-right drop-icon"></i></a>';
            menu_html += childmenu(q.childs, workmode);
            menu_html += '</li>';
        } else {
            if ((q.name.indexOf('ads_firewall') > -1 || q.name.indexOf('internet_network_set') > -1 ||
                 q.name.indexOf('dns') > -1 || q.name.indexOf('route_table') > -1) && workmode != 'router')
            {
                return;
            }
            if (q.name.indexOf('message_switch') > -1 && (0 == support_5g || 0 == support_message))
            {
                return;
            }
            if (q.name.indexOf('netmanager_switch') > -1 && 0 == support_cwmp)
            {
                return;
            }
            if (q.name.indexOf('vlan') > -1 && 0 == support_vlan)
            {
                return;
            }
			if (q.name.indexOf('message') > -1 && 0 == support_msg)
            {
                return;
            }
			if ((q.name.indexOf('qos')) > -1 && (0 == support_qos))
			{
				return;
			}
            if (q.name.indexOf('mac_User_management') > -1  && workmode == 'router')
            {
                return;
            } else if (q.name.indexOf('ads_User_management') > -1 && workmode != 'router')
            {
                return;
            }
            if (q.name.indexOf('online_list') > -1 && workmode != 'router')
            {
                return;
            }
            if (this_url.indexOf(q.urls) > -1 || this_url.indexOf(q.urltag) > -1)
            {
                menu_html += '<li class="active">';
            } else
            {
                menu_html += '<li>';
            }
            menu_html += '<a href="' + q.urls + '">';
            menu_html += '<i class="fa ' + q.icon + '"></i>';
            menu_html += '<span sh_lang = ' + q.name + '>' + sh_lang + '</span>';
            menu_html += '<span class="selected hidden-xs"></span>';
            menu_html += '</a>';
            menu_html += '</li>';
        }
    });
    menu_html += '</ul>';
    return menu_html;
}

function childmenu(arg, workmode) {
    var this_url = location.pathname;
    var sh_lang, menu_html;
    var StaticRouteSupport = '<% getStaticRouteSupport("");%>';
    var URLSupport = '<% getURLSupport("");%>';
    var custorm = "<% getCustormInfo("");%>";
    menu_html = '<ul class="submenu">';
    $.each(arg, function (n, m) {
        sh_lang = eval(m.name);
        if (m.childs.length > 0) {
            if ((m.name.indexOf('ads_firewall') > -1 || m.name.indexOf('internet_network_set') > -1 || m.name.indexOf('dns') > -1 ||
             m.name.indexOf('route_table') > -1) && workmode != 'router') {
                return;
            }
            if (this_url.indexOf(m.urls) > -1) {
                menu_html += '<li class="active open">';
            } else {
                menu_html += '<li>';
            }
            menu_html += '<a class="dropdown-toggle"><i class="fa fa-chevron-circle-right drop-icon"></i>' +
                '<span sh_lang = ' + m.name + '>' + sh_lang + '</span></a>';
            menu_html += childmenu(m.childs);
            menu_html += '</li>';
        } else {
            if ((m.name.indexOf('ads_firewall') > -1 || m.name.indexOf('internet_network_set') > -1
            || m.name.indexOf('dns') > -1 || m.name.indexOf('route_table') > -1 ||
            m.name.indexOf('dhcp_client') > -1 || m.name.indexOf('mac_clone') > -1) && workmode != 'router') {
                return;
            }
			if (m.name.indexOf('intelligent_switch') > -1  && support_bridge_wired_first != 1)
			{
                return;
            }
			if(m.name.indexOf('mobile_set') > -1 && (workmode != 'router' || 0 == support_5g))
            {
                return;
			}
			if(m.name.indexOf('index_flow_statistics') > -1 && 0 == support_5g)
            {
                return;
			}
			if((m.name.indexOf('route_table') > -1) && StaticRouteSupport == 0 ){
                return;
            }
            if(m.name.indexOf('load_balanced') > -1 && support_loadbalanced != "1")
            {
                return;
            }
			if(m.name.indexOf('mesh_set') > -1 && support_mesh != "1")
            {
                return;
            }
            if(m.name.indexOf('snmp_management') > -1 && 0 == support_snmp)
            {
                return;
			}
            if((m.name.indexOf('urlfilter_header') > -1) && URLSupport == 0 ){
                return;
            }
            if(m.name.indexOf('guest_network') > -1 && 0 == support_guest_network)
            {
                return;
			}
            if(m.name.indexOf('wps_setting') > -1 && 0 == support_wps_setting)
            {
                return;
            }
            if(m.name.indexOf('server_set') > -1 && custorm != 'ws'){
                return;
            }
            if((m.name.indexOf('mac_clone') > -1) && workmode == 'router'){
                return;
            }
            if(m.name.indexOf('authentication_8021x') > -1 && 0 == support_8021x)
            {
                return;
            }
			if(m.name.indexOf('mqtt_client') > -1 && 0 == support_mqttcli)
            {
                return;
			}

            if (this_url.indexOf(m.urls) > -1) {
                menu_html += '<li><a href="' + m.urls + '" sh_lang = "' + m.name + '" class="active">' + sh_lang + '<span class="selected hidden-xs"></span></a></li>';
            } else {
                menu_html += '<li><a href="' + m.urls + '" sh_lang = "' + m.name + '">' + sh_lang + '</a></li>';
            }
        }
    })
    menu_html += '</ul>';
    return menu_html;
}
/**菜单 end */

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

/**提示信息 start */
function volide() {
    var requires = $("div").find('.require');
    var format_error_num = 0;
    requires.keyup(function () {
        var this_obj = $(this);
        var ByteCount, LenghtCount;
        var $parent = this_obj.parents('.list');
        $parent.find(".icon_margin").remove();
        this_obj.removeClass('borError');
        var tmp_id = this_obj.attr("id");

	    //isNULL
        if (this_obj.hasClass('isNULL') && this.value == '') {
            $parent.append('<i class="fa fa-check-circle col-lg-1 col-md-1 col-xs-1 icon_margin icon-success"></i>');
            this_obj.removeClass('borError');
            return;
        }

         //包含 isNONULL
         if (this_obj.hasClass('isNONULL')) {
            if (this_obj.val() == '') {
                $parent.append('<i class="fa fa-times-circle col-lg-1 col-md-1 col-xs-1 icon_margin icon-error"></i>');
                if ($("." + tmp_id).html() == undefined)
                    $("#" + tmp_id).after('<p class="' + tmp_id + ' hide" style="color:red;"></p>');
                this_obj.addClass('borError');
                return false;
            }
        }

        //包含 isALL 127位
        if (this_obj.hasClass('isALL127')) {
            ByteCount = checkChar($.trim(this.value));
            if (ByteCount > 127 || ByteCount < 1) {
                $parent.append('<i class="fa fa-times-circle col-lg-1 col-md-1 col-xs-1 icon_margin icon-error"></i>');
                if ($("." + tmp_id).html() == undefined)
                    $("#" + tmp_id).after('<p class="' + tmp_id + ' hide" style="color:red;"></p>');
                this_obj.addClass('borError');
                return false;
            }
        }

		 //包含 isALL 256位
        if (this_obj.hasClass('isALL256')) {
            ByteCount = checkChar($.trim(this.value));
            if (ByteCount > 256) {
                $parent.append('<i class="fa fa-times-circle col-lg-1 col-md-1 col-xs-1 icon_margin icon-error"></i>');
                if ($("." + tmp_id).html() == undefined)
                    $("#" + tmp_id).after('<p class="' + tmp_id + ' hide" style="color:red;"></p>');
                this_obj.addClass('borError');
                return false;
            }
        }

		//包含 isALL
		if (this_obj.hasClass('isALL')) {
            ByteCount = checkChar($.trim(this.value));
            if (ByteCount > 32 || ByteCount < 1) {
                $parent.append('<i class="fa fa-times-circle col-lg-1 col-md-1 col-xs-1 icon_margin icon-error"></i>');
                if ($("." + tmp_id).html() == undefined)
                    $("#" + tmp_id).after('<p class="' + tmp_id + ' hide" style="color:red;"></p>');
                this_obj.addClass('borError');
                return false;
            }
        }

        //包含 isCharNum
        if (this_obj.hasClass('isCharNum')) {
            ByteCount = checkChar($.trim(this.value));
            if (!charnum(this.value) || ByteCount == 0 || ByteCount > 32) {
                $parent.append('<i class="fa fa-times-circle col-lg-1 col-md-1 col-xs-1 icon_margin icon-error"></i>');
                if ($("." + tmp_id).html() == undefined)
                    $("#" + tmp_id).after('<p class="' + tmp_id + ' hide" style="color:red;"></p>');
                this_obj.addClass('borError');
                return false;
            }
        }

		//手机号
		if (this_obj.hasClass('isReciever_Phone')) {
			ByteCount = checkChar($.trim(this.value));
			if(ByteCount != 11)
			{
				$parent.append('<i class="fa fa-times-circle col-lg-1 col-md-1 col-xs-1 icon_margin icon-error"></i>');
				if ($("." + tmp_id).html() == undefined)
				   $("#" + tmp_id).after('<p class="' + tmp_id + ' hide" style="color:red;"></p>');
				this_obj.addClass('borError');
				return false;
			}
        }

		//QOS地址判断
		if (this_obj.hasClass('isQOSIP_MAC') && (!QOS_IP_MAC(this.value) || this.value == '')) {
			$parent.append('<i class="fa fa-times-circle col-lg-1 col-md-1 col-xs-1 icon_margin icon-error"></i>');
			if ($("." + tmp_id).html() == undefined)
			   $("#" + tmp_id).after('<p class="' + tmp_id + ' hide" style="color:red;"></p>');
			this_obj.addClass('borError');
			return false;
        }

		//QOS端口判断
        if (this_obj.hasClass('isQOSPORTS')) {
			if(this.value != "")
			{
				if((this.value != "all") && (this.value != "All") && (this.value != "ALL"))
				{
					var ports = this.value.split(",");
					var i = 0;
					for(i=0; i<ports.length; i++)
					{
						if((parseInt(ports[i],10) < 1) || (parseInt(ports[i],10) > 65535) || isNaN(parseInt(ports[i],10)))
						{
							$parent.append('<i class="fa fa-times-circle col-lg-1 col-md-1 col-xs-1 icon_margin icon-error"></i>');
							if ($("." + tmp_id).html() == undefined)
							   $("#" + tmp_id).after('<p class="' + tmp_id + ' hide" style="color:red;"></p>');
							this_obj.addClass('borError');
							return false;
						}
					}
				}
			}
        }

		//isRoute
        if (this_obj.hasClass('isRoute') && ((!isIpaddr(this.value) && this.value != "0.0.0.0") || this.value == '')) {
            $parent.append('<i class="fa fa-times-circle col-lg-1 col-md-1 col-xs-1 icon_margin icon-error"></i>');
            if ($("." + tmp_id).html() == undefined)
               $("#" + tmp_id).after('<p class="' + tmp_id + ' hide" style="color:red;"></p>');
            this_obj.addClass('borError');
            return false;
        }

        //isIP
        if (this_obj.hasClass('isIP') && (!isIpaddr(this.value) || this.value == '')) {
            $parent.append('<i class="fa fa-times-circle col-lg-1 col-md-1 col-xs-1 icon_margin icon-error"></i>');
            if ($("." + tmp_id).html() == undefined)
               $("#" + tmp_id).after('<p class="' + tmp_id + ' hide" style="color:red;"></p>');
            this_obj.addClass('borError');
            return false;
        }

        //isIPv6
        if(this_obj.hasClass('isIPv6') && (!checkIPv6Addr(this.value)|| !checkIPv6(this.value) || !check_special_ipv6addr(this.value) || this.value == '')){
            $parent.append('<i class="fa fa-times-circle col-lg-1 col-md-1 col-xs-1 icon_margin icon-error"></i>');
            if ($("." + tmp_id).html() == undefined)
               $("#" + tmp_id).after('<p class="' + tmp_id + ' hide" style="color:red;"></p>');
            this_obj.addClass('borError');
            return false;
        }

        //IPv6Prefix
        if(this_obj.hasClass('checkIPv6Prefix') && (!checkIPv6Prefix(this.value))){
            $parent.append('<i class="fa fa-times-circle col-lg-1 col-md-1 col-xs-1 icon_margin icon-error"></i>');
            if ($("." + tmp_id).html() == undefined)
               $("#" + tmp_id).after('<p class="' + tmp_id + ' hide" style="color:red;"></p>');
            this_obj.addClass('borError');
            return false;
        }

		//isPorts
        if (this_obj.hasClass('isPorts') && (this.value == '' || parseInt(this.value) > 65535 || parseInt(this.value) < 1)) {
            $parent.append('<i class="fa fa-times-circle col-lg-1 col-md-1 col-xs-1 icon_margin icon-error"></i>');
            if ($("." + tmp_id).html() == undefined)
               $("#" + tmp_id).after('<p class="' + tmp_id + ' hide" style="color:red;"></p>');
            this_obj.addClass('borError');
            return false;
        }

        //isEndIp
        if (this_obj.hasClass('isEndIp') && (!isIpaddr(this.value) || this.value == '' || (parseInt($(this).val().split(".")[3]) < parseInt($("#dhcp_start").val().split(".")[3])))) {
            $parent.append('<i class="fa fa-times-circle col-lg-1 col-md-1 col-xs-1 icon_margin icon-error"></i>');
            if ($("." + tmp_id).html() == undefined)
               $("#" + tmp_id).after('<p class="' + tmp_id + ' hide" style="color:red;"></p>');
            this_obj.addClass('borError');
            return false;
        }

        //isNetmask
        if (this_obj.hasClass('isNetmask') && (!isNetmask(this.value) || this.value == '')) {
            $parent.append('<i class="fa fa-times-circle col-lg-1 col-md-1 col-xs-1 icon_margin icon-error"></i>');
            if ($("." + tmp_id).html() == undefined)
               $("#" + tmp_id).after('<p class="' + tmp_id + ' hide" style="color:red;"></p>');
            this_obj.addClass('borError');
            return false;
        }

        //isWpsPinCode
        if (this_obj.hasClass('isWpsPinCode')) {
            if (!isNum(this.value) || this.value.length != 8) {
                if ($("." + tmp_id).html() == undefined)
                    $("#" + tmp_id).after('<p class="' + tmp_id + ' hide" style="color:red;"></p>');
                this_obj.addClass('borError');
                return false;
            }
        }

        //isNUM
        if (this_obj.hasClass('isNUM')) {
            var startnum = parseInt(this_obj.attr('name').split("_@")[1].split("_")[0]) || '0';
            var endnum = parseInt(this_obj.attr("name").split("_@")[1].split("_")[1]) || Number.MAX_VALUE;
            if (!isNum(this.value) || !isRangNum(this.value, startnum, endnum)) {

                if ($("." + tmp_id).html() == undefined)
                    $("#" + tmp_id).after('<p class="' + tmp_id + ' hide" style="color:red;"></p>');
                this_obj.addClass('borError');
                return false;
            }
        }

		//isNumLen
        if (this_obj.hasClass('isNumLen')) {
            var numLen = parseInt(this_obj.attr('name').split("_@")[1]) || '0';
            if (!isNum(this.value) || (numLen != this.value.length)) {
                if ($("." + tmp_id).html() == undefined)
                    $("#" + tmp_id).after('<p class="' + tmp_id + ' hide" style="color:red;"></p>');
                this_obj.addClass('borError');
                return false;
            }
        }

        //isNUM_1_4094
        if (this_obj.hasClass('isNUM_1_4094')) {
            var startnum = parseInt(this_obj.attr('name').split("_@")[1].split("_")[0]) || '0';
            var endnum = parseInt(this_obj.attr("name").split("_@")[1].split("_")[1]) || Number.MAX_VALUE;
            if (!isNum(this.value) || !isRangNum(this.value, startnum, endnum)) {

                if ($("." + tmp_id).html() == undefined)
                    $("#" + tmp_id).after('<p class="' + tmp_id + ' hide" style="color:red;"></p>');
                this_obj.addClass('borError');
                return false;
            }
        }

		//isNUM_2_254
        if (this_obj.hasClass('isNUM_2_254')) {
            var startnum = parseInt(this_obj.attr('name').split("_@")[1].split("_")[0]) || '0';
            var endnum = parseInt(this_obj.attr("name").split("_@")[1].split("_")[1]) || Number.MAX_VALUE;
            if (!isNum(this.value) || !isRangNum(this.value, startnum, endnum)) {
                $parent.append('<i class="fa fa-times-circle col-lg-1 col-md-1 col-xs-1 icon_margin icon-error"></i>');
                if ($("." + tmp_id).html() == undefined)
                    $("#" + tmp_id).after('<p class="' + tmp_id + ' hide" style="color:red;"></p>');
                this_obj.addClass('borError');
                return false;
            }
        }

        //isNUM_0_64
        if (this_obj.hasClass('isNUM_0_64')) {
            var startnum = parseInt(this_obj.attr('name').split("_@")[1].split("_")[0]) || '0';
            var endnum = parseInt(this_obj.attr("name").split("_@")[1].split("_")[1]) || Number.MAX_VALUE;
            if(this.value != "auto" && this.value != "no"){
                if (!isNum(this.value) || !isRangNum(this.value, startnum, endnum)) {
                    $parent.append('<i class="fa fa-times-circle col-lg-1 col-md-1 col-xs-1 icon_margin icon-error"></i>');
                    if ($("." + tmp_id).html() == undefined)
                        $("#" + tmp_id).after('<p class="' + tmp_id + ' hide" style="color:red;"></p>');
                    this_obj.addClass('borError');
                    return false;
                }
            }
        }

        //isEnglish
        if (this_obj.hasClass('isEnglish')) {
            ByteCount = checkChar($.trim(this.value));
            if (isChinese(this.value) || this.value.indexOf(" ") > -1 || ByteCount > 32 || ByteCount < 1) {
                $parent.append('<i class="fa fa-times-circle col-lg-1 col-md-1 col-xs-1 icon_margin icon-error"></i>');
                if ($("." + tmp_id).html() == undefined)
                $("#" + tmp_id).after('<p class="' + tmp_id + ' hide" style="color:red;"></p>');
                this_obj.addClass('borError');
                return;
            }
        }

         //isSSID
         if (this_obj.hasClass('isSSID')) {
            ByteCount = checkChar($.trim(this.value));
            if (ByteCount > 30 || ByteCount < 1 ||
                !check_special(this.value)) {
                $parent.append('<i class="fa fa-times-circle col-lg-1 col-md-1 col-xs-1 icon_margin icon-error"></i>');
                if ($("." + tmp_id).html() == undefined)
                $("#" + tmp_id).after('<p class="' + tmp_id + ' hide" style="color:red;"></p>');
                this_obj.addClass('borError');
                return;
            }
        }

        //isSSIDPwd
        if (this_obj.hasClass('isSSIDPwd')) {
            ByteCount = checkChar($.trim(this.value));
            if (ByteCount < 8 || ByteCount > 63 || !(check_psk(this.value))) {
                $parent.append('<i class="fa fa-times-circle col-lg-1 col-md-1 col-xs-1 icon_margin icon-error"></i>');
                if ($("." + tmp_id).html() == undefined)
                $("#" + tmp_id).after('<p class="' + tmp_id + ' hide" style="color:red;"></p>');
                this_obj.addClass('borError');
                return;
            }
        }

		//isRepterPwd
        if (this_obj.hasClass('isRepterPwd')) {
            ByteCount = checkChar($.trim(this.value));
            if (!(checkChinese(this.value))) {
                $parent.append('<i class="fa fa-times-circle col-lg-1 col-md-1 col-xs-1 icon_margin icon-error"></i>');
                if ($("." + tmp_id).html() == undefined)
                $("#" + tmp_id).after('<p class="' + tmp_id + ' hide" style="color:red;"></p>');
                this_obj.addClass('borError');
                return;
            }
        }

		//isPPPOEPwd
		if (this_obj.hasClass('isPPPOEPwd')) {
            ByteCount = checkChar($.trim(this.value));
            if (this.value.indexOf(" ") > -1 || ByteCount < 8 || ByteCount > 63) {
                $parent.append('<i class="fa fa-times-circle col-lg-1 col-md-1 col-xs-1 icon_margin icon-error"></i>');
                if ($("." + tmp_id).html() == undefined)
                $("#" + tmp_id).after('<p class="' + tmp_id + ' hide" style="color:red;"></p>');
                this_obj.addClass('borError');
                return;
            }
        }

        //is_network_segment
        if (this_obj.hasClass('is_network_segment')) {
            ByteCount = checkChar($.trim(this.value));
            if (this.value.indexOf(" ") > -1 || !check_network_segment(this.value)) {
                if ($("." + tmp_id).html() == undefined)
                $("#" + tmp_id).after('<p class="' + tmp_id + ' hide" style="color:red;"></p>');
                this_obj.addClass('borError');
                return;
            }
        }

        //isSAMBAGroup
        if (this_obj.hasClass('isSAMBAGroup')) {
            ByteCount = checkChar($.trim(this.value));
            if (!format_check(this.value) || this.value.indexOf(" ") > -1 || ByteCount < 1 || ByteCount > 16) {
                $parent.append('<i class="fa fa-times-circle col-lg-1 col-md-1 col-xs-1 icon_margin icon-error"></i>');
                if ($("." + tmp_id).html() == undefined)
                $("#" + tmp_id).after('<p class="' + tmp_id + ' hide" style="color:red;"></p>');
                this_obj.addClass('borError');
                return;
            }
        }

        //isHostname
        if (this_obj.hasClass('isHostname')) {
            ByteCount = checkChar($.trim(this.value));
            if (!format_check(this.value)) {
                $parent.append('<i class="fa fa-times-circle col-lg-1 col-md-1 col-xs-1 icon_margin icon-error"></i>');
                if ($("." + tmp_id).html() == undefined)
                $("#" + tmp_id).after('<p class="' + tmp_id + ' hide" style="color:red;"></p>');
                this_obj.addClass('borError');
                return;
            }
        }

        //isLoginPwd
        if (this_obj.hasClass('isLoginPwd')) {
            ByteCount = checkChar($.trim(this.value));
            if (this.value.indexOf(" ") > -1 || ByteCount < 8 || ByteCount > 63) {
                $parent.append('<i class="fa fa-times-circle col-lg-1 col-md-1 col-xs-1 icon_margin icon-error"></i>');
                if ($("." + tmp_id).html() == undefined)
                $("#" + tmp_id).after('<p class="' + tmp_id + ' hide" style="color:red;"></p>');
                this_obj.addClass('borError');
                return;
            }
        }

        //isSpecial
        if(this_obj.hasClass('isSpecial')){
            var test = $.trim(this.value);
            if(!check_special(test)){
                $parent.append('<i class="fa fa-times-circle col-lg-1 col-md-1 col-xs-1 icon_margin icon-error"></i>');
                if($("." + tmp_id).html() == undefined)
                    $("#" + tmp_id).after('<p class="' + tmp_id + ' hide" style="color:red;"></p>');
                this_obj.addClass('borError');
                return;
            }
        }

	    // /isMAC
        if (this_obj.hasClass('isMAC') && (!isMac(this.value) || this.value == '' || !checkMac(this.value))) {
            $parent.append('<i class="fa fa-times-circle col-lg-1 col-md-1 col-xs-1 icon_margin icon-error"></i>');
            if ($("." + tmp_id).html() == undefined)
                $("#" + tmp_id).after('<p class="' + tmp_id + ' hide" style="color:red;"></p>');
            this_obj.addClass('borError');
            return;
        }

         //isUrl
         if (this_obj.hasClass('isUrl')) {
            ByteCount = checkChar($.trim(this.value));
            if (ByteCount > 63 || this.value == "" || this.value.indexOf(" ") > -1) {
                $parent.append('<i class="fa fa-times-circle col-lg-1 col-md-1 col-xs-1 icon_margin icon-error"></i>');
                if ($("." + tmp_id).html() == undefined)
                $("#" + tmp_id).after('<p class="' + tmp_id + ' hide" style="color:red;"></p>');
                this_obj.addClass('borError');
                return;
            }
        }

        //isSpeed
        if(this_obj.hasClass('isSpeed')){
            var speed = $.trim(this.value);
            if(speed >1024000 || speed < 0 || this.value == "" || this.value.indexOf(" ") > -1){
                $parent.append('<i class="fa fa-times-circle col-lg-1 col-md-1 col-xs-1 icon_margin icon-error"></i>');
                if($("." + tmp_id).html() == undefined)
                    $("#" + tmp_id).after('<p class="' + tmp_id + ' hide" style="color:red;"></p>');
                this_obj.addClass('borError');
                return;
            }
        }

        //isIPv6AndPrefix
        if(this_obj.hasClass('isIPv6AndPrefix')){
            if(this.value != '' && !checkIPv6AndPrefix(this.value)){
                $parent.append('<i class="fa fa-times-circle col-lg-1 col-md-1 col-xs-1 icon_margin icon-error"></i>');
                if($("." + tmp_id).html() == undefined)
                    $("#" + tmp_id).after('<p class="' + tmp_id + ' hide" style="color:red;"></p>');
                this_obj.addClass('borError');
                return;
            }
        }

        //isRangeNumberOrNull
        if (this_obj.hasClass('isRangeNumberOrNull')) {
            if(this.value != ''){
                var startnum = parseInt(this_obj.attr('name').split("_@")[1].split("_")[0]) || '0';
                var endnum = parseInt(this_obj.attr("name").split("_@")[1].split("_")[1]) || Number.MAX_VALUE;
                if (!isNum(this.value) || !isRangNum(this.value, startnum, endnum)) {
                    if ($("." + tmp_id).html() == undefined)
                        $("#" + tmp_id).after('<p class="' + tmp_id + ' hide" style="color:red;"></p>');
                    this_obj.addClass('borError');
                    return false;
                }
            }else {
					$parent.append('<i class="fa fa-times-circle col-lg-1 col-md-1 col-xs-1 icon_margin icon-error"></i>');
					if ($("." + tmp_id).html() == undefined)
						$("#" + tmp_id).after('<p class="' + tmp_id + ' hide" style="color:red;"></p>');
					this_obj.addClass('borError');
					return false;
			}
        }

        //isUserName
        if (this_obj.hasClass('isUserName')) {
            if(this.value != ''){
                if (isChineseAndSymbol(this.value) || !check_special(this.value)) {
                    if ($("." + tmp_id).html() == undefined)
                        $("#" + tmp_id).after('<p class="' + tmp_id + ' hide" style="color:red;"></p>');
                    this_obj.addClass('borError');
                    return false;
                }
            }
        }

		//isSnmpKey
        if (this_obj.hasClass('isSnmpKey')) {
            if (this.value.length < 8) {
                if ($("." + tmp_id).html() == undefined)
                    $("#" + tmp_id).after('<p class="' + tmp_id + ' hide" style="color:red;"></p>');
                this_obj.addClass('borError');
                return false;
            }
        }

        $parent.append('<i class="fa fa-check-circle col-lg-1 col-md-1 col-xs-1 icon_margin icon-success"></i>');
        $("." + tmp_id).remove();
        $("." + tmp_id + "_1").show();
        return true;
    }).blur(function () {
        $(this).triggerHandler("keyup");
        var this_obj = $(this);
        if (this_obj.hasClass('borError')) {
            show_format_error($(this), format_error_num, this_obj.attr("id"));
            format_error_num++;
            return;
        }
    });
}

function show_format_error(obj, num, err_cla) {
    ByteCount = checkChar($.trim(obj.val()));
    $("." + err_cla).removeClass('hide');
    var format_id = 'format_' + num;
    var format_name = obj.parent('.form_right').find('.tip_name').html();
    if (obj.val() == '') {
        if(obj.hasClass('isDhcp_leasetime')){
		ErrorTip(format_id, isDhcp_leasetime_null_tips, format_name, err_cla);
		return;
	}
	ErrorTip(format_id, null_tips, format_name, err_cla);
        return;
    }
	else if (obj.hasClass('isNUM_2_254')) {
        if (obj.val() == '') {
            ErrorTip(format_id, dhcp_error_null,format_name,err_cla);
            return;
        }
        ErrorTip(format_id, dhcp_error,format_name,err_cla);
    }
	else if (obj.hasClass('isQOSIP_MAC')) {
        if (obj.val() == '') {
            ErrorTip(format_id, qos_host_error_null,format_name,err_cla);
            return;
        }
        ErrorTip(format_id, qos_host_error,format_name,err_cla);
    }
	else if (obj.hasClass('isPorts')) {
        if (obj.val() == '') {
            ErrorTip(format_id, host_server_ports_error_null,format_name,err_cla);
            return;
        }
        ErrorTip(format_id, host_server_ports_error,format_name,err_cla);
    }
    else if(obj.attr('id').indexOf('ssid') > -1){

        if (obj.val() == '') {
            ErrorTip(format_id, msg_error_ssid_null,format_name,err_cla);
            return;
        }else if(!check_special(obj.val())){
            ErrorTip(format_id, msg_error_spacial,format_name,err_cla);
        }else if(ByteCount > 30 || ByteCount < 1){
            ErrorTip(format_id, msg_error_ssid_maxlength,format_name,err_cla);
        }

    }
    else if(obj.attr('id').indexOf('comment') > -1){
        if(!check_special(obj.val())){
            ErrorTip(format_id, msg_error_spacial,format_name,err_cla);
        }else if(ByteCount > 30){
            ErrorTip(format_id, msg_error_comm,format_name,err_cla);
        }
    }
	else if (obj.hasClass('is_network_segment')) {
        if (obj.val() == '') {
            ErrorTip(format_id, vpn_network_segment_error,format_name,err_cla);
            return;
        }
        ErrorTip(format_id, vpn_network_segment_error,format_name,err_cla);
    }
	else if (obj.hasClass('isSAMBAGroup')){
		if (obj.val() == ''){
			ErrorTip(format_id, msg_error_samba_group_null,format_name,err_cla);
			return ;
		}
		ErrorTip(format_id, msg_error_sambagroup,format_name,err_cla);
	}
    else if(obj.attr('id').indexOf('passwd') > -1
    || obj.attr('id').indexOf('psk') > -1
    || obj.attr('id').indexOf('pwd') > -1){
        if (obj.val() == '') {
            ErrorTip(format_id, msg_error_key,format_name,err_cla);
            return;
        }else if(ByteCount > 63 || ByteCount < 8){
            ErrorTip(format_id, msg_error_loginkey,format_name,err_cla);
        }
        else if(!check_psk(obj.val())){
            ErrorTip(format_id, msg_error_trip,format_name,err_cla);
        }
    }
    else if(obj.attr('id').indexOf('comment') > -1){
        if(!check_special(obj.val())){
            ErrorTip(format_id, msg_error_spacial,format_name,err_cla);
        }else if(ByteCount > 30){
            ErrorTip(format_id, msg_error_comm,format_name,err_cla);
        }
    }
	else if (obj.hasClass('isSAMBAGroup')){
		if (obj.val() == ''){
			ErrorTip(format_id, msg_error_samba_group_null,format_name,err_cla);
			return ;
		}
		ErrorTip(format_id, msg_error_sambagroup,format_name,err_cla);
    }
    else if(obj.hasClass('isHostname')){
        ErrorTip(format_id, msg_error_hostname,format_name,err_cla);

    }
    else if(obj.hasClass('isEndIp')){
        if((!isIpaddr(obj.val()) || obj.val() == ''))
            ErrorTip(format_id, ip_format_error, format_name, err_cla);
        else
            ErrorTip(format_id, dhcp_add_error,format_name,err_cla);
    }
    else if(obj.hasClass('isUpload')){
        if (obj.val() == '') {
            ErrorTip(format_id, upload_error,format_name,err_cla);
            return;
        }
        ErrorTip(format_id, upload_error2,format_name,err_cla);
    }
    else if(obj.hasClass('isDownload')){
        if (obj.val() == '') {
            ErrorTip(format_id, down_error,format_name,err_cla);
            return;
        }
        ErrorTip(format_id, down_error2,format_name,err_cla);
    }
    else if(obj.hasClass("isDHCPLimit")){
        ErrorTip(format_id, error_dhcp_limit,format_name,err_cla);
    }
    else if(obj.hasClass('isDhcp_leasetime'))
    {
        ErrorTip(format_id, error_dhcp_leasetime,format_name,err_cla);
    }
    else if(obj.hasClass('isPort'))
    {
        ErrorTip(format_id, port_range,format_name,err_cla);
    }
    else if(obj.hasClass('isRepterPwd'))
    {
        ErrorTip(format_id, msg_error_chinese,format_name,err_cla);
    }
    else if(obj.hasClass('isMAC'))
    {
        ErrorTip(format_id, mac_addr_error,format_name,err_cla);
    }
    else if(obj.hasClass('isIP'))
    {
        ErrorTip(format_id, ip_format_error,format_name,err_cla);
    }
    else if(obj.hasClass('isNUM'))
    {
        ErrorTip(format_id, num_format_error,format_name,err_cla);
    }
    else if(obj.hasClass('isRangeNumberOrNull'))
    {
        ErrorTip(format_id, num_format_error,format_name,err_cla);
    }
    else if(obj.hasClass('isNetmask'))
    {
        ErrorTip(format_id, netmask_format_error,format_name,err_cla);
    }
    else if(obj.hasClass('isIPv6AndPrefix'))
    {
        ErrorTip(format_id, ipv6_prefix_format_error,format_name,err_cla);
    }
    else if (obj.hasClass('isUserName'))
    {
        ErrorTip(format_id, msg_error_trip,format_name,err_cla);
    }
    else if (obj.hasClass('isWpsPinCode'))
    {
        ErrorTip(format_id, pin_code_error,format_name,err_cla);
    }
	else if (obj.hasClass('isSnmpKey'))
    {
        ErrorTip(format_id, snmpv3_password_error,format_name,err_cla);
    }
    else
        ErrorTip(format_id, format_tips, format_name, err_cla);

}

function ErrorTip(num, tiptext, setname, err_cla) {
    var error_id = 'error_' + num,
        this_html = '',
        setname = setname || '';
    this_html += tiptext;
    var temp_tips;
    temp_tips = $("." + err_cla).html();
    //  if (temp_tips == "") {
        $("." + err_cla).text(this_html);
        $("." + err_cla + "_1").hide();
    //  }
    // setTimeout(function () {
    //     $("." + err_cla).remove();
    //     $("." + err_cla + "_1").show();
    // }, 3000);

}

function SetOKTip(num, tiptext) {
    var setok_id = 'setok_' + num,
        this_html = '',
        setname = setname || '';
    this_html += '<div class="alert alert-success fade in" id="' + setok_id + '">';
    this_html += '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>';
    this_html += '<i class="fa fa-check-circle fa-fw fa-lg"></i>';
    this_html += '<strong>' + setname + '</strong> ' + " " + tiptext;
    this_html += '</div>';
    $(".set_tips").append(this_html);
    setTimeout(function () {
        $('#' + setok_id).remove();
    }, 3000);
}

function show_error_form(obj,msg){
	var err_html = '<p class="tr_error_box" style="color:red;">'+msg+'</p>';
    obj.after(err_html);
    setTimeout(function (){
        $(".tr_error_box").remove();
    },3000);
}

/** 检测IP*/

function isEqualIPAddress (addr1,addr2,addr3,mask){
    if(!addr1 || !addr2 || !mask){
        // 各参数不能为空
        return false;
    }
    var
    res1 = [],
    res2 = [],
    res3 = [],
    ret = 0;
    addr1 = addr1.split(".");
    addr2 = addr2.split(".");
    addr3 = addr3.split(".");
    mask = mask.split(".");
    for(var i = 0,ilen = addr1.length; i < ilen ; i += 1){
        res1.push(parseInt(addr1[i]) & parseInt(mask[i]));
        res2.push(parseInt(addr2[i]) & parseInt(mask[i]));
        res3.push(parseInt(addr3[i]) & parseInt(mask[i]));
    }
    if(addr3 != ""){
        if(res1.join(".") == res2.join(".") && res1.join(".") == res3.join(".")){
            ret = 1;
        }
        else if(res1.join(".") != res2.join(".")){
            // 不在同一个网段
            ret = 2;
        }else if(res1.join(".") != res3.join(".")){
            // 不在同一个网段
            ret = 3;
        }
        return ret
    }else{
        if(res1.join(".") == res2.join(".")){
            return true;
        }
        else{
            // 不在同一个网段
            return false;
        }
    }
}

function checkIP(ip){
	var exp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.([1-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])$/;
	var reg = ip.match(exp);
	if(reg == null){
		return false;
	}else{
		return true;
	}
}

function checkMask(mask){
	var exp = /^(254|252|248|240|224|192|128|0)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(254|252|248|240|224|192|128|0)$/;
	var reg = mask.match(exp);
	if(reg == null){
		return false;
	}else{
		return true;
	}
}
function Trim(str) {
    var result;
    //过滤两端空格
    result = str.replace(/(^\s+)|(\s+$)/g, "");
    //过滤所有空格
    result = result.replace(/\s/g, "");
    return result;
}

function check_network_segment(str)
{
	var buff = str.split('/');
	if(!isIpaddr(buff[0]))
	{
		return false;
	}

	if(!isNum(buff[1]))
	{
		return false;
	}

	if(parseInt(buff[1])>0 && parseInt(buff[1])<32)
	{
		return true;
	}
}

function format_check(str) {
    var reg = /^[^-][0-9a-zA-Z-.]{1,}$/;
    if (reg.test(str) ) {
        return true;
    }else{
        return false;
    }
}

function check_special(str){
    var reg = /^[0-9a-zA-Z-._@*!+=~<>\u4e00-\u9fa5]{1,}$/;
    if (reg.test(str.trim()) ) {
        return true;
    }else{
        return false;
    }
}

function check_psk(str){
    var reg = /^[0-9a-zA-Z-._@*!+=~<>]{1,}$/;
    if (reg.test(str.trim()) ) {
        return true;
    }else{
        return false;
    }
}

function checkChinese(str){
	var reg = /^[^%'"<;|>\u4e00-\u9fa5]+$/;
    if (reg.test(str.trim()) ) {
        return true;
    }else{
        return false;
    }
}

function isChineseAndSymbol(str){
    // 对应`。 ？ ！ ， 、 ； ： “ ” ‘ ’ （ ） 《 》 【 】…`
	var reg = /[\u4e00-\u9fa5|\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3010|\u3011|\u2026]+/;
    if (reg.test(str.trim()) ) {
        return true;
    }else{
        return false;
    }
}

function charnum(str) {
    var pattern;
    pattern = /^[A-Za-z0-9]+$/im;
    if (!pattern.test(str)) {
        return false;
    }
    return true;
}

function isNum(str) {
    var regExp = new RegExp("^(0|-?[1-9][0-9]*)$");
    return regExp.test(str)
}

function isRangNum(num, min, max) { //
    if (isNum(num)) {
        if (num >= min && num <= max) return true;
    }
    return false;
}

function QOS_IP_MAC(val)
{
	if(isIpaddr(val))
	{
		return true;
	}
	else if(isMac(val))
	{
		return true;
	}
	else
	{
		return false;
	}
}

//Ip地址检测/网关
function isIpaddr(ip) {
    var regExp = new RegExp(/^(?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/);
    if (regExp.test(ip)) {
        ip_array = ip.split('.');
    }
    if (!regExp.test(ip) || IpToNumber(ip) < 16777216 || IpToNumber(ip) == 4294967295) {
        return false;
    } else {
        return true;
    }
}

function isNetmask(mask) { //子网掩码
    var correct_range = {
        128: 1,
        192: 1,
        224: 1,
        240: 1,
        248: 1,
        252: 1,
        254: 1,
        255: 1,
        0: 1
    };
    var m = mask.split('.');
    if (m.length != 4)
        return false;

    for (var i = 0; i < 4; i++) {
        if (!(m[i] in correct_range) ||
            (i < 3 && m[i] > 0 && m[i] < 255 && m[i + 1] != 0)) {
            return false;
        }
    }

    return true;
}

function isTime(str) {
    var regExp = new RegExp("^(([1-9]{1})|([0-1][0-9])|([1-2][0-3])):([0-5][0-9])$");
    if (regExp.test(str)) {
        return true;
    }
    return false;
}

function isDomain(str) {
    var domain = str.split('.');
    if (domain.length <= 1) {
        return false;
    }
    var regExp = new RegExp(/^[\d\w\-\u4e00-\u9fa5]+$/);
    for (var i in domain) {
        if (!regExp.test(domain[i]))
            return false;
    }
    if (!isNaN(Number(domain[domain.length - 1][0])))
        return false;
    return true;
}

function isDomainName(domain) {
    if (domain.length >= 33)
        return false;
    var regExp = new RegExp(/^[0-9a-zA-Z]*$/);
    if (regExp.test(domain)) {
        return true;
    }
    return false;
}

function isDomainPort(domain) {
    if (domain.length >= 68)
        return false;
    var regExp = new RegExp("^[0-9a-zA-Z]+([\.0-9a-zA-Z\-])*\.([a-zA-z])+:([0-9]+)$");
    if (regExp.test(domain))
        return true;
    return false;
}

function isUrl(str) {
    var reg = /[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;
    return (reg.test(str));
}

function isMac(str) {
    var reg1 = /^[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}$/;
    return (reg1.test(str));
 //   var reg2 = /^[A-Fa-f\d]{2}-[A-Fa-f\d]{2}-[A-Fa-f\d]{2}-[A-Fa-f\d]{2}-[A-Fa-f\d]{2}-[A-Fa-f\d]{2}$/;
 //   return (reg1.test(str) | reg2.test(str));
}

function checkMac(str){
	var mac_addr= str.split(":")[0].split("")[1].toUpperCase();
	if(str.indexOf('00:00:00:00:00:00') > -1 || str.indexOf('FF:FF:FF:FF:FF:FF') > -1 || mac_addr.indexOf("1") > -1 || mac_addr.indexOf("F") > -1){
		return false;
	}
	return true;
}

function isServer(str) {
    var s1 = str.split(':');
    if (s1.length > 2) {
        return false;
    }
    if (s1.length == 2 && !valide.isRangNum(s1[1], 1, 65535)) {
        return false;
    }
    if (!valide.isIpaddr(s1[0]) && !valide.isDomain(s1[0])) {
        return false;
    }
    return true;
}

function isSameNet(ip, mask, ip2, mask2) {
    if (!valide.isIpaddr(ip) || !valide.isNetmask(mask) || !valide.isIpaddr(ip) || !valide.isNetmask(mask2))
        return false;
    if (ip == "0.0.0.0" || ip2 == "0.0.0.0")
        return false;

    sip = [ip.split('.'), ip2.split('.')];
    smask = [mask.split('.'), mask2.split('.')];
    var i;
    for (i = 0; i < 4; i++) {
        if ((Number(sip[0][i]) & Number(smask[0][i])) != (Number(sip[1][i]) & Number(smask[1][i])))
            break;
    }
    if (i == 4)
        return true;
    return false;
}

function isChinese(mask) { //用户名密码
    var regExp = new RegExp(/[\u4e00-\u9fa5|\u0020]+/);
    return regExp.test(mask);
}

function checkChar(Message) { //字节统计
    var ByteCount = 0;
    var StrLength = Message.length;
    for (var i = 0; i < StrLength; i++) {
        ByteCount = (Message.charCodeAt(i) < 128) ? ByteCount + 1 : ByteCount + 3;
    }
    return ByteCount;
}

function IpToNumber(ip) {
    var num = 0;
    if (ip == "") {
        return num;
    }
    var aNum = ip.split(".");
    if (aNum.length != 4) {
        return num;
    }
    num += parseInt(aNum[0]) << 24;
    num += parseInt(aNum[1]) << 16;
    num += parseInt(aNum[2]) << 8;
    num += parseInt(aNum[3]) << 0;
    num = num >>> 0;
    return num;
}

//匹配带子网前缀的ipv6地址
function checkIPv6AndPrefix(str){
    var ipv6AndPrefix = /^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))$|^:((:[\da-fA-F]{1,4}){1,6}|:)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))$|^([\da-fA-F]{1,4}:){6}:(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))$/;
    return ipv6AndPrefix.test(str);
}


function checkIPv6Prefix(str){
    //var ipv6Prefix = /^((\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*)(\/(([1-9])|([1-9][0-9])|(1[0-1][0-9]|12[0-8]))){0,1})*$/;
    var ipv6Prefix = /^(([0-9A-Fa-f]{1,4}:){1,4})(:\/)([1-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9]|6[0-4])$/;
    if(ipv6Prefix.test(str)){
        return true;
    }else{
        return false;
    }
}


function checkIPv6Addr(str){
    var ipv6ip = /^\s*((([0-9A-Fa-f]{1,4}:){7}(([0-9A-Fa-f]{1,4})|:))|(([0-9A-Fa-f]{1,4}:){6}(:|((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})|(:[0-9A-Fa-f]{1,4})))|(([0-9A-Fa-f]{1,4}:){5}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:){4}(:[0-9A-Fa-f]{1,4}){0,1}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:){3}(:[0-9A-Fa-f]{1,4}){0,2}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:){2}(:[0-9A-Fa-f]{1,4}){0,3}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:)(:[0-9A-Fa-f]{1,4}){0,4}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(:(:[0-9A-Fa-f]{1,4}){0,5}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})))(%.+)?\s*$/;
    if (ipv6ip.test(str)) {
      return true;
    } else {
      return false;
    }
  }

  function check_special_ipv6addr(str, code)
  {
      addr = str.split(":");

      if(code == 0)
      {
          if( (addr[0] == "FE80") || (addr[0] == "FE8") || (addr[0] == "fe80") || (addr[0] == "fe8")) //链路本地自地址
              return false;
      }

      if( (addr[0] == "FEC0") || (addr[0] == "FEC") || (addr[0] == "fec0") || (addr[0] == "fec")) //站点本地地址
          return false;


      if((addr[0].substr(0, 2) == "FF") || (addr[0].substr(0, 2) == "Ff") || (addr[0].substr(0, 2) == "fF") || (addr[0].substr(0, 2) == "ff")) //组播地址
          return false;

      return true;
  }

  function checkIPv6(str) {
      var idx = str.indexOf("::");
      // there is no "::" in the ip address
      if (idx == -1) {
          var items = str.split(":");
          if (items.length != 8) {
              return false;
          } else {
              for (i in items) {
                  if (!isHex(items[i])) {
                      return false;
                  }
              }
              return true;
          }
      } else {
          // at least, there are two "::" in the ip address
          if (idx != str.lastIndexOf("::")) {
              return false;
          } else {
              var items = str.split("::");
              var items0 = items[0].split(":");
              var items1 = items[1].split(":");
              if ((items0.length + items1.length) > 7) {
                  return false;
              } else {
                  for (i in items0) {
                      if (!isHex(items0[i])) {
                          return false;
                      }
                  }
                  for (i in items1) {
                      if (!isHex(items1[i])) {
                          return false;
                      }
                  }
                  return true;
              }
          }
      }
  }

  function isHex(str) {
    if(str.length == 0 || str.length > 4) {
        return false;
    }
    str = str.toLowerCase();
    var ch;
    for(var i=0; i< str.length; i++) {
        ch = str.charAt(i);
        if(!(ch >= '0' && ch <= '9') && !(ch >= 'a' && ch <= 'f')) {
            return false;
        }
    }
    return true;
}
/**提示信息 end */

/**进度条 */

function setting(times, callback) {
    times = times || 1;
    var $setbox = (!$('.loading').length) ? $('<div>').addClass('loading') : $('.loading');
    var seting_tip = setting_tips_start + '<span class="seting_time">' + times + '</span>' + setting_tips_end;
    var $backdrop = $('<div>').addClass('loading-backdrop');
    var $loadcont = $('<div>').addClass('loadcont');
    var $progress = '<div class="skillbar css"><div class="filled" data-width="100%"></div><span class="percent"></span></div>';
    var $progressbox = $('<div>').addClass('progressbox').append($progress);

    $setbox.append($backdrop, $loadcont.append($progressbox)).appendTo('body');
    showremaintime(times, callback);

    $(".skillbar").skillbar({
        speed: times*1000,
    });
};

function showremaintime(times, callback) {
    if (times) {
        setTimeout(function () {
            times--;
            $('.seting_time').html(times);
            showremaintime(times, callback);
        }, 1000);
    } else {
        callback();
    }
}

/**弹框 */
function shconfirm(popHtml, type, options) {
    var this_obj = {};
    //按钮类型
    this_obj.btnEnum = {
        ok: parseInt("0001", 2), //确定按钮
        cancel: parseInt("0010", 2), //取消按钮
        okcancel: parseInt("0011", 2) //确定&&取消
    };
    //触发事件类型
    this_obj.eventEnum = {
        ok: 1,
        cancel: 2,
        close: 3
    };

    //弹窗类型
    this_obj.typeEnum = {
        success: "success",
        error: "error",
        confirm: "confirm",
        warning: "warning",
        upgrade: "upgrade",
        custom: "custom"
    };

    var btnType = this_obj.btnEnum;
    var eventType = this_obj.eventEnum;

    var popType = {
        success: {
            title: global_information,
            icon: '<i class="iconcorrect fa fa-check-circle-o"></i>',
            btn: btnType.ok
        },
        error: {
            title: global_warning,
            icon: '<i class="iconerror fa fa-times-circle"></i>',
            btn: btnType.ok
        },
        confirm: {
            title: global_warning,
            icon: '<i class="iconwarning fa fa-info-circle"></i>',
            btn: btnType.okcancel
        },
        warning: {
            title: global_warning,
            icon: '<i class="iconwarning fa fa-info-circle"></i>',
            btn: btnType.ok
        },
        upgrade: {
            title: global_upgrade,
            icon: '<i class="iconcorrect fa fa-check-circle-o"></i>',
            btn: btnType.okcancel
        },
        custom: {
            icon: '',
            btn: btnType.okcancel
        }
    };

    var itype = type ? type instanceof Object ? type : popType[type] || {} : {};//格式化输入的参数:弹窗类型
    var config = $.extend(true, {//遍历数组元素,并修改第一个对象
        //属性
        title: "&nbsp", //自定义的标题
        btn: btnType.ok, //按钮,默认单按钮
        //事件
        onOk: $.noop,//点击确定的按钮回调
        onCancel: $.noop,//点击取消的按钮回调
        onClose: $.noop//弹窗关闭的回调,返回触发事件
    }, itype, options);

    var $txt = $("<span>").html(popHtml);//弹窗文本dom
    var $tt = $("<span>").addClass("tt").text(config.title);//标题
    var $icon = config.icon;

    var btn = config.btn;//按钮组生成参数

    var popId = creatPopId();//弹窗索引

    var $box = $("<div>").addClass("mo_Confirm");//弹窗插件容器
    var $layer = $("<div>").addClass("xc_layer");//遮罩层
    var $popBox = $("<div>").addClass("popBox");//弹窗盒子
    var $ttBox = $("<div>").addClass("ttBox");//弹窗顶部区域
    var $contBox = $("<div>").addClass("contBox");//弹窗内容主体区
    var $icobox = $("<div>").addClass("icobox").append($icon);//弹窗图标主体区
    var $txtBox = $("<div>").addClass("txtBox").append($txt);//弹窗图标主体区
    var $btnArea = $("<div>").addClass("btnArea");//按钮区域


    var $ok = $("<a>").addClass("sgBtn").addClass("ok").text(global_sure);//确定按钮
    var $cancel = $("<a>").addClass("sgBtn").addClass("cancel").text(global_cancel);//取消按钮
    var $clsBtn = $("<i>").addClass("iconclose fa fa-times");//关闭按钮
    var btns = {
        ok: $ok,
        cancel: $cancel
    };

    init();

    function init() {
        creatDom();
        bind();
    }

    function creatDom() {
        $popBox.append(
            $ttBox.append(
                $clsBtn
            ).append(
                $tt
            )
        ).append(
            $contBox.append($icobox).append($txtBox)
        ).append(
            $btnArea.append(creatBtnGroup(btn))
        );
        $box.attr("id", popId).append($layer).append($popBox);
        $("body").append($box);
    }

    function bind() {
        //点击确认按钮
        $ok.click(doOk);

        //回车键触发确认按钮事件
        $(window).bind("keydown", function (e) {
            if (e.keyCode == 13) {
                if ($("#" + popId).length == 1) {
                    doOk();
                }
            }
        });

        $cancel.click(doCancel);
        $clsBtn.click(doClose);
    }

    function doOk() {
        $("#" + popId).animate({opacity: '0'}, 500, function () {
            config.onOk();
            $(this).remove()
        });
        config.onClose(eventType.ok);
    }

    function doCancel() {
        $("#" + popId).animate({opacity: '0'}, 500, function () {
            config.onCancel();
            $("#" + popId).remove();
        });

        config.onClose(eventType.cancel);
    }

    function doClose() {
        $("#" + popId).animate({opacity: '0'}, 500, function () {
            config.onClose(eventType.close);
            $(this).remove();
        });
        $(window).unbind("keydown");
    }

    function creatBtnGroup(tp) {
        if (btn == 3) {
            var $bgp = $("<div>").addClass("btnGroup");
            $.each(btns, function (i, n) {
                if (btnType[i] == (tp & btnType[i])) {
                    $bgp.append(n);
                }
            });
        } else {
            var $bgp = $ok;
        }
        return $bgp;
    }

    function creatPopId() {
        var i = "pop_" + (new Date()).getTime() + parseInt(Math.random() * 100000);//弹窗索引
        if ($("#" + i).length > 0) {
            return creatPopId();
        } else {
            return i;
        }
    }
};

function format_volide_ok(obj) {
    if (!obj || obj == undefined) {
        obj = 'body'
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
};


function format_check_ok(obj) {
	 var samba_group = $("#samba_group").val();
    if (  samba_group == ''||samba_group==undefined) {
	alert(usb_group_error);
       return false;
    }

    return true;
};
function setvalue (obj, data) {
    if (data != '' && data != undefined) {
        $(obj).val(data).siblings('.tip').addClass('hide');
    } else {
        data = '';
        $(obj).val(data)
    }
};

function swich(evt, swich_status, openvalue) {
    if (openvalue == undefined) {
        openvalue = 1;
    }
    if (!swich_status) {
        swich_status = 0;
    }

    if (swich_status == openvalue) {
        $(evt).attr('data-value', swich_status);
        $(evt).addClass("switchopen").removeClass("switchclose");
    } else {
        $(evt).attr('data-value', swich_status);
        $(evt).addClass("switchclose").removeClass("switchopen");
    }
};

function clearall () {
    $("#modal_one").addClass("in");
    $("#modal_one").css('display', 'block');
    // $("#modal_one").prepend('<div class="modal-backdrop fade in"></div>');
    $('input[type="text"]').val('').removeClass('borError').attr('disabled', false);
	$('input[type="text"]').removeAttr('readonly');
	$('#new_content').val('').removeClass('borError').attr('disabled', false);
	$('#new_content').removeAttr('readonly');
	$('.modal-content input[type=checkbox]').attr('checked', false);
    $('.modal-content select').each(function (n, m) {
        $(m).children().eq(0).prop("selected", 'selected');
    })
    $('body').find('.icon_margin').remove();
    $('p').each(function () {
        if ($(this).css('color') === 'rgb(255, 0, 0)') {
            $(this).remove();
        }
        if ($(this).css('color') === 'rgb(170, 170, 170)') {
            $(this).show();
        }
    });
};

function close(){
    $("#modal_one").removeClass("in");
    $("#modal_one").css('display', 'none');
    $('p').each(function () {
        if ($(this).css('color') === 'rgb(255, 0, 0)') {
            $(this).remove();
        }
        if ($(this).css('color') === 'rgb(170, 170, 170)') {
            $(this).show();
        }
    });
}
function select_row(evt) {
    var rowcheck = $(evt).attr('data-value');
    if (rowcheck == '1') {
        $('#select_laber').text(global_selectall);
        $(evt).prop('checked', false).attr('data-value', '0');
        $('#allchecked').prop('checked', false).attr('data-value', '0');
    } else {
        $(evt).prop('checked', true).attr('data-value', '1');
    }
    if ($('.row_checkbox').length == $('.row_checkbox:checked').length) {
        $('#select_laber').text(global_disselect);
        $('#allchecked').prop('checked', true).attr('data-value', '1');
    }
}

function get_setstep(a, b) {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        async: false,
        cache: false,
        url: '/js/guide.json',
        success: a,
        error: b
    })
}

function step (model, opt,wlan) {
    var not_radio, remove_div;
    if (!model) {
        return;
    }
    var $html = [], $arrs;
    get_setstep(function (data) {
        $arrs = data[model];
        if(wlan){
            $(".w24G").remove();
            $('.w58G').remove();
            $arrs.splice($.inArray("wireless_24g", $arrs), 1);
            $arrs.splice($.inArray("wireless_58g", $arrs), 1);
        }else{
            if (opt) {
                not_radio = 'wireless_' + opt;
                remove_div = 'w' + opt.toUpperCase();
                $arrs.splice($.inArray(not_radio, $arrs), 1);
                $('.' + remove_div).remove();
            }
        }
        $html += '<ul>';
        $.each($arrs, function (n, m) {
            if (n == 0) {
                $html += '<li class="active"><span>' + (n + 1) + '</span><em sh_lang="' + m + '">' + eval(m) + '</em></li>';
            } else {
                $html += '<li><span>' + (n + 1) + '</span><em sh_lang="' + m + '">' + eval(m) + '</em></li>';
            }
        });
        $('.shstep').html($html);
    })
}

function chgTabs (tabnav, tabbox) {
    $('body').on('click', '.' + tabnav + ' li', function (event) {
        event.stopPropagation();
        var oThis = $(this);
        var oIndex = oThis.index();
        var tabCon = $('.' + tabbox).children();
        oThis.addClass('active').siblings().removeClass('active');
        oThis.find('input[type="radio"]').prop('checked', true).end().siblings().find('input[type="radio"]').prop('checked', false);
        tabCon.eq(oIndex).addClass('show').siblings().removeClass('show');
    })
}

function showTips(msg) {
	$(".submit_tips").html(msg);
	setSubmitGif();
}

function setSubmitGif(){
	var imgHeight = (parseInt($("#dialog").height()) - 54.9)*0.5 - '0';
	$(".submit_gif").css({"margin-top":imgHeight});
}

/**进度条 */

"use strict";
/*
 * Plugin: an-progress-bar
 * Version: 1.0.1
 * Description: A plugin that fills bars with a percentage you set.
 * Author: Hasan Misbah
 * Copyright 2018, Hasan Misbah
 * Free to use and abuse under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */
! function (i) {
    i.fn.skillbar = function (t) {
        var e = i.extend({
                speed: 1e3,
                bg: ""
            }, t),
            n = e.bg,
            d = i(this).find(".filled"),
            s = i(this).find(".title");
        return n ? (d.css({
            "background-color": n
        }), s.css({
            "background-color": "rgba(0,0,0,0.5)"
        })) : this.each(function (t) {
            i(this).find(".filled").animate({
                width: i(this).find(".filled").data("width")
            }, e.speed)
        }), this
    }
}(jQuery);
//# sourceMappingURL=an-skill-bar.js.map

        (function ($) {
            var a = function (i) {
                return new a.fn.init(i)
            };
            var c = "",
                g = 0,
                f = 10000,
                e = {},
                b;
            a.fn = a.prototype = {
                init: function (n) {
                    var j = this,
                        i = "",
                        m = "",
                        l = global_sure;
                    if (typeof(n) == "string") {
                        if ($.trim(n) != "") {
                            c = n
                        } else {
                            c = i
                        }
                        j.title = m;
                        j.obTxt = l[0];
                        j.cbTxt = l[1];
                        j.moreBox = false;
                        j.drop = false;
                        j.okFn = function () {
                            return true
                        };
                        j.cancelFn = function () {
                            return true
                        };
                        j.closeFn = function () {
                            return true
                        };
                        j.goTopage(j._html(""))
                    } else {
                        if (n) {
                            if (!j.isObject(n)) {
                                return
                            }
                            var o = $.trim(j.getHtml(n.message));
                            c = o != "" ? o : i;
                            j.title = ($.trim(n.title) != "" && n.title != undefined) ? n.title : m;
                            j.obTxt = ($.trim(n.obTxt) != "" && n.obTxt != undefined) ? n.obTxt : l[0];
                            j.cbTxt = ($.trim(n.cbTxt) != "" && n.cbTxt != undefined) ? n.cbTxt : l[1];
                            j.vBtn = ($.trim(n.vBtn) != "" && n.vBtn != undefined) ? n.vBtn : "all";
                            j.moreBox = n.moreBox != undefined ? n.moreBox : true;
                            j.drop = true;
                            j.okFn = n.okFn && j.isFunction(n.okFn) ? n.okFn : function () {
                                return true
                            };
                            j.cancelFn = n.cancelFn && j.isFunction(n.cancelFn) ? n.cancelFn : function () {
                                return true
                            };
                            j.closeFn = n.closeFn && j.isFunction(n.closeFn) ? n.closeFn : function () {
                                return true
                            };
                            j.goTopage(j._html(n.message))
                        }
                    }
                    return j
                },
                goTopage: function (m) {
                    if (g >= 2) return;
                    g++;
                    var n = $('<div class="pop_confirm">'),
                        l = "pop" + Math.random().toString().replace(/\w\./, "_").substr(0, 5),
                        k = n.clone();
                    n.attr("id", l);
                    n.css({
                        position: "absolute",
                        "z-index": f * g
                    });
                    n.html(m);
                    k.addClass("c_mask");
                    if (!this.moreBox) {
                        $(".pop_confirm").remove();
                        g = 1
                    }
                    $("body").append(n);
                    var i = $(".pop_confirm").length;
                    if (i == 1) {
                        $("body").append(k)
                    }
                    this.lockScreen();
                    b = this.boxPosition("#" + l);
                    var j = $("#" + l);
                    this.moveOn(j, "r-btn");
                    j.attr("r-sVal", j.width() + "|" + j.height())
                },
                getHtml: function (k) {
                    var j = "",
                        i;
                    if (typeof(k) == "string" && $.trim(k) != "") {
                        i = $(k);
                        j = i.clone().html();
                        e[k] = j;
                        i.html("")
                    }
                    return j
                },
                setHtml: function (j) {
                    if ($.trim(j) == "") {
                        return
                    }
                    for (var k in e) {
                        if (j == k) {
                            $(j).html(e[k])
                        }
                    }
                },
                _html: function (j) {
                    if (typeof(j) != "string") {
                        return
                    }
                    var i = '<table border="0" cellspacing="0" cellpadding="0" align="left" class="c_cont">';
                    i += '<tr r-drag="yes"><td valign="top"><div class="c_title" ><span>' + this.title + '</span></div><a href="javascript:void(0);" class="fa close" title="close" r-btn="close"></a><a href="javascript:void(0);" class="open" title="open" r-btn="open"></a></td></tr>';
                    i += '<tr><td  valign="top"><div class="c_default-conts" ' + ($.trim(j) != "" ? 'r-group="' + j + '"' : "") + ">" + c + "</div></td></tr>";
                    if (this.vBtn != "none") {
                        i += '<tr r-footer><td valign="middle" class="c_btn">';
                        if (this.vBtn == "ok") {
                            i += '<a tabindex="6" class="btn btn-warning" href="javascript:void(0)"  r-btn="ok"><span>' + this.obTxt + "</span></a>"
                        } else {
                            if (this.vBtn == "no") {
                                i += '<a tabindex="6" class="btn btn-default" href="javascript:void(0)"  r-btn="cancel"><span>' + this.cbTxt + "</span></a>"
                            } else {
                                i += '<a tabindex="6" class="btn btn-default" href="javascript:void(0)" r-btn="cancel"><span>' + this.cbTxt + '</span></a><a tabindex="6" class="btn btn-primary c_ml15" href="javascript:void(0)" r-btn="ok"><span>' + this.obTxt + "</span></a>"
                            }
                        }
                        i += "</td></tr>"
                    }
                    i += "</table>";
                    return i
                },
                moveOn: function (j, k) {
                    var i = this;
                    j.on("click tap", "[" + k + "]",
                        function () {
                            var m = $(this),
                                n = m.attr(k);
                            var q = m.closest(".pop_confirm"),
                                l = q.find("[r-group]").attr("r-group");
                            switch (n) {
                                case "ok":
                                    var p = i.okFn();
                                    if (p) {
                                        if (l) {
                                            i.setHtml(l)
                                        }
                                        q.remove();
                                        g--;
                                        i.lockScreen()
                                    }
                                    break;
                                case "cancel":
                                    var t = i.cancelFn();
                                    if (t) {
                                        if (l) {
                                            i.setHtml(l)
                                        }
                                        q.remove();
                                        g--;
                                        i.lockScreen()
                                    }
                                    break;
                                case "close":
                                    var s = i.closeFn();
                                    if (s) {
                                        if (l) {
                                            i.setHtml(l)
                                        }
                                        q.remove();
                                        g--;
                                        i.lockScreen()
                                    }
                                    break;
                                case "open":
                                    var r = j.attr("r-state");
                                    if (r == "yes") {
                                        var o = j.attr("r-sVal").split("|");
                                        i.zoomWindow(j, {
                                            w: o[0],
                                            h: o[1]
                                        });
                                        j.attr("r-state", "no")
                                    } else {
                                        i.zoomWindow(j);
                                        j.attr("r-state", "yes")
                                    }
                                    break;
                                case "lock":
                                    a.blank("c_cont", 3);
                                    break
                            }
                            if (g == 0) {
                                $(".c_mask").remove()
                            }
                        })
                },
                lockScreen: function () {
                    var j = $("<p>");
                    j.css({
                        position: "absolute",
                        top: "0px",
                        left: "0px",
                        "z-index": (f * g) + 1
                    });
                    j.attr("r-btn", "lock");
                    j.addClass("lock");
                    var i = $("[r-group]");
                    i.each(function (m) {
                        var n = $(this),
                            l = n.find(".lock");
                        if (m != (g - 1)) {
                            if (l.length == 0) {
                                var k = n.closest(".c_cont");
                                j.css({
                                    width: k.width(),
                                    height: k.height()
                                });
                                n.append(j)
                            }
                        } else {
                            l.remove()
                        }
                    })
                },
                boxPosition: function (k) {
                    if (typeof(k) != "string") {
                        return
                    }
                    var j = this;
                    var i = {
                        init: function (n) {
                            var m = $(n);
                            w = m.width(),
                                h = m.height();
                            var l = this.center(w, h);
                            if (w<900){
                                m.css({
                                    top: 40,
                                    left: l.left
                                });
                            }else {
                                m.css({
                                    top: l.top,
                                    left: l.left
                                });
                            }
                            this.drag(j.drop, n);
                            return this
                        },
                        center: function (l, n) {
                            var q = $(window),
                                m = q.width(),
                                p = q.height();
                            var o = q.scrollTop(),
                                r = q.scrollLeft();
                            return {
                                top: (p - n) / 2 + o,
                                left: (m - l) / 2 + r
                            }
                        },
                        move: function (o, p, r, l, m, n) {
                            var q = {};
                            o.bind("mousemove",
                                function (A) {
                                    var z = $(this);
                                    q.x = A.clientX;
                                    q.y = A.clientY;
                                    var C = z.scrollLeft(),
                                        B = z.scrollTop();
                                    var x = r + (q.y - m),
                                        v = l + (q.x - n);
                                    var y = p.width(),
                                        t = p.height();
                                    var u = z.width(),
                                        s = z.height();
                                    if (v <= 0) {
                                        v = 0
                                    } else {
                                        if ((v + y) >= u) {
                                            v = u - y
                                        }
                                    }
                                    if (x <= 0) {
                                        x = 0
                                    } else {
                                        if ((x + t) >= s) {
                                            x = s - t
                                        }
                                    }
                                    p.css({
                                        top: x + "px",
                                        left: v + "px"
                                    });
                                    j.stopDefault(A)
                                })
                        },
                        drag: function (n, l, r) {
                            if (!j.isBoolean(n)) {
                                return
                            } else {
                                if (!n) {
                                    return
                                }
                            }
                            var p = this,
                                q = r || $(document);
                            var s = j.isObject(q) ? q : $(q);
                            var o = $(l),
                                m = o.find("[r-drag]");
                            var t = ["mousedown", "mouseup"];
                            m.bind(t[0],
                                function (A) {
                                    m.css("cursor", "move");
                                    var z = o.offset().top,
                                        v = o.offset().left,
                                        u = A.clientX,
                                        B = A.clientY;
                                    p.move(s, o, z, v, B, u);
                                    j.stopDefault(A)
                                });
                            s.bind(t[1],
                                function () {
                                    m.css("cursor", "");
                                    s.unbind("mousemove")
                                })
                        }
                    };
                    return i.init(k)
                },
                zoomWindow: function (j, n) {
                    var o = $(j),
                        t = o.find(".c_default-conts");
                    var s = 0,
                        p = 0,
                        l = 8,
                        k = 30,
                        m = o.find("[r-footer]").height();
                    if (n) {
                        s = n.w - l;
                        p = n.h - (k + l + m);
                        var i = b.center(n.w, n.h);
                        o.css({
                            top: i.top,
                            left: i.left
                        })
                    } else {
                        var q = $(window),
                            r = q.scrollTop();
                        o.css({
                            top: r + "px",
                            left: "0px"
                        });
                        s = q.width() - l;
                        p = q.height() - (k + l + m)
                    }
                    t.css({
                        width: s + "px",
                        height: p + "px"
                    });
                    t.children().css({
                        width: "100%",
                        height: "100%"
                    })
                },
                error: function (j, i) {
                },
                stopDefault: function (i) {
                    if (i && i.preventDefault) {
                        i.preventDefault()
                    } else {
                        window.event.returnValue = false
                    }
                    return false
                },
                isBoolean: function (i) {
                    return Object.prototype.toString.call(i) === "[object Boolean]"
                },
                isFunction: function (i) {
                    return Object.prototype.toString.call(i) === "[object Function]"
                },
                isObject: function (i) {
                    return Object.prototype.toString.call(i) === "[object Object]"
                }
            };
            a.normal = function (k, j) {
                var i = $("." + k).last();
                i.css("border-color", "");
                if (j < 0) {
                    return
                }
                j = j - 1;
                setTimeout("confirmBox.blank('" + k + "'," + j + ")", 60)
            };
            a.blank = function (k, j) {
                var i = $("." + k).last();
                i.css("border-color", "#ffffcc");
                j = j - 1;
                setTimeout("confirmBox.normal('" + k + "'," + j + ")", 120)
            };
            a.fn.init.prototype = a.fn;
            $.confirmBox = a
        })(jQuery);

//页面刷新
function gohref() {
    $(".loading-backdrop").remove();
    $(".skillbar").remove();
    window.location.reload();
}
