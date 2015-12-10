module SwarmApp.Pages {
	export interface IMainPageCtrl {
		test: string;
	}

	export class MainPageCtrl implements IMainPageCtrl {
		public test = "my test";
	}
}

angular.module("myApp").controller("MainPageCtrl", SwarmApp.Pages.MainPageCtrl)
	.config(['$routeProvider', ($routeProvider: angular.route.IRouteProvider) => {
		$routeProvider.when('/main', {
			templateUrl: 'views/main/main.template.html',
			controller: 'MainPageCtrl',
			controllerAs: 'ctrl'
		});
	}]);