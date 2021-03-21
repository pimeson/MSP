module.exports = function (app) {
    app.factory('linkFactory', function ($http) {

        const link = {};

        link.findAllLinks = () => {
            return $http.get('/api/links')
                .then(res => res.data);
        }

        link.deleteLinkByID = (id) => {
            const deleteQuery = `?id=${id}`
            return $http.delete('/api/links' + deleteQuery)
                .then(res => res.data);
        }

        link.create = link => {
            return $http.post('/api/links', link)
                .then(res => res.data);
        }

        link.setVisibility = (id, visibility) => {
            return $http.put(`/api/links/${id}/visibility`, { isVisible: visibility })
        }

        link.setPosition = (id, currPos, newPos) => {
            return $http.put(`/api/links/${id}/order`, { currPos, newPos })
        }

        return link;

    })
}