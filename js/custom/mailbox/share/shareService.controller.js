(function () {
  'use strict';


  angular.module('app.mailbox').controller('shareController', shareController);


  shareController.$inject = ['shareTemplateBase', 'profileFactory', 'swangular', '$state', 'shareFactory', 'swalFactory', 'templatesFactory', 'composeFactory'];

  function shareController(shareTemplateBase, Profile, SweetAlert, $state, shareFactory, swalFactory, templatesFactory, composeFactory) {
    var vm = this;
    vm.compose = composeFactory;
    vm.setByFolio = setByFolio;
    vm.goToNextPanel = goToNextPanel;
    vm.loading = false;
    vm.steep = 1;
    vm.summernoteViewOptions = {
      lang: 'es-MX',
      height: 700,
      defaultFontName: 'Helvetica',
      toolbar: [
        ['misc', ['print']]
      ],
      editable: false,

      disableResizeEditor: true,
      contenteditable: false
    };
    init();




    function init() {

      Profile.getProfile().then(function (profile) {
        vm.profile = profile;
        if (!vm.profile.jobTitleID) {


          SweetAlert.swal({
            title: '¡Error!',
            text: 'No puedes acceder al contenido',
            type: 'error',
            showCancelButton: false,
            confirmButtonColor: '#DD2C57',
            confirmButtonText: 'Aceptar',
            timer: 1200
          });
          $state.go('app.mailbox.internal.in');
          return;
        }
        vm.current = shareTemplateBase.getComisionTemplate();
        vm.compose.init();
        vm.html = '<h1>CARGANDO...</h1>';
        vm.steep = 1;
      }, function (err) {
        console.error('Error addMember on getProfile', err);
      });


    }




    function setByFolio() {
      vm.loading = true;
      vm.steep = 2;


      vm.current = shareTemplateBase.getComisionTemplate();


      shareFactory.getSharedServicesByFolio(vm.folio, function (err, solve) {
        vm.dataOfFolio = solve.data[0];
        vm.properties = Object.getOwnPropertyNames(vm.dataOfFolio);

        setData();
        vm.loading = false;
      });

    }



    function setData() {

      setDocumentContent();
      setInternalBaseInfo();
    }

    function goToNextPanel() {

      if (!vm.compose.selectedTo || vm.compose.selectedTo.length === 0) {
        vm.error = 'Agrega el email de ' + vm.dataOfFolio.nombrE_EMPLEADO;
        swalFactory.error('Agrega el email de ' + vm.dataOfFolio.nombrE_EMPLEADO);
        return;
      }
      if (!vm.compose.selectedTo || vm.compose.selectedTo.length < 2) {
        vm.error = 'Agrega el resto de personal faltan' + (5 - vm.compose.selectedTo.length);
        swalFactory.error('Agrega el resto de personal faltan' + (5 - vm.compose.selectedTo.length));
        return;
      } else if (vm.compose.selectedTo.length < 5) {
        vm.error = 'Agrega el resto de el resto de personal faltan' + (5 - vm.compose.selectedTo.length);
        swalFactory.error('Agrega el resto de el resto de personal faltan' + (5 - vm.compose.selectedTo.length));
        return;
      }
      vm.error = null;
      setColaborators();
    }


    function setColaborators() {

      var textoImg = 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Firma_Ricardo_Lagos_Escobar.png';
      var textoImgFondo = 'Girl in a jacket';
      vm.current = vm.html;

      for (let i = 0; i < vm.compose.selectedTo.length; i++) {
        var element = vm.compose.selectedTo[i];

        if (i !== 0) {
          vm.current = vm.current.replace('[nombrE_EMPLEADO]', element.name);
        }
        vm.current = vm.current.replace(textoImg, 'firmaID-' + element.email);
        vm.current = vm.current.replace(textoImgFondo, 'firma-' + element.email);
      }




      vm.html = vm.current;
      vm.compose.document.subject = vm.subject;
      vm.compose.document.content = vm.html;
      vm.compose.subject = vm.subject;
      vm.compose.content = vm.html;
      vm.compose.saveDraft();
      $state.go('app.mailbox.internal.drafts.page', {
        page: 1
      });
    }


    function setInternalBaseInfo() {

      vm.subject = `SOLICITUD DE OFICIO COMISION ${vm.dataOfFolio.nombrE_EMPLEADO} <${vm.dataOfFolio.foliO_SOLICITUD}>`;
    }

    function setDocumentContent() {

      for (let i = 0; i < vm.properties.length; i++) {

        var element = vm.properties[i];
        var replaceVal = '[' + element + ']';
        var value = vm.dataOfFolio[element];
        vm.current = vm.current.replace(replaceVal, value);
        vm.current = vm.current.replace(replaceVal, value);
      }
      var fechA_SOLICITUD = new Date(vm.dataOfFolio.fechA_SOLICITUD);
      var fechA_INICIAL = new Date(vm.dataOfFolio.fechA_INICIAL);
      var fechA_FINAL = new Date(vm.dataOfFolio.fechA_FINAL);


      vm.current = vm.current.replace('[ds]', fechA_SOLICITUD.getDay());
      vm.current = vm.current.replace('[ms]', fechA_SOLICITUD.getMonth() + 1);
      vm.current = vm.current.replace('[as]', fechA_SOLICITUD.getFullYear());

      vm.current = vm.current.replace('[di]', fechA_INICIAL.getDay());
      vm.current = vm.current.replace('[mi]', fechA_INICIAL.getMonth() + 1);
      vm.current = vm.current.replace('[ai]', fechA_INICIAL.getFullYear());

      vm.current = vm.current.replace('[df]', fechA_FINAL.getDay());
      vm.current = vm.current.replace('[mf]', fechA_FINAL.getMonth() + 1);
      vm.current = vm.current.replace('[af]', fechA_FINAL.getFullYear());

      vm.current = vm.current.replace('[ddif]', (fechA_FINAL.getTime() - fechA_INICIAL.getTime()) / (86400000));




      var totalNumero = vm.dataOfFolio.importE_TOTAL_COMISION;
      var totalLetras = numeroALetras(totalNumero);

      vm.current = vm.current.replace('[impTotal]', totalNumero);
      vm.current = vm.current.replace('[impNombre]', totalLetras);




      // fechA_SOLICITUD
      // ds ms as

      // fechA_INICIAL
      // di mi ai

      // fechA_FINAL
      // df mf af


      vm.html = vm.current;
    }

    function unidades(num) {

      switch (num) {
        case 1:
          return 'UN';
        case 2:
          return 'DOS';
        case 3:
          return 'TRES';
        case 4:
          return 'CUATRO';
        case 5:
          return 'CINCO';
        case 6:
          return 'SEIS';
        case 7:
          return 'SIETE';
        case 8:
          return 'OCHO';
        case 9:
          return 'NUEVE';
      }

      return '';
    }

    function decenasFun(num) {

      var decena = Math.floor(num / 10);
      var unidad = num - (decena * 10);



      switch (decena) {
        case 1:
          switch (unidad) {
            case 0:
              return 'DIEZ';
            case 1:
              return 'ONCE';
            case 2:
              return 'DOCE';
            case 3:
              return 'TRECE';
            case 4:
              return 'CATORCE';
            case 5:
              return 'QUINCE';
            default:
              return 'DIECI' + unidades(unidad);
          }
          break;
        case 2:
          switch (unidad) {
            case 0:
              return 'VEINTE';
            default:
              return 'VEINTI' + unidades(unidad);
          }
          break;
        case 3:
          return decenasY('TREINTA', unidad);
        case 4:
          return decenasY('CUARENTA', unidad);
        case 5:
          return decenasY('CINCUENTA', unidad);
        case 6:
          return decenasY('SESENTA', unidad);
        case 7:
          return decenasY('SETENTA', unidad);
        case 8:
          return decenasY('OCHENTA', unidad);
        case 9:
          return decenasY('NOVENTA', unidad);
        case 0:
          return unidades(unidad);
      }
    } //Unidades()

    function decenasY(strSin, numUnidades) {
      if (numUnidades > 0)
        return strSin + ' Y ' + unidades(numUnidades);

      return strSin;
    } //DecenasY()

    function centenas(num) {

      var centenas = Math.floor(num / 100);
      var decenas = num - (centenas * 100);

      switch (centenas) {
        case 1:
          if (decenas > 0)
            return 'CIENTO ' + decenasFun(decenas);
          return 'CIEN';
        case 2:
          return 'DOSCIENTOS ' + decenasFun(decenas);
        case 3:
          return 'TRESCIENTOS ' + decenasFun(decenas);
        case 4:
          return 'CUATROCIENTOS ' + decenasFun(decenas);
        case 5:
          return 'QUINIENTOS ' + decenasFun(decenas);
        case 6:
          return 'SEISCIENTOS ' + decenasFun(decenas);
        case 7:
          return 'SETECIENTOS ' + decenasFun(decenas);
        case 8:
          return 'OCHOCIENTOS ' + decenasFun(decenas);
        case 9:
          return 'NOVECIENTOS ' + decenasFun(decenas);
      }

      return decenasFun(decenas);
    } //Centenas()

    function seccion(num, divisor, strSingular, strPlural) {
      var cientos = Math.floor(num / divisor);
      var resto = num - (cientos * divisor);

      var letras = '';

      if (cientos > 0)
        if (cientos > 1)
          letras = centenas(cientos) + ' ' + strPlural;
        else
          letras = strSingular;

      if (resto > 0)
        letras += '';

      return letras;
    } //Seccion()

    function miles(num) {
      var divisor = 1000;
      var cientos = Math.floor(num / divisor);
      var resto = num - (cientos * divisor);

      var strMiles = seccion(num, divisor, 'MIL', 'MIL');
      var strCentenas = centenas(resto);

      if (strMiles === '')
        return strCentenas;

      return strMiles + ' ' + strCentenas;

      //return seccion(num, divisor, 'UN MIL', 'MIL') + ' ' + centenas(resto);
    } //Miles()

    function millones(num) {
      var divisor = 1000000;
      var cientos = Math.floor(num / divisor);
      var resto = num - (cientos * divisor);

      var strMillones = seccion(num, divisor, 'UN MILLON', 'MILLONES');
      var strMiles = miles(resto);

      if (strMillones === '')
        return strMiles;

      return strMillones + ' ' + strMiles;

      //return seccion(num, divisor, 'UN MILLON', 'MILLONES') + ' ' + miles(resto);
    } //Millones()

    function numeroALetras(num, centavos) {
      var data = {
        numero: num,
        enteros: Math.floor(num),
        centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
        letrasCentavos: '',
      };
      if (centavos === undefined || centavos === false) {
        data.letrasMonedaPlural = 'PESOS';
        data.letrasMonedaSingular = 'PESO';
      } else {
        data.letrasMonedaPlural = 'CENTAVOS';
        data.letrasMonedaSingular = 'CENTAVO';
      }

      if (data.centavos > 0)
        data.letrasCentavos = 'CON ' + numeroALetras(data.centavos, true);

      if (data.enteros === 0) {
        return 'CERO ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
      }
      if (data.enteros === 1) {
        return millones(data.enteros) + ' ' + data.letrasMonedaSingular + ' ' + data.letrasCentavos;
      } else {
        return millones(data.enteros) + ' ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
      }
    } //numeroALetras()




  }

}());
