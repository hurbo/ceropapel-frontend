(function () {
  'use strict';

  angular.module('app.templates').controller('deleteTemplateComponentController', deleteTemplateComponentController);

  angular.module('app.templates').component('deleteTemplateComponent', {
    template: '<div ng-include="dtcmp.templateUrl">',
    bindings: {
      canEdit: '=',
      template: '='
    },
    controller: deleteTemplateComponentController,
    controllerAs: 'dtcmp'

  });


  deleteTemplateComponentController.$inject = [
    'paginatorFactory',
    'templatesFactory',
    '$uibModal',
    '$uibModalStack',
    '$rootScope',
    'swalFactory',
    'profileFactory'
  ];

  function deleteTemplateComponentController(
    paginatorFactory,
    templatesFactory,
    $uibModal,
    $uibModalStack,
    $rootScope,
    swalFactory,
    profile
  ) {
    var vm = this;
    vm.inbox = null;
    vm.templateUrl = 'views/templates/deleteTemplate.html';
    vm.open = open;
    vm.ok = ok;
    vm.setCurrentTemplate = setCurrentTemplate;




    vm.cancel = function () {
      $uibModalStack.dismissAll();
    };



    function open(size) {
      $uibModal.open({
        templateUrl: 'views/templates/deleteTemplateModal.html',
        controller: deleteTemplateComponentController,
        size: size
      });
    }

    function ok() {
      console.log("On delete template ", vm.currentTemplate);
      templatesFactory.deleteTemplate(vm.currentTemplate.id, function (err, data) {
        if (err) {
          swalFactory.error(err.message);
        } else {
          paginatorFactory.refreshPage();
          vm.cancel();
          swalFactory.success('Plantilla eliminada');
        }
      });

    }

    function setCurrentTemplate(template) {

      templatesFactory.setCurrentTemplate(template);
    }



    init();

    function init() {


      profile.getProfile().then(function (profile) {
        vm.currentTemplate = templatesFactory.getCurrentTemplate();
        vm.profile = profile;
        vm.canDelete = false;
        if (vm.profile.roleID === 3 && vm.currentTemplate) {
          vm.canDelete = true;
        } else if (vm.currentTemplate && vm.profile.roleID === 2 && vm.currentTemplate.secretariateID === vm.profile.secretariateID) {
          vm.canDelete = true;
        } else if (vm.currentTemplate && vm.profile.roleID === 1 && vm.currentTemplate.jobTitleID === vm.profile.jobTitleID) {
          vm.canDelete = true;
        }



      });

    }


  }

}());
