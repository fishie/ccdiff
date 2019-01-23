angular.module('han').controller('MainController', function() {

    //this.chars = '天漢以叫集写直今所過骨平説說雪没沒社飯絆青靑鯖歩步海';
    this.chars = '鯖';
    this.charhistory = [this.chars];
    this.variantsMap = variantsMap;
    this.variants = [];
    this.previouslyPasted = "";
    this.showAbout = false;
    this.fonts = [
        {
            countryCode: 'TW',
            shortName: 'Kai',
            cssClass: 'taiwan-kai-pc',
            glyphDict: CMEXc1_glyphdict
        },
        {
            countryCode: 'TW',
            shortName: 'Song',
            cssClass: 'taiwan-song-pc',
            glyphDict: CMEXa1_glyphdict
        },
        {
            countryCode: 'JP',
            shortName: 'Mincho',
            cssClass: 'japan-ipa-mincho',
            glyphDict: IPAMincho_glyphdict
        },
        {
            countryCode: 'JP',
            shortName: 'Gothic',
            cssClass: 'japan-ipa-gothic',
            glyphDict: IPAGothic_glyphdict
        },
        {
            countryCode: 'HK',
            shortName: 'Ming',
            cssClass: 'hong-kong-ming',
            glyphDict: Ming_glyphdict
        },
        {
            countryCode: 'CN',
            shortName: 'Sans',
            cssClass: 'source-han-sans-cn',
            glyphDict: SourceHanSansCN_Regular_glyphdict
        },
        {
            countryCode: 'CN',
            shortName: 'Song',
            cssClass: 'ar-pl-baosong',
            glyphDict: ARPLBaosong2GBK_Light_glyphdict
        },
        {
            countryCode: 'KR',
            shortName: 'Gothic',
            cssClass: 'nanum-gothic',
            glyphDict: NanumGothic_glyphdict
        },
        {
            countryCode: 'KR',
            shortName: 'Seoul',
            cssClass: 'seoul-hangang',
            glyphDict: SeoulHangangL_glyphdict
        }
    ];

    const textBox = document.getElementById('TextBox');

    document.documentElement.addEventListener('touchstart', (event) => {
        if (event.target != textBox) {
            textBox.blur();
        } else if (document.activeElement == textBox) {
            cordova.plugins.Keyboard.disableScroll(true);
        }
    });

    document.documentElement.addEventListener('touchend', (event) => {
        if (document.activeElement == textBox) {
            cordova.plugins.Keyboard.disableScroll(false);
        }
    });

    this.getVariants = function() {
        this.variants = this.variantsMap[this.chars.charCodeAt(0)];
        let variantChars = [];
        if (this.variants) {
            for (i = 0; i < this.variants.length; i++) {
                variantChars.push(String.fromCharCode(this.variants[i]));
            }
        }
        return variantChars;
    };

    function isChineseCharacter(char) {
        charcode = char.charCodeAt(0);
        if ((charcode >= 0x3400 && charcode <= 0x9FFF) || (charcode >= 0xF900 && charcode <= 0xFAFF)) {
            return true;
        }
        return false;
    }

    this.appendToHistory = function (chars) {

        trimmed = chars.trim();
        if ((trimmed != "") && isChineseCharacter(trimmed[0])) {
            this.charhistory.push(trimmed[0]);
        }

        d = {};
        noduplicate = [];
        for (let i = this.charhistory.length; i--; i >= 0) {

          if (this.charhistory[i] in d) continue;
          noduplicate.unshift(this.charhistory[i]);
          d[this.charhistory[i]] = 1;
        }
        this.charhistory = noduplicate;
    };

    this.charClick = function (char) {
        this.chars = char;
        this.appendToHistory(char);
    };

    this.toggleAbout = function() {
        this.showAbout ^= true;

        if (this.showAbout) {
            window.history.pushState({showAbout: true}, "", "index.html");
        } else {
            window.history.back();
        }
    };

    window.onpopstate = function(event) {
        let showAbout = false;
        if (event.state) {
            showAbout = event.state.showAbout;
        }

        const scope = angular.element(document.getElementById("Body")).scope();
        scope.$evalAsync((scope) => {
            scope.main.showAbout = showAbout;
        });
    }

    this.openExternal = function(url) {
        if (window.cordova) cordova.InAppBrowser.open(url, '_system');
        else window.open(url);
    };
});
