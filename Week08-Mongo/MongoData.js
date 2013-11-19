/**
 * @author Charlie Calvert
 */

/* global angular */

angular.module('elvenApp', ['pres'])
.constant('CONFIG', {
    DB_NAME: 'elvenlab01',
    COLLECTION: 'address',
    API_KEY: 'qfSxFoUGHBA1EuUlqhux_op2fy6oF_wy'
})
.controller('MyController', function($scope, $http, presidents) {
    $scope.hint = "<p>Start with <strong>node server.js</strong> to retrieve JSON from Server</p>";
    
    // $scope.presidents = presidents;
    $scope.presidents = presidents.query({}, function(presidents) {
      $scope.presidentsLength = presidents.length;
      console.log($scope.presidentsLength);
    });
    
    
    $scope.addPresident = function() {
        var pres = new presidents({
            firstName: $scope.firstName,
            lastName: $scope.lastName,
            address: $scope.address,
            city: $scope.city,
            state: $scope.state,
            zip: $scope.zip,
            phoneHome: $scope.phoneHome,
            phoneMobile: $scope.phoneMobile,
            email: $scope.email
        });
        pres.$save(function(president, r) {
            $scope.presidents.push(president);
            $scope.presidentsLength = $scope.presidents.length;
        });
    };
    
    $scope.deleteRow = function() {
        var indexOfItemToDelete = $scope.indexOfItemToDelete;
        // if (indexOfItemToDelete < $scope.presidents.length) {}
        $scope.presidents[indexOfItemToDelete].remove(function(deletedObject, headers) {
            $scope.presidents.splice(indexOfItemToDelete, 1);
            $scope.presidentsLength = $scope.presidents.length;
        }, function(err) {
            console.log("error: " + err.data.message);  
        });
    };
    
    $scope.updateRow = function() {
        var indexOfItemToUpdate = $scope.indexOfItemToDelete;
        $scope.presidents[indexOfItemToUpdate].firstName = $scope.firstName;
        $scope.presidents[indexOfItemToUpdate].lastName = $scope.lastName;
        $scope.presidents[indexOfItemToUpdate].city = $scope.city;
        $scope.presidents[indexOfItemToUpdate].state = $scope.state;
        $scope.presidents[indexOfItemToUpdate].zip = $scope.zip;
        $scope.presidents[indexOfItemToUpdate].phoneHome = $scope.phoneHome;
        $scope.presidents[indexOfItemToUpdate].phoneMobile = $scope.phoneMobile;
        $scope.presidents[indexOfItemToUpdate].email = $scope.email;
        $scope.presidents[indexOfItemToUpdate].updateMe(function(data) {            
            console.log("success: " + data);
        }, function(err) {
            console.log("Error Status: " + err.status + ' ' + err.data.message);
        });  
    };
    
    $scope.indexChange = function() {        
        $scope.firstName = $scope.presidents[$scope.indexOfItemToDelete].firstName;
        $scope.lastName = $scope.presidents[$scope.indexOfItemToDelete].lastName;
        $scope.address = $scope.presidents[$scope.indexOfItemToDelete].address;
        $scope.city = $scope.presidents[$scope.indexOfItemToDelete].city;
        $scope.state = $scope.presidents[$scope.indexOfItemToDelete].state;
        $scope.zip = $scope.presidents[$scope.indexOfItemToDelete].zip;
        $scope.phoneMobile = $scope.presidents[$scope.indexOfItemToDelete].phoneMobile;
        $scope.phoneHome = $scope.presidents[$scope.indexOfItemToDelete].phoneHome;
        $scope.email = $scope.presidents[$scope.indexOfItemToDelete].email;
    };
});

angular.module('pres', ['ngResource'])
.factory('presidents', function($resource, CONFIG) {
	console.log('Presidents factory called');
	var Presidents = $resource(
        'https://api.mongolab.com/api/1/databases/' + CONFIG.DB_NAME + 
        '/collections/' + CONFIG.COLLECTION + '/:id', {      
        apiKey: CONFIG.API_KEY     
    },
    {
        update: {method:'PUT'}
    });

    Presidents.prototype.updateMe = function (callback, errorCallback) {
        console.log("update called");
        return Presidents.update(
            {id:this._id.$oid}, 
            angular.extend({}, this, {_id:undefined}), 
            callback, 
            errorCallback);
    };
    
    Presidents.prototype.getFirstName = function() {
      return this.firstName;
    };
    
    Presidents.prototype.getLastName = function() {
    	return this.lastName;
    };
    
    Presidents.prototype.address = function() {
    	return this.address;
    };
    
    Presidents.prototype.city = function() {
    	return this.city;
    };
    
    Presidents.prototype.state = function() {
    	return this.state;
    };
    
    Presidents.prototype.phoneMobile = function() {
    	return this.phoneMobile;
    };
    
    Presidents.prototype.phoneHome = function() {
    	return this.phoneHome;
    };
    
    Presidents.prototype.email = function() {
    	return this.phoneHome;
    };
    
    Presidents.prototype.remove = function (cb, errorcb) {
      return Presidents.remove({id:this._id.$oid}, cb, errorcb);
    };

    Presidents.prototype['delete'] = function (cb, errorcb) {
      return this.remove(cb, errorcb);
    };

    return Presidents;    
	 
	// return { a: 2 };		
});
