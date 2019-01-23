angular.module('han').directive('codeConverter', () => {

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
        link: (scope, element, attributes, ngModel) => {

            if (attributes.codeConverter === 'decimal') {
                ngModel.$parsers.push(toCharFromDecimal);
                ngModel.$formatters.push(getDecimal);
            } else if (attributes.codeConverter === 'hexadecimal') {
                ngModel.$parsers.push(toCharFromHexadecimal);
                ngModel.$formatters.push(getHexadecimal);
            }
        }
    };
});
