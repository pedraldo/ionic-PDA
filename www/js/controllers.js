angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, AuthService) {
  firebase.auth().onAuthStateChanged(function(user) {
    $scope.isLoggedIn = !!user;
  });

  // // With the new view caching in Ionic, Controllers are only called
  // // when they are recreated or on app start, instead of every page change.
  // // To listen for when this page is active (for example, to refresh data),
  // // listen for the $ionicView.enter event:
  // //$scope.$on('$ionicView.enter', function(e) {
  // //});

  // // Form data for the login modal
  // $scope.loginData = {};

  // // Create the login modal that we will use later
  // $ionicModal.fromTemplateUrl('templates/auth/login.html', {
  //   scope: $scope
  // }).then(function(modal) {
  //   $scope.modal = modal;
  // });

  // // Triggered in the login modal to close it
  // $scope.closeLogin = function() {
  //   $scope.modal.hide();
  // };

  // // Open the login modal
  // $scope.login = function() {
  //   $scope.modal.show();
  // };

  // // Perform the login action when the user submits the login form
  // $scope.doLogin = function() {
  //   console.log('Doing login', $scope.loginData);

  //   // Simulate a login delay. Remove this and replace with your login
  //   // code if using a login system
  //   $timeout(function() {
  //     $scope.closeLogin();
  //   }, 1000);
  // };
})

.controller('PlaylistsCtrl', function($scope, $http) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];

  headers = {'X-Auth-Token': 'c9040d10a01d42e6b18db5ca4887697d'} 
  url = "http://api.football-data.org/v1/competitions/?season=2016"

  $http.get(url, {
    headers: headers
  }).success(function(response) {
    $scope.competitions = response
  });
})

.controller('PlaylistCtrl', function($scope, $stateParams, $http) {
  $scope.competitionId = $stateParams.competitionId;
  $scope.currentMatchDay = $stateParams.currentMatchDay;
})

.controller('leagueRankingCtrl', function($scope, $stateParams, $http) {
  $scope.competitionId = $stateParams.competitionId;
  $scope.currentMatchDay = $stateParams.currentMatchDay;
  headers = {'X-Auth-Token': 'c9040d10a01d42e6b18db5ca4887697d'}; 
  urlRanking = "http://api.football-data.org/v1/competitions/" + $scope.competitionId + "/leagueTable";

  $http.get(urlRanking, {
    headers: headers
  }).then(function(response) {
    $scope.leagueTable = response.data;
  });
})

.controller('leagueFixtureCtrl', function($scope, $stateParams, $http, $q) {
  $scope.competitionId = $stateParams.competitionId;
  $scope.currentMatchDay = $stateParams.currentMatchDay;
  $scope.matchDayDisplayed = $scope.currentMatchDay;
  $scope.isFirstMatchDay = $scope.matchDayDisplayed === 1;
  headers = {'X-Auth-Token': 'c9040d10a01d42e6b18db5ca4887697d'}; 

  updateMatchDay($scope.matchDayDisplayed);
  const nbMatchDay = getNumberOfMatchDay();
  $scope.isLastMatchDay = $scope.matchDayDisplayed === nbMatchDay;

  function updateMatchDay() {
    urlFixture = "http://api.football-data.org/v1/competitions/" + $scope.competitionId + "/fixtures?matchday=" + $scope.matchDayDisplayed;

    $http.get(urlFixture, { headers: headers }).then((response) => {
      $scope.nbTeam = 2*response.data.count;
      const fixturesPromises = response.data.fixtures.map((fixture) => {
        var homeUrl = fixture._links.homeTeam.href;
        var awayUrl = fixture._links.awayTeam.href;

        var homePromise = $http.get(homeUrl, { headers: headers }).then((response) => {
          return response.data.crestUrl;
        });

        var awayPromise = $http.get(awayUrl, { headers: headers }).then((response) => {
          return response.data.crestUrl;
        });

        return $q.all([homePromise, awayPromise]).then((values) => {
          fixture.homeCrest = values[0];
          fixture.awayCrest = values[1];
          return fixture;
        });
      });
      return $q.all(fixturesPromises);
    }).then((fixtures) => {
      $scope.leagueFixtures = fixtures;
    });
  }

  function getNumberOfMatchDay() {
    return (2*$scope.nbTeam - 2);
  }

  $scope.previousMatchDay = function() {
    if ($scope.matchDayDisplayed > 1) {
      $scope.matchDayDisplayed--;
    }
    updateMatchDay();
  }

  $scope.nextMatchDay = function() {
    var maxMatchDay = getNumberOfMatchDay();
    if ($scope.matchDayDisplayed < maxMatchDay) {
      $scope.matchDayDisplayed--;
    }
    updateMatchDay();
  }
})

.controller('LogInCtrl', function($scope, $state, AuthService, $ionicLoading) {
  $scope.login = function(user) {
    $ionicLoading.show({
      template: 'Logging in ...'
    });

    AuthService.doLogin(user)
    .then(function(user){
      // success
      $state.go('app.user');
      $ionicLoading.hide();
    },function(err){
      // error
      $scope.errors = err;
      $ionicLoading.hide();
    });
  };

  $scope.facebookLogin = function(){
    $ionicLoading.show({
      template: 'Logging in with Facebook ...'
    });

    AuthService.doFacebookLogin()
    .then(function(user){
      // success
      $state.go('app.user');
      $ionicLoading.hide();
    },function(err){
      // error
      $scope.errors = err;
      $ionicLoading.hide();
    });
  };
})

.controller('SignUpCtrl', function($scope, $state, AuthService, $ionicLoading) {
  $scope.signup = function(user){
    $ionicLoading.show({
      template: 'Signing up ...'
    });

    AuthService.doSignup(user)
    .then(function(user){
      // success
      $state.go('app.user');
      $ionicLoading.hide();
    },function(err){
      // error
      $scope.errors = err;
      $ionicLoading.hide();
    });
  };
})

.controller('UserCtrl', function($scope, $state, AuthService){
  $scope.current_user = {};

  var current_user = AuthService.getUser();

  if (current_user && current_user.provider == "facebook") {
    $scope.current_user.email = current_user.facebook.displayName;
    $scope.current_user.image = current_user.facebook.profileImageURL;
  } else {
    $scope.current_user.email = current_user.email;
    $scope.current_user.image = current_user.profileImageURL;
  }

  $scope.logout = function(){
    AuthService.doLogout();

    $state.go('auth.login');
  };
})

.controller('GroupsCtrl', function($scope, $ionicModal, $state, GroupService) {
  $ionicModal.fromTemplateUrl('templates/modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.createGroup = function(newGroup) {
    GroupService.createGroup(newGroup);
    $state.go('app.groups');
  }

  $scope.userGroups = GroupService.getUserGroups();
})
;
