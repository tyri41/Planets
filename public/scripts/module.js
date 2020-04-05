let app = angular.module('bd3', ['ngSanitize']);

app.constant('apiUrl', 'http://localhost:8080/api/');

app.filter('byName', function () {
    return function (items, selection) {
        return items.filter( function (v) {
            return v.Name.toLowerCase().includes(selection.toLowerCase());
        });
    }
});

app.filter('woRepeats', function () {
    return function (items, selection) {
        let ids = {};
        angular.forEach(selection, (row) => {ids[(row.Id)] = true;});
        return items.filter( function (v) {
            return !(v.Id in ids);
        });
    }
});

app.service('dbServer', function ($http, apiUrl) {
    this.get = function (str, args, callback) {
        console.log('running ' + str);
        $http.get(apiUrl + 'direct/' + str + args).then(
            function (res) {
                console.log(res);
                callback(0,res);
            },
            function (err) {
                console.log('err - no data');
                callback(1,err);
            });
    };

    this.post = function (str, args, callback) {
        console.log('running ' + str);
        let arg = {insertString: str, obj: args};
        $http.post(apiUrl + 'direct', arg).then(
            function (res) {
                console.log(res);
                callback(0,res);
            },
            function (err) {
                console.log('err - no data');
                callback(1,err);
            });
    }
});

app.directive('dirc', () => {
    return {
        templateUrl: (elem, attr) => {
            return attr.link + '.html';
        }
    }
});