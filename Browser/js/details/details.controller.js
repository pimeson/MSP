module.exports = function (app) {

  app.controller('DetailsCtrl', function ($scope, $rootScope, exhibit, project, $state, $stateParams, $window, $document) {

    let activeZoom;

    $scope.isFF = 'MozAppearance' in document.documentElement.style;

    if (activeZoom) {
      activeZoom.destroy();
    }

    $scope.iframeHeight = $(window).height();
    $scope.iframeWidth = $(window).width();

    $scope.isLandscape = function () {
      return $(window).width() >= $(window).height();
    }


    $scope.hover = false;
    //description is collapsed by default
    $scope.collapsed = true;
    let scrollPosY;
    let scrollPosX;
    $document.on('scroll', () => {
      $scope.$apply(() => {
        scrollPosY = $window.scrollY;
        scrollPosX = $window.scrollX;
        $scope.scrollY = scrollPosY;
        $scope.scrollX = scrollPosX;
        $rootScope.scrollX = scrollPosX;
        $rootScope.scrollY = scrollPosY;
      })
    })


    $scope.toggleDescPortrait = false;
    $scope.togglePortrait = () => {
      $scope.toggleDescPortrait = !$scope.toggleDescPortrait;
      if (!$scope.isLandscape() && !$scope.toggleDescPortrait) {
        $('body').css({
          overflow: '',
          position: '',
          top: ''
        }).scrollTop($scope.scrollPosYFixed);
      } else if (!$scope.isLandscape() && $scope.toggleDescPortrait) {
        console.log("I should be here!:", scrollPosY)
        $('body').css({
          overflow: 'hidden',
          width: '100vw',
          position: 'fixed',
          top: -scrollPosY + 'px'
        });
        $scope.scrollPosYFixed = scrollPosY;
      }
      $scope.$evalAsync();
    }

    $scope.collapse = () => {
      $scope.collapsed = !$scope.collapsed;
    }

    //Exhibit is resolved as an array, there should only be one.
    $scope.exhibit = exhibit[0];
    $scope.project = project;
    $scope.projDesc = project.description;

    $scope.projTitle = $stateParams.projTitle;
    //Exhibit is resolved as an array due to where query, but there should only be 1.
    $scope.currImage = exhibit[0];

    $scope.altViews = exhibit[0].altViews;
    $scope.showVideo = false;


    $scope.backToGallery = () => $state.go('gallery', {
      projId: exhibit[0].projectId,
      projTitle: $stateParams.projTitle.replaceAll(" ", "_")
    });

    //Square zoom options for CloudZoom
    let zoomOptions = () => {
      if ($(window).height() <= $(window).width()) {
        return {
          zoomPosition: '#target'
        }
      }
      // else {
      //   return {
      //     zoomOffsetX: 0,
      //     zoomPosition: 'inside'
      //   }
      // }
    }


    //Initiate cloud zoom on load
    if ($scope.isLandscape()) {
      activeZoom = new CloudZoom($('#mainPic'), zoomOptions());

      //Load image takes two params: thumbnail image and original (high res) image
      activeZoom.loadImage(exhibit[0].thumbnail, exhibit[0].imageSrc.slice(9));
    }

    //This variable will be set to a vimeo video object
    let player;


    //Triggered with ng-click on sidebar gallery pics, takes ng-repeated el as argument
    $scope.changeToAltView = (alt) => {
      //Destroy current zoom window
      // if (activeZoom) {
      //   activeZoom.destroy();
      // }
      //Stop video from playing when not visible
      if (player) {
        player.pause()
          .then(() => console.log("paused!"));
      }

      //If a user had clicked an alt view and wants to go back to the original view.
      if (alt.showing) {
        alt.showing = false;
        $scope.showVideo = false;
        $scope.currImage = exhibit[0];
        //activeZoom = new CloudZoom($('#mainPic'), zoomOptions());
        if ($scope.isLandscape()) {
          activeZoom.loadImage(exhibit[0].thumbnail, exhibit[0].imageSrc.slice(9));
        }
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
          //let newZoom = new CloudZoom($('#mainPic'), zoomOptions());
          if ($scope.isLandscape()) {
            activeZoom.loadImage(alt.thumbnail, alt.imageSrc.slice(9));
          }
        } else if (alt.type === 'Video') {


          /*player takes video id as an argument, really should be a virtual field
          makes sure if player exists, change the video for the player*/
          if (player) {
            player.loadVideo(alt.videoUrl.slice(alt.videoUrl.lastIndexOf('/') + 1))
              .then(() => console.log("loaded other video!"));
            //If player does not exist...
          } else {
            let width = () => {
              if ($scope.isLandscape()) {
                if ($(window).width() > 1200) {
                  return 640;
                } else {
                  return 480;
                }
              } else {
                return 320;
              }
            }
            const exhibitOptions = {
              id: alt.videoUrl.slice(alt.videoUrl.lastIndexOf('/') + 1),
              width: width(),
              loop: true
            }
            player = new Vimeo.Player('exhibitVideo', exhibitOptions);
          }
          $scope.showVideo = true;
        }


      }

      $scope.$evalAsync();
    };

    $(window).on('resize', _.debounce(() => {
      // if (activeZoom) {
      //   activeZoom.destroy();
      // }
      //activeZoom = CloudZoom($('#mainPic'), zoomOptions());
      if ($scope.isLandscape()) {
        if (!activeZoom) {
          activeZoom = new CloudZoom($('#mainPic'), zoomOptions());
        }
        activeZoom.loadImage($scope.currImage.thumbnail, $scope.currImage.imageSrc.slice(9));
      } else {
        if (activeZoom) {
          activeZoom.destroy();
        }
      }
    }, 250));

    //prevent stacking instances of zoom
    $rootScope.$on('$stateChangeStart',
      function (event, toState, toParams, fromState, fromParams, options) {
        if (activeZoom) {
          activeZoom.close();
          activeZoom.destroy();
        }
      })

    // $(document).ready(function () {
    //   $('#mainPicContainer').zoom({
    //     target: '#target'
    //   });
    // })

    // $scope.$watch(() => {
    //   if (!$scope.showVideo) {
    //     $('#mainPicContainer').zoom({
    //       target: '#target'
    //     });
    //   } else {
    //     $('#mainPicContainer').trigger('zoom.destroy')
    //   };
    // })



  })

}