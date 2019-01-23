angular.module('han').directive('touchstartClick', () => {
    return (scope, element, attributes) => {

        element.on('touchstart', (event) => {
            scope.$apply(() => {
                scope.$eval(attributes.touchstartClick);
            });
            event.preventDefault();
        });

        element.on('click', (event) => {
            scope.$apply(() => {
                scope.$eval(attributes.touchstartClick);
            });
        });

        element.on('mousedown', (event) => {
            event.preventDefault(); // Prevent double click select text.
        });
    };
});
