(function () {
  'use strict';
  angular.module('app.general').factory('File', File);

  File.$inject = ['$q', '$window'];

  function File($q, $window) {
    var onlyBlob = false;
    var file = {
      unzip: unzip
    };

    function unzip(file, options) {
      var defer = $q.defer();
      var files = [];
      if (options && options.onlyBlob) {
        onlyBlob = true;
      }
      getFiles(file, function (err, files) {
        if (err) {
          defer.reject(err);
        } else {
          defer.resolve(orderFilesByKind(files));
        }
      });
      return defer.promise;
    }

    function getFiles(zipFile, cb) {
      JSZip.loadAsync(zipFile).then(
        function (zip) {
          var files = [];
          window.myFile = zip;
          zip.forEach(function (relativePath, zipEntry) {
            var file = {
              relativePath: relativePath,
              zipEntry: zipEntry,
              name: zipEntry.name
            };
            files.push(file);
          });
          processArray(files, processFile).then(
            function () {
              cb(null, files);
            },
            function (err) {
              cb(err);
            }
          );
        },
        function (err) {
          alert('Error reading: ' + e.message);
          cb(err);
        }
      );
    }

    function processArray(array, fn) {
      var index = 0;

      return new Promise(function (resolve, reject) {
        function next() {
          if (index < array.length) {
            fn(array[index++]).then(next, reject);
          } else {
            resolve();
          }
        }
        next();
      });
    }

    function processFile(item) {
      return new Promise(function (resolve, reject) {
        var fileType = 'blob';
        var isPDF = false;
        item.extension = getExtension(item.name);
        item.cssClass = getCssClassForFile(item.extension);
        // var isPDF = item.extension === 'pdf';

        if (item.extension === 'pdf' && !onlyBlob) {
          fileType = 'arraybuffer';
          isPDF = true;
        }

        item.zipEntry.async(fileType).then(function (binaryFile) {
          item.binaryFile = binaryFile;
          item.downloadURL = isPDF ?
            $window.URL.createObjectURL(
              new Blob([binaryFile], {
                type: 'application/pdf'
              })
            ) :
            $window.URL.createObjectURL(binaryFile);
          resolve();
        });
      });
    }

    function getCssClassForFile(extension) {
      var cssClass = 'fa-file-o';
      switch (extension) {
        case 'png':
        case 'jpeg':
        case 'jpg':
        case 'gif':
          cssClass = 'fa-file-image-o';
          break;

        case 'pdf':
          cssClass = 'fa-file-pdf-o';
          break;

        case 'zip':
        case 'rar':
          cssClass = 'fa-file-zip-o';
          break;

        case 'doc':
        case 'docx':
          cssClass = 'fa-file-word-o';
          break;

        case 'ppt':
        case 'pptx':
          cssClass = 'fa-file-powerpoint-o';
          break;

        case 'xls':
        case 'xlsx':
          cssClass = 'fa-file-excel-o';
          break;

        case 'txt':
        case 'rtf':
          cssClass = 'fa-file-text-o';
          break;

        case 'mp4':
        case '3g2':
        case '3gp':
        case 'asf':
        case 'avi':
        case 'flv':
        case 'm4v':
        case 'mov':
        case 'mpg':
        case 'rm':
        case 'srt':
        case 'swf':
        case 'vob':
        case 'wmv':
          cssClass = 'fa-file-video-o';
          break;

        case 'mp3':
        case 'aif':
        case 'iff':
        case 'm3u':
        case 'm4a':
        case 'mid':
        case 'mpa':
        case 'wav':
        case 'wm':
          cssClass = 'fa-file-audio-o';
          break;

        default:
          cssClass = 'fa-file-o';
          break;
      }
      return cssClass;
    }

    function orderFilesByKind(files) {
      var filesByKind = {
        images: [],
        pdf: [],
        others: []
      };
      for (let i = 0; i < files.length; i++) {
        var file = files[i];

        if (isImage(file)) {
          filesByKind.images.push(file);
        } else if (file.extension === 'pdf') {
          filesByKind.pdf.push(file);
        } else {
          filesByKind.others.push(file);
        }
      }
      return filesByKind;
    }

    function getExtension(fileName) {
      return fileName
        .split('.')
        .pop()
        .toLowerCase();
    }

    function isImage(file) {
      var imageExtensions = ['png', 'jpeg', 'jpg', 'gif'];

      return imageExtensions.indexOf(file.extension) >= 0;
    }

    return file;
  }
})();
