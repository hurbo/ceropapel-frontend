(function () {
    "use strict";




    angular.module('app.mailbox').component('composeDocumentTourComponent', {
      template: '<div ng-include="cdtc.templateUrl">',
      bindings: {
        tour: '='
      },
      controller: composeDocumentTourComponentController,
      controllerAs: 'cdtc'
    });




    angular.module("app.mailbox").controller("composeDocumentTourComponentController", composeDocumentTourComponentController);
    composeDocumentTourComponentController.$inject = [
        "$http",
        "$q",
        "$scope",
        "$state",
        "$rootScope",
        "socket",
        "swalFactory",
        "nzTour"
    ];

    function composeDocumentTourComponentController(
        $http,
        $q,
        $scope,
        $state,
        $rootScope,
        socket,
        swalFactory,
        nzTour
    ) {
        var vm = this;

        vm.templateUrl = 'views/mailbox/components/composeDocumentTour.html';
        vm.tourSelectTemplate = tourSelectTemplate;



        vm.setTour = setTour;

        function setTour(){
            switch (vm.tour) {
                case 1:
                    tourSelectTemplate();
                break;

            }
        }

        function tourSelectTemplate() {

            var tour = new Tour({
                template:
                    "<div class='popover tour'> \
                <div class='arrow'></div> \
                <h3 class='popover-title principal' style='color : #fafafa'></h3> \
                <div class='popover-content'></div> \
                <nav class='popover-navigation'> \
                <div class='btn-group'> \
                <button class='btn btn-default' data-role='prev'>" +
                    "Anterior" +
                    "</button> \
                <button class='btn btn-default' data-role='next'>" +
                    "Siguiente" +
                    "</button> \
                </div> \
                <button class='btn btn-default' data-role='end'>" +
                    "Salir" +
                    "</button> \
                </nav> \
                </div>",
                debug: false,
                storage: false,
                backdrop: true,













                steps: [
                    {
                        element: "#formComposeDocument",
                        title: "Seleccionar una plantilla",
                        content: "Desde aquí se seleccionan plantillas para crear oficios de cero papel.",
                        placement: "top",

                        onNext: function (tour) {
                            // $state.go("app.mailbox.in");
                        }
                    },

                    {
                        element: "#mostUsedTemplates",
                        title: "Aquí se encuentran tus plantillas mas utilizadas",
                        content:
                            "Al dar click aquí se mostraran solamente las platillas que has utilizado con mayor frecuencia.",
                        placement: "right",
                        onPrev: function (tour) {
                            // $state.go("app.info");
                        }
                    },

                    {
                        element: "#recentTemplates",
                        title: "Aquí se encuentran las plantillas mas nuevas",
                        content:
                            "Al dar click aquí se mostraran las plantillas compartidas con tu área y personales.",
                        placement: "right"
                    },
                    {
                        element: "#filterTemplatesByName",
                        title: "Aquí puedes filtrar las plantillas",
                        content:
                            "En este lugar puedes buscar plantillas por su nombre.",
                        placement: "left"
                    },
                    {
                        element: "#apliFilter",
                        title: "Aquí efectuas la busqueda",
                        content:
                            "Debes dar click aquí para filtrar los resultados.",
                        placement: "left"
                    },
                    {
                        element: "#containerOfTemplates",
                        title: "Aquí se encuentran las plantillas de oficios",
                        content:
                            "En este lugar se ubican las plantillas disponibles para crear oficios.",
                        placement: "top"
                    },
                    {
                        element: "#templateFormat-1",
                        title: "Aquí se muestran la vista previa de tus plantillas",
                        content: "Desde aquí puedes seleccionar la plantilla que desees utilizar.",
                        placement: "top"
                    }



                ]
            });
            if (tour.ended()) {
                tour.restart();
            } else {
                tour.init();
                tour.start();
            }
        }


    }
})();
