module SwarmApp.Pages {

	export interface ITeam {
		Name: string,
		Code: string
	}
	export interface ICode {
		Value: string,
		IsTaken: boolean,
		NameOfTeamTook: string
	}

	export interface IAdminPageCtrl {
		getData(password: string): void
		reset(): void
		teams: ITeam[];
		codes: ICode[];
	}

	export class AdminPageCtrl implements IAdminPageCtrl {
		public getData = (password: string): void => {
			this.$http.get("/data", { params: { pass: password } })
			.then((response: any) => {
				console.dir(response);
				this.teams = response.data.Teams;
				this.codes = response.data.Codes;
			})
		}
		
		public reset = () => {
			this.$http.get("/reset").then(() => this.getData("test"));
		} 
		
		public teams: ITeam[];
		public codes: ICode[];
		
		public static $inject = ['$http'];
		constructor(private $http: angular.IHttpService) {
			this.getData("test");
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