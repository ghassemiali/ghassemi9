//#region ProtoTypes

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};
String.prototype.commaSeperate = function() {
    var target = this;
    return target != null ? target.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "";
};
String.prototype.commaSeperateMinimize = function() {
    var target = this;
    var symbol = "";
    if (+target > 1000000000) {
        target = +((target / 1000000000).toFixed(window.MinimizeDecimalPlaces));
        symbol = "B";
    } else
    if (+target > 1000000) {
        target = +((target / 1000000).toFixed(window.MinimizeDecimalPlaces));
        symbol = "M";
    }
    return (target != null ? target.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "") + (symbol != "" ? " " + symbol : "");
};
String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g,
        function(match, number) {
            return typeof args[number] != "undefined" ?
                args[number] :
                match;
        });
};
String.prototype.hashCode = function() {
    var hash = 0,
        i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};
Number.prototype.commaSeperate = function() {
    var target = this;
    return target != null ? target.toString().commaSeperate() : "";
};
Number.prototype.commaSeperateMinimize = function() {
    var target = this;
    return target != null ? target.toString().commaSeperateMinimize() : "";
};
Number.prototype.padLeft = function(n, str) {
    return Array(n - String(this).length + 1).join(str || '0') + this;
}
Array.prototype.clone = function() {
    return JSON.parse(JSON.stringify(this));
};
Array.prototype.distinct = function() {
    return this.filter((value, index, self) => {
        return self.indexOf(value) === index;
    });
};
Array.prototype.distinctBy = function(key) {
    var list = this;
    return Array.from(new Set(list.map(s => s[key]))).map(id => {
        return list.find(o => o[key] == id);
    });
};
Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}
if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength, padString) {
        targetLength = targetLength >> 0; //truncate if number, or convert non-number to 0;
        padString = String(typeof padString !== 'undefined' ? padString : ' ');
        if (this.length >= targetLength) {
            return String(this);
        } else {
            targetLength = targetLength - this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
            }
            return padString.slice(0, targetLength) + String(this);
        }
    };
}

//#endregion

var apiBaseUrl = window.ApiBaseURl;
var rootWebSiteUrl = rootWebSite || "";
var TadbirRLCUrl = TadbirRLC_Url || "//beta.tadbirrlc.com/";
var TadbirRLApiUrl = TadbirRLCApi_Url || "//rlcwebapi.tadbirrlc.com/";

var utility = {
    clone: function(obj) {
        if (null == obj || "object" != typeof obj) return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr))
                if (!isNaN(attr))
                    copy[attr] = utility.clone(obj[attr]);
                else
                    copy[attr] = obj[attr];
        }
        return copy;
    },
    extend: function(target, source) {
        if (null == source || "object" != typeof source)
            return target;
        for (var attr in source) {
            target[attr] = source[attr];
        }
    },
    AppendOptionsToSelect: function(select, data, name, value) {
        select.options.length = 0;
        name = name || "name";
        value = value || "value";
        for (var i = 0; i < data.length; i++) {
            var option = document.createElement("option");
            option.text = data[i][name];
            option.value = data[i][value];
            select.appendChild(option);
        }
    },
    setCookie: function(cname, cvalue, exdays) {
        var d = new Date();
        exdays = exdays ? exdays : 1;
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    },
    getCookie: function(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },
    consolelog: function(txt) {
        if (window.isDebugMode)
            console.log(txt);
    },
    getElemWidth: function(id) {
        return document.getElementById(id).getBoundingClientRect().width;
    },
    isNullOrEmpty: function(obj) {
        return obj == null || obj == "";
    },
    NumberParenthesesFormat: function(val) {
        return val >= 0 ? val.commaSeperate() : `<span class="tp-co-re">(${Math.abs(val).commaSeperate()})</span>`;
    },
    NumberColorFormat: function(val) {
        return val != null && val >= 0 ? val.commaSeperate() : `<span class="tp-co-re">${val.commaSeperate()}</span>`;
    },
    getUrlParam: function(param) {
        param = param.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + param + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    },
    bindSetActiveClick(elemId, classToAdd) {
        if (!classToAdd)
            classToAdd = "active";

        document.getElementById(elemId).onclick = function(e) {
            e.stopPropagation();
            this.classList.toggle(classToAdd);
            document.body.addEventListener("click", bodyClick);
        };

        function bodyClick() {
            document.getElementById(elemId).classList.remove(classToAdd);
            document.body.removeEventListener("click", bodyClick);
        }
    },
    getCurrentShamsiDate: function() {
        return Convert.ConvertToLongShamsi(todayJavaScript.getFullYear(), todayJavaScript.getMonth() + 1, todayJavaScript.getDate());
    },
    bankAccountDropList: function(elem, list) {
        elem.innerHTML = "";
        for (var i = 0; i < list.length; i++) {
            elem.innerHTML += `<label style="${i > 1 ? 'display:none':'display:block'}">
                بانک ${list[i].BankTitle}
                <br />
                 شماره حساب <span style="direction:ltr;display: inline-block;">${list[i].AccountNumber}</span>
                <br />` +
                (list[i].Shaba ? `شبا <span style="direction:ltr;display: inline-block;">${list[i].Shaba}</span>` : "") +
                `<input type="radio" name="${elem.id}" value="${list[i].Id}" ${i == 0 ? "checked='checked'" : ""} >
                <span class="radiobtn"></span>
            </label>`;
        }
        var more_btn = document.createElement("div");
        if (list.length > 1) {
            more_btn.innerHTML = `<span class="arrow_icon">&#9660;</span>`;
            elem.append(more_btn);
            more_btn.setAttribute("class", "btn more-btn");
        }
        document.querySelector(".more-btn").onclick = displayDate;

        function displayDate() {
            var children_moneyPaymeny_bank = document.querySelector("#moneyPaymeny_bank").children;
            //console.log(children_moneyPaymeny_bank);
            for (var j = 0; j < children_moneyPaymeny_bank.length; j++) {
                if (children_moneyPaymeny_bank[j].style.display == "none") {
                    children_moneyPaymeny_bank[j].classList.toggle("d-block");
                }
            }
            var arrow_icon = document.querySelector(".arrow_icon");
            if (arrow_icon.innerHTML == '▼') {
                arrow_icon.innerHTML = "▲";
            } else {
                arrow_icon.innerHTML = "&#9660;";
            }
        }
    }
};

