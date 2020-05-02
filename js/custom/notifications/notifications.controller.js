(function () {
  'use strict';

  angular
    .module('app.notifications')
    .controller('NotificationsController', NotificationsController);
  NotificationsController.$inject = ['socket', '$rootScope', '$state', 'notificationsFactory', 'swalFactory', 'profileFactory', 'ExternalsFactory', 'paginatorFactory'];

  function NotificationsController(socket, $rootScope, $state, Notifications, swalFactory, Profile, Externals, paginatorFactory) {
    var vm = this;
    vm.notifications = [];
    vm.readNotification = readNotification;
    vm.goNotification = goNotification;
    vm.getClassCheck = getClassCheck;
    vm.clickCheckbox = clickCheckbox;
    vm.getClassCheckMaster = getClassCheckMaster;
    vm.clickCheckboxMaster = clickCheckboxMaster;
    vm.showButtonMarkAsRead = showButtonMarkAsRead;
    vm.markAsRead = markAsRead;
    vm.currentPath = null;

    vm.onInternal = onInternal;
    vm.onExternalArchived = onExternalArchived;
    vm.onInternalArchived = onInternalArchived;
    vm.onExternal = onExternal;
    vm.onHome = onHome;
    vm.logOut = logOut;

    vm.getCurrentUser = getCurrentUser;
    vm.changeUser = changeUser;

    var notificationsMarked = [];

    active();


    vm.setOrigin = false;
    vm.onSinaloa = false;
    vm.originSinaloa = originSinaloa;

    function logOut() {
      $rootScope.auth.logout();
      $state.go('auth.login');
    }

    function originSinaloa() {
      if (vm.setOrigin) {
        return vm.onSinaloa;
      }
      if (window.location.origin.indexOf('http://localhost:3000') !== -1 || window.location.origin.indexOf('https://ceropapel.sinaloa.gob.mx') !== -1) {
        vm.setOrigin = true;
        vm.onSinaloa = true;
        return true;
      } else {
        vm.setOrigin = true;
        vm.onSinaloa = false;
        return false;
      }

    }


    function getCurrentUser() {
      return Externals.getCurrentUser();
    }

    function changeUser(user) {
      vm.currentUser = user;
      Externals.setCurrentUser(user);
    }



    function onHome() {
      return $state.current.name.indexOf('app.info') !== -1;
    }

    function onExternal() {
      return $state.current.name.indexOf('app.mailbox.external') !== -1 && $state.current.name.indexOf('app.mailbox.external.archived') === -1;
    }

    function onInternalArchived() {
      return $state.current.name.indexOf('app.mailbox.internal.archived') !== -1;
    }

    function onExternalArchived() {
      return $state.current.name.indexOf('app.mailbox.external.archived') !== -1;
    }

    function onInternal() {
      return $state.current.name.indexOf('app.mailbox.internal') !== -1 && $state.current.name.indexOf('app.mailbox.internal.archived') === -1;
    }

    $rootScope.$on('reloadCount', function () {
      _getCount();
      console.log('reloadCount from notifications controller');
    });



    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
      console.log('stateChangeSuccess notification');
      vm.currentPath = toState.title;
    });


    function getClassCheck(id) {
      if (notificationsMarked.indexOf(id) >= 0) {
        return 'checked all';
      }
      return '';
    }

    function clickCheckbox(id) {
      var index = notificationsMarked.indexOf(id);
      if (index >= 0) {
        notificationsMarked.splice(index, 1);
      } else {
        notificationsMarked.push(id);
      }
    }

    function getClassCheckMaster() {
      var nmrCount = notificationsMarked.length;
      var nCount = vm.notifications.length;
      if (nmrCount === nCount) {
        return 'checked all';
      } else if (nmrCount < nCount && nmrCount > 0) {
        return 'checked middle';
      } else {
        return '';
      }
    }

    function clickCheckboxMaster() {
      var nmrCount = notificationsMarked.length;
      var nCount = vm.notifications.length;
      notificationsMarked = [];
      if (nmrCount !== nCount) {
        for (var i = 0; i < vm.notifications.length; i++) {
          notificationsMarked.push(vm.notifications[i].id);
        }
      }
    }

    function showButtonMarkAsRead(who) {
      return who === getClassCheckMaster().split(' ')[1];
    }


    function getMarkedNotifications() {
      var solve = [];
      for (let i = 0; i < vm.notifications.length; i++) {
        var element = vm.notifications[i];
        if (element.selected) {
          solve.push(element);
        }

      }
      return solve;
    }

    function markAsRead() {
      var data = getMarkedNotifications();
      Notifications.markAsRead(data, function (err, result) {
        notificationsMarked = [];
        _getCount();
      });
    }

    function readNotification(data) {
      Notifications.markAsRead([data], function (err, result) {
        _getCount();
      });
    }


    function goNotification(notification) {


      paginatorFactory.refreshPage();

      switch (notification.type) {
        case 'updateDraft':

          $state.go('app.mailbox.internal.drafts', {
            id: notification.documentID
          });
          break;
        case 'showDraft':

          $state.go('app.mailbox.internal.drafts', {
            id: notification.documentID
          });

          break;
        case 'deleteDraft':

          $state.go('app.mailbox.internal.drafts');
          break;
        case 'newDraft':

          $state.go('app.mailbox.internal.drafts', {
            id: notification.documentID
          });
          break;
        case 'needCancel':

          $state.go('app.mailbox.internal.in.view', {
            mid: notification.documentID,
            inboxID: notification.inboxID
          });

          break;
        case 'aceptCancel':

          $state.go('app.mailbox.internal.out.view', {
            mid: notification.documentID,
            inboxID: notification.inboxID
          });

          break;
        case 'rejectCancel':

          $state.go('app.mailbox.internal.out.view', {
            mid: notification.documentID,
            inboxID: notification.inboxID
          });

          break;
        case 'needEdit':

          $state.go('app.mailbox.internal.in.view', {
            mid: notification.documentID,
            inboxID: notification.inboxID
          });

          break;
        case 'rejectEdit':

          $state.go('app.mailbox.internal.in.view', {
            mid: notification.documentID,
            inboxID: notification.inboxID
          });

          break;


        case 'externalNewDocument':

          $state.go('app.mailbox.external.in.view', {
            jobTitle: notification.jobTitleID,
            mid: notification.documentID,
            inboxID: notification.inboxID
          });

          break;
        case 'newDocument':



          if (vm.profile && vm.profile.jobTitleID === notification.jobTitleID) {
            $state.go('app.mailbox.internal.in.view', {
              mid: notification.documentID,
              inboxID: notification.inboxID
            });
          } else {
            $state.go('app.mailbox.external.in.view', {
              jobTitle: notification.jobTitleID,
              mid: notification.documentID,
              inboxID: notification.inboxID
            });
          }


          break;
        case 'canceledDocument':

          $state.go('app.mailbox.internal.out.view', {
            mid: notification.documentID,
            inboxID: notification.inboxID
          });

          break;
        case 'changeStatus':

          $state.go('app.mailbox.internal.in.view', {
            mid: notification.documentID,
            inboxID: notification.inboxID
          });

          break;
        case 'rejectedDocument':

          $state.go('app.mailbox.internal.out.view', {
            mid: notification.documentID,
            inboxID: notification.inboxID
          });

          break;
        case 'rejectedDocument':

          $state.go('app.mailbox.internal.out.view', {
            mid: notification.documentID,
            inboxID: notification.inboxID
          });

          break;

        default:
          break;
      }
    }

    function active() {

      if (!vm.currentPath) {
        vm.currentPath = $state.current.title;
      }
      vm.notificationsCount = 0;
      Profile.getProfile().then(function (profile) {

        vm.profile = profile;

        Profile.subcribeNotifications().then(function (init) {
          if (!init) {

            $rootScope.$on('updateProfile', function () {

              Profile.getProfile().then(function (profile) {
                vm.profile = profile;
              });
            });



            socket.on('updateProfile-' + vm.profile.id, function () {

              Profile.reloadProfile().then(function (profileNew) {

                vm.profile = profileNew;
                active();

              });
            });




          }
        });







        _getCount();


        Notifications.onRecibeNotification(profile.jobTitleID, function (notifications) {


          paginatorFactory.refreshPage();

          let notification = notifications[0];

          switch (notification.type) {
            case 'canCancel':
              vm.notifications.unshift(notification);
              swalFactory.success(notification.message);
              break;

            case 'deleteDraft':


              if ($state.current.name === 'app.mailbox.internal.draft' && $state.params.id === notification.documentID) {

                $state.go('app.mailbox.internal.drafts');
              }
              vm.notifications.unshift(notification);
              swalFactory.success(notification.message);
              break;



            case 'showDraft':
              // if (vm.profile.notificationPreferences.canEdit) {
              vm.notifications.unshift(notification);
              swalFactory.success(notification.message);
              // } else {
              //   readNotification(notification);
              // }
              break;
            case 'canEdit':
              // if (vm.profile.notificationPreferences.canEdit) {
              vm.notifications.unshift(notification);
              swalFactory.success(notification.message);
              // } else {
              //   readNotification(notification);
              // }
              break;
            case 'rejectCancel':
              // if (vm.profile.notificationPreferences.canEdit) {
              vm.notifications.unshift(notification);
              swalFactory.success(notification.message);
              // } else {
              //   readNotification(notification);
              // }
              break;
            case 'extras':
              // if (vm.profile.notificationPreferences.extras) {
              vm.notifications.unshift(notification);
              swalFactory.success(notification.message);
              // } else {
              //   readNotification(notification);
              // }
              break;
            case 'needCancel':
              // if (vm.profile.notificationPreferences.needCancel) {
              vm.notifications.unshift(notification);
              swalFactory.success(notification.message);
              // } else {
              //   readNotification(notification);
              // }
              break;
            case 'needEdit':
              // if (vm.profile.notificationPreferences.needEdit) {
              vm.notifications.unshift(notification);
              swalFactory.success(notification.message);
              // } else {
              //   readNotification(notification);
              // }
              break;
            case 'newDocument':
              // if (vm.profile.notificationPreferences.newDocument) {
              vm.notifications.unshift(notification);
              swalFactory.success(notification.message);
              // } else {
              //   readNotification(notification);
              // }
              break;
            case 'externalNewDocument':
              // if (vm.profile.notificationPreferences.newDocument) {
              vm.notifications.unshift(notification);
              swalFactory.success(notification.message);
              // } else {
              //   readNotification(notification);
              // }
              break;
            case 'canceledDocument':
              // if (vm.profile.notificationPreferences.newDocument) {
              vm.notifications.unshift(notification);
              swalFactory.success(notification.message);
              // } else {
              //   readNotification(notification);
              // }
              break;
            case 'rejectedDocument':
              // if (vm.profile.notificationPreferences.newDocument) {
              vm.notifications.unshift(notification);
              swalFactory.success(notification.message);
              // } else {
              //   readNotification(notification);
              // }
              break;

            default:
              vm.notifications.unshift(notification);
              swalFactory.success(notification.message);
          }
          _getCount();
        });

        Notifications.onRefreshNotification(profile, function (notification) {
          _getCount();
        });





        Externals.getUsers(function (err, users) {
          if (!err) {
            vm.users = users;
            vm.currentUser = Externals.getCurrentUser();
            for (var i = 0; i < users.length; i++) {
              var user = users[i];
              var canShowNotification = false;
              Notifications.onRecibeNotification(user.jobTitle, function (notification) {
                paginatorFactory.refreshPage();
                switch (notification.type) {
                  case 'canCancel':
                    if (vm.profile.notificationPreferences.canCancel) {
                      canShowNotification = true;
                    }
                    break;
                  case 'canEdit':
                    if (vm.profile.notificationPreferences.canEdit) {
                      canShowNotification = true;
                    }
                    break;
                  case 'extras':
                    if (vm.profile.notificationPreferences.extras) {
                      canShowNotification = true;
                    }
                    break;
                  case 'needCancel':
                    if (vm.profile.notificationPreferences.needCancel) {
                      canShowNotification = true;
                    }
                    break;
                  case 'needEdit':
                    if (vm.profile.notificationPreferences.needEdit) {
                      canShowNotification = true;
                    }
                    break;
                  case 'newDocument':
                    if (vm.profile.notificationPreferences.newDocument) {
                      canShowNotification = true;
                    }
                    break;
                }
                if (canShowNotification) {
                  vm.notifications.unshift(notification);
                  swalFactory.success(notification.message, 'Recibido en bandeja de externos');
                }
              });
            }
          }
        });
      }, function (err) {
        console.error('Error addMember on getProfile', err);
      });



    }

    function _getCount() {
      console.log("get count");
      Notifications.get(function (err, notifications) {
        vm.notifications = notifications;
        vm.notificationsCount = vm.notifications.length;
        if (vm.profile) {
          for (let i = 0; i < vm.notifications.length; i++) {
            if (vm.notifications[i].jobTitleID.toString() !== vm.profile.jobTitleID.toString()) {
              vm.notifications[i].header = '[Bandeja de externos] ' + vm.notifications[i].header;
            }
          }
        }
      });
      Notifications.flips(function (err, notifications) {


        vm.flipNotification = notifications;
        if (vm.profile) {
          for (let i = 0; i < vm.flipNotification.length; i++) {
            if (vm.flipNotification[i].jobTitleID.toString() !== vm.profile.jobTitle.id.toString()) {
              vm.flipNotification[i].header = '[Bandeja de externos] ' + vm.flipNotification[i].header;
            }
          }
        }
      });
    }
  }
})();
