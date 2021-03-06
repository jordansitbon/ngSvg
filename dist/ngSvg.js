angular.module('ngSvg', [])

.constant('SVG_PATH', '/svg/')

.directive('ngSvg', ['$http', 'SVG_PATH', '$compile', function($http, SVG_PATH, $compile) {
	var svg_caches = {};
	var svg_callbacks = {};
	
	var showSVG = function(svgTemplate, el, scope, svgScope, svgPath) {
		var newScope = scope.$new();
		
		angular.forEach(svgScope, function(value, key) {
			newScope[key] = value;
		});
		
		if (svg_callbacks[svgTemplate] == undefined)
			svg_callbacks[svgTemplate] = [];
		
		if (typeof svg_caches[svgTemplate] == 'undefined') {
			svg_caches[svgTemplate] = null;
			
			$http({
				method: 'GET',
				url: (typeof svgPath != 'undefined' ? svgPath : SVG_PATH)+svgTemplate+'.svg'
			}).then(
				function successCallback(response) {
					svg_caches[svgTemplate] = response.data;
					el.empty().append($compile(response.data)(newScope));
					
					angular.forEach(svg_callbacks[svgTemplate], function(callback, key) {
						if (typeof callback == 'function') {
							callback(response.data);
							svg_callbacks[svgTemplate].splice(key, 1);
						}
					});
				},
				function errorCallback(response) {
					console.error(
						'Error : SVG file not found.',
						'File : '+svgTemplate
					);
				}
			);
		} else if (svg_caches[svgTemplate] == null) {
			svg_callbacks[svgTemplate].push(function(svg_data) {
				el.empty().append($compile(svg_data)(newScope));
			});
		} else {
			el.empty().append($compile(svg_caches[svgTemplate])(newScope));
		}
	};
	
	return {
		restrict: 'E',
		link: function(scope, el, attrs) {
			scope.$watch(attrs.svgTemplate, function(svgTemplate) {
				showSVG(svgTemplate, el, scope, scope.$eval(attrs.svgScope), scope.$eval(attrs.svgPath));
			}, true);
			
			scope.$watch(attrs.svgScope, function(svgScope) {
				showSVG(scope.$eval(attrs.svgTemplate), el, scope, svgScope, scope.$eval(attrs.svgPath));
			}, true);
			
			scope.$watch(attrs.svgPath, function(svgPath) {
				showSVG(scope.$eval(attrs.svgTemplate), el, scope, scope.$eval(attrs.svgScope), svgPath);
			}, true);
			
			return showSVG(scope.$eval(attrs.svgTemplate), el, scope, scope.$eval(attrs.svgScope), scope.$eval(attrs.svgPath));
		}
	};
	
}]);