(function () {
  'use strict';

  angular.module('app.templates').factory('templatesFactory', templatesFactory);

  templatesFactory.$inject = ['$q', '$http', 'socket'];

  function templatesFactory($q, $http, socket) {
    var selectedTemplate = null;
    var service = {




      getTemplates: getTemplates,

      getTemplatesPag: getTemplatesPag,



      getTemplatesMostUsedPag: getTemplatesMostUsedPag,
      createTemplate: createTemplate,
      editTemplate: editTemplate,
      getListOfTemplates: getListOfTemplates,
      getTemplateById: getTemplateById,
      getDocumentTypes: getDocumentTypes,
      getVariableTypes: getVariableTypes,
      incrementUsedCounter: incrementUsedCounter,
      setCurrentTemplate: setCurrentTemplate,
      getCurrentTemplate: getCurrentTemplate,
      deleteTemplate: deleteTemplate
    };
    return service;



    function setCurrentTemplate(template) {
      selectedTemplate = template;
    }

    function getCurrentTemplate() {
      return selectedTemplate;
    }

    function createTemplate(json, callback) {
      socket.emit('createTemplate', json, callback);
    }


    function getTemplatesMostUsedPag(params, callback) {
      var deferred = $q.defer();
      socket.emit('getTemplatesMostUsedPag', params, function (error, data) {
        if (!error) {
          deferred.resolve(data);
        } else {
          deferred.reject(error);
        }
      });
      return deferred.promise;



    }
    function getTemplatesPag(params, callback) {
      var deferred = $q.defer();
      socket.emit('getTemplatesPag', params, function (error, data) {
        if (!error) {
          deferred.resolve(data);
        } else {
          deferred.reject(error);
        }
      });
      return deferred.promise;

    }




    function editTemplate(json, callback) {

      socket.emit('editTemplate', json, callback);
    }

    function getTemplates(params) {

      var deferred = $q.defer();
      socket.emit('getTemplates', params, function (error, data) {
        if (!error) {
          deferred.resolve(data);
        } else {
          deferred.reject(error);
        }
      });
      return deferred.promise;
    }



    function getDocumentTypes(cb) {

      socket.emit('getDocumentTypes', {}, cb);
    }

    function getVariableTypes(cb) {

      socket.emit('getVariableTypes', {}, cb);
    }
    function deleteTemplate(template, cb) {
      console.log("deleteTemplate factory", template);
      socket.emit('deleteTemplate', template, cb);
    }

    function getListOfTemplates() {

      var deferred = $q.defer();

      socket.emit('getListOfTemplates', {}, function (error, data) {
        if (!error) {

          deferred.resolve(data);
        } else {
          deferred.reject(erro);
        }
      });
      return deferred.promise;
    }

    function getTemplateById(id) {
      var deferred = $q.defer();
      socket.emit('getTemplate', {
        id: id
      }, function (error, data) {
        if (!error) {
          deferred.resolve(data);
        } else {
          deferred.reject(error);
        }
      });
      return deferred.promise;
    }

    function incrementUsedCounter(data, callback) {

      socket.emit('incrementUsedCounter', data, callback);
    }
  }
})();

