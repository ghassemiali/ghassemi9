var services = (function () {
    var rootWebSiteUrl = rootWebSite || "";

    function sendForgetPasswordRequestV2(postParam) {
        return new Promise(function (resolve, reject) {
            ajax.sendPost(rootWebSiteUrl + `/Account/SendForgetPasswordRequestV2`, postParam, function (data) {
                resolve(data);
            });
        });
    };
    function verifyCode(postParam) {
        return new Promise(function (resolve, reject) {
            ajax.sendPost(rootWebSiteUrl + `/Profile/VerifyCode`, postParam, function (data) {
                resolve(data);
            });
        });
    };
    function ResetPassword(postParam) {
        return new Promise(function (resolve, reject) {
            ajax.sendPost(rootWebSiteUrl + `/Account/ResetPasswordV2`, postParam, function (data) {
                resolve(data);
            });
        });
    };
    return {
        SendForgetPasswordRequestV2: sendForgetPasswordRequestV2,
        VerifyForgetPasswordCode: verifyCode,
        ResetPassword: ResetPassword
    };

})();

function checkNationalCode(input) {
    if (!/^\d{10}$/.test(input)
        || input == '0000000000'
        || input == '1111111111'
        || input == '2222222222'
        || input == '3333333333'
        || input == '4444444444'
        || input == '5555555555'
        || input == '6666666666'
        || input == '7777777777'
        || input == '8888888888'
        || input == '9999999999')
        return false;
    var check = parseInt(input[9]);
    var sum = 0;
    var i;
    for (i = 0; i < 9; ++i) {
        sum += parseInt(input[i]) * (10 - i);
    }
    sum %= 11;
    return (sum < 2 && check == sum) || (sum >= 2 && check + sum == 11);
}

var OnlinePlusUrl = '@OnlinePlusUrl';

function btnSumbitClick() {
    var headerselected = $('header.is-active');
    if (headerselected.length > 0) {
        var v = $($('header.is-active')[0]).parent().find('input');
        var id = v.attr('id');

        if (id == 'phonenumber') {

        }
        if (id == 'email') {

        }
        if (id == 'username') {

        }
    }
};

function getCaptchaUrlPlus() {
    var url = OnlinePlusUrl + "/" + Math.floor((Math.random() * 10000000) + 1) + "/Account/Captcha?postfix=" + Math.floor((Math.random() * 10000000) + 1);
    return url;
}

function changeCaptchaForgetPassword() {
    var captchaUrl = getCaptchaUrlPlus();

    $('#captcha-img-forgetpass').attr('src', captchaUrl);
}

$(document).ready(function () {
    changeCaptchaForgetPassword();
    $('header').click(function () {

        $('.collapse-content').attr('style', 'max-height: 0px; padding: 0px;');
        $('header').removeClass('is-active');
        $(this).addClass('is-active');
        $(this).parent().children('div.collapse-content').attr('style', 'max-height: 86px; padding: 10px 0px;');
    });

});

phonenum = "";
(function ($) {
    $.fn.buttonLoader = function (action, text) {
        var self = $(this);
        //start loading animation
        if (action == 'start') {
            if ($(self).attr("disabled") === "disabled") {
                e.preventDefault();
            }
            //disable buttons when loading state
            $(self).attr("disabled", "disabled");
            $(self).attr('data-btn-text', $(self).text());
            //binding spinner element to button and changing button text
            $(self).html(`${text}<span class="loader" style="margin:0 8px"></span>`);
            $(self).addClass('active');
        }
        //stop loading animation
        if (action == 'stop') {
            $(self).html($(self).attr('data-btn-text'));
            $(self).removeClass('active');
            //enable buttons after finish loading
            $(self).removeAttr("disabled");
        }
    }
})(jQuery);

var time = '';
var userid;
var hasTwoMobileNumer = false;

