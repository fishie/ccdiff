angular.module('han', []);

document.addEventListener('deviceready', () => {
    if (!window.cordova)
        return;

    if (cordova.platformId === 'android') {
        StatusBar.backgroundColorByHexString("#4e4e4e");
        StatusBar.styleLightContent();
    }

    document.addEventListener('resume', () => {
        cordova.plugins.clipboard.paste((text) => {
            if (!(typeof text === 'string' && text.trim() !== '')) {
                return;
            }
            const scope = angular.element(document.body).scope();
            if (scope.main.previouslyPasted !== text) {
              scope.main.setChars(text);
              scope.main.previouslyPasted = text;
              scope.$apply();
            }
        });
    }, false);
}, false);
