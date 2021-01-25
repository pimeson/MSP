module.exports = function (app) {
  app.factory('projectFactory', function ($http) {

    const projObj = {};

    projObj.findAll = () => {
      return $http.get('/api/project/')
        .then(res => res.data)
    }

    projObj.updateById = (id, payload) => {
      return $http.put('/api/project/' + id, payload)
        .then(res => res.data)
    }

    projObj.findAllWithExhibits = () => {
      return $http.get('/api/project/withExhibits')
        .then(res => res.data)
    }

    projObj.findById = (id) => {
      return $http.get('/api/project/' + id)
        .then(res => res.data);
    }

    projObj.findByName = (name) => {
      return $http.get('/api/project?projectTitle=' + name).then(res => res.data)
    }

    projObj.makeProject = (title, description) => {
      return $http.post('/api/project/', { title, description })
        .then(res => res.data);
    }

    projObj.deleteProject = (id) => {
      return $http.delete('/api/project/' + id)
        .then(res => res.data);
    }

    projObj.updateOrderById = (projectId, posOne, posTwo) => {
      return $http.put('/api/project/order/' + projectId + '/' + posOne + '/' + posTwo)
        .then(res => res.data);
    }

    return projObj;
  })
};