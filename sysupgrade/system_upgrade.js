$(document).ready(function () {
    $("#loadings_div").addClass('hide');
    refresh_init();

    function validInput() {
        var uploadFile = $.trim($("#upload_file").val());
        if (uploadFile.match(/\.img$|\.bin$|\.IMG$|\.BIN$/i) == null) {
            if ($(".uploadfile").html() == undefined)
                $("#upload_file").after('<p class="uploadfile" style="color:red;"></p>');
            if ($(".uploadfile").html() == "")
                $(".uploadfile").append(upload_up_failed);
            setTimeout(function () {
                $(".uploadfile").remove();
            }, 3000);
            return false;
        }
        return true;
    }

    $("#save").click(function () {
        var isValid = validInput();
        if (isValid) {
            shconfirm(upload_firmware, 'confirm', {
                onOk: function () {
                    is_setting_status = 1;
                    var cookies = getCookie("token");
                    $("#upgrade").attr("action", "/cgi-bin/upgrade_firmware.cgi?_reset=0&upload&token="+cookies);
                    $("#upgrade").submit();
                    $("#loadings_div").removeClass('hide');
                    
                }
            });
        }
    })

    $("#form").load(function () {
        var data = $(this).contents().find("body").text();
        var sysupgrade_time = $(this).contents().find("input").val();

        is_setting_status = 1;

        if (data.search("success") != -1) {
            $("#loading_pic").addClass("hide");
            $("#backdrop_div").addClass("hide");
            var progress = '<div class="skillbar css"><div class="filled" data-width="100%"></div><span class="percent"></span></div>';
            $('<div>').addClass('progressbox').append(progress);
            //setting(sysupgrade_time, gohref_upgrade);
            setting(300, gohref_upgrade);
        } else if(data.search("error") != -1) {
            $("#loading_pic").addClass("hide");
            $("#backdrop_div").addClass("hide");
            if ($(".uploadfile").html() == undefined)
                $("#upload_file").after('<p class="uploadfile" style="color:red;"></p>');
            if ($(".uploadfile").html() == "")
                $(".uploadfile").append(upload_up_failed);
            setTimeout(function () {
                $(".uploadfile").remove();
            }, 3000);
            return false;
        }
    })

    $("#cancle").click(function () {
        $('input').val('');
    })
})

function refresh_init() {
    var cookies = getCookie("token");
    $.ajax({
        contentType: "appliation/json",
        data: {token: cookies},
        dataType: "json",
        type: "POST",
        cache: false,
        async: false,
        url: "/goform/get_system_version",
        success: function (data) {
            if (data) {
                $("#version").text(data.version);
            }
        }
    })
}

function gohref_upgrade() {
    $(".loading-backdrop").remove();
    $(".skillbar").remove();
    logout();
    location.reload();
}