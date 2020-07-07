// Add info toID and toJT into TOs for create documents
(function () {
  'use strict';

  var DATE_FORMAT = 'DD/MM/YYYY';
  var DATE_MONTHNAME_FORMAT = 'DD/MMMM/YYYY';
  var DATE_EXTENDED_FORMAT = 'DD [de] MMMM [del] YYYY';
  var TIME_FORMAT = 'h:mm a';
  moment.locale('es_MX');

  angular.module('app.mailbox').factory('composeFactory', composeFactory);

  function getMinTemplateOptions() {
    return {
      height: 700,
      contenteditable: false,
      toolbar: [
        ['view', []]
      ]
    }
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
        ['table', ['table']],
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
        table: [
          ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
          ['delete', ['deleteRow', 'deleteCol', 'deleteTable']],
        ],
        air: [
          ['color', ['color']],
          ['font', ['bold', 'underline', 'clear']],
          ['para', ['ul', 'paragraph']],
          ['table', ['table']],
          ['insert', ['link', 'picture']]
        ]
      },
      disableResizeEditor: true
    };
  }

  composeFactory.$inject = [
    'socket',
    '$state',
    '$rootScope',
    'swalFactory',
    'profileFactory',
    'templatesFactory',
    'DocumentFactory',
    'fileList',
    '$sce'
  ];

  function composeFactory(socket, $state, $rootScope, swalFactory, Profile, templatesFactory, Doc, fileList, $sce) {
    var draftID = null;
    var contacts = [];
    var prossesing = false;
    var attachmentCount = 0;
    var globalDraftID = null;

    var userAction = false;
    var profile = null;

    var secretariats = [];
    var compose = {
      selectedCommissioner: {},
      profile: {},

      init: init,
      groups: [],
      start: true,
      document: {},
      contacts: [],
      isDraft: false,
      prossesing: false,
      haveDeadline: false,
      setTemplate: setTemplate,
      tagTransform: tagTransform,
      tagTransformGroup: tagTransformGroup,
      tagTransformSecretariat: tagTransformSecretariat,
      selectedTo: [],
      selectedToCc: [],
      selectedColaborators: [],
      selectedGroup: [],
      colaboration: false,
      canAddGroup: true,

      listToPrivateMessages: [],
      listPrivateMessages: [],
      files: [],
      fileList: fileList,
      editedAttachments: false,
      isUnzipFiles: false,
      unzipFiles: unzipFiles,
      showUploadFiles: showUploadFiles,
      onRemoveTo: onRemoveTo,
      onSelectTo: onSelectTo,
      onSelectToCc: onSelectToCc,
      toggleSignatureRequirement: toggleSignatureRequirement,

      onRemoveColaboration: onRemoveColaboration,
      onSelectColaboration: onSelectColaboration,

      onSelectGroup: onSelectGroup,

      onSelectDraftTo: onSelectDraftTo,
      removeFile: removeFile,
      addMessage: addMessage,
      createDocument: createDocument,
      setEmails: setEmails,
      saveDraft: saveDraft,
      error: '',
      deleteDraft: _deleteDraft,
      listColaborators: [],
      truncateDraft: false,
      external: false,
      externalInfo: {
        initialDate: '',
        office: '',
        organism: '',
        description: '',
        commissioned: [],
        cc: [],
        activity: '',
        document: ''
      },
      secretariats: [],
      onChangeVariable: onChangeVariable,
      areAllVariablesFilled: areAllVariablesFilled,
      onAddTableRow: onAddTableRow,
      onRemoveTableRow: onRemoveTableRow,
      isDateVariable: isDateVariable,
      isCurrentDateVariable: isCurrentDateVariable,
      showPreviewTemplate: showPreviewTemplate,
      closePreviewTemplate: closePreviewTemplate,
      printDocument: printDocument,
      templateViewContentOptions: $.extend(true, {}, getMinTemplateOptions(), {
        height: 700
      }),
      templateFullContentOptions: $.extend(true, {}, getCommonTemplateOptions(), {
        height: 700,
        // callbacks: {
        //   onChange: function(contents, $editable) {
        //     console.warn('changed', contents);
        //     compose.templateFullContent = contents;
        //     compose.originalContent = compose.templateFullContent;
        //   }
        // }
      }),
      templateFullContent: '',
      getFullSize: getFullSize,
      proceso: proceso,
      parseIntFa: parseIntFa
    };


    function parseIntFa(data){
      console.log("asdasdasdasdadssad");
      return parseInt(data);
    }


    function proceso() {
      var newContent = compose.templateFullContent;
      compose.variables.map(function (variable) {
        var variableKey = variable.variable;
        var value = compose.variableValues[variableKey] || variableKey;

        if (value && (isDateVariable(variable) || isCurrentDateVariable(variable))) {
          var momentValue = moment(value);
          var format = DATE_FORMAT;
          if (variable.type === 'date_ddmonthnameyyyy' || variable.type === 'current_date_ddmonthnameyyyy') {
            format = DATE_MONTHNAME_FORMAT;
          } else if (variable.type === 'date_extended' || variable.type === 'current_date_extended') {
            format = DATE_EXTENDED_FORMAT;
          }
          value = !momentValue.isValid() ? '' : momentValue.format(format)
        } else if (value && variable.type === 'time') {
          var momentValue = moment(value);
          value = !momentValue.isValid() ? '' : momentValue.format(TIME_FORMAT)
        } else if (variable.type === 'table') {
          value = getVariableTableContent(variable);
        }

        newContent = newContent.split(variableKey).join(value);
      });

      compose.document.content = newContent;
      compose.templateFullContent = newContent;
      // getRawDocumentElements();

    }

    function init(draft) {

      compose.templateLoaded = false;
      compose.originalContent = '';
      compose.variableValues = {};
      compose.variables = [];
      globalDraftID = null;
      userAction = false;
      compose.isDraft = false;
      compose.today = new Date();
      fileList.init([]);
      attachmentCount = 0;

      socket.emit('getSecretariats', {}, function (error, secretariats) {
        compose.secretariats = secretariats;
      });

      compose.truncateDraft = false;
      Profile.get(function (error, profile) {

        if (profile.jobTitle === "" || profile.jobTitle === undefined || profile.jobTitle === null || profile.cerID === "" || profile.cerID === undefined || profile.cerID === null) {
          // $state.go('app.profile.internal');
          compose.isDraft = true;
          compose.truncateDraft = true;
        }

        compose.profile = profile;
        console.warn('profile', profile);
      });
      draftID = null;
      compose.start = true;
      compose.external = false;
      compose.deadline = new Date();
      compose.showTo = true;
      compose.document = {
        variables: []
      };
      compose.document.content = '';// '<p style="text-align: right; ">[folio]</p>';
      compose.templateLoaded = false;
      compose.fileURL = null;
      compose.prossesing = false;
      compose.prossesingDeleteDraft = false;
      compose.haveDeadline = false;
      compose.havePriority = false;
      compose.isConfidential = false;
      compose.colaboration = false;
      compose.canAddGroup = true;
      compose.havePrivateMessages = false;
      compose.selectedTo = [];
      compose.selectedColaborators = [];
      compose.selectedGroup = [];
      compose.draftTo = [];
      compose.listToPrivateMessages = [];
      compose.recipients = [];
      compose.listPrivateMessages = [];
      // compose.files = [];
      compose.isUnzipFiles = false;

      compose.password = "";
      compose.priority = false;
      compose.privateMessageContent = "";
      compose.error = "";
      compose.listColaborators = [];
      compose.templateFullContent = '';
      compose.loading = false;



      if (draft && draft.templateVariableValues) {



        compose.templateFullContent = draft.template.fullContent;
        compose.variableValues = draft.variableValues;
        compose.variables = draft.template.variables;
        compose.templateId = draft.template.id;
        compose.draftID = draft.id;
        console.log('****************+');
        console.log('compose.variableValues', compose.variableValues);
        console.log('****************+');
        console.log('compose.variables', compose.variables);
        console.log('****************+');

        for (let i = 0; i < compose.variables.length; i++) {
          const element = compose.variables[i];
          if (element.type.indexOf("date") !== -1) {
            var oldDate = compose.variableValues[element.variable];
            console.log("oldDate oldDate oldDate oldDate ", oldDate);
            var newDate = new Date(oldDate);
            console.log("newDate newDate newDate newDate ", newDate);
            compose.variableValues[element.variable] = newDate;
          }
        }



      }

      _getContacts(function () {
        socket.emit("getGroups", {}, function (err, groups) {
          compose.groups = groups;
        });

        if (draft) {
          _setupDraft(draft);
        }
      });
    }


    function getFullSize() {

      var size = 0;


      for (let i = 0; i < compose.fileList.getItems().length; i++) {
        var element = compose.fileList.getItems()[i];
        if (element.zipEntry) {
          element.old = true;
        }
        if (element && element.binaryFile && element.binaryFile.byteLength) {
          size += element.binaryFile.byteLength;
        } else if (element && element.binaryFile && element.binaryFile.size) {
          size += element.binaryFile.size;
        } else if (element && element.size) {
          size += element.size;
        }

      }

      return size;
    }





    function NOW() {


      var date = new Date();
      var aaaa = date.getFullYear();
      var gg = date.getDate();
      var mm = (date.getMonth() + 1);

      if (gg < 10)
        gg = "0" + gg;

      if (mm < 10)
        mm = "0" + mm;

      var cur_day = aaaa + "-" + mm + "-" + gg;

      var hours = date.getHours()
      var minutes = date.getMinutes()
      var seconds = date.getSeconds();

      if (hours < 10)
        hours = "0" + hours;

      if (minutes < 10)
        minutes = "0" + minutes;

      if (seconds < 10)
        seconds = "0" + seconds;

      return cur_day + " " + hours + ":" + minutes + ":" + seconds;

    }

    function onRemoveTo(item, model) {

      compose.contacts.push(item);
      _removeFromListRecipients(item);
      _removeFromPrivateMessages(item);
    }

    function onSelectTo(item, model) {



      if (!item.email) {

        item = {
          name: '',
          email: item
        }
      }
      var flag = 0;
      for (var i = 0; i < compose.selectedTo.length; i++) {
        if (item.email === compose.selectedTo[i].email) {
          flag++;
        }
        if (flag > 1) {
          swalFactory.error('Este usuario ya se encuentra en la lista para enviarle el oficio');
          var index = compose.selectedTo.indexOf(item);
          if (index >= 0) compose.selectedTo.splice(index, 1);
          return;
        }
      }

      for (var i = 0; i < compose.selectedToCc.length; i++) {
        if (item.email === compose.selectedToCc[i].email) {
          flag++;
        }
        if (flag > 1) {
          swalFactory.error('Este usuario ya se encuentra en la lista para enviarle el oficio');
          var index = compose.selectedTo.indexOf(item);
          if (index >= 0) compose.selectedTo.splice(index, 1);
          return;
        }
      }

      for (var i = 0; i < compose.selectedColaborators.length; i++) {
        if (item.email === compose.selectedColaborators[i].email) {
          flag++;
        }
        if (flag > 1) {
          swalFactory.error('Este usuario ya se encuentra en la lista para enviarle el oficio');

          var index = compose.selectedColaborators.indexOf(compose.selectedColaborators[i]);
          if (index >= 0) compose.selectedColaborators.splice(index, 1);

          compose.onRemoveColaboration(item, model)
          return;
        }
      }

      socket.emit('findEmailInContacts', item.email, function (err, contact) {

        if (!contact) {
          console.log("Es uno nuevo onSelectTo");
        } else {
          item = contact;
        }

        if (_isEmail(item.email)) {

          _findEmailInDocument(item.email);
          var index = _findEmailInList(item.email, compose.contacts);
          console.error("_findEmailInList 1", index);

          compose.listToPrivateMessages.push(item);
          item.needSign = true;
          compose.recipients.push(item);


          if (index >= 0) {
            item.isNew = false;
            compose.contacts.splice(index, 1);
          } else {
            item.isNew = true;
          }


        } else {
          swalFactory.error("Ingresa un correo electrónico válido");
          compose.error = "Ingresa un correo electrónico válido";




          var index = compose.selectedTo.indexOf(item);
          if (index >= 0) compose.selectedTo.splice(index, 1);
        }
      });
    }

    function onSelectToCc(item, model) {


      var flag = 0;
      for (var i = 0; i < compose.selectedTo.length; i++) {
        if (item.email === compose.selectedTo[i].email) {
          flag++;
        }
        if (flag > 1) {
          swalFactory.error('Este usuario ya se encuentra en la lista para enviarle el oficio');
          var index = compose.selectedToCc.indexOf(item);
          if (index >= 0) compose.selectedToCc.splice(index, 1);
          return;
        }
      }

      for (var i = 0; i < compose.selectedToCc.length; i++) {
        if (item.email === compose.selectedToCc[i].email) {
          flag++;
        }
        if (flag > 1) {
          swalFactory.error('Este usuario ya se encuentra en la lista para enviarle el oficio');
          var index = compose.selectedToCc.indexOf(item);
          if (index >= 0) compose.selectedToCc.splice(index, 1);
          return;
        }
      }

      for (var i = 0; i < compose.selectedColaborators.length; i++) {
        if (item.email === compose.selectedColaborators[i].email) {
          flag++;
        }
        if (flag > 1) {
          swalFactory.error('Este usuario ya se encuentra en la lista para enviarle el oficio');

          var index = compose.selectedColaborators.indexOf(compose.selectedColaborators[i]);
          if (index >= 0) compose.selectedColaborators.splice(index, 1);

          compose.onRemoveColaboration(item, model)
          return;
        }
      }

      socket.emit('findEmailInContacts', item.email, function (err, contact) {
        if (!contact) {
          console.log("Es uno nuevo onSelectToCc");
        } else {
          item = contact;
        }

        if (_isEmail(item.email)) {

          _findEmailInDocument(item.email);
          var index = _findEmailInList(item.email, compose.contacts);
          console.error("_findEmailInList 2", index);
          if (index >= 0) {
            compose.contacts.splice(index, 1);
          }
          compose.listToPrivateMessages.push(item);
          item.needSign = false;
          compose.recipients.push(item);

        } else {
          swalFactory.error("Ingresa un correo electrónico válido");
          compose.error = "Ingresa un correo electrónico válido";
          var index = compose.selectedToCc.indexOf(item);
          if (index >= 0) compose.selectedToCc.splice(index, 1);
        }
      });
    }

    function onSelectGroup(item, model) {


      if (item.id) {
        socket.emit('getMembersOfGroupForCompose', {
          group: item.id
        }, function (err, member) {
          for (var i = 0; i < member.length; i++) {
            if (!_findEmailInDocument(member[i].userEmail)) {
              var index = _findEmailInList(member[i].userEmail, compose.contacts);
              console.error("_findEmailInList 3", index);
              if (index >= 0) {

                var auxItem = {
                  id: member[i].userID,
                  email: member[i].userEmail.toLowerCase(),
                  name: member[i].userName.toLowerCase(),
                  jobTitleID: member[i].memberJobTitleID,
                  jobTitle: member[i].memberJobTitleID,
                  needSign: true,
                  privateMessage: '',
                  read: false,
                  readAt: null,
                  signed: false,
                  signedAt: null,
                  state: 'Sin leer',
                  colaboration: compose.colaboration,
                  inColaboration: false
                };
                compose.listToPrivateMessages.push(auxItem);

                compose.selectedTo.push(auxItem);
                compose.recipients.push(auxItem);
                compose.contacts.splice(index, 1);
              }
            }
          }
        });
      }

      compose.selectedGroup = [];
    }

    function toggleSignatureRequirement(recipient) {

      recipient.needSign = !recipient.needSign;
    }

    function createDocument() {

      if (compose.prossesing) {
        return;
      };

      compose.prossesing = true;

      if (!compose.document.content) {
        swalFactory.error('Agrega contenido al documento');
        compose.error = 'Agrega contenido al documento';
        compose.prossesing = false;
        return;
      }

      if (compose.colaboration) {
        if (compose.selectedColaborators.length === 0) {
          swalFactory.error('Agrega colaboradores al documento');
          compose.error = 'Agrega colaboradores al documento';
          compose.prossesing = false;
          return;
        }
      }
      else {
        if (compose.recipients.length === 0) {
          swalFactory.error('Agrega destinatario al documento');
          compose.error = 'Agrega destinatario al documento';
          compose.prossesing = false;
          return;
        }
      }

      if (!compose.document.subject) {
        swalFactory.error('Agrega un asunto al documento');
        compose.error = 'Agrega un asunto al documento';
        compose.prossesing = false;
        return;
      }

      if (compose.password === '') {
        swalFactory.error('Ingresa tu contraseña');
        compose.prossesing = false;
        return;
      }

      if (compose.haveDeadline) {
        if (!compose.deadline) {
          swalFactory.error('Debe de asignar una fecha limite');
          compose.error = 'Debe de asignar una fecha limite';
          compose.prossesing = false;
          return;
        } else {
          var today = new Date();
          if (_getDate(today) > _getDate(compose.deadline)) {
            swalFactory.error('La fecha limite no puede ser anterior a hoy');
            compose.error = 'La fecha limite no puede ser anterior a hoy';
            compose.prossesing = false;
            return;
          }
        }
      }
      var auxTo = [];

      var auxFT = [];
      var auxCC = [];
      userAction = true;

      Profile.get(function (error, profile) {
        if (profile.jobTitle === "" || profile.jobTitle === undefined || profile.jobTitle === null) {
          vm.isDraft = true;
          vm.truncateDraft = true;
        }

        compose.profile = profile;

        var auxTo = [];
        if (compose.colaboration) {
          for (var i = 0; i < compose.listColaborators.length; i++) {
            auxTo.push({
              id: compose.listColaborators[i].item.id,
              jobTitleID: compose.listColaborators[i].item.jobTitleID,
              email: compose.listColaborators[i].item.email.toLowerCase(),
              name:
                compose.listColaborators[i].item.name ? compose.listColaborators[i].item.name.toLowerCase() :
                  'Nombre pendiente',
              privateMessage: compose.listColaborators[i].privateMessage ? compose.listColaborators[i].privateMessage : '',
              colaboration: true,
              inColaboration: true,
              type: compose.document.type || '',
              confidential: compose.isConfidential,
              deadline: compose.haveDeadline ? compose.deadline.getTime() : '',
              fromJT: profile.jobTitle._id,
              toJT: compose.listColaborators[i].item.jobTitle
            });
            auxFT.push({
              id: compose.listColaborators[i].item.id,
              jobTitleID: compose.listColaborators[i].item.jobTitleID,

              isNew: compose.listColaborators[i].item && compose.listColaborators[i].item.jobTitleID ? false : true,

              email: compose.listColaborators[i].item.email.toLowerCase(),
              name:
                compose.listColaborators[i].item.name ? compose.listColaborators[i].item.name.toLowerCase() :
                  'Nombre pendiente',
              privateMessage: compose.listColaborators[i].privateMessage ? compose.listColaborators[i].privateMessage : '',
              colaboration: true,
              inColaboration: true,
              type: compose.document.type || '',
              confidential: compose.isConfidential,
              deadline: compose.haveDeadline ? compose.deadline.getTime() : '',
              fromJT: profile.jobTitle._id,
              toJT: compose.listColaborators[i].item.jobTitle
            });

          }
        }

        for (var i = 0; i < compose.recipients.length; i++) {
          auxCC.push({
            id: compose.recipients[i].id,
            jobTitleID: compose.recipients[i].jobTitleID,
            isNew: compose.recipients[i] && compose.recipients[i].jobTitleID ? false : true,
            email: compose.recipients[i].email.toLowerCase(),
            name:
              compose.recipients[i].name ? compose.recipients[i].name.toLowerCase() : 'Nombre pendiente',
            privateMessage: compose.recipients[i].privateMessage ? compose.recipients[i].privateMessage : '',
            colaboration: compose.colaboration || false,
            inColaboration: false,
            type: compose.document.type || '',
            confidential: compose.isConfidential,
            deadline: compose.haveDeadline ? compose.deadline.getTime() : '',
            fromJT: profile.jobTitle._id,
            toJT: compose.recipients[i].jobTitle,
            needSign: compose.recipients[i].needSign
          });
          auxTo.push({
            id: compose.recipients[i].id,
            jobTitleID: compose.recipients[i].jobTitleID,
            email: compose.recipients[i].email.toLowerCase(),
            name:
              compose.recipients[i].name ? compose.recipients[i].name.toLowerCase() : 'Nombre pendiente',
            privateMessage: compose.recipients[i].privateMessage ? compose.recipients[i].privateMessage : '',
            colaboration: compose.colaboration || false,
            inColaboration: false,
            type: compose.document.type || '',
            confidential: compose.isConfidential,
            deadline: compose.haveDeadline ? compose.deadline.getTime() : '',
            fromJT: profile.jobTitle._id,
            toJT: compose.recipients[i].jobTitle,
            needSign: compose.recipients[i].needSign
          });
        }

        if (compose.havePrivateMessages) {
          for (var i = 0; i < compose.listPrivateMessages.length; i++) {

            for (var j = 0; j < auxFT.length; j++) {
              if (auxFT[j].email === compose.listPrivateMessages[i].to.email) {
                auxFT[j].privateMessage =
                  compose.listPrivateMessages[i].content;
                break;
              }
            }
            for (var j = 0; j < auxCC.length; j++) {
              if (auxCC[j].email === compose.listPrivateMessages[i].to.email) {
                auxCC[j].privateMessage =
                  compose.listPrivateMessages[i].content;
                break;
              }
            }


            for (var j = 0; j < auxTo.length; j++) {
              if (auxTo[j].email === compose.listPrivateMessages[i].to.email) {
                auxTo[j].privateMessage =
                  compose.listPrivateMessages[i].content;
                break;
              }
            }
          }
        }

        compose.document.from = {
          name: compose.profile.name,
          email: compose.profile.email,
          avatar: compose.profile.avatar,
          archived: false,
          readed: false
        };

        compose.document.auxFT = auxFT;
        compose.document.auxCC = auxCC;
        compose.document.to = auxTo;
        compose.document.ft = compose.colaboration;
        compose.document.priority = compose.havePriority;
        compose.document.confidential = compose.isConfidential;
        compose.document.password = compose.password;
        compose.document['external'] = compose.external;
        compose.document['externalInfo'] = compose.externalInfo;
        compose.document.deadline = compose.haveDeadline ? compose.deadline.getTime() : '';
        compose.document.signIt = true;

        var folio = compose.variableValues['[//FOLIO//]'];
        console.log("nuevo folio es ", folio);
        compose.document.content = compose.document.content.replace('[//FOLIO//]', folio);

        var data = {
          document: compose.document,
          files: _getFiles()
        };

        if (draftID) data.id = draftID;




        Doc.create(data, function (error, doc) {
          if (error) {
            compose.prossesing = false;
            if (!error.message)
              error['message'] = 'Ocurrio un error durante el proceso';
            swalFactory.error(error.message);
            compose.error = error.message;
          } else {
            templatesFactory.incrementUsedCounter({
              templateId: compose.templateId,
              userId: compose.profile.id,
              roleId: compose.profile.roleID,
              secretariateId: compose.profile.secretariateID,
              documentID: doc.id
            });
            Doc.getSignatures({ uuid: doc.uuid }, function (err, signatures) {
              var editData = {
                uuid: doc.uuid,
                firma: signatures.firmas[0]
              };
              Doc.setInitialSigned(editData, function (error, data) { });
            });

            compose.prossesing = false;
            if ('app.mailbox.draft' === $state.current.name) {
              $state.go('app.mailbox.internal.drafts');
            } else {
              if (globalDraftID) {
              }
              $state.go('app.mailbox.internal.drafts');
            }

            swalFactory.success('Se envió un nuevo oficio');
          }
        });
      });
    }

    function _removeFromPrivateMessages(item) {

      compose.listToPrivateMessages.splice(
        compose.listToPrivateMessages.indexOf(item),
        1
      );
      var index = -1;
      for (var i = 0; i < compose.listPrivateMessages.length; i++) {
        if (compose.listPrivateMessages[i].to.email === item.email) {
          index = i;
          break;
        }
      }
      if (index >= 0) {
        compose.listPrivateMessages.splice(index, 1);
      }
    }

    function _removeFromListRecipients(item) {

      compose.recipients.splice(compose.recipients.indexOf(item), 1);
    }

    function _deleteDraft() {

      compose.prossesingDeleteDraft = true;
      socket.emit("deleteDraft", draftID, function (error, flag) {
        compose.prossesingDeleteDraft = false;
        swalFactory.success("Borrador eliminado");
        $state.go("app.mailbox.internal.drafts");
      });
    }



    function bufferToBase64(buf) {
      var binstr = Array.prototype.map.call(buf, function (ch) {
        return String.fromCharCode(ch);
      }).join('');
      return btoa(binstr);
    }


    function onInitPDF() {
      console.log("onInitPDF");
    }
    function htmlToPdf() {
      console.log("htmlToPdf");
      socket.emit('htmlToPDFMaker', compose.document.content, function (err, solve) {
        console.log('error html to pdf', err);
        console.log('solve html to pdf', solve);

        var pdf = new Blob([solve], {
          type: "application/pdf"
        });

        compose.pdfBuffer = solve;
        compose.pdfBlop = pdf;
        compose.pdfUint8Array = new Uint8Array(solve);


        console.log("El pdf es pdf", pdf);



        // open a file in the viewer



        var fileURL = URL.createObjectURL(pdf);

        compose.pdfContent = $sce.trustAsResourceUrl(fileURL);


        //  window.open(fileURL);
        //  compose.pdfBuffer = new Uint8Array(solve);
        //   console.log("pdfBuffer", compose.pdfBuffer);



      });
    }

    function setTemplate(template) {

      compose.loading = true;

      var templateID = template && template.id ? template.id : template;
      console.log("Compose fctory template template template template", templateID);
      templatesFactory.getTemplateById(templateID).then(function (solve) {
        if (solve) {
          compose.loading = false;
          compose.templateId = templateID;
          compose.templateLoaded = true;
          compose.document.content = solve.fullContent + '';
          compose.originalContent = compose.document.content;
          compose.variableValues = {};
          compose.document.type = solve.type;
          compose.variables = solve.variables || [];

          compose.templateFullContent = compose.document.content;

          setInitialVariableValues();
        }
      });
    }

    function setInitialVariableValues() {

      compose.variables.map(function (variable, index) {
        if (variable.type === 'folio') {
          var secretariateData = compose.secretariats.find(function (secretaria) {
            return secretaria.id === compose.profile.secretariateID;
          });

          var folio = secretariateData.acronym + '-' + compose.profile.jobTitle.acronym + '-' + new Date().getFullYear() + '-' + compose.profile.jobTitle.count;
          compose.variableValues[variable.variable] = folio;
        } else if (variable.type === 'user_active') {
          compose.variableValues[variable.variable] = compose.profile.name;
        } else if (variable.type === 'user_secretariat') {
          compose.variableValues[variable.variable] = compose.profile.secretariateName;
        } else if (isCurrentDateVariable(variable)) {
          compose.variableValues[variable.variable] = new Date();
        } else if (variable.type === 'table') {
          compose.variableValues[variable.variable] = [];
        } else {
          var defaultValue = variable.default_value || '';

          if (variable.type === 'number' && defaultValue) {
            defaultValue = defaultValue || '';
            compose.variables[index].pattern = '[0-9]';

            if (variable.min || variable.max) {
              var min = variable.min || '';
              var max = variable.max || '';

              compose.variables[index].pattern = '[0-9]{' + min + ',' + max + '}';
            }
          }

          compose.variableValues[variable.variable] = defaultValue;
        }
      });
    }

    function onChangeVariable(variableChanged) {

      var newContent = compose.originalContent;
      compose.variables.map(function (variable) {
        var variableKey = variable.variable;
        var value = compose.variableValues[variableKey] || variableKey;

        if (value && (isDateVariable(variable) || isCurrentDateVariable(variable))) {
          var momentValue = moment(value);
          var format = DATE_FORMAT;
          if (variable.type === 'date_ddmonthnameyyyy' || variable.type === 'current_date_ddmonthnameyyyy') {
            format = DATE_MONTHNAME_FORMAT;
          } else if (variable.type === 'date_extended' || variable.type === 'current_date_extended') {
            format = DATE_EXTENDED_FORMAT;
          }
          value = !momentValue.isValid() ? '' : momentValue.format(format)
        } else if (value && variable.type === 'time') {
          var momentValue = moment(value);
          value = !momentValue.isValid() ? '' : momentValue.format(TIME_FORMAT)
        } else if (variable.type === 'table') {
          value = getVariableTableContent(variable);
        }

        newContent = newContent.split(variableKey).join(value);
      });

      compose.document.content = newContent;
    }

    function getVariableTableContent(variable) {

      var variableKey = variable.variable;
      // var value = [rowIndex][columnIndex] || variableKey;
      return '<table class="table table-bordered">' +
        '<thead><tr>' + (variable.tableColumns.map(function (column) {
          return '<th width="' + (column.width ? column.width : '') + '">' + column.name + '</th>';
        })).join('') + '</tr></thead>' +
        '<tbody>' + (compose.variableValues[variableKey] || []).map(function (row, rowIdx) {
          return '<tr>' + (row || []).map(function (column, columnIdx) {
            return '<td width="' + (column.width ? column.width : '') + '">' + (column.name || '') + '</td>';
          }).join('') + '</tr>';
        }).join('') + '</tbody></table>';
    }

    function areAllVariablesFilled() {

      return (compose.variables || []).every(function (variable) {
        console.log("variable", variable);
        console.log("variable.variable :", variable.variable, " : Values : ", compose.variableValues[variable.variable]);
        return !!compose.variableValues[variable.variable];
      });
    }

    function initModalPreviewTemplate() {

      if (!angular.element('#modalPreviewTemplate').modal) {
        angular.element('#modalPreviewTemplate').modal({ backdrop: true, show: false });
      }
    }

    function showPreviewTemplate() {

      compose.originalContent = compose.templateFullContent;
      initModalPreviewTemplate();
      compose.onChangeVariable();
      angular.element('#modalPreviewTemplate').modal('show');
      // compose.document.sheets = null;

      setTimeout(function () {
        getRawDocumentElements();
        $('.modal-backdrop').remove();
      }, 1000);
    }

    function getRawDocumentElements() {

      var $documentPreview = $('.document-preview');
      var headerElement = {};
      var footerElement = {};
      var elements = [];

      $documentPreview.children().each(function (elementIndex, documentElement) {
        var tagName = $(documentElement).prop("tagName").toLowerCase();
        var elementHeight = $(documentElement).outerHeight();
        var elementHTML = documentElement.outerHTML;

        var elementData = {
          height: elementHeight,
          html: elementHTML,
          tag: tagName
        };

        if (tagName === 'header') {
          headerElement = elementData;
        } else if (tagName === 'footer') {
          footerElement = elementData;
        }

        if (elementHeight) {
          elements.push(elementData);
        }
      });

      processSheets(headerElement, footerElement, elements);
    }

    function processSheets(header, footer, elements) {

      var SHEET_HEIGHT = 800;
      var sheets = [];
      var sheet = { sections: [], height: 0 };
      var workingSheet = Object.assign({}, sheet);

      function addSection(section) {

        workingSheet.sections.push(section);
        workingSheet.height += section.height;
      }

      function saveSheet(sheetToSave) {

        sheets.push(Object.assign({}, sheetToSave));
        workingSheet = { sections: [], height: 0 };
      }

      elements.forEach(function (section) {
        if (section.tag === 'header') {
          addSection(section);
        } else if (section.tag === 'footer') {
          addSection(section);
          saveSheet(workingSheet);
        } else {
          var newHeightWithFooter = workingSheet.height + section.height + footer.height;

          if (newHeightWithFooter < SHEET_HEIGHT) {
            addSection(section);
          } else {
            addSection(footer);
            saveSheet(workingSheet);
            addSection(header);
            addSection(section);
          }
        }
      });

      compose.document.sheets = sheets;
      $rootScope.$apply();
    }

    function printDocument() {

      $('.process-document').print();
    }

    function closePreviewTemplate() {

      initModalPreviewTemplate();
      angular.element('#modalPreviewTemplate').modal('hide');
    }

    function onAddTableRow(variable) {

      compose.variableValues[variable.variable].push((variable.tableColumns || []).map(function (column) {
        return {
          name: '',
          width: column.width
        };
      }));
      onChangeVariable(variable);
      // variable.tableColumns.push('');
    }

    function onRemoveTableRow(variable) {

      compose.variableValues[variable.variable].pop();
      onChangeVariable(variable);
      // variable.tableColumns.pop();
    }

    function isDateVariable(variable) {

      return variable.type === 'date_ddmmyyyy_slash' || variable.type === 'date_ddmonthnameyyyy' || variable.type === 'date_extended';
    }

    function isCurrentDateVariable(variable) {

      return variable.type === 'current_date_ddmmyyyy_slash' || variable.type === 'current_date_ddmonthnameyyyy' || variable.type === 'current_date_extended';
    }

    function tagTransform(newEmail) {


      var item = {
        name: newEmail,
        email: _cleanEmail(newEmail),
      };
      return item;
    }

    function tagTransformSecretariat(newEmail) {

      var item = {
        name: newEmail,
        email: newEmail
        // email: _cleanEmail(newEmail),
      };
      return item;
    }

    function tagTransformGroup(newGroup) {

      var item = {
        name: newGroup
        // email: _cleanEmail(newEmail),
      };
      return item;
    }

    function onRemoveColaboration(item, model) {

      compose.canAddGroup = false;
      var targen = -1;
      for (var i = 0; i < compose.listColaborators.length; i++) {
        if (item._id === compose.listColaborators[i].item._id) {
          targen = i;
        }
      }

      compose.listColaborators.splice(targen, 1);
      compose.contacts.push(item.item);
      _removeFromPrivateMessages(item.item);
    }

    function onSelectColaboration(item, model) {


      var flag = 0;
      for (var i = 0; i < compose.selectedTo.length; i++) {
        if (item.email === compose.selectedTo[i].email) {
          flag++;
        }
        if (flag > 1) {
          swalFactory.error('Este usuario ya se encuentra en la lista para enviarle el oficio');
          var index = compose.selectedColaborators.indexOf(item);
          if (index >= 0) compose.selectedColaborators.splice(index, 1);
          return;
        }
      }

      for (var i = 0; i < compose.selectedToCc.length; i++) {
        if (item.email === compose.selectedToCc[i].email) {
          flag++;
        }
        if (flag > 1) {
          swalFactory.error('Este usuario ya se encuentra en la lista para enviarle el oficio');
          var index = compose.selectedColaborators.indexOf(item);
          if (index >= 0) compose.selectedColaborators.splice(index, 1);
          return;
        }
      }
      for (var i = 0; i < compose.selectedColaborators.length; i++) {
        if (item.email === compose.selectedColaborators[i].email) {
          flag++;
        }
        if (flag > 1) {
          swalFactory.error('Este usuario ya se encuentra en la lista para enviarle el oficio');
          var index = compose.selectedColaborators.indexOf(item);
          if (index >= 0) compose.selectedColaborators.splice(index, 1);
          return;
        }
      }



      socket.emit('findEmailInContacts', item.email, function (err, contact) {

        if (!contact) {
          console.log("Es uno nuevo onSelectColaboration");
        } else {

          item = contact;
        }


        if (_isEmail(item.email)) {

          _findEmailInDocument(item.email);

          var index = _findEmailInList(item.email, compose.contacts);
          console.error("_findEmailInList 4", index);
          if (index >= 0) {
            compose.contacts.splice(index, 1);
            item.isNew = false;
          } else {
            item.isNew = true;
          }
          compose.listColaborators.push({
            item: item
          });
          compose.listToPrivateMessages.push(item);

        } else {
          swalFactory.error("Ingresa un correo electrónico válido");
          compose.error = "Ingresa un correo electrónico válido";



          var index = compose.selectedTo.indexOf(item);
          if (index >= 0) compose.selectedTo.splice(index, 1);
        }
      });
    }

    function onRemoveGroup(item, model) {

      var targen = -1;
      for (var i = 0; i < compose.listColaborators.length; i++) {
        if (item._id === compose.listColaborators[i].item._id) {
          targen = i;
          compose.contacts.push(item.item);
          compose.listColaborators.splice(targen, 1);
          _removeFromPrivateMessages(item.item);
          break;
        }
      }
    }


    function onSelectDraftTo(item) {

      var flag = 0;
      for (var i = 0; i < compose.draftTo.length; i++) {
        if (item.email === compose.draftTo[i].email) {
          flag++;
        }
        if (flag > 1) {
          swalFactory.error('Este usuario ya se encuentra en la lista para enviarle el borrador');
          var index = compose.draftTo.indexOf(item);
          if (index >= 0) compose.draftTo.splice(index, 1);
          return;
        }
      }

      socket.emit('findEmailInContacts', item.email, function (err, contact) {
        if (!contact) {
          console.log("Es uno nuevo onSelectDraftTo");
        } else {

          item = contact;
        }
        if (_isEmail(item.email)) {

          // var index = _findEmailInList(item.email, compose.contacts);
          if (compose.draftTo.length > 1) {
            swalFactory.error("Solo se permite seleccionar un correo");
            compose.error = "Solo se permite seleccionar un correo";
            var index = compose.draftTo.indexOf(item);
            compose.draftTo.splice(index, 1);
          }

        } else {
          swalFactory.error("Ingresa un correo electrónico válido");
          compose.error = "Ingresa un correo electrónico válido";
          var index = compose.draftTo.indexOf(item);
          if (index >= 0) compose.draftTo.splice(index, 1);
        }
      });
    }

    function removeFile(file) {

      compose.editedAttachments = true;
      compose.fileList.removeItem(file);
      // compose.files.splice(compose.files.indexOf(file), 1);
    }

    function showUploadFiles() {

      if (compose.fileURL) {
        return compose.isUnzipFiles;
      }
      else {
        return true;
      }
    }

    function unzipFiles() {

      compose.blockDownload = true;
      // vm.showAttachementSection = "loader";
      var url = compose.fileURL;
      var fileName = url.replace(/.*\//g, "");

      var dateBefore = new Date();
      Doc.unzipFiles(draftID).then(function (files) {
        var items = files.images.concat(files.others.concat(files.pdf));
        compose.isUnzipFiles = true;
        attachmentCount = items.length;
        fileList.setItems(items);
        compose.blockDownload = false;
      });
    }

    function addMessage() {

      if (compose.privateMessageContent === "") {
        swalFactory.error("Agrega contenido");
        compose.error = "Agrega contenido";
        return;
      }

      compose.listPrivateMessages.push({
        content: compose.privateMessageContent,
        to: compose.privateMessageTo
      });

      for (var i = 0; i < compose.listToPrivateMessages.length; i++) {
        if (
          compose.listToPrivateMessages[i].email ===
          compose.privateMessageTo.email
        ) {
          compose.listToPrivateMessages.splice(i, 1);
          break;
        }
      }
      compose.privateMessageContent = "";
    }

    function setEmails(emails) {


      var items = [];
      compose.showTo = false;

      _getContacts(function () {

        for (var i = 0; i < emails.length; i++) {
          var item = emails[i];
          item.name = item.name ? item.name : item.email;
          console.error("_findEmailInList 6");
          if (_findEmailInList(item.email, compose.contacts) === -1) {

            compose.contacts.push(item);
          }

          if (item.inColaboration) {

            compose.selectedColaborators.push(item);
            onSelectColaboration(item);
          } else {

            compose.selectedTo.push(item);
            onSelectTo(item);
          }
        }
        compose.showTo = true;
      });
    }

    function saveDraft() {

      userAction = true;
      compose.isDraft = true;
      if (compose.prossesing) return;
      compose.prossesing = true;

      Profile.get(function (err, profile) {
        if (!compose.document) {
          swalFactory.error("someting need be fixed");
          compose.error = "someting need be fixed";
          compose.prossesing = false;
          return;
        }
        if (!compose.document.content) {
          swalFactory.error("Agrega contenido al documento");
          compose.error = "Agrega contenido al documento";
          compose.prossesing = false;
          return;
        }

        if (!compose.document.subject) {
          swalFactory.error("Agrega un asunto al documento");
          compose.error = "Agrega un asunto al documento";
          compose.prossesing = false;
          return;
        }

        if (compose.haveDeadline) {
          if (!compose.deadline) {
            swalFactory.error("Debe de asignar una fecha limite");
            compose.error = "Debe de asignar una fecha limite";
            compose.prossesing = false;
            return;
          } else {
            var today = new Date();
            if (_getDate(today) > _getDate(compose.deadline)) {
              swalFactory.error("La fecha limite no puede ser anterior a hoy");
              compose.error = "La fecha limite no puede ser anterior a hoy";
              compose.prossesing = false;
              return;
            }
          }
        }
        var ft = compose.colaboration;
        var auxTo = [];























        var auxFT = [];
        var auxCC = [];
        var auxTo = [];
        if (compose.colaboration) {
          for (var i = 0; i < compose.listColaborators.length; i++) {
            auxTo.push({
              id: compose.listColaborators[i].item.id,
              jobTitleID: compose.listColaborators[i].item.jobTitleID,
              email: compose.listColaborators[i].item.email.toLowerCase(),
              name:
                compose.listColaborators[i].item.name ? compose.listColaborators[i].item.name.toLowerCase() :
                  'Nombre pendiente',
              privateMessage: compose.listColaborators[i].privateMessage ? compose.listColaborators[i].privateMessage : '',
              colaboration: true,
              inColaboration: true,
              type: compose.document.type || '',
              confidential: compose.isConfidential,
              deadline: compose.haveDeadline ? compose.deadline.getTime() : '',
              fromJT: profile.jobTitle._id,
              toJT: compose.listColaborators[i].item.jobTitle
            });
            auxFT.push({
              id: compose.listColaborators[i].item.id,
              jobTitleID: compose.listColaborators[i].item.jobTitleID,

              isNew: compose.listColaborators[i].item && compose.listColaborators[i].item.jobTitleID ? false : true,

              email: compose.listColaborators[i].item.email.toLowerCase(),
              name:
                compose.listColaborators[i].item.name ? compose.listColaborators[i].item.name.toLowerCase() :
                  'Nombre pendiente',
              privateMessage: compose.listColaborators[i].privateMessage ? compose.listColaborators[i].privateMessage : '',
              colaboration: true,
              inColaboration: true,
              type: compose.document.type || '',
              confidential: compose.isConfidential,
              deadline: compose.haveDeadline ? compose.deadline.getTime() : '',
              fromJT: profile.jobTitle._id,
              toJT: compose.listColaborators[i].item.jobTitle
            });

          }
        }

        for (var i = 0; i < compose.recipients.length; i++) {
          auxCC.push({
            id: compose.recipients[i].id,
            jobTitleID: compose.recipients[i].jobTitleID,
            isNew: compose.recipients[i] && compose.recipients[i].jobTitleID ? false : true,
            email: compose.recipients[i].email.toLowerCase(),
            name:
              compose.recipients[i].name ? compose.recipients[i].name.toLowerCase() : 'Nombre pendiente',
            privateMessage: compose.recipients[i].privateMessage ? compose.recipients[i].privateMessage : '',
            colaboration: compose.colaboration || false,
            inColaboration: false,
            type: compose.document.type || '',
            confidential: compose.isConfidential,
            deadline: compose.haveDeadline ? compose.deadline.getTime() : '',
            fromJT: profile.jobTitle._id,
            toJT: compose.recipients[i].jobTitle,
            needSign: compose.recipients[i].needSign
          });
          auxTo.push({
            id: compose.recipients[i].id,
            jobTitleID: compose.recipients[i].jobTitleID,
            email: compose.recipients[i].email.toLowerCase(),
            name:
              compose.recipients[i].name ? compose.recipients[i].name.toLowerCase() : 'Nombre pendiente',
            privateMessage: compose.recipients[i].privateMessage ? compose.recipients[i].privateMessage : '',
            colaboration: compose.colaboration || false,
            inColaboration: false,
            type: compose.document.type || '',
            confidential: compose.isConfidential,
            deadline: compose.haveDeadline ? compose.deadline.getTime() : '',
            fromJT: profile.jobTitle._id,
            toJT: compose.recipients[i].jobTitle,
            needSign: compose.recipients[i].needSign
          });
        }

        if (compose.havePrivateMessages) {
          for (var i = 0; i < compose.listPrivateMessages.length; i++) {

            for (var j = 0; j < auxFT.length; j++) {
              if (auxFT[j].email === compose.listPrivateMessages[i].to.email) {
                auxFT[j].privateMessage =
                  compose.listPrivateMessages[i].content;
                break;
              }
            }
            for (var j = 0; j < auxCC.length; j++) {
              if (auxCC[j].email === compose.listPrivateMessages[i].to.email) {
                auxCC[j].privateMessage =
                  compose.listPrivateMessages[i].content;
                break;
              }
            }


            for (var j = 0; j < auxTo.length; j++) {
              if (auxTo[j].email === compose.listPrivateMessages[i].to.email) {
                auxTo[j].privateMessage =
                  compose.listPrivateMessages[i].content;
                break;
              }
            }
          }
        }






        // for (var i = 0; i < compose.listColaborators.length; i++) {
        //   auxTo.push({
        //     id: compose.listColaborators[i].item.id,
        //     jobTitleID: compose.listColaborators[i].item.jobTitleID,
        //     email: compose.listColaborators[i].item.email.toLowerCase(),
        //     name:
        //       compose.listColaborators[i].item.name.toLowerCase() ||
        //       "Nombre pendiente",
        //     privateMessage: "",
        //     turnMessage: "",
        //     read: false,
        //     readAt: "",
        //     signed: false,
        //     signedAt: "",
        //     state: "unread",
        //     colaboration: ft,
        //     inColaboration: true
        //   });
        // }

        // for (var i = 0; i < compose.selectedTo.length; i++) {
        //   auxTo.push({
        //     id: compose.selectedTo[i].id,
        //     jobTitleID: compose.selectedTo[i].jobTitleID,
        //     email: compose.selectedTo[i].email.toLowerCase(),
        //     name: compose.selectedTo[i].name.toLowerCase() || "Nombre pendiente",
        //     needSign: compose.selectedTo[i].needSign,
        //     privateMessage: "",
        //     turnMessage: "",
        //     read: false,
        //     readAt: "",
        //     signed: false,
        //     signedAt: "",
        //     state: "unread",
        //     colaboration: ft,
        //     inColaboration: false
        //   });
        // }

        compose.document.auxFT = auxFT;
        compose.document.auxCC = auxCC;
        var draftTo = null;
        if (compose.draftTo && compose.draftTo.length > 0) {
          draftTo = {
            id: compose.draftTo[0].id,
            jobTitleID: compose.draftTo[0].jobTitleID,
            email: compose.draftTo[0].email,
            name: compose.draftTo[0].name
              ? compose.draftTo[0].name
              : compose.draftTo[0].email
          };
        }

        var newDoc = {
          variables: compose.variables,
          from: {
            email: profile.email,
            name: profile.name,
            avatar: profile.avatar,
            readed: false
          },
          active: true,
          type: compose.document.type,
          content: compose.document.content,
          to: auxTo,
          draftTo: draftTo ? draftTo : {},
          subject: compose.document.subject,
          priority: compose.havePriority,
          confidential: compose.isConfidential,
          ft: ft,
          deadline: "",
          currentTemplateData: {
            templateFullContent: compose.templateFullContent,
            variableValues: compose.variableValues,
            variables: compose.variables,
            templateId: compose.templateId
          },
          templateId: compose.templateId,
          auxCC: auxCC,
          auxTo: auxTo,
          auxFT: auxFT
        };

        newDoc.deadline = compose.haveDeadline ? compose.deadline.getTime() : "";
        compose.document = newDoc;

        var data = {
          draft: newDoc,
          files: _getFiles(),
        };

        if (draftID) data.id = draftID;
        if (compose.editedAttachments) data.deleteFiles = true;




        socket.emit('saveDraft', data, function (err, result) {


          if (err) {
            if (!err.message) err['message'] = 'Ocurrio un error en el proceso';
            swalFactory.error(err.message);
            compose.error = err.message;
            compose.prossesing = false;
          } else {
            swalFactory.success('Se ha guardado el borrador');
            compose.fileList.clear();
            compose.prossesing = false;
            $state.go('app.mailbox.internal.drafts');
          }
        });
      });
    }



    function _getFiles() {

      var items = compose.fileList.getItems();
      var files = null;
      if (compose.editedAttachments || items.length !== attachmentCount) {
        files = [];
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          if (item.binaryFile) {
            item._file = new File([item.binaryFile], item.name);
          }
          files.push(item);
        }
      }
      return files;
    }

    function _cleanEmail(email) {

      var parts = email.split("@");
      if (parts.length >= 2) {
        email = parts[0] + "@" + parts[1];
      } else {
        email = email + "@gmail.com";
      }
      return email.toLowerCase();
    }

    function _getDate(date) {

      var mm = date.getMonth() + 1; // getMonth() is zero-based
      var dd = date.getDate();
      var yy = date.getFullYear();
      var dateStr =
        yy +
        "-" +
        (mm.toString().length < 2 ? "0" + mm : mm) +
        "-" +
        (dd.toString().length < 2 ? "0" + dd : dd);
      return dateStr;
    }

    function _verifyPass() {

      compose.prossesing = true;
      if (compose.password === "") {
        swalFactory.error("Ingresa tu contraseña");
        compose.error = "Ingresa tu contraseña";
        compose.prossesing = false;
        return;
      }

      socket.emit(
        "validatePassword",
        {
          password: compose.password
        },
        function (err, result) {

          console.error('ERR', err);
          console.error('result', result);
          if (err) {
            swalFactory.error(
              "Lo sentimos su contraseña o alguno de sus archivos del SAT ya no son válidos"
            );
            compose.error =
              "Lo sentimos su contraseña o alguno de sus archivos del SAT ya no son válidos";
            compose.prossesing = false;
          } else {
            _sendDocument();
          }
        }
      );
    }



    function _isEmail(email) {

      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }

    function _getContacts(cb) {

      socket.emit("getContacts", {}, function (err, data) {
        compose.contacts = err ? [] : data;
        compose.contacts.sort();
        cb();
      });
    }

    function _findEmailInDocument(email) {

      var profile = Profile.getEmail();
      if (email === profile) {
        return;
      }
      for (var i = 0; i < compose.selectedTo.length; i++) {
        if (email === compose.selectedTo[i].email) {
          return true;
        }
      }
      for (var i = 0; i < compose.selectedColaborators.length; i++) {
        if (email === compose.selectedColaborators[i].email) {
          return true;
        }
      }
    }

    function _findEmailInList(email, list) {




      var index = -1;

      for (var i = 0; i < list.length; i++) {
        if (email === list[i].email) {
          index = i;
          break;
        }
      }

      return index;

    }

    function _setupDraft(draft) {

      Profile.get(function (error, profile) {

        if (draft.authorID !== profile.id && draft.draftTo !== profile.jobTitleID) {

          swalFactory.error('No puedes acceder al contenido');
          $state.go('app.mailbox.internal.drafts');
          return;
        } else {
          // setTemplate(draft.templateID);


          draftID = draft.id;
          compose.external = draft.external;

          compose.document.content = draft.content;
          compose.isDraft = true;
          compose.colaboration = draft.ft;

          if (draft.priority === 1) {
            compose.havePriority = true;
          } else {
            compose.havePriority = false;
          }
          if (draft.confidential === 1) {
            compose.isConfidential = true;
          } else {
            compose.isConfidential = false;
          }





          compose.document.subject = draft.subject.indexOf('Guardado automatico ') === -1 ? draft.subject : '';
          compose.fileURL = draft.fileURL;
          if (draft.deadline !== "" && draft.deadline !== null) {
            compose.haveDeadline = true;
            compose.deadline = new Date(draft.deadline);
          }

          setEmails(draft.to);

          if (draft.draftToUser) {
            compose.draftTo.push(draft.draftToUser);
          }


        }

      });



    }


    return compose;
  }
})();
