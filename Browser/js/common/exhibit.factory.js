app.factory('exhibitFactory', function($http){
  
  const exObj = {};

  exObj.findAll = () => {
    return $http.get('/api/exhibit/')
    .then(res => res.data);
  }

  exObj.findById = (exhibitId) => {
    return $http.get('/api/exhibit/' + exhibitId)
    .then(res => res.data);
  }

  exObj.getAllByProjectId = (projId) => {
    return $http.get('/api/exhibit/project/'+projId)
    .then(res => res.data);
  }

  return exObj;
});