(function () {
  'use strict';

  angular.module('app.mailbox').controller('selectTemplateComponentController', selectTemplateComponentController);

  angular.module('app.mailbox').component('selectTemplateComponent', {
    template: '<div ng-include="stcmp.templateUrl">',
    bindings: {
      folder: '='
    },
    controller: selectTemplateComponentController,
    controllerAs: 'stcmp'

  });


  selectTemplateComponentController.$inject = [
    '$q',
    '$uibModal',
    '$uibModalStack',
    'swalFactory',
    'templatesFactory',
    'composeFactory',
    'profileFactory'
  ];

  function selectTemplateComponentController(
    $q,
    $uibModal,
    $uibModalStack,
    swalFactory,
    templatesFactory,
    composeFactory,
    profileFactory
  ) {
    var vm = this;
    vm.setPage = setPage;

    vm.filterByName = false;
    vm.name = '';
    vm.commonBox = false;
    vm.topBox = false;




    vm.pager = {
      pages: [],
      currentPage: 1,
      totalPages: 1
    }







    vm.folderToEdit = false;
    vm.templateUrl = 'views/mailbox/components/selectTemplate.html';
    vm.ok = ok;
    vm.open = open;
    vm.cancel = cancel;
    vm.setTemplate = setTemplate;
    vm.setTemplateToCompose = setTemplateToCompose;
    vm.summernoteOptions = {
      lang: "es-MX",
      defaultFontName: "Helvetica",
      height: 700,
      toolbar: [],
      disableResizeEditor: true
    };

    vm.selectTemplatesToView = selectTemplatesToView;


    vm.numPages = 1;



    function selectTemplatesToView(box, name) {
      vm.loading = true;
      vm.box = box;
      vm.name = name;
      setPage(1);

    }


    function setPage(page) {

      vm.loading = true;
      var data = {
        secretariateID: vm.profile.secretariateID,
        jobTitleID: vm.profile.jobTitleID,
        box: vm.box,
        name: vm.name,
        page: page
      };
      vm.currentPage = page;

      switch (data.box) {
        case 'mostUsed':

          templatesFactory.getTemplatesMostUsedPag(data).then(function (pageData) {
            vm.templates = pageData.items;
            vm.numPages = pageData.numPages;

            setPager();
            vm.loading = false;
          });
          break;
        case 'recent':

          templatesFactory.getTemplatesPag(data).then(function (pageData) {
            vm.templates = pageData.items;
            vm.numPages = pageData.numPages;


            setPager();
            vm.loading = false;
          });
          break;
        case 'name':

          break;
      }



    }




    function setPager() {

      vm.pager = {
        pages: [],
        currentPage: vm.currentPage,
        totalPages: vm.numPages
      }
      for (let i = 1; i <= vm.numPages; i++) {
        vm.pager.pages.push(i);
      }

    }


    function setTemplate(targen) {

      vm.loading = true;
      templatesFactory.getTemplateById(targen.id).then(function (current) {
        vm.currentTemplate = current;
        vm.isTemplateVisible = true;
        vm.loading = false;
      });
    }


    function setTemplateToCompose(targen) {

      vm.loading = true;
      composeFactory.setTemplate(targen);
      cancel();
    }






    function ok() {
      swalFactory.error('Agrega nombre a la carpeta');
      return;
    }



    function cancel() {
      $uibModalStack.dismissAll();
    }


    function open(size) {
      $uibModal.open({
        templateUrl: 'views/mailbox/components/selectTemplateModal.html',
        controller: selectTemplateComponentController,
        size: size
      });
    }



    _init();

    function _init() {
      vm.loading = true;
      let defer = $q.defer();


      profileFactory.getProfile().then(function (profile) {
        vm.profile = profile;

        vm.currentTemplate = null;
        vm.isTemplateVisible = false;

        selectTemplatesToView('mostUsed', null);
        defer.resolve();

      });
      return defer.promise;

    }




















    vm.setHoveredTemplate = setHoveredTemplate;
    vm.getPreviewImage = getPreviewImage;
    vm.isTemplateHovered = isTemplateHovered;
    vm.clearHoveredTemplate = clearHoveredTemplate;


    function setHoveredTemplate(template) {
      vm.hoveredTemplate = template.id;
    }


    function getPreviewImage(template) {

      return 'data:image/png;base64, ' + (template.previewImage || '');
    }


    function isTemplateHovered(template) {

      return vm.hoveredTemplate && vm.hoveredTemplate === template.id;
    }

    function clearHoveredTemplate(template) {

      vm.hoveredTemplate = '';
    }



  }

}());
