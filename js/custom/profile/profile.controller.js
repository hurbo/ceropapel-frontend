(function () {
  'use strict';

  angular.module('app.profile').controller('ProfileController', ProfileController);
  ProfileController.$inject = ['$rootScope', 'swalFactory', 'profileFactory'];

  function ProfileController($rootScope, swalFactory, Profile) {
    var vm = this;


    vm.uploadCerFile = uploadCerFile;
    vm.uploadKeyFile = uploadKeyFile;

    vm.disabledButtonCer = disabledButtonCer;
    vm.disabledButtonKey = disabledButtonKey;


    vm.showSpinKey = false;
    vm.showSpinCer = false;
    vm.needCer = false;
    vm.needKey = false;
    vm.cer_b64 = '';
    vm.key_b64 = '';
    vm.cerFileName = '';
    vm.keyFileName = '';

    vm.removeFromFavorites = removeFromFavorites;
    vm.managePermissions = managePermissions;



    vm.updateProfileUser = updateProfileUser;
    // vm.getPermissions = getPermissions;




    vm.setUserByClave = setUserByClave;

    vm.permissions = {
      read: false,
      sign: false,
      turn: false
    };
    vm.clave = '';


    function setUserByClave() {


      if (vm.clave === '') {
        swalFactory.error('Ingresa tu nombre de usuario', '');
        return;
      }

      Profile.setUserByClave(vm.clave, function (err, solve) {
        if (err) {
          swalFactory.error('Ocurrio un error');
          return;
        }
        swalFactory.success('Perfil actualizado');
        vm.profile = solve;
      });
    }





    function removeFromFavorites(contact) {


      Profile.removeFromFavorites(contact, function (err, data) {
        if (err) {
          swalFactory.error('Error al remover de favoritos');
          return;
        }
        contact['favorite'] = false;
        swalFactory.error('Removido de favoritos');
      });

    }



    function managePermissions() {


      var secretary = {
        user: vm.selectedSecretary,
        permissions: vm.permissions
      };
      Profile.managePermissions(secretary, function (err, data) {
        if (!err) {
          swalFactory.success('Se modificaron los permisos');
          _getSecretary();
        }

        swalFactory.success('Se modificaron los permisos');
        _getSecretary();

      });
    }







    function _getSecretary() {


      if (vm.profile.jobTitle) {
        Profile.getPotentialSecretaries({}, function (err, data) {
          for (var i = 0; i < data.length; i++) {

            if (data[i].hasOwnProperty('permissions')) {
              for (var j = 0; j < data[i].permissions.length; j++) {

                if (data[i].permissions[j].bossJobTitleID === vm.profile.jobTitleID) {
                  var p = data[i].permissions[j];
                  // data[i].isMySecretary = true;
                  data[i].isMySecretary = (p.read || p.reject || p.sign || p.turn);
                } else {
                  data[i].isMySecretary = false;
                }
              }
            }
          }
          vm.potentialSecretaries = data;
        })

      }
    }



    function uploadCerFile() {


      var file = vm.cerFile._file;
      vm.showSpinCer = true;
      var params = {
        file: file
      };
      Profile.uploadCer(params, function (err, profile) {
        vm.cerFile = null;
        vm.showSpinCer = false;
        vm.showCerForm = false;
        vm.profile = profile;
        if (err) {
          swalFactory.error(err.message);
        } else {
          Profile.updateProfile().then(function (profile) {
            swalFactory.success('Perfil actualizado correctamente');
            vm.profile = profile;
          });
        }
      });
    }


    function uploadKeyFile() {




      var file = vm.keyFile._file;
      vm.showSpinKey = true;

      var params = {
        file: file
      };
      Profile.uploadKey(params, function (err, profile) {
        vm.cerFile = null;
        vm.showSpinKey = false;
        vm.showKeyForm = false;
        vm.profile = profile;

        if (err) {
          swalFactory.error(err.message);
        } else {
          Profile.updateProfile().then(function (profile) {
            swalFactory.success('Perfil actualizado correctamente');
            vm.profile = profile;
            _initialCheck(profile);
          });
        }
      });




    }







    function disabledButtonCer() {


      if (vm.cerFile) return false;
      else return true;
    }

    function disabledButtonKey() {


      if (vm.keyFile) return false;
      else return true;
    }




    // Metodo
    function updateProfileUser() {

      if (vm.profile.signature && vm.profile.signature._file) {
        var file = vm.profile.signature._file,
          reader = new FileReader();

        reader.onloadend = function () {

          var b64 = reader.result;
          vm.profile.signature = b64;

          var data = {
            name: vm.profile.name,
            avatar: vm.profile.avatar,
            signature: b64
          };

          Profile.setName(data, function (err, profile) {
            if (err) {
              var msg = err.message ?
                err.message :
                'Ocurrio un error al actualizar su perfil';
              swalFactory.error(msg);
            } else {
              Profile.updateProfile().then(function (newProfile) {
                vm.profile = newProfile;
                swalFactory.success('Perfil actualizado correctamente');
              });
            }
          });

        };

        reader.readAsDataURL(file);
      } else {
        // var imageData= $base64.encode(vm.profile.signature);
        // console.log("imageData", imageData);
        var data = {
          name: vm.profile.name,
          avatar: vm.profile.avatar,
          signature: vm.profile.signature
        };

        Profile.setName(data, function (err, profile) {
          if (err) {
            var msg = err.message ?
              err.message :
              'Ocurrio un error al actualizar su perfil';
            swalFactory.error(msg);
          } else {
            Profile.updateProfile().then(function (newProfile) {
              vm.profile = newProfile;
              swalFactory.success('Perfil actualizado correctamente');
            });
          }
        });
      }






    }

    function setSecretariateOnInit(jobTitle, secretariates) {


      if (jobTitle) {
        for (var i = 0; i < secretariates.length; i++) {
          if (secretariates[i]._id === jobTitle.secretariate) {
            vm.secretariate = secretariates[i];
            vm.jobTitle = jobTitle._id;
            break;
          }
        }
      }
    }



    activate();

    function _initialCheck(profile) {


      if (!profile) {
        return;
      }
      vm.profile = profile;
      if (vm.profile.oldData) vm.clave = vm.profile.oldData.Clave;
      if (profile.jobTitle !== '' && profile.jobTitle !== undefined && profile.jobTitle !== null) {
        _getSecretary();
      } else {
        swalFactory.error(
          'No tienes puesto de trabajo asignado, contacta al administrador de tu área'
        );
      }
      if (!vm.profile.cerUpdatedAt) {
        swalFactory.error('Requiere el archivo CER');
      } else {
        vm.showCerForm = false;
      }

      if (!vm.profile.keyUpdatedAt) {
        swalFactory.error('Requiere el archivo KEY');
      } else {
        vm.showKeyForm = false;
      }


      Profile.getOrganizationalStructureForProfile({}, function (err, data) {
        data.sort(function (a, b) {
          return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
        });
        for (var i = 0; i < data.length; i++) {
          data[i].jobTitles.sort(function (a, b) {
            return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
          });
        }
        vm.secretariates = data;
        setSecretariateOnInit(vm.profile.jobTitle, vm.secretariates);
      });
    }

    function activate() {

      Profile.subcribe().then(function (init) {

        if (!init) {

          $rootScope.$on('updateProfile', function () {

            vm.selectedSecretary = {};
            Profile.reloadProfile().then(function (profile) {

              vm.profile = profile;

              _initialCheck(profile);
            }, function (err) {
              console.error('Error  on reloadProfile', err);
            });
          });
        }
      });






      vm.selectedSecretary = {};
      Profile.getProfile().then(function (profile) {
        vm.profile = profile;

        _initialCheck(profile);

      }, function (err) {
        console.error('Error  on getProfile', err);
      });


    }
  }
})();
