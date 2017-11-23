angular.module('mainController', ['authServices'])

// Controller: mainCtrl is used to handle login and main index functions (stuff that should run on every page)  
.controller('mainCtrl', function(Auth, $timeout, $location, $rootScope) {
    //console.log('testing');

    var app = this;
    app.loadMe  = false;

    $rootScope.$on('$routeChangeStart', function() {
        if (Auth.isLoggedIn()) {
            console.log('user logged in');
            app.isLoggedIn = true;
            Auth.getUser().then(function(data) {
                console.log(data.data.username);
                app.username = data.data.username;
                app.email = data.data.email;
                app.password = data.data.password;
                app.loadMe = true;
            })
        } else {
            console.log('user not logged in');
            app.isLoggedIn = false;
            app.username = '';
            app.email = '';
            app.loadMe = true;
        };    
    });

    this.doLogin = function(loginData) {
        //console.log('submit');
        //console.log(this.loginData);
        app.errorMsg = false;
        app.loading = true;

        Auth.login(app.loginData).then(function(data) {
            //console.log(data.data.success);
            //console.log(data.data.message);
            if(data.data.success){
                app.successMsg = data.data.message + '....Redirecting Now';
                app.loading = false;
                $timeout(function() {
                    $location.path('/about');
                    app.loginData = '';
                    app.successMsg = false;
                }, 2000);
            } else {
                //console.log('fail');                    
                app.errorMsg = data.data.message;
                app.loading = false;
            }
        });
    };

    this.logout = function() {
        Auth.logout();
        $location.path('/logout');
        
        $timeout(function() {
            $location.path('/');
        }, 2000);
    };
});