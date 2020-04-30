(function () {
  'use strict';

  angular
    .module('app.notifications')
    .factory('notificationsFactory', notificationsFactory);

  notificationsFactory.$inject = ['$rootScope', 'socket', 'SweetAlert'];

  function notificationsFactory($rootScope, socket, SweetAlert) {
    var notifications;


    $rootScope.$on('closeSesion', function () {

      SweetAlert.swal({
        title: 'Tu sesión ha expirado',
        type: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#DD2C57',

      });
      setTimeout(function () {
        window.location.href = '/logOut';
      }, 1500);


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
      var data = {
        notifications: _notifications
      };
      socket.emit('readMutipleNotifications', data, cb);
    }

    function getNotifications(cb) {
      socket.emit('getNotifications', {}, function (err, solve) {
        notifications = solve;
        cb(err, notifications);
      });
    }
  }
})();
