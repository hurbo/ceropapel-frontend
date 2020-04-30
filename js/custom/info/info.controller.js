(function () {
  'use strict';

  angular.module('app.info').controller('InfoController', InfoController);
  InfoController.$inject = [
    '$window',
    'profileFactory',
    'InfoFactory'
  ];

  function InfoController(
    $window,
    Profile,
    InfoFactory
  ) {
    var vm = this;
    vm.goTo = goTo;
    vm.changeUser = changeUser;


    activate();

    function activate() {

      Profile.getProfile().then(function (profile) {
        vm.profile = profile;
        if (vm.profile.permissions && vm.profile.permissions[0]) {
          vm.currentUser = vm.profile.permissions[0];
          getBossCount();
        }
        if (vm.profile.jobTitleID) {
          getNumbers(profile);
        }
      }, function (err) {
        console.error('Error addMember on getProfile', err);
      });
    }



    function getNumbers(profile) {
      InfoFactory.getsinLeer(profile, function (err, contador) {
        vm.sinLeerCount = contador[0].count;

      });
      InfoFactory.getsinFirmar(profile, function (err, contador) {
        vm.sinFirmarCount = contador[0].count;

      });
      InfoFactory.getpendientes(profile, function (err, contador) {
        vm.pendientesCount = contador[0].count;

      });
      InfoFactory.getcolaboracionSinFirmar(profile, function (err, contador) {
        vm.colaboracionSinFirmarCount = contador[0].count;

      });
      InfoFactory.getcolaboracionPendientes(profile, function (err, contador) {
        vm.colaboracionPendientesCount = contador[0].count;

      });
      InfoFactory.getenviadosSinLeer(profile, function (err, contador) {
        vm.enviadosSinLeerCount = contador[0].count;

      });
      InfoFactory.getenviadosSinFirmar(profile, function (err, contador) {
        vm.enviadosSinFirmarCount = contador[0].count;

      });
      InfoFactory.getenviadosEnColaboracionSinFirmar(profile, function (err, contador) {
        vm.enviadosEnColaboracionSinFirmarCount = contador[0].count;

      });
      InfoFactory.getenviadosPendientes(profile, function (err, contador) {
        vm.enviadosPendientesCount = contador[0].count;

      });

      InfoFactory.getborradores(profile, function (err, contador) {
        vm.borradoresCount = contador[0].count;

      });
    }

    function changeUser(boss) {
      vm.currentUser = boss;
      getBossCount();
    }

    function getBossCount() {
      InfoFactory.getexternosTurnados({
        profile: vm.profile,
        currentUser: vm.currentUser
      }, function (err, contador) {
        vm.externosTurnadosCount = contador[0].count;

      });
      InfoFactory.getexternosSinLeer({
        profile: vm.profile,
        currentUser: vm.currentUser
      }, function (err, contador) {
        vm.externosSinLeerCount = contador[0].count;

      });
      InfoFactory.getexternosSinFirmar({
        profile: vm.profile,
        currentUser: vm.currentUser
      }, function (err, contador) {
        vm.externosSinFirmarCount = contador[0].count;

      });
    }



    function goTo(name) {

      switch (name) {
        case 'sinLeer':
          $window.location.href = $window.location.href.replace('/Inicio', '/mailbox/internal/in/filter/false/false/false/false/true/false/false/false/false/false//page/1');

          break;
        case 'sinFirmar':
          $window.location.href = $window.location.href.replace('/Inicio', '/mailbox/internal/in/filter/false/true/false/false/false/false/true/false/false/false//page/1');

          break;
        case 'pendientes':
          $window.location.href = $window.location.href.replace('/Inicio', '/mailbox/internal/in/filter/true/false/false/false/false/false/false/false/false/false//page/1');

          break;
        case 'colaboracionSinFirmar':
          $window.location.href = $window.location.href.replace('/Inicio', '/mailbox/internal/collaboration/filter/false/true/false/false/false/false/true/false/false/false//page/1');

          break;
        case 'colaboracionPendientes':
          $window.location.href = $window.location.href.replace('/Inicio', '/mailbox/internal/collaboration/filter/true/false/false/false/false/false/false/false/false/false//page/1');

          break;
        case 'enviadosSinLeer':
          $window.location.href = $window.location.href.replace('/Inicio', '/mailbox/internal/out/filter/false/false/false/false/true/false/false/false/false/false//page/1');

          break;
        case 'enviadosSinFirmar':
          $window.location.href = $window.location.href.replace('/Inicio', '/mailbox/internal/out/filter/false/true/false/false/false/false/true/false/false/false//page/1');

          break;
        case 'enviadosEnColaboracionSinFirmar':

          break;
        case 'enviadosPendientes':

          break;
        case 'externosSinLeer':
          $window.location.href = $window.location.href.replace('/Inicio', `/mailbox/external/in/${vm.currentUser.bossJobTitleID}/filter/false/false/false/false/true/false/false/false/false/false//page/1`);
          break;
        case 'externosSinFirmar':
          $window.location.href = $window.location.href.replace('/Inicio', `/mailbox/external/in/${vm.currentUser.bossJobTitleID}/filter/false/true/false/false/false/false/true/false/false/false//page/1`);

          break;
        case 'externosTurnados':
          $window.location.href = $window.location.href.replace('/Inicio', `/mailbox/external/turned/${vm.currentUser.bossJobTitleID}`);

          break;
        case 'borradores':
          $window.location.href = $window.location.href.replace('/Inicio', '/mailbox/internal/drafts');
          break;

        default:
          break;
      }
    }

  }
})();
