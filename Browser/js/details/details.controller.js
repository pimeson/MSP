app.controller('DetailsCtrl', function ($scope, $rootScope, exhibit, project, $state, $stateParams) {

  $scope.hover = false;
  $scope.collapsed = true;

  $scope.exhibit = exhibit[0];
  $scope.projDesc = project.description;

  $scope.projTitle = $stateParams.projTitle;
  $scope.currImage = exhibit[0].thumbnail;

  $scope.altViews = exhibit[0].altViews;
  $scope.showVideo = false;

  $scope.iframeHeight = $(window).height();

  $scope.backToGallery = () => $state.go('gallery', {
    projId: exhibit[0].projectId
  });

  const zoomOptions = {
    zoomPosition: 3,
    zoomWidth: $(window).width() * .30,
    zoomHeight: $(window).width() * .30
  }

  let activeZoom = new CloudZoom($('#mainPic'), zoomOptions);

  let player;
  
  activeZoom.loadImage(exhibit[0].thumbnail, exhibit[0].imageSrc.slice(9));

  $scope.changeToAltView = (alt) => {
    if(activeZoom){
      activeZoom.destroy();
    }
    if (player) {
      player.pause()
        .then(() => console.log("paused!"));
    }
    console.log("clicked!");
    if (alt.showing) {
      alt.showing = false;
      $scope.showVideo = false;
      $scope.currImage = exhibit[0].imageSrc.slice(9);
      activeZoom = new CloudZoom($('#mainPic'), zoomOptions);
      activeZoom.loadImage(exhibit[0].thumbnail, exhibit[0].imageSrc.slice(9));
    } else {
      $scope.altViews.map(altView => {
        altView.showing = false;
      })
      alt.showing = true;
      if (alt.type === "Picture") {
        
        $scope.currImage = alt.thumbnail;
        $scope.showVideo = false;
        let newZoom = new CloudZoom($('#mainPic'), zoomOptions);
        newZoom.loadImage(alt.thumbnail, alt.imageSrc.slice(9));
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

  // $(document).ready(function () {
  //   $('#mainPicContainer').zoom({
  //     target: '#target'
  //   });
  // })

  // $scope.$watch(() => {
  //   console.log("weird!")
  //   if (!$scope.showVideo) {
  //     $('#mainPicContainer').zoom({
  //       target: '#target'
  //     });
  //   } else {
  //     $('#mainPicContainer').trigger('zoom.destroy')
  //   };
  // })



})