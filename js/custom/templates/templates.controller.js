(function () {
  'use strict';

  angular.module('app.templates').controller('TemplatesCtrl', TemplatesCtrl);
  TemplatesCtrl.$inject = ['$state', 'templatesFactory', 'socket', 'swalFactory', 'paginatorFactory', 'filterFactory', 'profileFactory'];

  var DATE_FORMAT = 'DD/MM/YYYY';
  var DATE_MONTHNAME_FORMAT = 'DD/MMMM/YYYY';
  var DATE_EXTENDED_FORMAT = 'DD [de] MMMM [del] YYYY';
  var Roles = {
    NORMAL: 1,
    ADMIN: 2,
    MASTER: 3
  };

  function TemplatesCtrl($state, templatesFactory, socket, swalFactory, paginatorFactory, filterFactory, Profile) {
    var vm = this;

    vm.Roles = Roles;
    vm.secretariates = [];
    vm.filter = filterFactory;
    vm.isOnCompose = false;
    vm.show = false;
    vm.selectTemplate = selectTemplate;
    vm.editTemplate = editTemplate;
    vm.canEdit = canEdit;
    vm.canSave = canSave;
    vm.isOnComposeFunction = isOnComposeFunction;
    vm.saveFunction = null;
    vm.specialTypes = {
      TABLE: 'table'
    };


    vm.onCompose = onCompose;

function onCompose(){
  console.log('a orale');
  return false;
}




    function getCommonTemplateOptions() {
      return {
        lang: 'es-MX',
        toolbar: [
          ['edit', ['undo', 'redo']],
          ['headline', ['style']],
          [
            'style', [
              'bold',
              'italic',
              'underline',
              'superscript',
              'subscript',
              'strikethrough',
              'clear'
            ]
          ],
          ['fontface', ['fontname']],
          ['textsize', ['fontsize']],
          ['fontclr', ['color']],
          ['alignment', ['ul', 'ol', 'paragraph', 'lineheight']],
          ['height', ['height']],
          // ['table', ['table']],
          ['insert', ['link', 'picture']],
          ['view', ['fullscreen', 'codeview']]
        ],
        popover: {
          image: [
            ['image', ['resizeFull', 'resizeHalf', 'resizeQuarter', 'resizeNone']],
            ['float', ['floatLeft', 'floatRight', 'floatNone']],
            ['remove', ['removeMedia']]
          ],
          link: [
            ['link', ['linkDialogShow', 'unlink']]
          ],
          // table: [
          //   ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
          //   ['delete', ['deleteRow', 'deleteCol', 'deleteTable']],
          // ],
          air: [
            ['color', ['color']],
            ['font', ['bold', 'underline', 'clear']],
            ['para', ['ul', 'paragraph']],
            ['table', ['table']],
            ['insert', ['link', 'picture']]
          ]
        }
        ,
        disableResizeEditor: false,
        hint: {
          mentions: [],
          search: vm.searchVariableHint,
          match: /\B@(\w*)(\/{0,2}|_*)/
        }
      };
    }
    // vm.clean = {
    //   height: 700,
    //   lang: 'es-MX',
    //   toolbar: [
    //     ['misc', ['print']]
    //   ],
    //   disableResizeEditor: true
    // };
    // vm.clear = {
    //   height: 700,
    //   lang: 'es-MX',
    //   toolbar: [
    //     ['misc', ['print']]
    //   ],
    //   disableResizeEditor: true
    // };

    function getSecretariates() {
      socket.emit('getSecretariats', {}, function (error, data) {
        vm.secretariates = data;
      });
    }


    function activate() {
      vm._isLoading = false;
      vm.secretariates = [];
      vm.documentTypes = [];
      templatesFactory.getDocumentTypes(function (err, documentTypes) {
        console.log('document typES = ', documentTypes);
        vm.documentTypes = documentTypes ? documentTypes : [];
      });

      getSecretariates();

      vm.init();

      Profile.getProfile().then(function (profile) {

        templatesFactory.getVariableTypes(function (err, variableTypes) {
          vm.variableTypes = variableTypes ? variableTypes : [];
        });

        vm.profile = profile;
        vm.profile = profile;
        vm.paginator = paginatorFactory;
        vm.paginator.init('templates');
        vm.private = false;
        switch ($state.current.name) {
          case 'app.templates.compose':
            if (!vm.profile.jobTitleID) {
              swalFactory.error('No puedes acceder al contenido');
              $state.go('app.mailbox.internal.in');
              return;
            }

            getVariableTypes()
              .then(function () {
                vm._isLoading = false;
                vm.variables = [].concat(vm.fixedVariables);
                vm.fixedVariables.map(function (fixedVariable, index) {
                  vm.onChangeVariableType(index);
                });
              })
              .catch(function () {
                vm._isLoading = false;
              });
            vm.isOnCompose = true;
            break;
          case 'app.templates.edit':
            vm.isOnEdit = true;
            getVariableTypes().then(function () {
              _getTemplate($state.params.mid);

            });
            break;
          case 'app.templates.show':
          default:
            vm.isOnCompose = false;
            getVariableTypes().then(function () {
              _getTemplate($state.params.mid);
            });
            break;
        }
      }, function (err) {
        console.error('Error addMember on getProfile', err);
      });


    }

    function fullContent2Png() {
      var element = document.getElementById('html2image');
      element.innerHTML = vm.template.fullContent;
      // element.style.display = 'block';
      console.log("element.innerHTM", element.innerHTM);
      return domtoimage.toPng(element, { quality: 0.5 });
    }

    function _getTemplate(templateId) {
      console.log('template controller jala datos _getTemplate');
      templatesFactory.getTemplateById(templateId)
        .then(function (templateData) {
          console.log("Resuelve promesa ", templateData);
          if (vm.profile.roleID === Roles.NORMAL) {
            if ($state.current.name === 'app.templates.edit' && vm.profile.id !== templateData.authorID) {
              swalFactory.error('No puedes acceder al contenido no eres el autor de la plantilla');
              $state.go('app.templates.list');
              return;
            }
          } else if (vm.profile.roleID === Roles.ADMIN) {
            if ($state.current.name === 'app.templates.edit' && vm.profile.secretariateID !== templateData.secretariateID) {
              swalFactory.error('No puedes acceder al contenido no eres el administrador de la plantilla');
              $state.go('app.templates.list');
              return;
            }
          }

          var concatFixedVariables = [];
          if ($state.current.name === 'app.templates.edit') {
            var variableTypes = templateData.variables.map(function (variable) {
              return variable.type;
            });

            vm.fixedVariables.map(function (variable) {
              if (variableTypes.indexOf(variable.type) === -1) {
                concatFixedVariables.push(variable);
              }
            });
          }

          vm.template = templateData;
          vm.private = vm.template.private;

          vm.variables = [].concat(concatFixedVariables, vm.template.variables);
          if (_isOnPreview()) {
            vm.previewTemplate = vm.getTemplatePreview();
          }
          for (var i = 0; i < vm.variables.length; i++) {
            var variableTypeObject = vm.variableTypes.find(function (variable) {
              return variable.type === vm.variables[i].type;
            });

            vm.variables[i].typeObject = variableTypeObject;
          }

          vm._isLoading = false;
        })
        .catch(function (err) {
          console.log('Error en factory ', err)
        });
    }

    function getVariableTypes() {
      return new Promise(function (resolve, reject) {
        templatesFactory.getVariableTypes(function (err, variableTypes) {
          if (err) {
            reject(err);
          } else {
            var fixedVariables = [];
            var normalVariables = [];
            variableTypes.map(function (variable) {
              if (variable.fixed) {
                variable.typeObject = $.extend(true, {}, variable);
                fixedVariables.push($.extend(true, {}, variable, { variable: vm.getVariableName(variable.defaultVariable) }));
              } else {
                normalVariables.push(variable);
              }
            });
            vm.normalVariableTypes = normalVariables;
            vm.variableTypes = fixedVariables.concat(normalVariables);
            vm.fixedVariables = fixedVariables;
            vm.fixedVariables = fixedVariables;
            resolve(vm.variableTypes);
          }
        });
      });
    }

    function editTemplate() {
      return new Promise(function (resolve, reject) {
        templatesFactory.editTemplate(vm.template, function (error, template) {
          if (error) {
            reject(error);
          } else {
            resolve(template);
          }
        });
      });
    }

    function createTemplate() {
      if (vm.profile.roleID === Roles.NORMAL) {
        vm.template.private = 1;
      }


      return new Promise(function (resolve, reject) {
        templatesFactory.createTemplate(vm.template, function (error, template) {
          if (error) {
            reject(error);
          } else {
            resolve(template);
          }
        });
      });
    }

    function canEdit(item) {


      if ($state.current.name === 'app.templates.show') {
        return false;
      }
      if (vm.profile.roleID === Roles.ADMIN || vm.profile.roleID === Roles.MASTER) {
        return true;
      }
      if (item.authorID === vm.profile.id || item.jobTitleID === vm.profile.jobTitleID) {
        return true;
      }
      return false;
    }

    function canSave(item) {
      if ($state.current.name === 'app.templates.compose') {
        return true;
      }
      else {
        return canEdit(item);
      }
    }

    function selectTemplate(id) {
      console.log("Templeta controller jala datos");
      socket.emit(
        'getTemplate', {
        id: id
      },
        function (error, data) {
          console.log("Template controller selecciono el ", data);
          vm.template = data;
        }
      );
    }

    function isOnComposeFunction() {
      return 'app.templates.show' !== $state.current.name;
    }

    function _isOnPreview() {
      return !isOnComposeFunction();
    }










































































































    vm._isLoading = false;
    vm.saving = false;
    vm.previewTemplate = null;
    vm.fixedVariables = [];
    vm.defaultVariable = {
      name: '',
      variable: '',
      variableObject: '',
      type: '',
      typeObject: {},
      min: undefined,
      max: undefined,
      default_value: '',
      tableColumns: []
    };
    vm.defaultTemplate = {
      name: '',
      header: '',
      content: '',
      footer: '',
      signatureRequiered: 1,
      private: 0,
      variables: []
    };
    vm.templateHeaderOptions = {};
    vm.templateContentOptions = {};
    vm.templateFooterOptions = {};
    vm.template = {};
    vm.variables = [];
    vm.previewValues = {};
    vm.modalPreviewTemplate = angular.element('#modalPreviewTemplate').modal({ backdrop: true, show: false });





    vm.init = init;
    vm.getTemplatePreview = getTemplatePreview;
    vm.addVariable = addVariable;
    vm.saveTemplate = saveTemplate;
    vm.setVariableValues = setVariableValues;
    vm.getVariableTableContent = getVariableTableContent;
    vm.isDateVariable = isDateVariable;
    vm.isCurrentDateVariable = isCurrentDateVariable;
    vm.showPreviewTemplate = showPreviewTemplate;
    vm.closePreviewTemplate = closePreviewTemplate;
    vm.replaceVariableInContent = replaceVariableInContent;
    vm.isLoading = isLoading;
    vm.removeVariable = removeVariable;
    vm.getVariableName = getVariableName;
    vm.onChangeVariableName = onChangeVariableName;
    vm.onChangeVariableType = onChangeVariableType;
    vm.onAddTableColumn = onAddTableColumn;
    vm.onRemoveTableColumn = onRemoveTableColumn;
    vm.searchVariableHint = searchVariableHint;

    function init() {
      this.saving = false;
      this.templateHeaderOptions = $.extend(true, {}, getCommonTemplateOptions(), {
        height: 100
      });
      this.templateContentOptions = $.extend(true, {}, getCommonTemplateOptions(), {
        height: 500
      });
      this.templateFooterOptions = $.extend(true, {}, getCommonTemplateOptions(), {
        height: 100
      });
      this.template = $.extend(true, {}, this.defaultTemplate);
      this._isLoading = true;

      this.variables = [];
      this.previewValues = {};
    }

    function getTemplatePreview() {
      console.log("getTemplatePreview");
      this.setVariableValues();
      var newContent = this.template.fullContent;
      var _this = this;

      this.variables.map(function (variable) {
        var variableKey = variable.variable;
        var value = _this.previewValues[variableKey] || variableKey;

        newContent = newContent.split(variableKey).join(value);
      });

      return newContent;
    };

    function setVariableValues() {
      var _this = this;
      console.log("this.variables", this.variables);
      this.variables.map(function (variable, index) {
        if (variable.type === 'user_active') {
          _this.previewValues[variable.variable] = vm.profile.name;
        } else if (variable.type === 'user_secretariat') {
          _this.previewValues[variable.variable] = vm.profile.secretariateName;
        } else if (_this.isDateVariable(variable) || _this.isCurrentDateVariable(variable)) {
          var value = new Date();

          var momentValue = moment(value);
          var format = DATE_FORMAT;
          if (variable.type === 'date_ddmonthnameyyyy' || variable.type === 'current_date_ddmonthnameyyyy') {
            format = DATE_MONTHNAME_FORMAT;
          } else if (variable.type === 'date_extended' || variable.type === 'current_date_extended') {
            format = DATE_EXTENDED_FORMAT;
          }
          _this.previewValues[variable.variable] = !momentValue.isValid() ? '' : momentValue.format(format)
        } else if (variable.type === 'table') {
          _this.previewValues[variable.variable] = _this.getVariableTableContent(variable);
        } else {
          var defaultValue = variable.default_value || '';
          _this.previewValues[variable.variable] = defaultValue || variable.name;
        }
      });
    };

    function getVariableTableContent(variable) {
      return '<table class="table table-bordered">' +
        '<thead><tr>' + ((variable.tableColumns || []).map(function (column) {
          return '<th width="' + (column.width ? column.width : '') + '">' + column.name + '</th>';
        })).join('') + '</tr></thead>' +
        '<tbody><tr>' + (variable.tableColumns || []).map(function (column) {
          return '<td width="' + (column.width ? column.width : '') + '">' + (column.name || '') + '</td>';
        }).join('') + '</tr></tbody></table>';
    };


    function isDateVariable(variable) {
      return variable.type === 'date_ddmmyyyy_slash' || variable.type === 'date_ddmonthnameyyyy' || variable.type === 'date_extended';
    }

    function isCurrentDateVariable(variable) {
      return variable.type === 'current_date_ddmmyyyy_slash' || variable.type === 'current_date_ddmonthnameyyyy' || variable.type === 'current_date_extended';
    }

    function showPreviewTemplate() {
      console.log("showPreviewTemplate");
      vm.template.fullContent = '<header>' + vm.template.header + '</header>' +
        '<body>' + vm.template.content + '</body>' +
        '<footer>' + vm.template.footer + '</footer>';
      vm.previewTemplate = vm.getTemplatePreview();
      vm.modalPreviewTemplate.modal('show');
    }

    function closePreviewTemplate() {
      vm.modalPreviewTemplate.modal('hide');
    }



    function replaceVariableInContent(previousVariable, newVariable) {
      console.log("replaceVariableInContent");


      vm.template.header = vm.template.header.split(previousVariable).join(newVariable);
      vm.template.content = vm.template.content.split(previousVariable).join(newVariable);
      vm.template.footer = vm.template.footer.split(previousVariable).join(newVariable);
    }

    function isLoading() {
      return this._isLoading;
    }


    function addVariable() {
      this.variables.push($.extend(true, {}, this.defaultVariable));
    }

    function removeVariable(index) {
      this.replaceVariableInContent(this.variables[index].variable, '');
      this.variables.splice(index, 1);
    }







    function getVariableName(variableName) {
      return !variableName ? '' : '[//' + variableName.toUpperCase().split(' ').join('_') + '//]';
    }


    function onChangeVariableName(index, variableName) {
      var previousVariable = this.variables[index].variable;
      variableName = variableName || this.variables[index].name;
      this.variables[index].variable = this.getVariableName(variableName);

      if (previousVariable) {
        this.replaceVariableInContent(previousVariable, this.variables[index].variable);
      }
    }
    function onChangeVariableType(index) {
      var typeObject = this.variables[index].typeObject;
      var type = this.variables[index].typeObject.type
      if (typeObject.defaultVariable) {
        this.variables[index].name = typeObject.name || '';
        this.onChangeVariableName(index, typeObject.defaultVariable);
      }

      this.variables[index].type = type;
    }
    function onAddTableColumn(variable) {
      variable.tableColumns.push({
        name: '',
        width: '100%'
      });
    }
    function onRemoveTableColumn(variable) {
      variable.tableColumns.pop();
    }


    function searchVariableHint(keyword, callback) {
      callback($.grep(vm.variables, function (item) {
        if (!item.variable) {
          return false;
        }
        return item.variable.indexOf(keyword) === 0;
      }).map(function (variable) {
        return variable.variable;
      }).sort());
    }

    function saveTemplate() {
      if (vm.template.content === '') {
        swalFactory.error('El contenido no debe estar vacío');
        return;
      }
      // vm.template.type = vm.template.type.id;

      var hasMissingType = false;
      var variableTypes = vm.variables.map(function (variable) {
        if (!hasMissingType && !variable.type) {
          hasMissingType = true;
        }

        return variable.type;
      });

      if (hasMissingType) {
        swalFactory.error('Todas las variables deben tener un tipo asignado');
        return;
      }

      var missingFixedVariables = [];
      vm.fixedVariables.map(function (variable) {
        if (variableTypes.indexOf(variable.type) === -1) {
          missingFixedVariables.push(variable.name);
        }
      });

      if (missingFixedVariables.length > 0) {
        swalFactory.error('Las siguientes variables deben estar configuradas: ' + missingFixedVariables.join(', '));
        return;
      }

      var missingVariables = [];
      for (var i = 0; i < vm.fixedVariables.length; i++) {
        var variable = vm.fixedVariables[i];
        if (!(vm.template.header.indexOf(variable.variable) !== -1 ||
          vm.template.content.indexOf(variable.variable) !== -1 ||
          vm.template.footer.indexOf(variable.variable) !== -1)
        ) {
          missingVariables.push(variable.variable);
        }
      }

      for (var i = 0; i < vm.variables.length; i++) {
        var variable = vm.variables[i];
        if (!(vm.template.header.indexOf(variable.variable) !== -1 ||
          vm.template.content.indexOf(variable.variable) !== -1 ||
          vm.template.footer.indexOf(variable.variable) !== -1)
        ) {
          if (missingVariables.indexOf(variable.variable) === -1) {
            missingVariables.push(variable.variable);
          }
        }
      }

      if (missingVariables.length > 0) {
        swalFactory.error('Las siguientes variables deben estar en la plantilla: ' + missingVariables.join(', '));
        return;
      }

      vm.template['profile'] = vm.profile;
      vm.template.variables = vm.variables;

      vm.saving = true;
      fullContent2Png()
        .then(function (imgBase64) {
          imgBase64 = imgBase64.replace(/^data:image\/png;base64,/, '');
          vm.template.previewImage = imgBase64;

          if (vm.isOnComposeFunction()) {
            var saveFunction = null;
            if (vm.isOnEdit) {
              saveFunction = editTemplate;
            } else {
              saveFunction = createTemplate;
            }

            saveFunction()
              .then(function (templateSaved) {
                vm.saving = false;
                vm.template = $.extend(true, {}, vm.defaultTemplate);
                // vm.paginator.refreshPage();
                $state.go('app.templates.list');
                swalFactory.success('Plantilla guardada');
              })
              .catch(function (error) {
                vm.saving = false;
                console.warn('Saved error', error);
                swalFactory.error(error.message);
              });
          }
        })
        .catch(function (error) {
          vm.saving = false;
          console.error('Error al generar el preview', error);
          swalFactory.error('Error al generar vista previa');
        });
    }































































































































    activate();
  }
})();

