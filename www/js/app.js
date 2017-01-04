// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'firebase', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $rootScope, $state, AuthService) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    AuthService.userIsLoggedIn().then((response) => {
      if (response === true) {
        $state.go('app.playlists');
      } else {
        $state.go('auth.login');
      }
    });

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  // UI Router Authentication Check
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
    if (toState.data.authenticate) {
      AuthService.userIsLoggedIn().then((response) => {
        if(response === false) {
          event.preventDefault();
          $state.go('auth.login');
        }
      });
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('auth', {
    url: '/auth',
    abstract: true,
    templateUrl: 'templates/app/menu.html',
    controller: 'AppCtrl'
  })

  .state('auth.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/auth/login.html',
        controller: 'LogInCtrl'
      }
    },
    data: {
      authenticate: false
    }
  })

  .state('auth.signup', {
    url: '/signup',
    views: {
      'menuContent': {
        templateUrl: 'templates/auth/signup.html',
        controller: 'SignUpCtrl'
      }
    },
    data: {
      authenticate: false
    }
  })

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/app/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.user', {
    url: '/user',
    views: {
      'menuContent': {
        templateUrl: 'templates/app/user.html',
        controller: 'UserCtrl'
      }
    },
    data: {
      authenticate: true
    }
  })

  .state('app.groups', {
    url: '/groups',
    views: {
      'menuContent': {
        templateUrl: 'templates/app/groups.html',
        controller: 'GroupsCtrl'
      }
    },
    data: {
      authenticate: true
    }
  })

  .state('app.group', {
    url: '/groups/:groupId',
    views: {
      'menuContent': {
        templateUrl: 'templates/app/group.html',
        controller: 'GroupCtrl'
      }
    },
    data: {
      authenticate: true
    }
  })

  .state('app.playlists', {
    url: '/playlists',
    views: {
      'menuContent': {
        templateUrl: 'templates/app/playlists.html',
        controller: 'PlaylistsCtrl'
      }
    },
    data: {
      authenticate: false
    }
  })

  .state('app.single', {
    url: '/playlists/:competitionId/:currentMatchDay',
    views: {
      'menuContent': {
        templateUrl: 'templates/app/playlist.html',
        controller: 'PlaylistCtrl'
      }
    },
    data: {
      authenticate: false
    }
  })

  .state('app.ranking', {
    url: '/playlists/:competitionId/:currentMatchDay/ranking',  
    views: {
      'menuContent': {
        templateUrl: 'templates/app/leagueRanking.html',
        controller: 'leagueRankingCtrl'
      }
    },
    data: {
      authenticate: false
    }
  })

  .state('app.leagueFixture', {
    url: '/playlists/:competitionId/:currentMatchDay/fixture',
    views: {
      'menuContent': {
        templateUrl: 'templates/app/leagueFixture.html',
        controller: 'leagueFixtureCtrl'
      }
    },
    data: {
      authenticate: false
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/playlists');
});
