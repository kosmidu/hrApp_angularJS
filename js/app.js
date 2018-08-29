// create the module and name it hrApp
var hrApp = angular.module('hrApp', ['ngRoute']);

/*var employee =
    [
        {
            "id": 2,
            "firstName": "Helen",
            "lastName": "Doe",
            "birthDate": "1921-07-16",
            "address": {
                "city": "Volos",
                "country": "Greece",
                "street": "Zachou",
                "streetNumber": "61",
                "zipCode": "38333"
            },
            "email": "user@example.com",
            "phoneNumber": "6999999999",
            "department": {
                "id": 10,
                "name": "afse",
                "address": {
                    "city": "Volos",
                    "country": "Greece",
                    "street": "Ritsou",
                    "streetNumber": "27",
                    "zipCode": "38888"
                }
            },
            "salary": 8976.55,
            "joinDate": "1964-02-16"
        },
        {
            "id": 3,
            "firstName": "Mara",
            "lastName": "Doe",
            "birthDate": "1921-07-16",
            "address": {
                "city": "Volos",
                "country": "Greece",
                "street": "Zachou",
                "streetNumber": "61",
                "zipCode": "38333"
            },
            "email": "user@example.com",
            "phoneNumber": "6999999999",
            "department": {
                "id": 30,
                "name": "afse",
                "address": {
                    "city": "Volos",
                    "country": "Greece",
                    "street": "Ritsou",
                    "streetNumber": "27",
                    "zipCode": "38888"
                }
            },
            "salary": 8976.55,
            "joinDate": "1964-02-16"
        },
        {
            "id": 4,
            "firstName": "Sara",
            "lastName": "Doe",
            "birthDate": "1921-07-16",
            "address": {
                "city": "Volos",
                "country": "Greece",
                "street": "Zachou",
                "streetNumber": "61",
                "zipCode": "38333"
            },
            "email": "user@example.com",
            "phoneNumber": "6999999999",
            "department": {
                "id": 34,
                "name": "afse",
                "address": {
                    "city": "Volos",
                    "country": "Greece",
                    "street": "Ritsou",
                    "streetNumber": "27",
                    "zipCode": "38888"
                }
            },
            "salary": 8976.55,
            "joinDate": "1964-02-16"
        },
        {
            "id": 1,
            "firstName": "Laura",
            "lastName": "Mendes",
            "birthDate": "1988-03-13",
            "address": {
                "city": "Athens",
                "country": "Greece",
                "street": "Panormou",
                "streetNumber": "86",
                "zipCode": "178765"
            },
            "email": "ma@fdg.com",
            "phoneNumber": "6999999999",
            "department": {
                "id": 24,
                "name": "afse",
                "address": {
                    "city": "Volos",
                    "country": "Greece",
                    "street": "Ritsou",
                    "streetNumber": "27",
                    "zipCode": "38888"
                }
            },
            "salary": 900.5,
            "joinDate": "1999-07-25"
        }
    ];*/

// configure our routes
hrApp.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        // route for the home page
        .when('/', {
            templateUrl: 'templates/home.tpl.html',
            controller: 'mainController'
        })

        // route for the about page
        .when('/employees/create', {
            templateUrl: 'templates/employees/createOrUpdate.tpl.html',
            controller: 'createOrUpdateEmployeeController'
        })

        // route for the about page
        .when('/employees/all', {
            templateUrl: 'templates/employees/showAll.tpl.html',
            controller: 'showAllEmployeesController'
        })

        // route for the contact page
        .when('/employees/details', {
            templateUrl: 'templates/employees/show.tpl.html',
            controller: 'showEmployeeController'
        })

        // route for the about page
        .when('/departments/create', {
            templateUrl: 'templates/departments/createOrUpdate.tpl.html',
            controller: 'createOrUpdateDepartmentController'
        })

        // route for the about page
        .when('/departments/all', {
            templateUrl: 'templates/departments/showAll.tpl.html',
            controller: 'showAllDepartmentsController'
        })

        // route for the contact page
        .when('/departments/details', {
            templateUrl: 'templates/departments/show.tpl.html',
            controller: 'showDepartmentController'
        })

    $locationProvider.html5Mode(true);
});

hrApp.service('redirectService', function () {
    var service = this;
    var storedId = null;

    service.setId = function (id) {
        storedId = id;
    }
    service.getId = function () {
        var id = storedId;
        storedId = null;
        return id;
    };
});

