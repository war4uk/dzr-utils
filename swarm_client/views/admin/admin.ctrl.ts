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
        dzrCode: string;
    }

    export class AdminPageCtrl implements IAdminPageCtrl {
        public getData = (password: string): angular.IPromise<any> => {
            return this.$http.get("/data", { params: { pass: password } })
                .then((response: any) => {
                    console.dir(response);
                    this.teams = response.data.Teams;
                    this.codes = response.data.Codes;
                    this.dzrCode = response.data.dzrCode;
                })
        }

        public pass: string;
        public dzrCode: string;

        public reset = () => {
            if (window.confirm("Сбросить данные о взятии ВСЕХ кодов?")) {
                this.$scope.$applyAsync(() => {
                    this.$http.get("/reset", { params: { pass: this.pass }})
                        .then(() => this.getData(this.pass));
                });
            }
        }

        public saveAll = () => {
            this.$http.post("/saveData", {
                Teams: this.teams.filter((team) => !!team.Code && !!team.Name),
                Codes: this.codes.filter((code) => !!code.Value),
                dzrCode: this.dzrCode
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

        public static $inject = ['$http', '$location', '$scope'];
        constructor(private $http: angular.IHttpService, private $location: angular.ILocationService, private $scope: ng.IScope) {
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