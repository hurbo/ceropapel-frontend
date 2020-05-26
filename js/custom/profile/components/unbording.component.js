(function () {
    'use strict';

    angular.module('app.profile').controller('unbordingComponentController', unbordingComponentController);

    angular.module('app.profile').component('unbordingComponent', {
        template: '<div ng-include="ucmp.templateUrl">',
        bindings: {
            user: '='
        },
        controller: unbordingComponentController,
        controllerAs: 'ucmp'

    });


    angular.module('app.profile').controller('unbordingFormComponentController', unbordingFormComponentController);



    unbordingFormComponentController.$inject = [
        '$state',
        '$rootScope',
        '$uibModal',
        '$uibModalStack',
        'swalFactory',
        'permissionFactory',
        'profileFactory'
    ];







    function unbordingFormComponentController(
        $state,
        $rootScope,
        $uibModal,
        $uibModalStack,
        swalFactory,
        permissionFactory,
        profileFactory

    ) {
        var vm = this;
        vm.cancel = cancel;

        vm.isLoading = false;
        vm.unbordingForm = {
            name: '',
            rfc: '',
            key: null,
            cer: null,
            keyUpdatedAt: null,
            cerUpdatedAt: null
        };

        vm.showCerInput = false;
        vm.showKeyInput = false;

        vm.rfcPattern = '^([A-ZÑ\x26]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1]))([A-Z\d]{3})?$';
        vm.updateForm = updateForm;

        vm.flagsLoading = {
            fullLoadin: false,
            key: false,
            cer: false,
            profile: false
        };

        function cancel() {
            $uibModalStack.dismissAll();
        }

        initForm();

        function initForm() {
            console.log("Init form");
            vm.isLoading = true;
            vm.showCerInput = true;
            vm.showKeyInput = true;
            profileFactory.getProfile().then(function (profile) {
                vm.profile = profile;
                vm.unbordingForm.name = vm.profile.name;
                vm.unbordingForm.rfc = vm.profile.rfc;
                vm.unbordingForm.keyUpdatedAt = vm.profile.keyUpdatedAt;
                vm.unbordingForm.cerUpdatedAt = vm.profile.cerUpdatedAt;
                vm.showKeyInput = vm.profile.keyUpdatedAt ? false : true;
                vm.showCerInput = vm.profile.cerUpdatedAt ? false : true;


                vm.isLoading = false;


            });
        }




        function updateForm() {
            console.log("On updateform");
            vm.flagsLoading = {
                fullLoadin: true,
                key: false,
                cer: false,
                profile: true
            }
            if (vm.unbordingForm.key) {
                console.log("actualiza el key");
                vm.flagsLoading.key = true;
                uploadKey();
            }
            if (vm.unbordingForm.cer) {
                console.log("actualiza el cer");
                vm.flagsLoading.cer = true;
                uploadCer();
            }
            updateProfile();

        }


        function uploadCer() {
            vm.flagsLoading.cer = true;
            var file = vm.unbordingForm.cer._file;
            console.log("file", file);
            var params = {
                file: file
            };
            profileFactory.uploadCer(params, function (err, profile) {
                console.log("Se actualizo el certificado cambia bandera de cer");
                this.flagsLoading.cer = false;
            });
        }

        function uploadKey() {
            vm.flagsLoading.key = true;
            var file = vm.unbordingForm.key._file;
            console.log("file", file);
            var params = {
                file: file
            };
            profileFactory.uploadKey(params, function (err, profile) {
                console.log("Se actualizo el certificado cambia bandera de key");
                this.flagsLoading.key = false;
            });
        }


        function updateProfile() {
            console.log("uploadProfileFromUnbording profile");
            vm.flagsLoading.profile = true;
            var params = {
                profile: vm.profile,
                name: vm.unbordingForm.name,
                rfc: vm.unbordingForm.rfc
            };

            profileFactory.uploadProfileFromUnbording(params).then(function (profile) {
                console.log("Se actualizo el certificado cambia bandera de profile");
                vm.flagsLoading.profile = false;
            });


        }




    }










    unbordingComponentController.$inject = [
        '$state',
        '$rootScope',
        '$uibModal',
        '$uibModalStack',
        'swalFactory',
        'permissionFactory',
        'profileFactory'
    ];

    function unbordingComponentController(
        $state,
        $rootScope,
        $uibModal,
        $uibModalStack,
        swalFactory,
        permissionFactory,
        profileFactory

    ) {
        var vm = this;
        vm.inbox = null;
        vm.profile = null;
        vm.templateUrl = 'views/profile/components/unbording.html';
        vm.open = open;
        vm.cancel = cancel;
        vm.isLoading = false;
        vm.unbordingForm = {
            name: '',
            rfc: '',
            key: null,
            cer: null,
            keyUpdatedAt: null,
            cerUpdatedAt: null
        };



        function cancel() {
            $uibModalStack.dismissAll();
        };


        function open(size) {
            $uibModal.open({
                templateUrl: 'views/profile/components/unbordingModal.html',
                controller: unbordingFormComponentController,
                size: size
            });
        }


        init();

        function init() {
            console.log("init unbordinf component controller");
            vm.isLoading = true;
            profileFactory.getProfile().then(function (profile) {
                vm.profile = profile;

                vm.unbordingForm.name = vm.profile.name;
                vm.unbordingForm.keyUpdatedAt = vm.profile.keyUpdatedAt;
                vm.unbordingForm.cerUpdatedAt = vm.profile.cerUpdatedAt;
                if (!vm.profile.jobTitleID) {
                    $state.go('app.profile');
                    console.log("unbording component profile cambia la bandera", profile);
                    open('lg');
                }
                vm.isLoading = false;


            });
        }




    }

}());
