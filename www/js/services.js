angular.module('starter.services', [])

.service('AuthService', function($q) {
	
	this.userIsLoggedIn = function(){
		var deferred = $q.defer(),
		    authService = this,
		    isLoggedIn = (authService.getUser() !== null);

		deferred.resolve(isLoggedIn);

		return deferred.promise;
	};

	this.getUser = function(){
    	return firebase.auth().currentUser;
  	};

  	this.doLogin = function(user){
	    var deferred = $q.defer();

	    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
	    .catch((errors) => {
        	var errors_list = [],
            	error = {
              	code: errors.code,
              	msg: errors.message
            	};
        	errors_list.push(error);
        	deferred.reject(errors_list);
        })
	    .then((data) => {
	        deferred.resolve(data);
	    });
	    return deferred.promise;
	};

	this.doFacebookLogin = function(){
	    var deferred = $q.defer();

	    firebase.auth().signInWithPopup("facebook")
	    .catch((errors) => {

	        	var errors_list = [],
	            	error = {
	              		code: errors.code,
	              		msg: errors.message
	            	};
	        	errors_list.push(error);
	        	deferred.reject(errors_list);
	      	}) 
		.then((data) => {
	        	deferred.resolve(data);
	    });
	    return deferred.promise;
	};

	this.doSignup = function(user){
	    var deferred = $q.defer(),
	        authService = this;

	    firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
    	.catch((errors) => {
        	var errors_list = [],
            	error = {
              		code: errors.code,
              		msg: errors.message
            	};
        	errors_list.push(error);
        	deferred.reject(errors_list);
        })
      	.then((data) => {
      		firebase.database().ref('users/' + data.uid).set({
			    email: data.email,
			    id : data.uid,
			    created_at: new Date().getTime(),
			    groups: {
			    	no_group: true
			    }
			});
        	// After signup we should automatically login the user
        	authService.doLogin(user)
        	.then(function(data){
          		// success
          		deferred.resolve(data);
        	},function(err){
          	// error
          	deferred.reject(err);
        	});
    	});
    	return deferred.promise;
  	};

  	this.doLogout = function(){
    	firebase.auth().signOut();
  	};
})

.service('GroupService', function($q) {
	// /!\ Il faut aussi ajouter le groupe aux groupes de l'utilisateur
	this.createGroup = function(newGroup) {
		return firebase.database().ref('groups/').push().set({
		    name: newGroup.name,
		    description: newGroup.description,
		    members: {
		    	[firebase.auth().currentUser.uid]: true
		    }
		});
	}

	this.getUserGroups = function() {
		var userId = firebase.auth().currentUser.uid;
		var userGroupsId = firebase.database().ref('/users/' + userId + '/groups/').once('value').then((snapshot) => {
			var result = snapshot.val();
			debugger;
			return result;
		}).then((val) => {
			debugger;
		});
		debugger;
		return userGroupsId;
	}
})
;