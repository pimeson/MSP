module.exports = function (app) {

  app.factory('exhibitFactory', function ($http) {

    const exObj = {};

    exObj.findAll = () => $http.get('/api/exhibit/')
      .then(res => res.data)

    exObj.findById = (exhibitId) => $http.get('/api/exhibit/' + exhibitId + '/withAltViews')
      .then(res => res.data)

    exObj.updateById = (exhibitId, payload) => $http.put('/api/exhibit/' + exhibitId, payload)
      .then(res => res.data)

    exObj.updateOrderById = (exhibitId, projectId, posOne, posTwo) => $http.put('/api/exhibit/order/' + projectId + '/' + exhibitId + '/' + posOne + '/' + posTwo)
      .then(res => res.data)

    exObj.deleteById = (exhibitId) => $http.delete('/api/exhibit/' + exhibitId)
      .then(res => res.data)

    exObj.findAllByProjectId = (projId) => $http.get('/api/exhibit/project/' + projId)
      .then(res => res.data)
    exObj.findAllByProjectName = (projectName) => $http.get(`/api/exhibit/project?title=${projectName}`)
      .then(res => res.data)
    exObj.makeVideo = (payload) => $http.post('/api/exhibit/video', payload)
      .then(res => res.data)

    return exObj;
  })

};