function icons(size) {
    const i = {};

    i.Web = function() {
        return `<svg viewBox='0 0 486 486' height='${size}px'>
                    <g>
                        <path d='M367.101,280.795h118.025c0.909-8.185,1.273-16.549,1.273-25.099c0-40.111-10.768-77.733-29.562-110.132c19.439-51.654,18.746-95.494-7.278-121.695C424.812-0.77,358.414,3.23,283.354,36.469c-5.552-0.42-11.158-0.636-16.817-0.636c-103.024,0-189.463,70.897-213.354,166.425c32.318-41.377,66.318-71.377,111.738-93.224c-4.13,3.87-28.227,27.826-32.28,31.882C12.866,260.654-24.905,417.068,15.736,457.717c30.893,30.887,86.879,25.671,151.188-5.824c29.903,15.229,63.75,23.815,99.61,23.815c96.565,0,178.4-62.158,208.044-148.725H355.645c-16.366,30.19-48.373,50.739-85.107,50.739s-68.743-20.549-85.108-50.739c-7.275-13.638-11.457-29.276-11.457-45.828v-0.36H367.101z M174.15,222.783c2.728-48.555,43.1-87.292,92.384-87.292c49.282,0,89.655,38.736,92.382,87.292H174.15z M448.482,48.285c16.763,16.94,16.344,48.107,2.006,87.011c-24.567-37.454-60.259-66.968-102.396-83.82C393.146,32.157,429.796,29.598,448.482,48.285z M46.741,450.008C25.35,428.611,31.798,383.7,59.355,329.592c17.154,48.136,50.578,88.545,93.668,114.577C105.309,465.829,66.255,469.506,46.741,450.008z'></path>
                    </g>
                </svg>
                `.trim();
    }
    i.ConditionalOrder = function() {
        return `
                <span style="font-size:15px;font-weight:bold;">CO</span>
                `.trim();
    }
    i.TestSystem = function() {
        return `
                <svg viewBox='0 0 684 684' height='${size}px'>
                    <g>
                        <path d="M602.882,0H80.281c-24.017,0-44.21,19.214-44.21,44.21v6.76c0,0.978,0,0.978,0,0.978v62.445v0.978v95.091
		c0,24.017,19.214,44.21,44.21,44.21h77.745c24.017,0,44.21-19.214,44.21-44.21v-45.188h55.685V515.93h-61.467
		c-23.039,0-42.253,19.214-42.253,42.253v82.638c0,23.039,19.214,42.253,42.253,42.253h74.899c0.978,0,2.847,0.979,4.804,0.979
		h130.673c1.957,0,2.846,0,3.825-0.979h73.031c23.039,0,42.253-19.214,42.253-42.253v-81.659c0-23.039-19.214-42.253-42.253-42.253
		h-59.599V166.254h57.642v45.188c0,24.017,19.214,44.21,44.21,44.21h77.834c24.017,0,44.21-19.214,44.21-44.21V44.21
		C647.092,20.192,626.9,0,602.882,0z M611.511,211.353c0,4.803-3.825,8.628-8.628,8.628h-77.834c-4.803,0-8.628-3.825-8.628-8.628
		v-62.445c0-9.607-7.65-17.257-17.257-17.257h-93.223c-9.607,0-17.257,7.65-17.257,17.257v386.236
		c0,9.607,7.65,17.257,17.257,17.257h77.834c3.825,0,6.76,2.846,6.76,6.76v81.659c0,3.825-2.846,6.76-6.76,6.76h-77.834
		c-1.957,0-2.846,0-4.803,0.978H280.07c-0.978,0-2.847-0.978-4.803-0.978h-79.702c-3.825,0-6.76-2.846-6.76-6.76v-81.659
		c0-3.825,2.847-6.76,6.76-6.76h79.702c9.607,0,17.257-7.65,17.257-17.257V148.019c0-9.607-7.65-17.257-17.257-17.257H184
		c-9.607,0-17.257,7.65-17.257,17.257v62.445c0,4.803-3.825,8.629-8.628,8.629H80.281c-4.804,0-8.629-3.825-8.629-8.629v-96.07
		v-0.978V52.927c0-0.978,0-0.978,0-0.978v-7.65c0-4.803,3.825-8.628,8.629-8.628h522.602c4.804,0,8.628,3.825,8.628,8.628
		L611.511,211.353L611.511,211.353z"/>
                    </g>
                </svg>
                `.trim();
    }
    i.OnlinePlus = function() {
        return `
                <svg viewBox='0 0 300 300' height='${size}px'>
                    <g transform='translate(0.000000,299.000000) scale(0.100000,-0.100000)'>
                        <path d='M1365 2978 c-3 -7 -6 -125 -7 -263 l-3 -250 -150 -6 c-185 -8 -273 -27 -460 -102 -55 -22 -158 -78 -194 -106 -20 -15 -61 -46 -92 -69 -31 -23 -72 -58 -91 -76 -44 -43 -185 -229 -203 -270 -8 -17 -19 -38 -23 -46 -43 -73 -86 -197 -119 -345 -24 -109 -24 -320 1 -430 35 -153 90 -303 139 -379 6 -11 26 -43 43 -71 47 -75 178 -220 264 -290 157 -129 327 -205 572 -255 87 -18 128 -22 220 -18 186 9 382 60 528 139 8 5 35 19 61 32 65 35 209 148 265 210 123 134 220 292 282 457 35 92 62 256 65 385 l2 120 265 5 265 5 3 264 c2 184 -1 268 -9 277 -9 11 -66 14 -268 16 l-256 3 -3 254 c-1 167 -6 259 -13 268 -9 10 -67 13 -270 13 -143 0 -260 1 -261 3 -1 1 -5 121 -8 267 l-5 265 -268 3 c-209 2 -269 0 -272 -10z m535 -818 l5 -265 265 -5 265 -5 3 -250 c2 -226 1 -251 -15 -262 -12 -10 -83 -13 -270 -13 l-253 0 0 -264 c0 -231 -2 -265 -16 -270 -9 -3 -123 -6 -254 -6 -192 0 -240 3 -249 14 -8 10 -11 87 -10 266 0 138 -1 254 -4 256 -3 3 -119 5 -258 5 -140 -1 -260 3 -267 7 -9 7 -12 66 -10 263 l3 254 260 3 c142 1 263 6 268 11 6 6 9 117 8 253 -1 134 1 251 5 261 6 16 27 17 263 15 l256 -3 5 -265z'></path>
                    </g>
                </svg>
                `.trim();
    }
    i.lock = function() {
        return `
                <svg viewBox='0 0 512 512' height='${size}px'>
                    <g>
                        <path d='M89.044,244.87V512h333.913V244.87H89.044z M272.696,390.653v49h-33.391v-49c-9.977-5.774-16.696-16.555-16.696-28.914c0-18.442,14.949-33.391,33.391-33.391s33.391,14.949,33.391,33.391C289.391,374.096,282.673,384.878,272.696,390.653z'></path>
                        <path d='M256,0c-73.766,0-133.565,59.799-133.565,133.565s0,77.913,0,77.913h66.783v-77.913c0-36.824,29.959-66.783,66.783-66.783s66.783,29.959,66.783,66.783v77.913h66.783c0,0,0-4.147,0-77.913S329.766,0,256,0z'></path>
                    </g>
                </svg>
                `.trim();
    }
    i.unlock = function() {
        return `
                <svg viewBox='0 0 512 512' height='${size}px'>
                    <g>
                        <path d='M172.522,244.87V512h333.913V244.87H172.522z M356.174,390.653v49h-33.391v-49c-9.977-5.774-16.696-16.555-16.696-28.914c0-18.442,14.949-33.391,33.391-33.391s33.391,14.949,33.391,33.391C372.87,374.096,366.151,384.878,356.174,390.653z'></path>
                        <path d='M139.13,0C65.365,0,5.565,59.799,5.565,133.565s0,77.913,0,77.913h66.783v-77.913c0-36.824,29.959-66.783,66.783-66.783s66.783,29.959,66.783,66.783v77.913h66.783c0,0,0-4.147,0-77.913S212.896,0,139.13,0z'></path>
                    </g>
                </svg>
                `.trim();
    }
    i.Mobile = function() {
        return `<span title='Mobile' class="tp-icon tp-mobile" style="font-size:19px"></span>`.trim();
    }
    i.MobileView = function() {
        return `<span title='Mobile' class="tp-icon tp-mobile" style="font-size:19px"></span>`.trim();
    }
    i.Metatrader = function() {
        return `<span title='Meta Trader'><svg viewBox='0 0 192 192' height='${size}px'>
                <g transform='translate(0.000000,192.000000) scale(0.100000,-0.100000)'>
                <path d='M378 1317 c-142 -138 -280 -273 -308 -299 -28 -27 -50 -56 -50 -68 0 -11 19 -38 43 -60 23 -23 160 -157 305 -298 145 -141 267 -258 271 -260 12 -4 111 80 111 95 0 8 -60 74 -134 146 -73 73 -142 148 -152 167 -73 141 -73 279 0 420 10 19 79 94 152 167 74 72 134 138 134 146 0 12 -95 97 -109 97 -3 0 -122 -114 -263 -253z'></path>
                <path d='M1232 1529 c-29 -24 -52 -49 -52 -56 0 -8 60 -74 134 -146 73 -73 142 -148 152 -167 73 -141 73 -279 0 -420 -10 -19 -79 -94 -152 -167 -74 -72 -134 -138 -134 -146 0 -12 95 -97 109 -97 3 0 122 114 263 253 340 332 345 337 357 337 6 0 11 14 11 30 0 17 -5 30 -11 30 -7 0 -27 15 -45 33 -149 148 -567 553 -573 555 -4 1 -31 -16 -59 -39z'></path>
                <path d='M856 1301 c-3 -4 56 -68 130 -141 75 -72 133 -134 130 -138 -7 -6 -41 -8 -298 -10 l-198 -2 0 -60 0 -60 203 -2 c252 -2 286 -3 293 -11 3 -3 -55 -65 -130 -138 -74 -72 -133 -136 -130 -140 3 -5 49 -9 102 -9 l97 0 173 170 c106 105 172 178 172 190 0 12 -66 85 -172 190 l-173 170 -97 0 c-53 0 -99 -4 -102 -9z'></path>
                </g>
            </svg></span>`;
    }
    i.BrokerApi = function() {
        return "api";
    }
    i.BatchOnlineTradeApi = function() {
        return "api";
    }
    i.TadbirMonitoring = function() {
        return "TadbirMonitoring";
    }
    return i;
}

