app.factory('exhibitFactory', function($http){
  
  const exObj = {};

  exObj.findAll = () => {
    return $http.get('/api/exhibit/')
    .then(res => res.data);
  }

  exObj.findById = (exhibitId) => {
    return $http.get('/api/exhibit/' + exhibitId + '/withAltViews')
    .then(res => res.data);
  }

  exObj.updateById = (exhibitId, payload) => {
    return $http.put('/api/exhibit/' + exhibitId, payload)
    .then(res => res.data);
  }
  
  exObj.deleteById = (exhibitId) => {
    return $http.delete('/api/exhibit/' + exhibitId)
    .then(res => res.data);
  }

  exObj.findAllByProjectId = (projId) => {
    return $http.get('/api/exhibit/project/'+projId)
    .then(res => res.data);
  }

  return exObj;
});