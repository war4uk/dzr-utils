var SwarmApp;
(function (SwarmApp) {
    var Pages;
    (function (Pages) {
        var MainPageCtrl = (function () {
            function MainPageCtrl() {
                this.test = "my test";
            }
            return MainPageCtrl;
        })();
        Pages.MainPageCtrl = MainPageCtrl;
    })(Pages = SwarmApp.Pages || (SwarmApp.Pages = {}));
})(SwarmApp || (SwarmApp = {}));
angular.module("myApp").controller("MainPageCtrl", SwarmApp.Pages.MainPageCtrl)
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/main', {
            templateUrl: 'views/main/main.template.html',
            controller: 'MainPageCtrl',
            controllerAs: 'ctrl'
        });
    }]);

//# sourceMappingURL=main.ctrl.js.map