function parseUrl(url) {
    var a = document.createElement('a');
    a.href = url;
    return a;
};

function GetGuid() {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

var ajax = (function() {
    var cacheQueue = {};

    function onreadystatechange(readyState, status, statusText, responseText, callbackFn, errorCallback) {
        if (readyState == 4) {
            if (status == 200) {
                var myArr = null;
                try {
                    if (responseText)
                        myArr = JSON.parse(responseText);
                } catch (e) {
                    if (errorCallback)
                        try {
                            errorCallback(statusText);
                        } catch (e) {}
                    console.error(e);
                }
                if (callbackFn)
                    try {
                        callbackFn(myArr);
                    } catch (e) {
                        console.error(e);
                    }
            } else if (status == 401) {
                if (isUserLogOut == false) {
                    isUserLogOut = true;
                    deleteAllCookies();

                }
                window.location.href = "/Account/Logout";
            } else {
                if (errorCallback)
                    try {
                        errorCallback(statusText);
                    } catch (e) {
                        console.error(e);
                    }
            }
        } else if (status == 401) {
            if (isUserLogOut == false) {
                isUserLogOut = true;
            }
            window.location.href = "/Account/Logout";
        }
    };

    var getJSON = function(url, apiVersion = false) {
        var promise = new Promise(function(resolve, reject) {
            var mainUrl = url;
            var g = parseUrl(url);
            var query = g.search;
            var added = ".rand=" + GetGuid();
            if (query != "") {
                added = "&" + added;
            } else {
                added = "?" + added;
            }
            url = encodeURI(url);

            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                onreadystatechange(this.readyState,
                    this.status,
                    this.statusText,
                    this.responseText,
                    (data) => {
                        delete cacheQueue[mainUrl];
                        resolve(data);
                    },
                    () => {
                        delete cacheQueue[mainUrl];
                        reject();
                    });
            };
            xhr.onerror = function() {
                onreadystatechange(this.readyState,
                    this.status,
                    this.statusText,
                    this.responseText,
                    resolve,
                    reject);
            };
            xhr.open("GET", url, true);
            if (url.indexOf(TadbirRLC_Url) < 0 && url.indexOf(TadbirRLApiUrl) < 0 && url.indexOf("ovm.etadbir.com") < 0)
                xhr.setRequestHeader("X-Requested-With", 'XMLHttpRequest');
            if (apiVersion) {
                xhr.setRequestHeader("Authorization", 'BasicAuthentication ' + tokenManger.getToken());
            }

            xhr.send();
        });

        return promise;


    };
    var sendPostByPromise = function (url, data, callbackFn, errorCallback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            onreadystatechange(this.readyState,
                this.status,
                this.statusText,
                this.responseText,
                callbackFn,
                errorCallback);
        };
        xhr.onerror = function () {
            onreadystatechange(this.readyState,
                this.status,
                this.statusText,
                this.responseText,
                callbackFn,
                errorCallback);
        };
        xhr.open("POST", url, true);

        xhr.setRequestHeader("Content-Type", "application/json");
        if (url.indexOf(apiBaseUrl) === 0) {
            xhr.setRequestHeader("Authorization", 'BasicAuthentication ' + tokenManger.getToken());
        } else if (url.indexOf(TadbirRLC_Url) < 0 && url.indexOf(TadbirRLApiUrl) < 0)
            xhr.setRequestHeader("X-Requested-With", 'XMLHttpRequest');
        xhr.send(JSON.stringify(data));
    };
    var getFile = function(url, callBack, apiVersion = false) {
        var promise = new Promise(function(resolve, reject) {
            var mainUrl = url;
            var g = parseUrl(url);
            var query = g.search;
            var added = ".rand=" + GetGuid();
            if (query != "") {
                added = "&" + added;
            } else {
                added = "?" + added;
            }
            url = encodeURI(url);

            var xhr = new XMLHttpRequest();
            xhr.addEventListener("load", function() {
                callBack(this.responseText);
            });
            xhr.onerror = function() {
                console.log(this.responseText)
            };
            xhr.open("GET", url, true);
            if (url.indexOf(TadbirRLC_Url) < 0 && url.indexOf(TadbirRLApiUrl) < 0 && url.indexOf("ovm.etadbir.com") < 0)
                xhr.setRequestHeader("X-Requested-With", 'XMLHttpRequest');
            if (apiVersion) {
                xhr.setRequestHeader("Authorization", 'BasicAuthentication ' + tokenManger.getToken());
            }

            xhr.send();
        });

        return promise;


    };
    var sendPost = function(url, data, callbackFn, errorCallback, apiVersion = false) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            onreadystatechange(this.readyState,
                this.status,
                this.statusText,
                this.responseText,
                callbackFn,
                errorCallback);
        };
        xhr.onerror = function() {
            onreadystatechange(this.readyState,
                this.status,
                this.statusText,
                this.responseText,
                callbackFn,
                errorCallback);
        };
        xhr.open("POST", url, true);

        xhr.setRequestHeader("Content-Type", "application/json");
        if (url.indexOf(apiBaseUrl) === 0) {
            xhr.setRequestHeader("Authorization", 'BasicAuthentication ' + tokenManger.getToken());
        } else if (url.indexOf(TadbirRLC_Url) < 0 && url.indexOf(TadbirRLApiUrl) < 0)
            xhr.setRequestHeader("X-Requested-With", 'XMLHttpRequest');
        xhr.send(JSON.stringify(data));
    };

    var sendPut = function (url, data, callbackFn, errorCallback, apiVersion = false) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            onreadystatechange(this.readyState,
                this.status,
                this.statusText,
                this.responseText,
                callbackFn,
                errorCallback);
        };
        xhr.onerror = function () {
            onreadystatechange(this.readyState,
                this.status,
                this.statusText,
                this.responseText,
                callbackFn,
                errorCallback);
        };
        xhr.open("PUT", url, true);

        xhr.setRequestHeader("Content-Type", "application/json");
        if (url.indexOf(apiBaseUrl) === 0) {
            xhr.setRequestHeader("Authorization", 'BasicAuthentication ' + tokenManger.getToken());
        } else if (url.indexOf(TadbirRLC_Url) < 0 && url.indexOf(TadbirRLApiUrl) < 0)
            xhr.setRequestHeader("X-Requested-With", 'XMLHttpRequest');
        xhr.send(JSON.stringify(data));
    };


    var sendFormData = function(url, data, callbackFn, errorCallback, apiVersion = false) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            onreadystatechange(this.readyState,
                this.status,
                this.statusText,
                this.responseText,
                callbackFn,
                errorCallback);
        };
        xhr.onerror = function() {
            onreadystatechange(this.readyState,
                this.status,
                this.statusText,
                this.responseText,
                callbackFn,
                errorCallback);
        };
        xhr.open("POST", url, true);
        //if (url.indexOf(TadbirRLC_Url) < 0 && url.indexOf(TadbirRLApiUrl) < 0)
        //    xhr.setRequestHeader("X-Requested-With", 'XMLHttpRequest');
        //xhr.setRequestHeader("Content-Type", "multipart/form-data");
        if (apiVersion) {
            xhr.setRequestHeader("Authorization", 'BasicAuthentication ' + tokenManger.getToken());
        }
        xhr.send(data);
    };
    var sendDelete = function(url, callbackFn, errorCallback, apiVersion = false) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            onreadystatechange(this.readyState,
                this.status,
                this.statusText,
                this.responseText,
                callbackFn,
                errorCallback);
        };
        xhr.onerror = function() {
            onreadystatechange(this.readyState,
                this.status,
                this.statusText,
                this.responseText,
                callbackFn,
                errorCallback);
        };
        xhr.open("Delete", url, true);

        xhr.setRequestHeader("Content-Type", "application/json");
        if (url.indexOf(apiBaseUrl) === 0) {
            xhr.setRequestHeader("Authorization", 'BasicAuthentication ' + tokenManger.getToken());
        } else if (url.indexOf(TadbirRLC_Url) < 0 && url.indexOf(TadbirRLApiUrl) < 0)
            xhr.setRequestHeader("X-Requested-With", 'XMLHttpRequest');
        xhr.send();
    };



    function getCached(key, apiVersion = false) {
        if (cacheQueue[key])
            return cacheQueue[key];
        var res = getJSON(key, apiVersion);
        cacheQueue[key] = res;
        return res;
    }

    return {

        getJSON: function(url, calback, error, apiVersion = false) {
            getCached(url, apiVersion).then(function(data) {
                calback(data);
            }).catch(function(e) {
                if (error)
                    error(e);
                console.error(e);
            });
        },
        get: function(url) {
            return getCached(url);
        },
        getFile,
        sendPost,
        sendPut,
        sendDelete,
        sendFormData,
        sendPostByPromise
    };
})();

