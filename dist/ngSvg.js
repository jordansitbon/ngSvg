angular.module('ngSvg', [])

.constant('SVG_PATH', '/svg/')

.directive('ngSvg', ['$http', 'SVG_PATH', '$compile', function($http, SVG_PATH, $compile) {
	return {
		restrict: 'E',
		link: function(scope, el, attrs) {
			
			var showSVG = function(svgTemplate, svgScope) {
				var newScope = scope.$new();
				
				angular.forEach(svgScope, function(value, key) {
					newScope[key] = value;
				});
				
				$http({
					method: 'GET',
					url: SVG_PATH+svgTemplate+'.svg'
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
				
				console.log(svgTemplate, svgScope);
			};
			
			scope.$watch(attrs.svgTemplate, function(svgTemplate) {
				showSVG(svgTemplate, scope.$eval(attrs.svgScope));
			}, true);
			
			scope.$watch(attrs.svgScope, function(svgScope) {
				showSVG(scope.$eval(attrs.svgTemplate), svgScope);
			}, true);
			
			return showSVG(scope.$eval(attrs.svgTemplate), scope.$eval(attrs.svgScope));
		}
	};
}]);