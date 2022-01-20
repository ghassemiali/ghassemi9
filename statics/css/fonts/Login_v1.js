function submitForm(e) {

    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let captcha = document.getElementById('captcha').value;

    if (username == "") {
        document.getElementById('code-username-container').style.borderColor = "#ff2c3d";
        return false;
    } else {
        document.getElementById('code-username-container').style.borderColor = "#ced4da";
    }
    if (password == "") {
        document.getElementById('code-password-container').style.borderColor = "#ff2c3d";
        return false;
    } else {
        document.getElementById('code-password-container').style.borderColor = "#ced4da";
    }
    if (captcha == "") {
        document.getElementById('code-captcha-container').style.borderColor = "#ff2c3d";
        return false;
    } else {
        document.getElementById('code-captcha-container').style.borderColor = "#ced4da";
    }
}

var CaptchaUrlplus = getCaptchaUrlPlus();

function changeCaptchaPlus() {
    var CaptchaUrlplus = getCaptchaUrlPlus();
    var forgetPasswordCaptchaUrl = CaptchaUrlplus;
    var captchaImgPlus = document.getElementById("captcha-img-plus");
    captchaImgPlus.style.opacity = "0"
    captchaImgPlus.src = forgetPasswordCaptchaUrl;
};

var onlineplusurl = "";
onlineplusurl = onlineplusurl.length > 0 && onlineplusurl[onlineplusurl.length - 1] === "/" ?
    onlineplusurl.substring(0, onlineplusurl.length - 1) :
    onlineplusurl;

function getCaptchaUrlPlus() {
    var url = onlineplusurl ? onlineplusurl : "undefined" + "/" + Math.floor((Math.random() * 10000000) + 1) + "/Account/Captcha?postfix=" + Math.floor((Math.random() * 10000000) + 1);
    return url;
}


document.getElementById("captcha-img-plus").src = CaptchaUrlplus;




var CaptchaUrlOnline = getCaptchaUrlOnline();

function changeCaptchaOnline() {
    var CaptchaUrlOnline = getCaptchaUrlOnline();
    forgetPasswordCaptchaUrlOnlin = CaptchaUrlOnline;
    var captchaImgOnline = document.getElementById("captcha-img-plus");
    captchaImgOnline.style.opacity = "0"
    captchaImgOnline.src = forgetPasswordCaptchaUrlOnlin;
};

var onlineUrl = "";
onlineUrl = onlineUrl.length > 0 && onlineUrl[onlineUrl.length - 1] === "/" ?
    onlineUrl.substring(0, onlineUrl.length - 1) :
    onlineUrl;

function getCaptchaUrlOnline() {
    var url = onlineUrl + "/" + Math.floor((Math.random() * 10000000) + 1) + "/JpegImage.ashx?postfix=" + Math.floor((Math.random() * 10000000) + 1);
    return url;
}

function showPassword(isShow) {
    var password = document.getElementById("password");
    var visibleIcon = document.getElementById("visibleIcon");
    var unvisibleIcon = document.getElementById("unvisibleIcon");

    var type = 'password';
    if (isShow) {
        unvisibleIcon.style.display = 'contents';
        visibleIcon.style.display = 'none';

    } else {
        type = 'text';
        visibleIcon.style.display = 'contents';
        unvisibleIcon.style.display = 'none';
    }

    password.type = type;
}



// document.getElementById("captcha-img").src = CaptchaUrlOnline;