function translate(str) {
    if (str == null || str == "") {
        return "";
    }
    str = str.toLowerCase();
    if (globalResources != null && globalResources[str] != null)
        return globalResources[str];
    console.info("resource not found: " + str);
    return str;
}

var sharedServices = {
    GetUserSetting: function(settingName, fnCallback, fnError) {
        if (!window.UserSettings)
            window.UserSettings = {};

        if (window.UserSettings[settingName])
            fnCallback(window.UserSettings[settingName]);
        else {
            ajax.getJSON(rootWebSiteUrl + `/Customer/GetUserSettingsBySettingName?settingName=${settingName}&version=0`,
                function(data) {
                    window.UserSettings[settingName] = data;
                    fnCallback(data);
                });
        }
    },
    GetUserPageSettings: function(fnCallback, fnError) {
        return this.GetUserSetting("pageSettings_" + GlobalVar.CurrentPageName, fnCallback, fnError);
    },
    SaveUserSetting: function(settingName, settingValue, fnCallback, fnError) {
        if (SiteServices.timerSaveUserSetting == null)
            SiteServices.timerSaveUserSetting = [];

        if (SiteServices.timerSaveUserSetting != null && SiteServices.timerSaveUserSetting[settingName] != null) {
            clearTimeout(SiteServices.timerSaveUserSetting[settingName]);

            SiteServices.timerSaveUserSetting[settingName] = null;
        }
        if (!window.UserSettings)
            window.UserSettings = {};

        window.UserSettings[settingName] = { Data: settingValue };
        SiteServices.timerSaveUserSetting[settingName] = setTimeout(function() {

            ajax.sendPost(rootWebSiteUrl + `/Customer/SaveUserSettingsBySettingNameNew`, { userSetting: settingValue, settingName: settingName },
                fnCallback,
                fnError, true);
        }, 2000);
    },
    SaveUserPageSettings: function(fnCallback, fnError) {
        return this.SaveUserSetting("pageSettings_" + GlobalVar.CurrentPageName, JSON.stringify(GlobalVar.pageSettings), fnCallback, fnError);
    },
}

