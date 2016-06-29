angular.module('han', []);

angular.module('han').controller('MainController', function() {


    //this.chars = '天漢以叫集写直今所過骨平説說雪没沒社飯絆青靑鯖歩步海';
    this.chars = '鯖';
    this.charhistory = [this.chars];
    this.variantsMap = variantsMap;
    this.variants = [];
    this.previouslyPasted = "";
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

    var textBox = document.getElementById('TextBox');

    document.documentElement.addEventListener('touchstart', function(event) {
        if (event.target != textBox) {
            textBox.blur();
        } else if (document.activeElement == textBox) {
            cordova.plugins.Keyboard.disableScroll(true);
        }
    });

    document.documentElement.addEventListener('touchend', function(event) {
        if (document.activeElement == textBox) {
            cordova.plugins.Keyboard.disableScroll(false);
        }
    });

    this.toChars = function() {
        this.variants = this.variantsMap[this.chars.charCodeAt(0)];
        var variantChars = [];
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
        for (var i = this.charhistory.length; i--; i >= 0) {

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
});

angular.module('han').directive('codeConverter', function() {

    var base = 0;

    function getHexadecimal(chars) {
        return chars.charCodeAt(0).toString(16).toUpperCase();
    }

    function getDecimal(chars) {
        return chars.charCodeAt(0);
    }

    function toCharFromDecimal(code) {
        return String.fromCharCode(code);
    }

        function toCharFromHexadecimal(code) {
        return String.fromCharCode(parseInt(code, 16));
    }

    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attributes, ngModel) {

            if (attributes.codeConverter == 'decimal') {
                ngModel.$parsers.push(toCharFromDecimal);
                ngModel.$formatters.push(getDecimal);
            } else if (attributes.codeConverter == 'hexadecimal') {
                ngModel.$parsers.push(toCharFromHexadecimal);
                ngModel.$formatters.push(getHexadecimal);
            }
        }
    };
});

angular.module('han').directive('touchstartClick', function() {
    return function(scope, element, attributes) {

        element.on('touchstart', function(event) {
            scope.$apply(function() {
                scope.$eval(attributes.touchstartClick);
            });
            event.preventDefault();
        });

        element.on('click', function(event) {
            scope.$apply(function() {
                scope.$eval(attributes.touchstartClick);
            });
        });

        element.on('mousedown', function(event) {
            event.preventDefault(); // Prevent double click select text.
        });
    };
});

document.addEventListener('deviceready', function() {
    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

    document.addEventListener('resume', function() {
        cordova.plugins.clipboard.paste(function (text) {
            var scope = angular.element(document.body).scope();
            if (scope.main.previouslyPasted != text) {
              scope.main.chars = text;
              scope.main.previouslyPasted = text;
              scope.$apply();
            }
        });
    }, false);
}, false);
