module SwarmApp.Pages {
	export interface IMainPageCtrl {
		checkCode(code: string): void;
		message: string;
	}

	export class MainPageCtrl implements IMainPageCtrl {
		public message: string;
		public checkCode = (code: string) => {
			this.$http.get("/checkCode", { params: { code: code } })
			.then(((res: any) => {
				if (res.data.result) {
					this.message = "код принят!";
				} else {
					this.message = "код  НЕ принят!";
				}
			})
		};

		public static $inject = ['$http'];
		constructor(private $http: angular.IHttpService) {
		}
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