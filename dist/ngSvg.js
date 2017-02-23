angular.module('ngSvg', [])

.constant('SVG_PATH', '/svg/')

.directive('ngSvg', ['$http', 'SVG_PATH', '$compile', function($http, SVG_PATH, $compile) {
	return {
		restrict: 'E',
		link: function(scope, el, attrs) {
			
			var showSVG = function(svgTemplate, svgScope, svgPath) {
				var newScope = scope.$new();
				
				angular.forEach(svgScope, function(value, key) {
					newScope[key] = value;
				});
				
				$http({
					method: 'GET',
					url: (typeof svgPath != 'undefined' ? svgPath : SVG_PATH)+svgTemplate+'.svg'
				}).then(
					function successCallback(response) {
						el.empty().append($compile(response.data)(newScope));
					},
					function errorCallback(response) {
						console.error(
							'Error : SVG file not found.',
							'File : '+svgTemplate
						);
					}
				);
			};
			
			scope.$watch(attrs.svgTemplate, function(svgTemplate) {
				showSVG(svgTemplate, scope.$eval(attrs.svgScope), scope.$eval(attrs.svgPath));
			}, true);
			
			scope.$watch(attrs.svgScope, function(svgScope) {
				showSVG(scope.$eval(attrs.svgTemplate), svgScope, scope.$eval(attrs.svgPath));
			}, true);
			
			scope.$watch(attrs.svgPath, function(svgPath) {
				showSVG(scope.$eval(attrs.svgTemplate), scope.$eval(attrs.svgScope), svgPath);
			}, true);
			
			return showSVG(scope.$eval(attrs.svgTemplate), scope.$eval(attrs.svgScope), scope.$eval(attrs.svgPath));
		}
	};
}]);