(function () {
    'use strict';

    angular.module('app.documentTypes').controller('addDocumentTypeComponentController', addDocumentTypeComponentController);

    angular.module('app.documentTypes').component('addDocumentTypeComponent', {
        template: '<div ng-include="addtcmp.templateUrl">',
        controller: addDocumentTypeComponentController,
        bindings: {
            data: '=',
            profile: '=',

        },
        controllerAs: 'addtcmp'

    });


    addDocumentTypeComponentController.$inject = [
        '$uibModal',
        '$uibModalStack',
        'swalFactory',
        'documentTypesFactory',
        '$rootScope'
    ];

    function addDocumentTypeComponentController(
        $uibModal,
        $uibModalStack,
        swalFactory,
        documentTypesFactory,
        $rootScope
    ) {
        var vm = this;
        vm.inbox = null;
        vm.templateUrl = 'views/documentTypes/addDocumentType.html';
        vm.open = open;
        vm.ok = ok;
        vm.setData = setData;
        vm.currentDocumentType = null;



        function setData(data) {
            documentTypesFactory.setDocumentType(data);
        }

        vm.cancel = function () {
            $uibModalStack.dismissAll();
        };


        function open(size) {

            $uibModal.open({
                templateUrl: 'views/documentTypes/addDocumentTypeModal.html',
                controller: addDocumentTypeComponentController,
                size: size
            });
        }

        function ok(newDocumentType) {

            vm.currentDocumentType = documentTypesFactory.getDocumentType();

            var newData = {
                name: newDocumentType.name,
                acronym: newDocumentType.acronym
            };





            documentTypesFactory.createDocumentType(newData, function (err, solve) {



                if (vm.currentDocumentType) {

                    $rootScope.$broadcast('refreshSecretariatesView');
                    vm.cancel();
                    swalFactory.success('Se agregó nuevo puesto');
                } else {

                    $rootScope.$broadcast('refreshSecretariatesView');
                    vm.cancel();
                    swalFactory.success('Se agregó nueva área');
                }
            });

        }




    }

}());