var ProfileApp = (function (services) {

    function sendForgetPasswordRequestV2Click() {
        // Checking user national code and stop process
        if (hasTwoMobileNumer) {
            if (!checkNationalCode($("#melliCodeOrUserName").val())) {
                $("#d_AlertNationalCode").fadeOut(100, function () {
                    $("#d_AlertNationalCode").text('لطفا کدملی را صحیح وارد کنید').fadeIn(500);
                });
                $("#d_AlertNationalCode").removeClass("alert-success");
                $("#d_AlertNationalCode").addClass("alert-danger");
                $("#d_AlertNationalCode").show();
                $(btn).buttonLoader('stop', btnText);
                return false;
            }
        }

        $("#otpCodeInput").val('');
        $("#btnsendcode").attr("disabled", "disabled");

        var phonenumber = $("#phonenumber").val() !== '' ? $("#phonenumber").val() : phonenum;
        var username = $("#username").val() !== '' ? $("#username").val() : $("#melliCodeOrUserName").val();
        var email = $("#email").val();
        var btn = $("#forgetpassword")[0];
        var btnText = btn.innerText;
        if (!phonenumber && !username && !email) {
            $("#d_AlertForgetPassword").show();
            $("#d_AlertForgetPassword").addClass("alert-danger");
            $("#d_AlertForgetPassword").removeClass("alert-success");
            $("#d_AlertForgetPassword").text('لطفا یکی از موارد شماره موبایل یا کدملی یا ایمیل را وارد نمایید').fadeIn(500);
            return;
        }
        $(btn).buttonLoader('start', '  لطفا شکیبا باشید');

        services.SendForgetPasswordRequestV2({
            phonenumber: phonenumber,
            username: username,
            email: email
        }).then(function (data) {
            if (data.Data === 'MorethanOneUserFound') {
                hasTwoMobileNumer = true;
                phonenum = $('#phonenumber').val();
                $('#main-container').hide();
                $("#code-username-wrapper").show();
            }

            if (data.IsSuccessfull) {
                if (hasTwoMobileNumer === true) {
                    hasTwoMobileNumer = false;
                    $("#code-username-wrapper").hide();
                }
                $(btn).buttonLoader('stop', btnText);
                $("#d_AlertForgetPassword").removeClass("alert-danger");
                $("#d_AlertForgetPassword").addClass("alert-success");
                $("#d_AlertForgetPassword").text(data.MessageDesc);
                if ((data.Data !== null && data.Data.Userid.includes("SMSSent"))) {
                    if (data.Data)
                        time = data.Data.Time;
                    else {
                        time = 120;
                    }
                    $("#d_verfyPhoneByCode").show();
                    $("#main-container").hide();
                    $("#reciveMobileNumber").text(phonenumber);
                    userid = data.Data.Userid.substring(8, data.Data.length);
                }
            }
            else {
                $(btn).buttonLoader('stop', btnText);

                $("#d_AlertForgetPassword").show();
                $("#d_AlertForgetPassword").addClass("alert-danger");
                $("#d_AlertForgetPassword").removeClass("alert-success");
                $("#d_AlertForgetPassword").text(data.MessageDesc);
            }
        });
    }

    function ModifyPhoneNumberClicked() {
        $("#main-container").show();
        $("#d_verfyPhoneByCode").hide();
        $("#d_AlertForgetPassword").hide();
    }

    function ModifyNationalCodeClicked() {
        $("#main-container").show();
        $("#code-username-wrapper").hide();
        $("#d_AlertForgetPassword").hide();
    }

    function activeCodeBtnClicked() {
        var btn = $("#btnsendcode");
        var btnText = btn.innerText;
        $(btn).buttonLoader('start', '  لطفا شکیبا باشید');
        var stractiveCode = $("#otpCodeInput").val();
        var strphonenumber = document.getElementById('reciveMobileNumber').innerText;


        services.VerifyForgetPasswordCode({
            activeCode: stractiveCode,
            phonenumber: strphonenumber,
            tokenvalue: userid,
            contactPointType: "ForgetPasswordBySMS"
        }).then(function (data) {
            if (data.IsSuccessfull) {
                if (data.Data.IsCodeAproved) {
                    $("#d_Alert").text(data.MessageDesc);
                    $("#forgetpasswordid").val(data.Data.Id);
                    $("#d_Alert").show();
                    $("#resetpassword").show();
                    $("#verify-phone-number1").hide();
                    $('#d_Alert').attr('style', 'color: green');
                } else {
                    $("#d_Alert").fadeOut(500,
                        function () {
                            $("#d_Alert").text(data.MessageDesc).fadeIn(500);
                        });
                    $("#d_Alert").show();
                    $('#d_Alert').attr('style', 'color: red');
                    $(btn).buttonLoader('stop', btnText);
                }

            }
        });
    }

    function resetpassword() {
        document.getElementById('d_AlertResetPassword').style.display = 'block';
        var new_password = $("#new-password").val();
        var confirm_new_password = $("#confirm-new-password").val();
        if (new_password !== confirm_new_password) {
            $("#d_AlertResetPassword").removeClass("alert-success");
            $("#d_AlertResetPassword").addClass("alert-danger");
            $("#d_AlertResetPassword").fadeOut(500, function () {
                $("#d_AlertResetPassword").text(".رمز عبور و تکرار آن باید یکسان باشند").fadeIn(500);
            });
            return;
        }
        var id = $("#forgetpasswordid").val();
        var btn = $("#btnresetpassword");
        var btnText = btn.innerText;
        $(btn).buttonLoader('start', '  لطفا شکیبا باشید');
        services.ResetPassword({ id: id, newpassword: new_password, confirmnewpassword: confirm_new_password }).then(function (data) {
            if (data.IsSuccessfull) {
                let msg = data.MessageDesc + ' <a href="javascript:history.go(-1);">ورود به سیستم</a>';
                document.getElementById('d_AlertResetPassword').innerHTML = msg;
                $("#d_AlertResetPassword").addClass("alert-success");
                $("#d_AlertResetPassword").removeClass("alert-danger");
                $(btn).buttonLoader('stop', btnText);
            } else {
                $("#d_AlertResetPassword").removeClass("alert-success");
                $("#d_AlertResetPassword").addClass("alert-danger");
                $("#d_AlertResetPassword").fadeOut(500, function () {
                    $("#d_AlertResetPassword").text(data.MessageDesc).fadeIn(500);
                });
                $(btn).buttonLoader('stop', btnText);
            }
        });
    }

    function validatephone(phone) {
        if (phone === '')
            return true;
        var regex = /^(\+98|0)?9\d{9}$/;
        return regex.test(phone);
    }

    setInterval(function () {

        //if (document.querySelector("#phoneheader").classList.contains("is-active")) {
        //    const emailInput = document.getElementById("email");
        //    if (emailInput) {
        //        emailInput.value = "";
        //    }
        //    document.getElementById("username").value = "";
        //}
        //const emailheader = document.querySelector("#emailheader");
        //if (emailheader) {
        //    if (emailheader.classList.contains("is-active")) {
        //        document.getElementById("phonenumber").value = "";
        //        document.getElementById("username").value = "";
        //    }
        //}
        //if (document.querySelector("#usernameheader").classList.contains("is-active")) {
        //    const emailInput = document.getElementById("email");
        //    if (emailInput) {
        //        emailInput.value = "";
        //    }
        //    document.getElementById("phonenumber").value = "";
        //}

        $('#phonenumber').on('input', function (e) {
            $("#d_AlertForgetPassword").text('');
            $("#d_AlertForgetPassword").removeClass("alert-success");
            $("#d_AlertForgetPassword").removeClass("alert-danger");
        });

        if (validatephone($("#phonenumber").val()) === true) {

            if ($("#otpCodeInput").val().length === 5)
                $("#btnsendcode").removeAttr("disabled");

            if ($("#otpCodeInput").val().length === 5)
                $("#btnsendcode").removeAttr("disabled");

            $("#timeinterval").text(`ارسال مجدد کد تایید بعد از ${time} ثانیه`);

            time > 0 ? time -= 1 : $("#returnlink").show();

            if (time <= 0) {
                $("#timeinterval").hide();
                $("#returnlink").show();
            }
            else {
                $("#timeinterval").show();
                $("#returnlink").hide();
            }
        } else if ($("#phonenumber").val() !== '') {
            // $("#d_AlertForgetPassword").text('شماره همراه معتبر نیست');
            // $('#d_AlertForgetPassword').attr('style', 'color: red');
            $("#d_AlertForgetPassword").text('شماره همراه معتبر نیست');
            $("#d_AlertForgetPassword").removeClass("alert-success");
            $("#d_AlertForgetPassword").addClass("alert-danger");
        }
    }, 1000);

    return {
        SPRC: sendForgetPasswordRequestV2Click,
        ActiveCodeBtnClicked: activeCodeBtnClicked,
        ModifyPhoneNumberClicked: ModifyPhoneNumberClicked,
        resetpassword: resetpassword,
        ModifyNationalCodeClicked: ModifyNationalCodeClicked
    };

})(services);

