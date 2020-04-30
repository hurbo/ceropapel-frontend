(function () {
  'use strict';

  angular.module('app.mailbox').controller('SearchController', SearchController);
  SearchController.$inject = [
    '$scope',
    '$state',
    '$stateParams',
    'swalFactory',
    'paginatorFactory',
    'filterFactory',
    'profileFactory',
    'socket'
  ];

  function SearchController(
    $scope,
    $state,
    $stateParams,
    swalFactory,
    paginatorFactory,
    filterFactory,
    Profile,
    socket) {
    var vm = this;
    vm.search = search;
    vm.filter = filterFactory;
    vm.selectedUsers = [];
    vm.selectedTo = [];
    vm.recipients = [];
    vm.contacts = [];

    vm.onRemoveTo = onRemoveTo;
    vm.loadEmails = loadEmails;
    vm.onSelectTo = onSelectTo;
    vm.searchOption = {
      boxFilter: 1,
      startDate: false,
      endDate: false,
      subject: '',
      folio: '',
      status: false,
      atencion: false,
      ft: false,
      importance: false,
      confidential: false
    };

    function _getContacts() {
      socket.emit('getContacts', {}, function (err, data) {

        vm.contacts = data;
      });
    }

    function _isEmail(email) {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }

    function onSelectTo(item, model) {
      if (_isEmail(item.email)) {
        var index = vm.contacts.indexOf(item);
        if (index >= 0) {
          vm.contacts.splice(index, 1);
        }
        item.needSign = false;
        vm.recipients.push(item);

      } else {
        swalFactory.error('Ingresa un correo electrónico válido');
        var index = vm.selectedTo.indexOf(item);
        if (index >= 0) vm.selectedTo.splice(index, 1);
      }
    }


    function loadEmails() {
      return vm.contacts;
    }

    function onRemoveTo(item, model) {
      vm.contacts.push(item);
      _removeFromListRecipients(item);
    }

    function _removeFromListRecipients(item) {

      vm.recipients.splice(vm.recipients.indexOf(item), 1);
    }




    function search() {

      // vm.searchOption = {
      //   boxFilter: 1,
      //   startDate: null,
      //   endDate: null,
      //   subject: null,
      //   folio: null,
      //   status: null,
      //   require: null,
      //   ft: null,
      //   importance: null,
      //   confidential: null
      // };
      var ft = '';
      for (let i = 0; i < vm.recipients.length; i++) {
        var element = vm.recipients[i];
        if (element.email !== vm.profile.email) {
          ft = ft + element.jobTitleID + '*';
        }
      }

      var params = {
        box: vm.searchOption.boxFilter,
        jt: ft,
        startDate: vm.searchOption.startDate,
        endDate: vm.searchOption.endDate,
        subject: vm.searchOption.subject,
        folio: vm.searchOption.folio,
        status: vm.searchOption.status,
        require: vm.searchOption,
        ft: vm.searchOption.ft,
        importance: vm.searchOption.importance,
        confidential: vm.searchOption.confidential,
        page: 1
      };

      $state.go('app.mailbox.search.page', params);

    }
    activate();

    function activate() {

      Profile.getProfile().then(function (profile) {
        vm.profile = profile;

        _getContacts();
      }, function (err) {
        console.error('Error addMember on getProfile', err);
      });



      vm.paginator = paginatorFactory;
      vm.paginator.init('search');


    }
  }
})();
