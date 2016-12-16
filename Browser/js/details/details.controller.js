app.controller('DetailsCtrl', function ($scope, $rootScope, exhibit, project, $state, $stateParams, $window) {

  $scope.hover = false;
  //description is collapsed by default
  $scope.collapsed = true;

  //Exhibit is resolved as an array, there should only be one.
  $scope.exhibit = exhibit[0];
  $scope.projDesc = project.description;

  $scope.projTitle = $stateParams.projTitle;
  //Exhibit is resolved as an array due to where query, but there should only be 1.
  $scope.currImage = exhibit[0];

  $scope.altViews = exhibit[0].altViews;
  $scope.showVideo = false;

  $scope.iframeHeight = $(window).height();


  $scope.backToGallery = () => $state.go('gallery', {
    projId: exhibit[0].projectId
  });

  //Square zoom options for CloudZoom
  let zoomOptions = {
    zoomPosition: 3,
    zoomWidth: $(window).width() * .35,
    zoomHeight: $(window).height() * .60
  }

  //Initiate cloud zoom on load
  let activeZoom = new CloudZoom($('#mainPic'), zoomOptions);
  //This variable will be set to a vimeo video object
  let player;

  //Load image takes two params: thumbnail image and original (high res) image
  activeZoom.loadImage(exhibit[0].thumbnail, exhibit[0].imageSrc.slice(9));

  //Triggered with ng-click on sidebar gallery pics, takes ng-repeated el as argument
  $scope.changeToAltView = (alt) => {
    //Destroy current zoom window
    if (activeZoom) {
      activeZoom.destroy();
    }
    //Stop video from playing when not visible
    if (player) {
      player.pause()
        .then(() => console.log("paused!"));
    }
    console.log("clicked!");

    //If a user had clicked an alt view and wants to go back to the original view.
    if (alt.showing) {
      alt.showing = false;
      $scope.showVideo = false;
      $scope.currImage = exhibit[0];
      activeZoom = new CloudZoom($('#mainPic'), zoomOptions);
      activeZoom.loadImage(exhibit[0].thumbnail, exhibit[0].imageSrc.slice(9));
    } else {
      //Loops over altviews and makes sure that they are not active. All off.
      $scope.altViews.map(altView => {
          altView.showing = false;
        })
        //set the altview that you selected, one on.
      alt.showing = true;

      //Altviews have two types- Picture and Video
      if (alt.type === "Picture") {

        $scope.currImage = alt;
        $scope.showVideo = false;
        //create zoom window for alt view
        let newZoom = new CloudZoom($('#mainPic'), zoomOptions);
        newZoom.loadImage(alt.thumbnail, alt.imageSrc.slice(9));

      } else if (alt.type === 'Video') {

        $scope.showVideo = true;
        /*player takes video id as an argument, really should be a virtual field
        makes sure if player exists, change the video for the player*/
        if (player) {
          player.loadVideo(alt.videoUrl.slice(alt.videoUrl.lastIndexOf('/') + 1))
            .then(() => console.log("loaded other video!"));
          //If player does not exist...
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

  $(window).on('resize', _.debounce(() => {
    zoomOptions = {
      zoomPosition: 3,
      zoomWidth: $(window).width() * .35,
      zoomHeight: $(window).height() * .60
    }
    if (activeZoom) {
      activeZoom.destroy();
    }
    activeZoom = new CloudZoom($('#mainPic'), zoomOptions);
    activeZoom.loadImage($scope.currImage.thumbnail, $scope.currImage.imageSrc.slice(9));

  }, 250));

  //prevent stacking instances of zoom
  $rootScope.$on('$stateChangeStart',
    function (event, toState, toParams, fromState, fromParams, options) {
      if (activeZoom) {
        activeZoom.destroy();
      }
    })

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