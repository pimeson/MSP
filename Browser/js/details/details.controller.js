app.controller('DetailsCtrl', function ($scope, $rootScope, exhibit, project, $state, $stateParams) {

  $scope.hover = false;
  $scope.collapsed = true;

  $scope.exhibit = exhibit[0];
  $scope.projDesc = project.description;

  $scope.projTitle = $stateParams.projTitle;
  $scope.currImage = exhibit[0].imageSrc.slice(9);

  $scope.altViews = exhibit[0].altViews;
  $scope.showVideo = false;

  $scope.backToGallery = () => $state.go('gallery', {
    projId: exhibit[0].projectId
  });

  let player;

  $scope.changeToAltView = (alt) => {
    if (player) {
      player.pause()
        .then(() => console.log("paused!"));
    }
    console.log("clicked!");
    if (alt.showing) {
      alt.showing = false;
      $scope.showVideo = false;
      $scope.currImage = exhibit[0].imageSrc.slice(9);
    } else {
      $scope.altViews.map(altView => {
        altView.showing = false;
      })
      alt.showing = true;
      if (alt.type === "Picture") {
        $scope.showVideo = false;
        $scope.currImage = alt.imageSrc.slice(9);
      } else if (alt.type === 'Video') {

        $scope.showVideo = true;

        if (player) {
          player.loadVideo(alt.videoUrl.slice(alt.videoUrl.lastIndexOf('/') + 1))
            .then(() => console.log("loaded other video!"));
        } else {
          const exhibitOptions = {
            id: alt.videoUrl.slice(alt.videoUrl.lastIndexOf('/') + 1),
            width: screen.width * .5,
            loop: true
          }
          player = new Vimeo.Player('exhibitVideo', exhibitOptions);
        }
      }
    }

    $scope.$evalAsync();
  };

  $(document).ready(function () {
    $('#mainPicContainer').zoom({
      target: '#target'
    });
  })

  $scope.$watch(() => {
    console.log("weird!")
    if (!$scope.showVideo) {
      $('#mainPicContainer').zoom({
        target: '#target'
      });
    } else {
      $('#mainPicContainer').trigger('zoom.destroy')
    };
  })



})