var Convert = {
    ConvertToLongShamsi(year, month, day) {
        var g_days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var j_days = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
        var monthNames = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];

        for (var t, c, f, e = year, o = month, s = day,
                r = e - 1600, h = o - 1, y = s - 1, u = 365 * r + parseInt((r +
                    3) / 4) - parseInt((r + 99) / 100) + parseInt((r + 399) /
                    400), i = 0; i < h; ++i) u += g_days[i];
        for (h > 1 && (r % 4 == 0 && r % 100 != 0 || r % 400 == 0) && ++u, u +=
            y, t = u - 79, c = parseInt(t / 12053), t %= 12053, f = 979 + 33 *
            c + 4 * parseInt(t / 1461), t %= 1461, t >= 366 && (f += parseInt((
                t - 1) / 365), t = (t - 1) % 365), i = 0; i < 11 && t >= j_days[
                i]; ++i) t -= j_days[i];
        var p = i + 1,
            w = t + 1,
            b = new Date(e, o - 1, s),
            dayOfWeek = ["یک شنبه", "دو شنبه", "سه شنبه", "چهار شنبه", "پنج شنبه", "جمعه", "شنبه"][b.getDay()];

        return dayOfWeek + " " + w + " " + monthNames[p - 1] + " " + f;
    },
    ToDateFromString: function(s) {
        if (!s || s.indexOf("(-") >= 0)
            return null;
        if (s.indexOf("Date") >= 0)
            return new Date(+s.match(/\d+/)[0]);
        if (s.indexOf("-") >= 0) {
            var dt = s.split("-");
            return new Date(dt[0], (+dt[1]) - 1, dt[2].substring(0, 2));
        }
        return new Date(s);
    },
    ToShamsi: function(g_date) {
        if (g_date.getFullYear() < 1970)
            return "";
        var j = toJalaali(g_date);
        j.jh = g_date.getHours();
        j.jmm = g_date.getMinutes();
        j.js = g_date.getSeconds();
        j.jD = g_date.getDay();

        return j;
    },
    ToShamsiFormat: function(g_date, format) {
        if (!g_date)
            return "-";
        var j_date = this.ToShamsi(g_date);
        if (!j_date)
            return "";
        var dayOfWeeks = ["یک شنبه", "دو شنبه", "سه شنبه", "چهار شنبه", "پنج شنبه", "جمعه", "شنبه"];
        return format
            .replace("HH", j_date.jh.toString().padStart(2, "0"))
            .replace("mm", j_date.jmm.toString().padStart(2, "0"))
            .replace("ss", j_date.js)
            .replace("jYYYY", j_date.jy)
            .replace("jYY", (j_date.jy < 1400 ? j_date.jy % 100 : j_date.jy))
            .replace("jYY", j_date.jy.toString().substring(2, 4))
            .replace("jMM", j_date.jm.toString().padStart(2, "0"))
            .replace("jDDDD", dayOfWeeks[j_date.jD])
            .replace("jDD", j_date.jd.toString().padStart(2, "0"));
    },
    ToShamsiFormatFromDate(date, format) {
        return this.ToShamsiFormat(this.ToDateFromString(date), format);
    },
    ToShamsiM: function(dt) {
        return moment(dt);
    },
    ToShamsiFormatM: function(dt, format) {
        return this.ToShamsiM(dt).locale("fa").format(format);
    },
    StringToDate: function(strDate) {
        var date = new Date(strDate.substring(0, 4),
            parseInt(strDate.substring(5, 7)) - 1,
            parseInt(strDate.substring(8, 10)),
            strDate.substring(11, 13),
            strDate.substring(14, 16),
            strDate.substring(17, 19), 0);

        return date;
    },
    MiliSecondsToDateTime: function(secs) {
        var t = new Date(1970, 0, 1);
        t.setMilliseconds(secs);
        return t;
    },
    ShamsiToMiladi(jY, jM, jD) {
        return toGregorian(jY, jM, jD);
    },
    ShamsiStringToMiladi(jDateStr) {
        return Convert.ShamsiToMiladi(
            parseInt(jDateStr.substring(0, 4)),
            parseInt(jDateStr.substring(5, 7)),
            parseInt(jDateStr.substring(8, 10))
        );
    },
    ShamsiToMiladiFormat(jDateStr) {
        var miladi = Convert.ShamsiStringToMiladi(jDateStr);
        return miladi.gy + "-" + miladi.gm.toString().padStart(2, "0") + "-" + miladi.gd.toString().padStart(2, "0");
    },
    ToNumber: function(input, valueIfError, fixNumber) {
        var outpot;
        if (input) {
            if (isNaN(Number(input)))
                outpot = valueIfError ? valueIfError : 0;
            else {
                outpot = Number(input);
                if (fixNumber != null && fixNumber >= 0)
                    outpot = Number(outpot.toFixed(fixNumber));
            }
        } else
            outpot = valueIfError ? valueIfError : 0;
        return outpot;
    },
    GetHagheTaghadomIsinByStockIsin: function(StockIsin) { //تبدیل نماد به حق تقدم
        var newIsin = "IRR" + StockIsin.substring(3, 9) + "101";
        return newIsin;
    },
    GetStockIsinByHagheTaghadomIsin: function(StockIsin) { //تبدیل حق تقدم به نماد
        var newIsin = "IRO" + StockIsin.substring(3, 9) + "001";
        return newIsin;
    }
};

