(function () {
  'use strict';
  angular.module('app.mailbox').factory('filterFactory', filterFactory);
  filterFactory.$inject = [];



  function filterFactory(paginator) {


    var folder = '';
    var data = null;
    // var options = null;
    var options = {
      read: false,
      pending: false,
      unread: false,
      signed: false,
      needSign: false,
      notSigned: false,
      turned: false,
      rejected: false,
      notTurned: false,
      searchQuery: '',
      dateStart: false,
      dateEnd: false,
      bossJobTitleID: false,
      folderID: false,
      box: false,
      jt: false,
      startDate: false,
      endDate: false,
      subject: false,
      folio: false,
      status: false,
      require: false,
      ft: false,
      priority: false,
      confidential: false
    };


    var filter = {
      setOption: setOption,
      isActive: isActive,
      getQueryMsg: getQueryMsg,
      getOptions: getOptions,
      setOptionsFromParams: setOptionsFromParams,
      getStatus: getStatus,
      active: false,
      read: false,
      pending: false,
      unread: false,
      signed: false,
      needSign: false,
      notSigned: false,
      priority: false,
      rejected: false,
      confidential: false,
      notTurned: false,
      bossJobTitleID: null,
      folderID: null,








      turned: false,
      dateStart: false,
      dateEnd: false,
      box: false,
      jt: false,
      startDate: false,
      endDate: false,
      subject: false,
      folio: false,
      status: false,
      require: false,
      ft: false,






      searchQuery: '',
      init: init,
      setFolder: setFolder,
      onFilter: onFilter,
      onClean: onClean,
      onSearch: onSearch,
      process: [
        'Firmado',
        'En proceso',
        'Atendido satisfactoriamente',
        'De conocimiento'
      ]
    };

    function setFolder(folder) {

    }

    function setOption(option, value) {
      if (options.hasOwnProperty(option)) {
        options[option] = !options[option];
        filter[option] = !filter[option];
      }

      if (option === 'searchQuery') {
        options[option] = value;
        filter[option] = value;
      }
    }

    function isActive() {
      console.log('sdasdasdasdasadas isActive');
      filter.active =
        filter.read ||
        filter.unread ||
        filter.pending ||
        filter.signed ||
        filter.needSign ||
        filter.notSigned ||
        filter.turned ||
        filter.rejected ||
        filter.notTurned ||
        filter.dateStart ||
        filter.dateEnd ||
        filter.bossJobTitleID ||
        filter.box ||
        filter.jt ||
        filter.startDate ||
        filter.endDate ||
        filter.subject ||
        filter.folio ||
        filter.status ||
        filter.require ||
        filter.ft ||
        filter.priority ||
        filter.confidential ||
        filter.searchQuery;

      return filter.active;
    }

    function getQueryMsg(folder) {


      var query = '';
      switch (folder) {
        case 'inbox':
          query = 'getDocuments';
          break;
        case 'outbox':
          query = 'getSentDocuments';
          break;
        case 'colaboration':
          query = 'getColaborationDocuments';
          break;
        case 'archived':
          query = 'getArchiveDocuments';
          break;
        case 'externalArchived':
          query = 'getExternalsArchiveDocuments';
          break;
        case 'archivedInOutFolder':
          query = 'getArchiveDocumentsInOutFolder';
          break;
        case 'archivedInFolder':
          query = 'getArchiveDocumentsInFolder';
          break;


        case 'archivedExternalInFolder':
          query = 'archivedExternalInFolder';
          break;
        case 'archivedExternalOutFolder':
          query = 'archivedExternalOutFolder';
          break;



        case 'external':
          query = 'getExternalDocuments';
          break;
        case 'externalOut':
          query = 'getExternalOutDocuments';
          break;

        case 'externalTurned':
          query = 'getExternalTurnedDocuments';
          break;


        case 'templates':
          query = 'getTemplatesPag';
          // query = 'getListOfTemplates';
          break;

        case 'templatesMostUsed':
          query = 'getTemplatesMostUsedPag';
          break;
        case 'elaborated':
          query = 'getElaboratedDocuments';
          break;
        case 'drafts':
          query = 'getDraftsDocuments';
          break;
        case 'search':
          query = 'getSearchDocuments';
          break;
        default:
          query = 'getDocuments';
      }
      return query;
    }

    function getOptions() {

      return _getOptions();
    }

    function setOptionsFromParams(params) {

      var count = 0;
      for (var key in params) {
        if (filter.hasOwnProperty(key) && key !== 'searchQuery') {
          count++;
          filter[key] = (params[key] === 'true');
          options[key] = (params[key] === 'true');
        } else if (key === 'searchQuery') {
          filter[key] = params[key];
          options[key] = params[key];
        }
      }

      if (count === 0) {
        _cleanOptions();
      }
    }

    function getStatus(option) {
      return filter[option];
    }

    function _cleanOptions() {
      filter.read = false;
      filter.unread = false;
      filter.pending = false;
      filter.signed = false;
      filter.needSign = false;
      filter.notSigned = false;
      filter.turned = false;
      filter.rejected = false;
      filter.notTurned = false;
      filter.searchQuery = '';
      filter.dateStart = false;
      filter.dateEnd = false;
      filter.bossJobTitleID = false;
      filter.folderID = false;
      filter.box = false;
      filter.jt = false;
      filter.startDate = false;
      filter.endDate = false;
      filter.subject = false;
      filter.folio = false;
      filter.status = false;
      filter.require = false;
      filter.ft = false;
      filter.priority = false;
      filter.confidential = false;
    }








    function onSearch() {
      filter.active = true;
      var query = '';
      switch (folder) {

        case 'inbox':
          query = 'searchDocuments';
          break;
        case 'outbox':
          query = 'searchOutboxDocuments';
          break;
        case 'colaboration':
          query = 'searchColaborationDocuments';
          break;
        case 'archived':
          query = 'searchArchivedDocuments';
          break;
        case 'externalArchived':
          query = 'searchExternalArchivedDocuments';
          break;

        case 'archivedExternalInFolder':
          query = 'archivedExternalInFolder';
          break;
        case 'archivedExternalOutFolder':
          query = 'archivedExternalOutFolder';
          break;


        case 'external':
          query = 'searchExternalDocuments';
          break;
        case 'externalOut':
          query = 'getExternalOutDocuments';
          break;
        case 'externalTurned':
          query = 'getExternalTurnedDocuments';
          break;
        case 'drafts':
          query = 'getDraftsDocuments';
          break;
        case 'search':
          query = 'getSearchDocuments';
          break;
        default:
          query = 'searchDocuments';
      }

      paginator.setConfig(query);
      if (filter.active) {
        // var options = filter.searchQuery;
        paginator.setConfig(query, options);
      }

      paginator.init();
    }

    function init(_folder, _data, _options) {






      filter.active = false;

      folder = _folder;
      data = _data;
      // options = _options;
      onClean();
    }

    function onFilter() {

      _isActive();

      var query = '';
      switch (folder) {
        case 'inbox':
          query = 'getDocuments';
          break;

        case 'outbox':
          query = 'getSentDocuments';
          break;
        case 'colaboration':
          query = 'getColaborationDocuments';
          break;
        case 'archived':
          query = 'getArchiveDocuments';
          break;
        case 'externalArchived':
          query = 'getExternalsArchiveDocuments';
          break;
        case 'archivedInOutFolder':
          query = 'getArchiveDocumentsInOutFolder';
        case 'archivedInFolder':
          query = 'getArchiveDocumentsInFolder';
          break;

        case 'archivedExternalInFolder':
          query = 'archivedExternalInFolder';
          break;

        case 'archivedExternalOutFolder':
          query = 'archivedExternalOutFolder';
          break;

        case 'external':
          query = 'getExternalDocuments';
          break;
        case 'externalOut':
          query = 'getExternalOutDocuments';
          break;
        case 'externalTurned':
          query = 'getExternalTurnedDocuments';
          break;
        case 'external.turned':
          query = 'getExternalTurnedDocuments';
          break;
        case 'templates':
          query = 'getTemplatesPag';
          // query = 'getListOfTemplates';
          break;
        case 'search':
          query = 'getSearchDocuments';
        default:
          query = 'getDocuments';
      }




      // paginator.setConfig(query, options, data);
      if (filter.active) {

        // options = _getOptions();
        paginator.setConfig(query, options, data);
      }
      // paginator.init();
    }

    function _isActive() {

      filter.active =
        filter.read ||
        filter.unread ||
        filter.pending ||
        filter.signed ||
        filter.needSign ||
        filter.notSigned ||
        filter.rejected ||
        filter.notTurned ||
        filter.dateStart ||
        filter.dateEnd ||
        filter.box ||
        filter.jt ||
        filter.startDate ||
        filter.endDate ||
        filter.subject ||
        filter.folio ||
        filter.status ||
        filter.require ||
        filter.ft ||
        filter.priority ||
        filter.confidential ||
        filter.searchQuery;

    }


    function _getOptions() {
      var options = {
        read: filter.read,
        turned: filter.turned,
        signed: filter.signed,
        needSign: filter.needSign,
        notSigned: filter.notSigned,
        priority: filter.priority,
        rejected: filter.rejected,
        unread: filter.unread,
        pending: filter.pending,
        confidential: filter.confidential,
        notTurned: filter.notTurned,
        searchQuery: filter.searchQuery,
        dateStart: filter.dateStart,
        dateEnd: filter.dateEnd,
        folderID: filter.folderID,




        box: filter.box,
        jt: filter.jt,
        startDate: filter.startDate,
        endDate: filter.endDate,
        subject: filter.subject,
        folio: filter.folio,
        status: filter.status,
        require: filter.require,
        ft: filter.ft,
        importance: filter.importance
      };
      return options;
    }

    function onClean() {
      filter.read = false;
      filter.unread = false;
      filter.pending = false;
      filter.signed = false;
      filter.needSign = false;
      filter.notSigned = false;
      filter.turned = false;
      filter.priority = false;
      filter.rejected = false;
      filter.confidential = false;
      filter.notTurned = false;
      filter.searchQuery = '';
      filter.dateStart = null;
      filter.dateEnd = null;
      filter.folderID = null;
      onFilter();
    }

    return filter;
  }
})();
