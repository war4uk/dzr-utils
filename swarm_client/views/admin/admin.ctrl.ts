module SwarmApp.Pages {
	export interface SwarmConfig {
		Teams: {
			Name: string, 
			Code: string
		}, 
		Codes: {
			Value: string, 
			IsTaken: boolean,
			NameOfTeamTook: string
		}[]
	}
	
	export interface IAdminPageCtrl {
		getData(password: string): void
	}

	export class AdminPageCtrl implements IAdminPageCtrl {
		public getData = (password: string): void => {
			this.$http.get("/").then((response) => {
				console.dir(response);
			})
		}
		
		public static $inject = ['$http'];
		constructor(private $http: angular.IHttpService) {
			this.getData("ff");
		}
	}
}

angular.module("myApp").controller("AdminPageCtrl", SwarmApp.Pages.AdminPageCtrl)
	.config(['$routeProvider', ($routeProvider: angular.route.IRouteProvider) => {
		$routeProvider.when('/admin', {
			templateUrl: 'views/admin/admin.template.html',
			controller: 'AdminPageCtrl',
			controllerAs: 'ctrl'
		});
	}]);