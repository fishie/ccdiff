angular.module('han', []);

document.addEventListener('deviceready', () => {
    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

    document.addEventListener('resume', () => {
        cordova.plugins.clipboard.paste((text) => {
            const scope = angular.element(document.body).scope();
            if (scope.main.previouslyPasted != text) {
              scope.main.chars = text;
              scope.main.previouslyPasted = text;
              scope.$apply();
            }
        });
    }, false);
}, false);
