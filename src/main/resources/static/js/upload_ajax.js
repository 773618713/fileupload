$(function () {
    $(".file_input").change(function () {
        var docObj = $(this)[0];
        var files = docObj.files;

        var fileName = files[0].name;
        var fileType = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length);
        if (".zip".indexOf(fileType) == -1) {
            alert("请上传zip类型的文件。");
            return;
        }

        var formData = new FormData(document.getElementById("uploadForm"));
        formData.append("formData", JSON.stringify({name: "123"}));

        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: "FileUpload",
            data: formData,
            cache: false,
            processData: false,
            contentType: false,
            xhr: function () {
                var xhr = $.ajaxSettings.xhr();
                if (xhr.upload) {
                    //处理进度条的事件
                    xhr.upload.addEventListener("progress", onProgressHandler, false);
                    //加载完成的事件
                    xhr.addEventListener("load", onLoadHandler, false);
                    //加载出错的事件
                    xhr.addEventListener("error", onErrorHandler, false);
                    //加载取消的事件
                    xhr.addEventListener("abort", onAbortHandler, false);
                    //开始显示进度条
                    showProgress();
                    return xhr;
                }
            },
            success: function (result) {
                if (result.code == '0000') {
                    console.log(result);
                    $('.downloadBtn').css("display", "inline-block");
                } else {
                    $('.progress-body .progress-speed').html("0 M/S, 0/0M");
                    $('.progress-body progress').attr("value", "0");
                    $('.progress-body percentage').html("0%");
                    $('.progress-body .progress-info').css("color", "#f00");
                    $('.progress-body .progress-info').html(result.msg);
                }
                hideProgress();
            },
            error: function (result) {
                alert("上传出错。");
            }
        });
    });

    var start = 0;
    //显示进度条的函数
    var showProgress = function () {
        start = new Date().getTime();
        $(".progress-body").css("display", "block");
    }
    //隐藏进度条的函数
    var hideProgress = function () {
        $("#uploadFile").val('');
        setTimeout(function () {
            $(".progress-body").css("display", "none");
        }, 2000);
    }
    //进度条更新
    var onProgressHandler = function (e) {
        console.log("onProgressHandler");
        $('.progress-body progress').attr({value: e.loaded, max: e.total});
        var percent = e.loaded / e.total * 100;
        var time = ((new Date().getTime() - start) / 1000).toFixed(3);
        if (time == 0) {
            time = 1;
        }
        $('.progress-body .progress-speed').html(((e.loaded / 1024) / 1024 / time).toFixed(2) + "M/S, " + ((e.loaded / 1024) / 1024).toFixed(2) + "/" + ((e.total / 1024) / 1024).toFixed(2) + " MB. ");
        $('.progress-body percentage').html(percent.toFixed(2) + "%");
        $('.progress-body .progress-info').css("color", "#fff");
        if (percent == 100) {
            $('.progress-body .progress-info').html("上传完成,后台正在处理...");
        } else {
            $('.progress-body .progress-info').html("文件上传中...");
        }
    };

    //上传完成处理函数
    var onLoadHandler = function (e) {
        console.log("onLoadHandler");
        $('.progress-body .progress-info').css("color", "#0f0");
        $('.progress-body .progress-info').html("上传文件成功。");
    };
    //上传出错处理函数
    var onErrorHandler = function (e) {
        console.log("onErrorHandler");
        $('.progress-body .progress-info').css("color", "#f00");
        $('.progress-body .progress-info').html("上传文件出错, 服务不可用或文件过大。");
    };
    //上传中断处理函数
    var onAbortHandler = function (e) {
        console.log("onAbortHandler");
        $('.progress-body .progress-info').css("color", "#f00");
        $('.progress-body .progress-info').html("上传文件中断");
    };

});