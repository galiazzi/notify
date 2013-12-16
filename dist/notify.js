var Notify = (function () {

    var boxMessages = [],
        config = {
            maxBoxMessage: 4, urlImages: "."
        }, bottom;

    function getPosButton() {
        var bottom = 5, cssRule = (function () {
            var ds = document.styleSheets, i, j, cssRules;
            for (i = 0; i < ds.length; i++) {

                // O try-catch previne a ocorrencia de erro caso
                // não tenha permissão para acessar stylesheets de outra origin
                // O problema pode ser encontrado pesquisando por:
                // Accessing Cross Domain Stylesheet
                try {
                    cssRules = ds[i].cssRules;
                    for (j = 0; j < cssRules.length; j++) {
                        if (cssRules[j].selectorText === ".notify") {

                            // Configura o caminho das imagens
                            config.urlImages =
                                    ds[i].href.slice(0, ds[i].href.lastIndexOf("/")) + "/img";

                            return cssRules[j];
                        }
                    }
                } catch (e) {}

            }
            return null;
        })();
        if (cssRule) {
            bottom = parseInt(cssRule.style.bottom);
        }
        return bottom;
    }
    bottom = getPosButton();

    function $(id) {
        return document.getElementById(id);
    }

    function BoxMessage(type, message, time) {
        this.dom = createDOM();

        this.dom.className = "notify notify-" + type;
        this.dom.getElementsByTagName("img")[0].src =
                config.urlImages + "/" + type + ".png";
        var text = this.dom.getElementsByTagName("div")[0];
        text.innerHTML = message;
        //div.style.height = (70 + text.offsetHeight) + "px";

        this.dom.onclick = (function () {
            clearInterval(this.timer);
            this.hidden();
        }).bind(this);

        if(time > 0) {
            this.timer = setTimeout((function () {
                this.hidden();
            }).bind(this), time);
        }

        this.show = function () {
            this.dom.style.visibility = "visible";
            //this.dom.style["-webkit-animation"] = "fadein 0.2s";
        };

        this.hidden = function () {
            this.dom.style.visibility = "hidden";
            //this.dom.style["-webkit-animation"] = "fadeout 0.2s";
            //setTimeout((function () {
                this.destroy();
            //}).bind(this), 200);
        };

        this.destroy = function () {
            clearInterval(this.timer);
            document.body.removeChild(this.dom);
            boxMessages = boxMessages.filter((function (box) {
                return box !== this;
            }).bind(this));
            repaintBox();
        };

        this.setMessage = function (message) {
            var text = this.dom.getElementsByTagName("div")[0];
            text.innerHTML = message;
        };

    }

    function createDOM() {
        var div = document.createElement("div");
        div.id = "notifyDiv";
        div.className = "notify";
        div.style.cssText = "z-index:999999";
        div.innerHTML = "<img class='notify-img'><div class='notify-text'/>";
        document.body.appendChild(div);
        return div;
    }

    function repaintBox() {
        var alt = 0, i = boxMessages.length, box;
        while (--i >= 0) {
            box = boxMessages[i];
            box.dom.style.bottom = (bottom + alt) + "px";
            alt += parseInt(box.dom.offsetHeight) + 5;
        }
    }

    function setMessage(type, message, time) {
        var box = new BoxMessage(type, message, time);
        if (boxMessages.length >= config.maxBoxMessage) {
            boxMessages[0].destroy();
        }
        boxMessages.push(box);
        repaintBox();
        box.show();
    }

    function PMessage() {

        var self = this;

        function getBox () {
            var i = boxMessages.length;
            while(--i >= 0) {
                if (boxMessages[i].permanent === self) {
                    return boxMessages[i];
                }
            }
            return null;
        }

        function message(type, message) {
            var box = getBox();
            if (!box) {
                setMessage(type, message, 20000);
                box = boxMessages[boxMessages.length - 1];
                box.permanent = self;
            } else {
                box.setMessage(message);
                box.dom.getElementsByTagName("img")[0].src =
                        config.urlImages + "/" + type + ".png";
            }
            box.dom.className = "notify notify-black";
        }

        this.error = function (m) {
            message("error", m);
        };

        this.info = function (m) {
            message("info", m);
        };

        this.warning = function (m) {
            message("warning", m);
        };

        this.success = function (m) {
            message("success", m);
        };

        this.close = function () {
            var box = getBox();
            if (box) {
                box.destroy();
            }

            // Invalidar objeto
        };
    }

    return {
        error: function (m) {
            var time = arguments[1] ? arguments[1] : 7000;
            setMessage("error", m, time);
        },

        info: function (m) {
            setMessage("info", m, 3000);
        },

        warning: function (m) {
            setMessage("warning", m, 5000);
        },

        success: function (m) {
            setMessage("success", m, 3000);
        },

        config: function (obj) {
            Object.keys(obj).forEach(function (propertie) {
                config[propertie] = obj[propertie];
            });
        },

        createPMessage: function() {
            return new PMessage();
        }
    };

})();