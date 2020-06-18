(function () {
  'use strict';

  angular
    .module('app.notifications')
    .factory('notificationsFactory', notificationsFactory);

  notificationsFactory.$inject = ['$rootScope', '$state', 'socket', 'swangular'];

  function notificationsFactory($rootScope, $state, socket, SweetAlert) {
    var notifications;

    $rootScope.$on('closeSesion', function () {
      SweetAlert.swal({
        title: 'Tu sesión ha expirado',
        type: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#DD2C57',
      });
      socket.emit('logout');
      $rootScope.auth.logout();
    });

    return {
      init: init,
      get: get,
      flips: flips,
      onRecibeNotification: onRecibeNotification,
      onRefreshNotification: onRefreshNotification,
      markAsRead: markAsRead,
      getNotifications: getNotifications
    };

    function init() {}

    function get(cb) {
      socket.emit('getNotifications', {}, function (err, _notifications) {
        notifications = _notifications;
        cb(err, notifications);
      });
    }

    function flips(cb) {
      socket.emit('flipNotification', {}, function (err, _notifications) {
        cb(err, _notifications);
      });
    }

    function onRecibeNotification(profileJT, cb) {
      socket.on('notifications-' + profileJT, cb);
    }

    function onRefreshNotification(profile, cb) {
      socket.on('refresh-notifications-' + profile.jobTitleID, cb);
    }

    function markAsRead(_notifications, cb) {
      socket.emit('readMutipleNotifications', {
        notifications: _notifications
      }, cb);
    }

    function getNotifications(cb) {
      socket.emit('getNotifications', {}, function (err, solve) {
        notifications = solve;
        cb(err, notifications);
      });
    }
  }
})();
