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
		getData(password: string): void;
		reset(): void;
		saveAll(): void;
		testPassword(pass: string): void;
		teams: ITeam[];
		codes: ICode[];
		pass: string;
	}

	export class AdminPageCtrl implements IAdminPageCtrl {
		public getData = (password: string): angular.IPromise<any> => {
			return this.$http.get("/data", { params: { pass: password } })
				.then((response: any) => {
					console.dir(response);
					this.teams = response.data.Teams;
					this.codes = response.data.Codes;
				})
		}

		public pass: string;

		public reset = () => {
			this.$http.get("/reset").then(() => this.getData(this.pass));
		}

		public saveAll = () => {
			this.$http.post("/saveData", {
				Teams: this.teams.filter((team) => !!team.Code && !!team.Name),
				Codes: this.codes.filter((code) => !!code.Value)
			}, { params: { pass: this.pass } })
				.catch(() => window.alert('not saved!'))
				.finally(() => this.getData(this.pass));
		}

		public testPassword = (pass: string) => {
			this.getData(pass).then(() => {
				this.$location.search('pass', pass);
				this.pass = pass;
			}, () => {
				this.$location.search('pass', '');
				window.alert('Неверный пароль!')
			});
		}

		public teams: ITeam[];
		public codes: ICode[];

		public static $inject = ['$http', '$location'];
		constructor(private $http: angular.IHttpService, private $location: angular.ILocationService) {
			let passInUrl = $location.search().pass;
			if (passInUrl) {
				this.testPassword(passInUrl);
			}
		}
	}
}

angular.module("myApp").controller("AdminPageCtrl", SwarmApp.Pages.AdminPageCtrl)
	.config(['$routeProvider', ($routeProvider: angular.route.IRouteProvider) => {
		$routeProvider.when('/admin', {
			templateUrl: 'views/admin/admin.template.html',
			controller: 'AdminPageCtrl',
			controllerAs: 'ctrl',
			reloadOnSearch: false
		});
	}]);