function password_strength(password) {
    var desc = new Array(),
        des = document.getElementById('password_description'),
        str = document.getElementById('password_strength');

    desc[0] = "غیر قابل قبول";
    desc[1] = "بسیار ضعیف";
    desc[2] = "ضعیف";
    desc[3] = "متوسط";
    desc[4] = "خوب";
    desc[5] = "عالی";

    var points = 0;

    //---- if password is bigger than 4 , give 1 point.
    if (password.length > 4) points++;

    //---- if password has both lowercase and uppercase characters , give 1 point.
    if ((password.match(/[a-z]/)) && (password.match(/[A-Z]/))) points++;

    //---- if password has at least one number , give 1 point.
    if (password.match(/\d+/)) points++;

    //---- if password has at least one special caracther , give 1 point.
    if (password.match(/.[!,\\, ,|,+,=,`,\,,>,<,/,.,@@,#,$,%,^,&,*,?,_,~,-,(,)]/)) points++;

    //---- if password is bigger than 12 ,  give 1 point.
    if (password.length > 6) points++;

    //---- Showing  description for password strength.
    if (des) {
        des.innerHTML = desc[points];
    }

    //---- Changeing CSS class.
    if (str) {
        str.className = 'strength' + points;
    }
}

document.getElementById('new-password').addEventListener('keydown', function (e) {
    setTimeout(function () {
        let new_password = document.getElementById('new-password').value;
        password_strength(new_password);
    }, 50);
});

var passwordToggleButtons = document.querySelectorAll('.password-toggle .eye-button');

passwordToggleButtons.forEach(function (item) {
    item.addEventListener('click', function (e) {
        let target = document.getElementById(e.target.dataset.target);
        e.target.classList.toggle('visible');
        if (e.target.classList.length > 1) {
            target.type = 'text';
        } else {
            target.type = 'password';
        }
    });
});

function goToFirstStep() {
    $('#main-container').show();
    $("#code-username-wrapper").hide();
}