function handleNotifyMessage(message) {
    var id = "Notification_Container";
    var containerBox = document.getElementById(id);
    var container;
    if (containerBox == null) {
        containerBox = document.createElement("div");
        containerBox.id = id;
        document.body.appendChild(containerBox);

        container = document.createElement("div");
        container.classList.add("container");
        containerBox.appendChild(container);
    } else
        container = containerBox.querySelector("div.container");

    if (typeof message === "string")
        message = { text: message, type: "info" };

    if (message.type == null)
        message.type = "info";

    var notifyElem = document.createElement("div");


    var txtElem = document.createElement("span");
    txtElem.classList.add("text");
    txtElem.innerHTML = message.text;

    var headerElem = document.createElement("div");
    headerElem.classList.add("header");
    var closeElem = document.createElement("span");
    if (message.cookieKey)
        closeElem.setAttribute("cookieKey", message.cookieKey);
    closeElem.classList.add("close");
    closeElem.onclick = function(e) {
        e.stopPropagation();
        var cookieKey = e.target.getAttribute("cookieKey");
        if (cookieKey) {
            utility.setCookie(cookieKey, "true", 1);
        }
        container.removeChild(notifyElem);

    };
    notifyElem.appendChild(headerElem);
    notifyElem.appendChild(closeElem);
    notifyElem.appendChild(txtElem);
    notifyElem.classList.add("notify-item", message.type);

    container.prepend(notifyElem);

    if (message.type == "warning" && window.notificationAllowed) {
        //if (!document[window.notificationHidden]) return;
        var n = new Notification("", {
            body: message.text,
            dir: "rtl",
            icon: rootWebSite + "/favicon.ico",
        });
    }
    var notifyElems = container.querySelectorAll(".notify-item");
    if (notifyElems && notifyElems.length > 1) {
        var closeAll = containerBox.querySelector(".closeallnotifications #close-all");
        if (closeAll == null) {
            closeAll = document.createElement("span");

            closeAll.id = "close-all";
            closeAll.classList.add("tp-3d-bu-re");
            closeAll.innerHTML = "بستن همه";
            closeAll.onclick = function() {
                var nods = containerBox.querySelectorAll(".notify-item .close");
                nods.forEach(function(i) {
                    i.click();
                });
                containerBox.remove();
            };



            var closeallContainer = document.createElement("div");
            closeallContainer.classList.add("closeallnotifications");

            closeallContainer.appendChild(closeAll);

            containerBox.appendChild(closeallContainer);
        }
    }

    function ClearLastChils(container1) {
        setTimeout(function() {
            if (container1.lastChild) {
                container1.lastChild.remove();
            }
            var notifyElems = document.querySelectorAll(".notify-item");
            if (!(notifyElems && notifyElems.length > 1)) {
                var _closeAllBox = document.querySelector(".closeallnotifications");
                if (_closeAllBox) {
                    _closeAllBox.remove();
                }
            }
        }, message.duration ? (message.duration * 1000) : 5000);
    }

    ClearLastChils(container);
}