// create the controller and inject Angular's $scope
hrApp.controller('mainController', function ($scope) {
    // create a message to display in our view
    $scope.message = 'Home sweet home';
});

hrApp.controller('createOrUpdateEmployeeController', function ($scope, $http, $location, redirectService) {
    $scope.message = 'Create or Update Employee';

    $scope.employee = {}
    $scope.cities = {}
    $scope.countries = {}

    $scope.id = redirectService.getId();
    $http.get('http://localhost:8080/hr/rest/department/')
    .success(function (response) {
        $scope.departments = response;
    });
    
    $http.get('http://localhost:8080/hr/rest/employee/' + $scope.id)
    .success(function (response) {
        $scope.employee = response;
        $scope.GetSelectedCountry();
    });

    $http.get('http://localhost:8080/hr/rest/location/')
    .success(function (response) {
        $scope.countries = response;
    });
    $scope.GetSelectedCountry = function () {
        $http.get('http://localhost:8080/hr/rest/location/' + $scope.employee.address.country + '/cities')
        .success(function (response) {
            $scope.cities = response;
        });
    };

    var onSuccess = function (data, status, headers, config) {
        alert('Employee saved successfully');
    };

    var onError = function (data, status, headers, config) {
        alert('Error occured');
    };

    // $scope.Save = function () {
    //     $http.post('http://localhost:8080/hr/rest/employee/', {employee: $scope.employee},{headers: {'Content-Type': 'application/json'}})
    //         .success(onSuccess)
    //         .error(onError);
    // };

    $scope.Save = function () {
        if ($scope.employee.id == null) {
            $scope.employee.salary = Number($scope.employee.salary);
            $http({
                method: 'POST',
                url: "http://localhost:8080/hr/rest/employee/",
                headers: { 'Content-Type': 'application/json' },
                dataType: 'json',
                data: $scope.employee
            }).
                success(function (data, status, headers, config) {
                    alert("Employee has created Successfully!");
                    $location.path('/');
                }).
                error(function (data, status, headers, config) {
                    alert("Error while creating new employee. Try Again");
                });
        } else {
           // $http PUT function
           $scope.employee.salary = Number($scope.employee.salary);
                $http({
                    method: 'PUT',
                    url: 'http://localhost:8080/hr/rest/employee/',
                    data: $scope.employee

                }).then(function successCallback(response) {

                    alert("Employee has updated Successfully");
                    $location.path('/');

                }, function errorCallback(response) {

                    alert("Error while updating employee. Try Again!");

                });
        }
    };

});

//all employees
hrApp.controller('showAllEmployeesController', function ($scope, $location, redirectService, $http) {
    $scope.message = 'Show All Employees';
    // $scope.employees = employee;
    $http.get('http://localhost:8080/hr/rest/employee/').success(function (response) {
        $scope.employees = response;
    });
    $scope.goTo = function (id) {
        redirectService.setId(id);
        $location.path('/employees/details');
    };
    // $scope.toRemove = function(id){
    //     //redirectService.setId(id);
    //     // $http.delete('http://localhost:8080/hr/rest/employee/' + $scope.id).success(function (response) {
    //     //     $scope.employee = response;
    //     // });
    // }

    //Delete User
    $scope.toRemove = function (id) {
        //redirectService.setId(id);
        //$http DELETE function
        $http({
            method: 'DELETE',
            url: 'http://localhost:8080/hr/rest/employee/' + id

        }).then(function successCallback(response) {

            alert("User has deleted Successfully");
            $scope.employee = response;
            $location.path('/');

        }, function errorCallback(response) {

            alert("Error while deleting user. Try Again!");

        });
    };

    //Update User
    $scope.toEdit = function (id) {
        redirectService.setId(id);
        $location.path('/employees/create');
    };
});

//details
hrApp.controller('showEmployeeController', function ($scope, redirectService, $http) {
    $scope.message = 'Show Employee';
    $scope.id = redirectService.getId();
    $http.get('http://localhost:8080/hr/rest/employee/' + $scope.id).success(function (response) {
        $scope.employee = response;
    });
    // $scope.employee = employee[$scope.id];
});

hrApp.controller('createOrUpdateDepartmentController', function ($scope) {
    $scope.message = 'Create or Update Department';
});

hrApp.controller('showAllDepartmentsController', function ($scope) {
    $scope.message = 'Show All Departments';
});

hrApp.controller('showDepartmentController', function ($scope) {
    $scope.message = 'Show Department';
});