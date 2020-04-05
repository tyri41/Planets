app.controller('ctrlAdd', function ($scope, $http, apiUrl, $timeout, dbServer) {
    $scope.hosts = [];
    $scope.newRecord = {};

    function putMsg(msg, e) {
        if(e) $scope.msgApiError = msg;
        else $scope.msgApiSucces = msg;
        $timeout(() => {
            $scope.msgApiError = '';
            $scope.msgApiSucces = '';
        }, 2000);
    }

    $scope.addItem = function (type) {
        switch (type) {
            case 'Object':
                console.log($scope.newRecord);
                break;
        }
        dbServer.post(type, $scope.newRecord, (e, v) => {
            if(e) putMsg('adding failed', e);
            else putMsg('adding succesfull', e);
        });
        $scope.loadTable(type);
        $scope.newRecord = {};
    };

    $scope.setHostList = function () {
        dbServer.get('objects','', (e, res) => {
            $scope.hosts = res.data.filter( (v) => {
                console.log(v);
                if($scope.newRecord.Type == 'Exoplanet') return v.Type == 'Star';
                else if($scope.newRecord.Type == 'Star') return v.Type == 'Constellation';
                else return false;
            });
        });
        console.log($scope.hosts);
    };
});