var Notify = function(message) {
    var toastMessagesSetting = {
        ModeratorToastMessages: window.GlobalVar.onlineplus_settings.ModeratorToastMessages,
        ImportantToastMessages: window.GlobalVar.onlineplus_settings.ImportantToastMessages,
        OrdersToastMessages: window.GlobalVar.onlineplus_settings.OrdersToastMessages
    }

    if (message.category) {
        if (toastMessagesSetting[message.category] === true || typeof (toastMessagesSetting[message.category]) === 'undefined') {
            handleNotifyMessage(message);
        } else {
            console.log('%c' + message.category + ' = Disabled', 'background: #ff6600; color: #fff;');
        }
    } else {
        handleNotifyMessage(message);
    }
};

function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

function initNotification() {
    window.notificationAllowed = false, window.notificationHidden = "", window.notificationVisibilityChange = "";
    if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
        window.notificationHidden = "hidden";
        window.notificationVisibilityChange = "visibilitychange";
    } else if (typeof document.mozHidden !== "undefined") {
        window.notificationHidden = "mozHidden";
        window.notificationVisibilityChange = "mozvisibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
        window.notificationHidden = "msHidden";
        window.notificationVisibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
        window.notificationHidden = "webkitHidden";
        window.notificationVisibilityChange = "webkitvisibilitychange";
    }
    if (("Notification" in window)) {
        if (Notification.permission === "granted") {
            window.notificationAllowed = true;
        } else {
            try {
                Notification.requestPermission(function(permission) {
                    if (permission === "granted") {
                        window.notificationAllowed = true;
                    }
                });
            } catch (e) {

            }
        }
    };
};

