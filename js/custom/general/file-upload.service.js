(function () {
  'use strict';
  angular.module('app.general').directive('fileUpload', fileUpload);
  fileUpload.$inject = ['$http'];

  function fileUpload($http) {
    this.uploadFileToUrl = function (file, uploadUrl) {
      var fd = new FormData();
      fd.append('file', file);
      $http
        .post(uploadUrl, fd, {
          transformRequest: angular.identity,
          headers: {
            'Content-Type': undefined
          }
        })
        .success(function () {})
        .error(function () {});
    };
  }
})();
