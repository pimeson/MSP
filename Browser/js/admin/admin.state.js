module.exports = function (app) {
  app.config($stateProvider => {
    $stateProvider.state('admin', {
      url: '/admin',
      controller: 'adminCtrl',
      templateUrl: 'js/admin/admin.html',
      data: {
        authenticate: true
      },
      resolve: {
        projects: function (projectFactory) {
          return projectFactory.findAll();
        },
        downloads: function (fileFactory) {
          return fileFactory.findAllDownloads();
        },
        links: function (linkFactory) {
          return linkFactory.findAllLinks();
        }
      }
    })
  })

  app.controller('adminCtrl', function ($scope, projectFactory, projects, Upload, $state, downloads, fileFactory, AuthService, links, linkFactory) {

    $scope.projects = projects.sort((x, y) => x.order - y.order);
    $scope.downloads = downloads;

    $scope.findAll = () => {
      projectFactory.findAll()
        .then(projects => {
          $scope.projects = projects.sort((x, y) => x.order - y.order);
          $scope.$evalAsync();
        })
    }

    $scope.makeProject = (title, desc) => {
      if (title) {
        return projectFactory.makeProject(title, desc)
          .then(() => {
            $scope.projTitle = '';
            $scope.projDesc = '';
            $scope.findAll();
          })
      } else {
        alert("Projects must have a title!");
      }
    };

    $scope.uploadAboutHtml = (file) => {
      Upload.upload({
        url: 'http://matthewspiegelman.com/api/about/aboutHtml',
        data: {
          file: file
        }
      }).then((res) => {
        alert("Updated new about page!");
      })
    }

    $scope.submitAboutPage = () => {
      if ($scope.form.file.$valid && $scope.file) {
        $scope.uploadAboutHtml($scope.file)
      }
    };

    $scope.uploadPortrait = (file) => {
      Upload.upload({
        url: 'http://matthewspiegelman.com/api/about/aboutPortrait',
        data: {
          file: file
        }
      }).then((res) => {
        alert("Updated portrait! Please refresh the page to see the new portrait.");
        $state.reload();
      })
    }

    $scope.newDownload = (file) => {
      $scope.$evalAsync();
      if ($scope.dlTitle) {
        Upload.upload({
          url: 'http://matthewspiegelman.com/api/about/upload',
          data: {
            file: file,
            title: $scope.dlTitle
          }
        }).then((res) => {
          $state.reload();
        })
      } else {
        alert('No empty title names allowed.')
      }
    }

    $scope.deleteDl = (id) => {
      fileFactory.deleteDlById(id)
        .then(deletingFile => $state.reload())
    }

    $scope.switch = (x, y) => {
      if (x <= $scope.projects.length && x > 0 && y <= $scope.projects.length && y > 0 && x !== y) {
        let firstSwitch = projectFactory.updateById($scope.projects[x - 1].id, { order: y });
        let secondSwitch = projectFactory.updateById($scope.projects[y - 1].id, { order: x });
        Promise.all(firstSwitch, secondSwitch)
          .then(switched => $state.reload());
      }
    }

    $scope.switchProjPos = (x, y) => {
      if (x <= $scope.projects.length && x > 0 && y <= $scope.projects.length && y > 0 && x !== y) {
        projectFactory.updateOrderById($scope.projects[x - 1].id, x, y)
          .then(() => $state.reload());
      } else {
        alert('invalid inputs!')
      }
    }

    $scope.logOff = () => {
      AuthService.logOff()
        .then(() => {
          $state.go('home');
        })
    }


    console.log({ links })
    $scope.links = links.sort((l1, l2) => l1.order - l2.order)

    $scope.makeLink = (title, type, date) => {
      if (!title || !type || !date) return

      linkFactory.create({ title, type, date }).then(() => $state.reload());
    }

    $scope.setVisibility = (id, isVisible) => {

      linkFactory.setVisibility(id, isVisible).then(() => $state.reload());
    }

    $scope.deleteLink = (id) => {
      linkFactory.deleteLinkByID(id).then(() => $state.reload())
    }

    $scope.linkData = {}

    $scope.updateFile = (file, id) => {

      $scope.$evalAsync();
      if (!file) return;

      Upload.upload({
        url: `http://matthewspiegelman.com/api/links/${id}/file`,
        data: {
          file
        }
      }).then(resp => {
        console.log('Success ' + resp.config.data + 'uploaded. Response: ' + resp.data);
        $state.reload();
      }, (resp) => {
        console.log('Error status: ' + resp.status);
      }, (evt) => {
        if (evt.config.data.file) {
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        }
      })
    };

    $scope.uploadFile = (file, type, url) => {

      //TODO: Disable if no date/title
      $scope.$evalAsync();
      if (!file) return;

      console.log({ url })

      Upload.upload({
        url: 'http://matthewspiegelman.com/api/links',
        data: {
          file: file,
          title: $scope.linkTitle,
          type,
          url
        }
      }).then(resp => {
        console.log('Success ' + resp.config.data + 'uploaded. Response: ' + resp.data);
        $state.reload();
      }, (resp) => {
        console.log('Error status: ' + resp.status);
      }, (evt) => {
        if (evt.config.data.file) {
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        }
      })
    };

    $scope.setPosition = (id, currPos, newPos) => {
      if (newPos > $scope.links.length || newPos < 1 || currPos === newPos) return

      linkFactory.setPosition(id, currPos, newPos).then(() => $state.reload())
    }

  })
}