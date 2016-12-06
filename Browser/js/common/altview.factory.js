app.factory('altViewFactory', function($http){

  const altObj = {}

  altObj.findAll = () => {
    return $http.get('/api/altView/')
    .then(res => res.data);
  }

  altObj.findById = (altViewId) => {
    return $http.get('/api/altView/' + altViewId)
    .then(res => res.data);
  }

  altObj.updateById = (altViewId, payload) => {
    return $http.put('/api/altView/' + altViewId, payload)
    .then(res => res.data);
  }
  
  altObj.deleteById = (altViewId) => {
    return $http.delete('/api/altView/' + altViewId)
    .then(res => res.data);
  }

  return altObj;

})