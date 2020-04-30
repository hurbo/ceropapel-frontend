(function () {
  'use strict';

  var AUTOCOMPLETE_TIME_WAIT = 400;

  angular.module('app.mailbox').controller('SearchAdvancedController', SearchController);
  SearchController.$inject = [
    'PaginatorService',
    'profileFactory',
    'socket',
    'templatesFactory',
    '$localStorage',
    'searchAdvanced'
  ];

  function SearchController(
    PaginatorService,
    Profile,
    socket,
    templatesFactory,
    localStorage,
    searchAdvanced
  ) {
    var vm = this;
    vm.profile = undefined;
    vm.showTo = true;
    vm.showFrom = true;
    vm.selectedTo = [];
    vm.selectedFrom = [];
    vm.contactsTo = [];
    vm.contactsFrom = [];
    vm.paginator = PaginatorService;
    vm.documentTypes = [];
    vm.maxDate = moment().format('YYYY-MM-DD');

    vm.StatusType = {
      unread: 'Sin leer',
      read: 'Leído',
      signed: 'Firmado',
      rejected: 'Rechazado',
      Recibido: 'Recibido',
      'En proceso': 'En proceso',
      'Atendido satisfactoriamente': 'Atendido satisfactoriamente',
      'De conocimiento': 'De conocimiento',
      'No procede': 'No procede'
    };

    vm.selectedSearchType = 'both';

    vm.searchTypes = [{
        value: 'both',
        label: 'Enviados y recibidos'
      },
      {
        value: 'sent',
        label: 'Enviados'
      },
      {
        value: 'received',
        label: 'Recibidos'
      },
    ];

    vm.statusTypes = [{
      value: 'unread',
      label: vm.StatusType['Sin leer']
    }, {
      value: 'read',
      label: vm.StatusType['Leído']
    }, {
      value: 'signed',
      label: vm.StatusType['Firmado']
    }, {
      value: 'rejected',
      label: vm.StatusType['Rechazado']
    }, {
      value: 'Recibido',
      label: vm.StatusType['Recibido']
    }, {
      value: 'En proceso',
      label: vm.StatusType['En proceso']
    }, {
      value: 'Atendido satisfactoriamente',
      label: vm.StatusType['Atendido satisfactoriamente']
    }, {
      value: 'De conocimiento',
      label: vm.StatusType['De conocimiento']
    }, {
      value: 'No procede',
      label: vm.StatusType['No procede']
    }];
    vm.searchOption = {};

    vm.clearSearchOption = clearSearchOption;
    vm.exportToExcel = exportToExcel;
    vm.exportToPDF = exportToPDF;
    vm.search = search;

    vm.searchAdvanced = searchAdvanced;



    function clearSearchOption() {
      resetSearchOption();
      vm.paginator.clear();
      // window.location = window.location.origin + '/#/app/mailbox/searchAdvanced';
    }

    function exportToExcel() {
      if (vm.paginator.items.length) {
        var tableID = 'searchTable';
        var tab_text = "<table border='2px'><tr bgcolor='#87AFC6'>";
        var j = 0;
        var tab = document.getElementById(tableID);

        for (j = 0; j < tab.rows.length; j++) {
          tab_text = tab_text + tab.rows[j].innerHTML + "</tr>";
        }

        tab_text = tab_text + '</table>';
        tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, ''); //remove if u want links in your table
        tab_text = tab_text.replace(/<img[^>]*>/gi, ''); // remove if u want images in your table
        tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ''); // reomves input params

        var htmls = tab_text;
        var uri = 'data:application/vnd.ms-excel;base64,';
        var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';

        var base64 = function (s) {
          return window.btoa(unescape(encodeURIComponent(s)));
        };

        var format = function (s, c) {
          return s.replace(/{(\w+)}/g, function (m, p) {
            return c[p];
          })
        };

        var ctx = {
          worksheet: 'Worksheet',
          table: htmls
        }

        var link = document.createElement("a");
        link.download = "Reporte de búsqueda.xls";
        link.href = uri + base64(format(template, ctx));
        link.click();
      }
    }

    function exportToPDF() {
      if (vm.paginator.items.length) {
        $('#searchTable').print({
          title: "Búsqueda avanzada"
        });
      }
    }

    function initLocalStorageSearchOption() {
      localStorage.mailboxSearchAdvanced = localStorage.mailboxSearchAdvanced || {};
      var mailboxSearchAdvanced = localStorage.mailboxSearchAdvanced;

      vm.selectedTo = mailboxSearchAdvanced.selectedTo || [];
      vm.selectedFrom = mailboxSearchAdvanced.selectedFrom || [];
      vm.contactsTo = mailboxSearchAdvanced.contactsTo || [];
      vm.contactsFrom = mailboxSearchAdvanced.contactsFrom || [];

      if (mailboxSearchAdvanced.searchOption && mailboxSearchAdvanced.searchOption.endDate) {
        mailboxSearchAdvanced.searchOption.endDate = new Date(mailboxSearchAdvanced.searchOption.endDate);
      }

      if (mailboxSearchAdvanced.searchOption && mailboxSearchAdvanced.searchOption.startDate) {
        mailboxSearchAdvanced.searchOption.startDate = new Date(mailboxSearchAdvanced.searchOption.startDate);
      }

      vm.searchOption = Object.assign({}, {
        subject: '',
        from: {
          jobTitle: [],
          user: []
        },
        to: {
          jobTitle: [],
          user: []
        },
        beneficiary: '',
        folio: '',
        documentType: '',
        status: '',
        startDate: '',
        endDate: ''
      }, mailboxSearchAdvanced.searchOption || {});
    }

    function resetSearchOption() {
      vm.selectedTo = [];
      vm.selectedFrom = [];
      vm.contactsTo = [];
      vm.contactsFrom = [];
      vm.selectedSearchType = 'both';

      vm.searchOption = {
        subject: '',
        from: {
          jobTitle: [],
          user: []
        },
        to: {
          jobTitle: [],
          user: []
        },
        beneficiary: '',
        folio: '',
        documentType: '',
        status: '',
        startDate: '',
        endDate: ''
      };

      localStorage.mailboxSearchAdvanced = {};
    }

    function getQueryString() {
      // var queries = window.location.hash.split('?');
      var queries = vm.queryStringRoot;
      console.log('queries aslkdlakdsldkasjl', queries);

      if (queries.length > 1) {
        queries = queries[1].split('&');

        queries.forEach(function (filter) {
          var filterData = filter.split('=');
          var filterName = filterData[0];

          var filterValue = filterData[1]
            .replace(/%20/g, ' ')
            .replace(/%5B/g, '[')
            .replace(/%7B/g, '{')
            .replace(/%7D/g, '}')
            .replace(/%5D/g, ']')
            .replace(/%22/g, '"')

            .replace(/%C3%A1/g, 'á')
            .replace(/%C3%A9/g, 'é')
            .replace(/%C3%AD/g, 'í')
            .replace(/%C3%B3/g, 'ó')
            .replace(/%C3%BA/g, 'ú')

            .replace(/%C3%81/g, 'Á')
            .replace(/%C3%89/g, 'É')
            .replace(/%C3%8D/g, 'Í')
            .replace(/%C3%93/g, 'Ó')
            .replace(/%C3%9A/g, 'Ú')

            .replace(/%C3%B1/g, 'ñ')
            .replace(/%C3%91/g, 'Ñ');

          if (filterName === 'subject') {
            vm.searchOption[filterName] = filterValue;
          }

          if (filterName === 'senders') {
            vm.selectedTo = JSON.parse(filterValue);
          }

          if (filterName === 'recipients') {
            vm.selectedFrom = JSON.parse(filterValue);
          }

          if (filterName === 'folio') {
            vm.searchOption[filterName] = filterValue;
          }

          if (filterName === 'documentType') {
            vm.searchOption.documentType = parseInt(filterValue, 10);
          }

          if (filterName === 'status') {
            vm.searchOption[filterName] = filterValue;
          }

          if (filterName === 'startDate') {
            vm.searchOption[filterName] = moment(filterValue)._d;
          }

          if (filterName === 'endDate') {
            vm.searchOption[filterName] = moment(filterValue)._d;
          }

          if (filterName === 'searchType') {
            vm.selectedSearchType = filterValue;
          }
        });
      }
    }

    function updateQueryString(params) {
      var queryString = '?';

      if (params.subject) {
        queryString += 'subject=' + params.subject;
      }

      if (vm.selectedTo.length) {
        queryString += '&senders=' + JSON.stringify(vm.selectedTo);
      }

      if (vm.selectedFrom.length) {
        queryString += '&recipients=' + JSON.stringify(vm.selectedFrom);
      }

      if (params.folio) {
        queryString += '&folio=' + params.folio;
      }

      if (params.documentType) {
        queryString += '&documentType=' + params.documentType;
      }

      if (params.status) {
        queryString += '&status=' + params.status;
      }

      if (params.startDate) {
        queryString += '&startDate=' + moment(params.startDate).format('YYYY-MM-DD');
      }

      if (params.endDate) {
        queryString += '&endDate=' + moment(params.endDate).format('YYYY-MM-DD');
      }

      if (params.searchType) {
        queryString += '&searchType=' + params.searchType;
      }


      vm.queryStringRoot = window.location.origin + '/#/app/mailbox/searchAdvanced' + queryString;
      // console.log("newUrl", newUrl);
      // window.location = newUrl;
    }

    function search() {
      localStorage.mailboxSearchAdvanced.selectedTo = vm.selectedTo;
      localStorage.mailboxSearchAdvanced.selectedFrom = vm.selectedFrom;
      localStorage.mailboxSearchAdvanced.contactsTo = vm.contactsTo;
      localStorage.mailboxSearchAdvanced.contactsFrom = vm.contactsFrom;
      localStorage.mailboxSearchAdvanced.searchOption = vm.searchOption;

      var selectedFrom = [];
      var selectedTo = [];

      if (vm.selectedSearchType !== 'sent') {
        selectedTo = vm.selectedTo;
      }

      if (vm.selectedSearchType !== 'received') {
        selectedFrom = vm.selectedFrom;
      }

      var params = Object.assign({}, vm.searchOption, {
        searchType: vm.selectedSearchType,
        page: 1,
        to: {
          jobTitle: selectedFrom.map(function (singleFrom) {
            if (singleFrom.type === 'jobTitle') {
              return singleFrom.id;
            }
          }).filter(function (singleFrom) {
            return !!singleFrom;
          }),
          user: selectedFrom.map(function (singleFrom) {
            if (singleFrom.type === 'user') {
              return singleFrom.id;
            }
          }).filter(function (singleFrom) {
            return !!singleFrom;
          })
        },
        from: {
          jobTitle: selectedTo.map(function (singleTo) {
            if (singleTo.type === 'jobTitle') {
              return singleTo.id;
            }
          }).filter(function (singleTo) {
            return !!singleTo;
          }),
          user: selectedTo.map(function (singleTo) {
            if (singleTo.type === 'user') {
              return singleTo.id;
            }
          }).filter(function (singleTo) {
            return !!singleTo;
          })
        }
      });

      if (params.startDate) {
        var momentValue = moment(params.startDate);
        params.startDate = momentValue.isValid() ? momentValue.format('YYYY-MM-DD') : '';
      }

      if (params.endDate) {
        var momentValue = moment(params.endDate);
        params.endDate = momentValue.isValid() ? momentValue.format('YYYY-MM-DD') : '';
      }

      updateQueryString(params);
      vm.paginator.searchItems(params);

      // $state.go('app.mailbox.searchAdvanced.page', params).then(function () {
      //   vm.paginator.show();
      // });
    }

    function init() {
      console.log('INIT SEARCH ADVANCE');
      vm.queryStringRoot = window.location.origin + '/#/app/mailbox/searchAdvanced?&searchType=both';
      initLocalStorageSearchOption();





      Profile.getProfile().then(function (profile) {
        vm.profile = profile;
      });

      vm.paginator.init('getAdvancedSearchDocuments');

      templatesFactory.getDocumentTypes(function (err, documentTypes) {
        vm.documentTypes = documentTypes ? documentTypes : [];
        getQueryString();
      });
    }

    vm.onSelectTo = function (item, model) {};
    vm.onRemoveTo = function (item, model) {};

    vm.refreshContactsTo = _.debounce(function (search) {
      if (search) {
        socket.emit('getDocumentContacts', {
          search: search
        }, function (err, result) {
          vm.contactsTo = result;
        });
      }
    }, AUTOCOMPLETE_TIME_WAIT);

    vm.onSelectFrom = function (item, model) {};
    vm.onRemoveFrom = function (item, model) {};

    vm.datetime2Client = function (datetimeString) {
      var momentValue = moment(datetimeString);
      return !momentValue.isValid() ? '' : momentValue.format('DD/MM/YYYY');
    };

    vm.refreshContactsFrom = _.debounce(function (search) {
      if (search) {
        socket.emit('getDocumentContacts', {
          search: search
        }, function (err, result) {
          vm.contactsFrom = result;
        });
      }
    }, AUTOCOMPLETE_TIME_WAIT);

    init();
  }
})();