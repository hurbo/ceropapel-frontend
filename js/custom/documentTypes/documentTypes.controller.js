(function () {
    'use strict';

    angular
        .module('app.documentTypes')
        .controller('DocumentTypesController', DocumentTypesController);
    DocumentTypesController.$inject = [
        '$state',
        '$rootScope',
        'swalFactory',
        'profileFactory',
        'documentTypesFactory'
    ];

    function DocumentTypesController(
        $state,
        $rootScope,
        swalFactory,
        Profile,
        DocumentTypes
    ) {
        var vm = this;
        vm.showDetails = [];

        vm.changeShowDetails = changeShowDetails;




        active();

        function active() {

            Profile.getProfile().then(function (profile) {
                vm.profile = profile;
                if (vm.profile.roleID !== 3) {
                    swalFactory.error('No puedes acceder al contenido');
                    $state.go('app.mailbox.internal.in');
                    return;
                } else {

                    DocumentTypes.subscribe().then(function (init) {
                        if (!init) {

                            $rootScope.$on('refreshDocumentTypesView', function () {

                                DocumentTypes.reloadDocumentTypes(vm.profile, function (err, secretariates) {
                                    if (err) {
                                        console.error('Error reloadDocumentTypes', err);
                                    } else {
                                        vm.documentTypes = secretariates;
                                    }
                                });
                            });
                        }
                        DocumentTypes.getDocumentTypes(vm.profile, function (err, secretariates) {
                            if (err) {
                                console.error('Error getDocumentTypes', err);
                            } else {
                                vm.documentTypes = secretariates;
                            }
                        });
                    });

                }
            });
        }


        function changeShowDetails(item) {

            if (item) {
                var show = item.showJobTitles ? !item.showDetails : true;

                if (show && !item.jobTitlesSecretariateViewData) {

                    item.showJobTitles = true;
                    DocumentTypes.getJobTitlesBySecretariateID(item.id, function (error, jobTitles) {
                        if (error) {
                            console.error('error: getJobTitlesBySecretariateID', error);
                        } else {
                            item.jobTitlesSecretariateViewData = jobTitles;
                        }
                    });
                } else {

                    item.showJobTitles = show;
                }
            }

        }
    }
})();
