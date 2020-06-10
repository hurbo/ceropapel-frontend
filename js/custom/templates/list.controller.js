(function () {
  'use strict';

  angular.module('app.templates').controller('TemplatesListCtrl', TemplatesListCtrl);
  TemplatesListCtrl.$inject = ['$location', '$state', 'socket', 'swalFactory', 'paginatorFactory', 'filterFactory', 'profileFactory'];

  function TemplatesListCtrl($location, $state, socket, swalFactory, paginatorFactory, filterFactory, Profile) {
    var vm = this;
    vm.filter = filterFactory;
    vm.isOnCompose = false;

    vm.selectTemplate = selectTemplate;

    vm.deleteTemplate = deleteTemplate;
    vm.canEdit = canEdit;
    vm.canSave = canSave;
    vm._isOnCompose = _isOnCompose;
    vm.selectTemplatesToView = selectTemplatesToView;

    vm.profile = null;
    vm.paginator = null;
    vm.selectedTemplates = 'mostUsed';
    vm.templateToDelete = null;
    vm.hoveredTemplate = '';
    vm.templateName = '';
    vm.templatesByName = [];
    vm.viewingByName = false;
    vm.loadingTemplatesByName = false;



    vm.show = false;

    activate();

    function activate() {


      Profile.getProfile().then(function (profile) {
        vm.profile = profile;

        vm.paginator = paginatorFactory;
        vm.paginator.init('templates');
        vm.selectTemplatesToView('mostUsed');



      }, function (err) {
        console.error('Error addMember on getProfile', err);
      });

    }


    function deleteTemplate(id) {

      socket.emit('deleteTemplate', id, function (error, data) {
        if (!error) {
          vm.templates = data;
          $state.go('app.templates.list');
          swalFactory.success('Se eliminó una plantilla');
          vm.paginator.refreshPage();
        }
      });
    }

    function canEdit(item) {

      if ($state.current.name === 'app.templates.show') {
        return false;
      }
      if (vm.profile.roleID === 2 || vm.profile.roleID === 3) {
        return true;
      }
      if (item.authorID === vm.profile.id || item.jobTitleID === vm.profile.jobTitleID) {
        return true;
      }
      return false;
    }

    function canSave(item) {

      if ($state.current.name === 'app.templates.compose') {
        return true;
      } else {
        return canEdit(item);
      }
    }

    function selectTemplate(id) {
      $location.path('/app/templates/show/' + id);
      // console.log("El list cpontroller jala template");
      // socket.emit(
      //   'getTemplate', {
      //   id: id
      // },
      //   function (error, data) {
      //     console.log("error", error);
      //     console.log("Template LIST controller selecciono el ", data);
      //     vm.template = data;
      //   }
      // );
    }

    function _isOnCompose() {

      if ('app.templates.show' === $state.current.name) {
        return false;
      }
      return true;
    }

    function selectTemplatesToView(value) {

      vm.selectedTemplates = value;
      // vm.paginator.init('templates');
      vm.paginator.items = [];
      if (value === 'recent') {
        vm.paginator.init('templates');
      } else if (value === 'mostUsed') {
        vm.paginator.init('templatesMostUsed');
      }
    }



    vm.clearHoveredTemplate = clearHoveredTemplate;
    vm.setHoveredTemplate = setHoveredTemplate;
    vm.isTemplateHovered = isTemplateHovered;
    vm.visibleTemplates = visibleTemplates;
    vm.getPreviewImage = getPreviewImage;
    vm.getButtonStyle = getButtonStyle;
    vm.isLoading = isLoading;
    vm.selectTemplateToDelete = selectTemplateToDelete;
    vm.editTemplate = editTemplate;
    vm.viewTemplate = viewTemplate;
    vm.goToPage = goToPage;



    function goToPage(page) {
      $location.path('/app/templates/list/page/' + page.num);
    }
    function editTemplate(id) {
      $location.path('/app/templates/edit/' + id);
    }
    function viewTemplate(id) {
      $location.path('/app/templates/show/' + id);
    }


    function setHoveredTemplate(template) {
      vm.hoveredTemplate = template.id;
    }
    function selectTemplateToDelete(template) {
      vm.templateToDelete = template;
    }

    function clearHoveredTemplate(template) {

      vm.hoveredTemplate = '';
    }


    function isTemplateHovered(template) {

      return vm.hoveredTemplate && vm.hoveredTemplate === template.id;
    }


    function visibleTemplates() {

      if (vm.viewingByName) {
        return vm.templatesByName;
      }

      if (!vm.paginator) {
        return [];
      }

      return vm.paginator.items;
    }


    function getPreviewImage(template) {

      return 'data:image/png;base64, ' + (template.previewImage || '');
    }





    function getButtonStyle(button) {

      var mostUsedVisible = vm.selectedTemplates === 'mostUsed';
      var recentVisible = vm.selectedTemplates === 'recent';

      var selectedStyle = {
        background: 'transparent',
        color: '#3A6C82',
        border: 'none',
        'font-weight': 'bold',
        'font-size': '16px',
        'border-bottom': '7px solid #FB5450',
        'padding-bottom': '7px'
      };

      var unselectedStyle = {
        background: 'transparent',
        color: '#3A6C82',
        border: 'none',
        'font-weight': 'bold',
        'font-size': '16px',
        'padding-bottom': '14px'
      };

      if (button === 'mostUsed') {
        return mostUsedVisible ? selectedStyle : unselectedStyle;
      }

      if (button === 'recent') {
        return recentVisible ? selectedStyle : unselectedStyle;
      }
    }




    function isLoading() {

      if (vm.loadingTemplatesByName) {
        return true;
      }

      if (vm.paginator && vm.paginator.items.length) {
        return false;
      }

      return true;
    }

    vm.getTemplatesByName = getTemplatesByName;
    function getTemplatesByName(templateName) {



      var params = {
        name: templateName,
        secretariateID: vm.profile.secretariateID,
        authorID: vm.profile.id
      };

      if (params.name) {
        vm.loadingTemplatesByName = true;

        socket.emit('getTemplatesByName', params, function (error, result) {
          vm.loadingTemplatesByName = false;

          if (!error) {
            vm.templatesByName = result.items;
          }
        });
      } else {
        vm.loadingTemplatesByName = false;
        vm.viewingByName = false;
        vm.templatesByName = [];
      }
    }

  };
})();
