module SwarmApp.Pages {
	export interface IMainPageCtrl {
		checkCode(code: string): void;
		testPin(pin: string): void;
		forgetPin(): void;
		message: string;
		teamName: string;
		pin: string;
		loginMessage: string;
		prequelCOde: string;
		hasTookCode: boolean;
	}

	export class MainPageCtrl implements IMainPageCtrl {
		public message: string;
		public checkCode = (code: string) => {
			this.$http.get("/checkCode", { params: { code: code, pin: this.pin } })
				.then((res: any) => {
					if (!res.data.result) {
						if (!!res.data.tookTeam) {
							this.message = "Вас опередила команда " + res.data.tookTeam + ". УАХАХАХАХАХАХА!!!";
							return;
						}
						if (res.data.alreadyTookByYou) {
							this.message = "вы уже вводили этот код!";
							return;
						}

						this.message = "код не принят!";
					} else {
						this.message = "код принят!";
					}
				})
				.finally(() => {
					if (!!this.pin) {
						this.testPin(this.pin);
					}
				})
		};

		public teamName: string;
		public pin: string;
		public loginMessage: string;
		public prequelCOde: string;
		public hasTookCode: boolean;

		public forgetPin = () => {
			this.pin = null;
			this.hasTookCode = false;
			this.prequelCOde = "";
			this.$location.search('pin', '');
		};

		public testPin = (pin: string) => {
			this.loginMessage = "";
			this.$http.get("/checkPin", { params: { pin: pin } }).then((request: any) => {
				this.teamName = request.data.name;
				this.hasTookCode = request.data.hasTookCode;
				this.prequelCOde = request.data.prequelCOde;

				this.pin = pin;
				this.$location.search('pin', pin);
			}, () => {
				this.$location.search('pin', '');
				this.loginMessage = "неверный пин";
			})
		};

		public static $inject = ['$http', '$location'];
		constructor(private $http: angular.IHttpService, private $location: angular.ILocationService) {
			let pinInUrl = $location.search().pin;
			if (pinInUrl) {
				this.testPin(pinInUrl);
			}
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