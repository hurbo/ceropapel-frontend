(function () {
  'use strict';
  angular.module('app.mailbox')
    .service('PaginatorService', PaginatorService);
  PaginatorService.$inject = ['socket'];

  function PaginatorService(socket) {
    var _this = this;
    this.messageRequest = '';
    this.numPages = 0;
    this.pages = [];
    this.items = [];
    this.pageActive = 0;
    this.currentParams = {};
    this.loading = false;

    this.init = function (messageRequest) {
      _this.messageRequest = messageRequest;
    };

    this.searchItems = function (params) {
      _this.currentParams.page = 1;
      _this.loading = true;

      _this.getItems(params, function () {
        _this.paginate(1);
        _this.loading = false;
      });
    };

    this.clear = function () {
      _this.numPages = 0;
      _this.pages = [];
      _this.items = [];
      _this.pageActive = 0;
      _this.currentParams = {};
    };

    this.refreshPage = function () {
      var activePage = _this.getActivePage();
      activePage = activePage === -1 ? 1 : activePage;
      _this.currentParams.page = activePage;
      _this.getItems(undefined, function () {
        _this.paginate(activePage);
      });
    };

    this.getActivePage = function () {
      var active = 0;
      for (var i = 0; i < _this.pages.length; i++) {
        var page = _this.pages[i];
        if (page.active) {
          active = page.num;
          break;
        }
      }

      return active;
    };

    this.paginate = function (numPage) {
      _this.pages = [];
      var begin = 0;
      var end = 0;

      if (numPage <= 3) {
        begin = 1;
        if (_this.numPages < 5) end = _this.numPages;
        else end = 5;
      } else if (numPage >= _this.numPages - 2) {
        if (_this.numPages <= 5) begin = 1;
        else begin = _this.numPages - 5;
        end = _this.numPages;
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
        _this.pages.push(page);
        page = {
          num: numPage - 1,
          text: 'Ant'
        };
        _this.pages.push(page);
      }
      for (var i = begin; i <= end; i++) {
        page = {
          num: i,
          text: i
        };
        if (i === numPage) page.active = true;
        _this.pages.push(page);
        if (i === numPage) _this.pageActive = numPage;
      }

      if (numPage < _this.numPages) {
        page = {
          num: numPage + 1,
          text: 'Sig'
        };
        _this.pages.push(page);
        page = {
          num: _this.numPages,
          text: 'Última'
        };
        _this.pages.push(page);
      }
    };

    this.getItems = function (params, cb) {
      if (params !== undefined) {
        _this.currentParams = Object.assign({
          options: params
        }, {
          page: 1
        });
      }

      if (_this.messageRequest) {
        socket.emit(_this.messageRequest, _this.currentParams, function (err, result) {
          if (!err && !result) {
            _this.items = [];
            _this.numPages = 0;
          }
          if (!err) {
            if (result && result.items) {
              _this.items = result.items;
              _this.numPages = result.numPages;
            } else {
              _this.items = result;
              _this.numPages = 3;
            }
          } else {
            _this.items = [];
            _this.numPages = 0;
          }
          if (cb) {
            cb(err);
          }
        });
      } else {
        _this.items = [];
        _this.numPages = 0;
      }
    };

    this.goPage = function (page) {
      if (page.num !== _this.pageActive) {
        _this.currentParams.page = page.num;
        _this.getItems(undefined, function () {
          _this.paginate(page.num);
        });
      }
    };
  }
})();
