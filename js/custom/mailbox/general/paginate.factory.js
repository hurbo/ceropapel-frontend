(function () {
  'use strict';
  angular.module('app.mailbox').factory('paginatorFactory', paginatorFactory);
  paginatorFactory.$inject = ['socket', '$state', '$stateParams', 'filterFactory', 'ExternalsFactory'];




  function paginatorFactory(socket, $state, $stateParams, Filter, ExternalsFactory) {
    var pageActive = -1;
    var messageRequest = null;
    var areSelectedAll = false;
    var options = null;
    var numPages = 0;
    var currentState;
    var currentParams;
    var paginator = {
      init: init,
      selectedAll: selectedAll,
      areSelectedAll: areSelectedAll,
      setConfig: setConfig,
      cleanFilter: cleanFilter,
      searchQuery: '',
      startDate: null,
      endDate: null,
      search: search,

      pages: [],
      items: [],
      goPage: goPage,
      show: show,
      refreshPage: refreshPage,
      setOptionsFromParams: _setOptionsFromParams,
      onFilter: onFilter,
      isActive: isActive
    };
    return paginator;


    function selectedAll() {

      if (areSelectedAll) {
        for (let i = 0; i < paginator.items.length; i++) {
          paginator.items[i].selected = false;
        }
        areSelectedAll = false;
      } else {
        for (let i = 0; i < paginator.items.length; i++) {
          paginator.items[i].selected = true;
        }
        areSelectedAll = true;
      }
    }


    function init(folder) {

      pageActive = $stateParams.page ? parseInt($stateParams.page) : 1;
      currentState = $state.current.name;
      currentParams = angular.copy($stateParams);
      messageRequest = Filter.getQueryMsg(folder);

      Filter.setOptionsFromParams(currentParams);
      paginator.searchQuery = currentParams.searchQuery ? currentParams.searchQuery : '';



      paginator.startDate = currentParams.startDate ? currentParams.startDate : null;
      paginator.endDate = currentParams.endDate ? currentParams.endDate : null;

      getItems(pageActive, function (err) {
        paginate(pageActive);
      });
    }

    function _setOptionsFromParams() {
      currentParams = angular.copy($stateParams);
      Filter.setOptionsFromParams(currentParams);
    }


    function isActive() {

      return Filter.isActive() ? Filter.getOptions() : Filter.getOptions();
    }

    function onFilter(option) {
      Filter.setOption(option);
      Filter.setOption('searchQuery', paginator.searchQuery);
      Filter.setOption('startDate', paginator.startDate);
      Filter.setOption('endDate', paginator.endDate);

      var state = _normalizeState(currentState, true);
      options = Filter.isActive() ? Filter.getOptions() : {};

      options.page = 1;
      $state.go(state, options);
    }

    function search() {
      option.searchQuery = paginator.searchQuery;
      option.startDate = paginator.startDate;
      option.endDate = paginator.endDate;
      Filter.setOption(option);
      var state = _normalizeState(currentState, false);
      options = Filter.isActive() ? Filter.getOptions() : {};


      options.page = 1;
      $state.go(_normalizeState(currentState, true), options);
    }

    function cleanFilter() {
      options = {
        page: 1
      };
      paginator.searchQuery = '';
      paginator.startDate = null;
      paginator.endDate = null;
      Filter.setOptionsFromParams({});
      $state.go(_normalizeState(currentState, true), options);
    }

    function goPage(page) {


      // if (processing) return;
      var index = paginator.pages.indexOf(page);
      if (index !== pageActive) {

        currentParams.page = page.num;
        var params = $state.params;





        $state.go(_normalizeState(currentState, true), currentParams);


      }
    }

    function _normalizeState(_state, setPage) {


      var state = _state;
      state = state.replace('.page', '');
      state = state.replace('.filter', '');

      if (Filter.isActive()) {



        state = state + '.filter';
      }
      if (setPage) {
        state = state + '.page';
      }

      return state;
    }






    function show() {

      getItems(pageActive, function (err) {
        paginator.pages[pageActive].active = false;
        paginator.pages[pageActive].active = true;
        paginate(pageActive);
      });
    }

    function search(searchFolder, query) {}

    function setConfig(msgRequest, _options, _data) {

      messageRequest = msgRequest;
      options = _options ? _options : null;
      data = _data ? _data : null;
    }

    function paginate(numPage) {

      paginator.pages = [];
      var begin = 0;
      var end = 0;

      if (numPage <= 3) {
        begin = 1;
        if (numPages < 5) end = numPages;
        else end = 5;
      } else if (numPage >= numPages - 2) {
        if (numPages <= 5) begin = 1;
        else begin = numPages - 5;
        end = numPages;
      } else {
        begin = numPage - 2;
        end = numPage + 2;
      }

      var page = {
        num: 1,
        text: '',
        active: false
      };
      if (numPage > 1) {
        page = {
          num: 1,
          text: 'Primera'
        };
        paginator.pages.push(page);
        page = {
          num: numPage - 1,
          text: 'Ant'
        };
        paginator.pages.push(page);
      }
      for (var i = begin; i <= end; i++) {
        page = {
          num: i,
          text: i
        };
        if (i === numPage) page.active = true;
        paginator.pages.push(page);
        if (i === numPage) pageActive = paginator.pages.length - 1;
      }

      if (numPage < numPages) {
        page = {
          num: numPage + 1,
          text: 'Sig'
        };
        paginator.pages.push(page);
        page = {
          num: numPages,
          text: 'Última'
        };
        paginator.pages.push(page);
      }

    }

    function refreshPage() {
      var activePage = getActivePage();
      activePage = activePage === -1 ? 1 : activePage;
      getItems(activePage, function (err) {
        paginate(activePage);
      });
    }

    function getActivePage() {


      var active = -1;
      for (var i = 0; i < paginator.pages.length; i++) {
        var page = paginator.pages[i];
        if (page.active) {
          active = page.num;
          break;
        }
      }

      return active;
    }





    function getItems(numPage, cb) {

      if (messageRequest) {
        var params = {
          page: numPage,
        };
        if (messageRequest === 'getSearchDocuments') {
          currentParams = angular.copy($stateParams);
          Filter.setOptionsFromParams(currentParams);
          options = currentParams;
          params['options'] = angular.copy($stateParams);
        }
        if (Filter.isActive()) params.options = Filter.getOptions();

        if (currentParams) {
          if (currentParams.folder) {
            params.folder = currentParams.folder;
          }
          if (currentParams.jobTitle) {
            params.jobTitle = currentParams.jobTitle;
          }
        }

        if ($state.current.name.includes('app.mailbox.external')) {
          // params['options'] = { bossJobTitleID: $stateParams.jobTitle, folder: $stateParams.folder ? $stateParams.folder : null  };


          ExternalsFactory.getCurrentBossjobTitleID(function (err, solve) {
            if (solve) {

              params['folder'] = $stateParams.folder ? $stateParams.folder : null;
              if ($stateParams.jobTitle) {
                params['bossJobTitleID'] = $stateParams.jobTitle;
              } else if (solve && solve.jobTitle) {
                params['bossJobTitleID'] = $stateParams.jobTitle;
              }


              socket.emit(messageRequest, params, function (err, result) {


                if (!err && !result) {
                  paginator.items = [];
                  numPages = 0;
                }
                if (!err) {
                  if (result && result.items) {
                    paginator.items = result.items;
                    numPages = result.numPages;
                  } else {
                    paginator.items = result;
                    numPages = 3;
                  }
                } else {
                  paginator.items = [];
                  numPages = 0;
                }
                cb(err);
              });
            }

          });
        } else {
          socket.emit(messageRequest, params, function (err, result) {


            if (!err && !result) {
              paginator.items = [];
              numPages = 0;
            }
            if (!err) {
              if (result && result.items) {
                paginator.items = result.items;
                numPages = result.numPages;
              } else {
                paginator.items = result;
                numPages = 3;
              }
            } else {
              paginator.items = [];
              numPages = 0;
            }
            cb(err);
          });
        }


      } else {
        paginator.items = [];
        numPages = 0;
      }
    }
  }
})();