window.addEventListener('DOMContentLoaded', function() {
    initNotification();
});

function checkAPMRules(error) {
    var now = new Date();
    var start = new Date(now.toISOString().substring(0, 11) + APMStartTime + ":00");
    var end = new Date(now.toISOString().substring(0, 11) + APMEndTime + ":00");

    if (now < start || now > end)
        return false;

    for (var i = 0; i < APMBlackList.length; i++)
        if (error.message.toLowerCase().indexOf(APMBlackList[i]) > 0)
            return false;

    return true;
}

if (APMIsEnabled) {
    try {
        if (elasticApm) {
            var serviceAddress = APMEndpoint;
            var configService = elasticApm.serviceFactory.getService('ConfigService');
            configService.setConfig({
                sendPageLoadTransaction: false,
                flushInterval: APMFlushInterval
            });
            elasticApm.addTags({ brokerId: BrokerID, brokerName: ThemeName });

            //elasticApm.serviceFactory.getService("ErrorLogging").registerGlobalEventListener();
            elasticApm.init({
                serviceName: 'silver',
                serverUrl: serviceAddress
            });

            var useragent = navigator.userAgent.toLowerCase();

            if (APMBrowsers.length > 0) {

                var shouldLog = false;

                var browsers = APMBrowsers.split(',');

                for (index = 0; index < browsers.length; index++) {
                    if (useragent.indexOf(browsers[index]) > 0) {
                        shouldLog = true;
                    }
                }
                if (shouldLog) {
                    var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

                    var processError = function(error) {
                        if (error && elasticApm && checkAPMRules(error)) {
                            error.tags = {};
                            error.tags.stack = error.stack;
                            error.stack = null;
                            elasticApm.captureError(error);
                        }
                    };

                    if (isFirefox) {
                        window.addEventListener('error',
                            function(event) {
                                processError(event.error);
                            });
                    } else {
                        window.onerror = function(message, source, lineno, colno, error) {
                            processError(error);
                        };
                    }
                }
            }
        }
    } catch (ex) {
        console.log("error in loading apm");
    }
}