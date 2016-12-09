var remjs = {
    options: {
        base: ""
    },
    config: function (opt) {
        for (var field in opt) {
            this.options[field] = opt[field];
        }
    },
    require: function (moduleId,callback) {
        if (!remjs.modules[moduleId]) {
            var xmlHttpRequest = remjs.creatHttpRequest();
            var url = remjs.options.base + moduleId + ".js";
            xmlHttpRequest.open("get", url, true);
            xmlHttpRequest.onreadystatechange = function (e) {
                if (xmlHttpRequest.readyState === 4 && xmlHttpRequest.status === 200) {
                    remjs.scriptcode[moduleId] = xmlHttpRequest.responseText;
                    remjs.modules[moduleId] = function (moduleId, require, module) {
                        var scriptcode = remjs.scriptcode[moduleId];
                        eval(scriptcode);
                        return module.exports;
                    }
                    if (remjs.checkrequire(xmlHttpRequest.responseText, callback)) {
                        if (callback) {
                            callback();
                        }
                    }
                    
                }
            }
            xmlHttpRequest.send();

        } else {
            return remjs.modules[moduleId](moduleId, remjs.require, { exports: null });
        }
    },
    modules: {},
    scriptcode: {},
    use: function (url) {
        if (!this.options.base) {
            this.options.base = url.substr(0, (url.lastIndexOf('/') || url.lastIndexOf('\\')) + 1);
        }
        var moduleId = url.substr((url.lastIndexOf('/') || url.lastIndexOf('\\')) + 1);
        this.require(moduleId, function () {
            remjs.modules[moduleId](moduleId, remjs.require, { exports: null });
        });
    },
    creatHttpRequest: function () {
        xmlhttp = null;
        if (window.XMLHttpRequest) {// code for Firefox, Opera, IE7, etc.
            xmlhttp = new XMLHttpRequest();
        }
        else if (window.ActiveXObject) {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        return xmlhttp;
    },
    checkrequire: function (scriptcode,callback) {
        var result = true;
         var matchs = scriptcode.match(/require\(['"]\w+['"]\)/g);
        if (matchs && matchs.length) {
            for (var i = 0, length = matchs.length; i < length; i++) {
                var item = matchs[i];
                var moduleid = item.substring((item.indexOf('\'') !== -1 ? item.indexOf('\'') : item.indexOf('\"')) + 1, (item.lastIndexOf('\'') !== -1 ? item.lastIndexOf('\'') : item.lastIndexOf('\"')));
                if (!remjs.modules[moduleid]) {
                    result = false;
                    remjs.require(moduleid, callback);
                }
            }
        }
        return result;
    }
}