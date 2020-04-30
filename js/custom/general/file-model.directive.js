(function () {
  'use strict';
  angular.module('app.general').directive('fileModel', fileModel);
  fileModel.$inject = ['$parse', 'fileList'];

  function fileModel($parse, files) {
    files.init();
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var isMultiple = attrs.multiple;
        var modelSetter = model.assign;

        element.bind('change', function () {
          var values = [];
          angular.forEach(element[0].files, function (item) {
            var value = {
              // File Name
              name: item.name,
              //File Size
              size: item.size,
              // css class icon
              classIcon: getClassIcon(item.name),
              //File URL to view
              url: URL.createObjectURL(item),
              // File Input Value
              _file: item
            };
            values.push(value);
          });
          scope.$apply(function () {
            files.setItems(values); // = files.concat(values);
            if (isMultiple) {
              modelSetter(scope, values);
            } else {
              modelSetter(scope, values[0]);
            }
          });
        });

        function getClassIcon(name) {
          var arr = name.split('.');
          var ext = arr[arr.length - 1].toLowerCase();
          var fileIcon = '';
          switch (ext) {
            case 'zip':
            case 'rar':
              fileIcon = 'fa fa-file-zip-o';
              break;
            case 'doc':
            case 'docx':
              fileIcon = 'fa fa-file-word-o';
              break;
            case 'png':
            case 'jpg':
            case 'jpeg':
              fileIcon = 'fa fa-file-image-o';
              break;
            case 'pdf':
              fileIcon = 'fa fa-file-pdf-o';
              break;
            case 'ptt':
            case 'pttx':
              fileIcon = 'fa fa-file-powerpoint-o';
              break;
            case 'txt':
              fileIcon = 'fa fa-file-text-o';
              break;
            case 'xls':
            case 'xlsx':
              fileIcon = 'fa fa-file-excel-o';
              break;
            case 'mp3':
              fileIcon = 'fa fa-file-audio-o';
              break;
            default:
              fileIcon = 'fa fa-file-o';
          }
          return fileIcon;
        }
      }
    };
  }
})();
