(function () {
  "use strict";

  angular
  .module("app.mailbox"
  ).controller("NewMailComposerController", NewMailComposerController);

  NewMailComposerController.$inject = ["swalFactory", "profileFactory"];

  function NewMailComposerController(swalFactory, Profile) {
    var vm = this;
    vm.loading = true;
    vm.profile = null;

    vm.Step = {
      FILL_DATA: 'FILL_DATA',
      FILL_SEND_DATA: 'FILL_SEND_DATA',
      REVIEW_DATA: 'REVIEW_DATA'
    };


    init();

    function init() {
      vm.loading = true;
      Profile.getProfile().then(profile => {
        vm.profile = profile;
        console.log("weeep",vm.profile);
        vm.loading = false;
      });
    }
  }
})();


