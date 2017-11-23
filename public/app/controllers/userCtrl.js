angular.module('userControllers', ['userServices'])
    .controller('regCtrl', function($http, $location, $timeout, User) {
        
        var app = this;

        this.regUser = function(regData) {
            //console.log('submit');
            //console.log(this.regData);
            app.errorMsg = false;
            app.loading = true;
            User.create(app.regData).then(function(data) {
                //console.log(data.data.success);
                //console.log(data.data.message);
                if(data.data.success){
                    app.successMsg = data.data.message + '....Redirecting Now';
                    app.loading = false;
                    $timeout(function() {
                        $location.path('/');
                    }, 2000);
                } else {
                    app.errorMsg = data.data.message;
                    app.loading = false;
                }
            })
        }
    });

