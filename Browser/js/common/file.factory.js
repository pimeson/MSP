module.exports = function(app) {
app.factory('fileFactory', function($http){

  const fileObj = {};

  fileObj.findAllDownloads = () => {
    return $http.get('/api/about/downloads/')
    .then(res => res.data);
  }

  fileObj.deleteDlById = (id) => {
    return $http.delete('/api/about/downloads/' + id)
    .then(res => res.data);
  }

  return fileObj;

})
}