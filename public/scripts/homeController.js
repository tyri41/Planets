app.controller('ctrlHome', function ($scope, $http, apiUrl, $timeout, dbServer) {
    $scope.regex = /^[a-zA-Z0-9\s-]/g;
    $scope.current = '';
    $scope.cur = [];
    $scope.msgApiSucces = '';
    $scope.msgApiError = '';
    $scope.filter = '';
    $scope.filter2 = '';
    $scope.desc = false;
    $scope.listStatus = 'Show List';
    $scope.listAdd = [];
    $scope.list = [];
    $scope.adding = false;

    function clearMsg() {
        $timeout(() => {
            $scope.msgApiError = '';
            $scope.msgApiSucces = '';
        }, 2000);
    }

    function getData(name) {
        $http.get(apiUrl + name).then(
            function (res) {
                $scope.cur = res.data;
                console.log(res);
                $scope.msgApiSucces = 'poprawnie pobrano ' + name;
            },
            function (err) {
                console.log('err - no data');
                $scope.msgApiError = 'błąd odczytu ' + name;
            });
        clearMsg();
    }

    function getSpecial(str, args, callback) {
        console.log('running ' + str);
        $http.get(apiUrl + 'direct/' + str + args).then(
            function (res) {
                console.log(res);
                $scope.msgApiSucces = 'poprawnie pobrano zapytanie';
                callback(res);
            },
            function (err) {
                console.log('err - no data');
                $scope.msgApiError = 'błąd odczytu';
                callback(err);
            });
        clearMsg();
    }

    function postSpecial(str, args, callback) {
        console.log('running ' + str);
        let arg = {insertString: str, obj: args};
        $http.post(apiUrl + 'direct', arg).then(
            function (res) {
                console.log(res);
                $scope.msgApiSucces = 'poprawnie wykonano zapytanie';
                callback(res);
            },
            function (err) {
                console.log('err - no data');
                $scope.msgApiError = 'błąd wykonania';
                callback(null);
            });
        clearMsg();
    }

    function newRecord() {
        // delete $scope.newRecord.id;
        $http.post(apiUrl + $scope.current, $scope.newRecord)
            .then(function (res) {
                if(res.status == 201) {
                    console.log('item created');
                } else {
                    console.log('err - not created');
                }
            });
        getData($scope.current);
        delete $scope.newRecord;
    }

    // $scope.addNew = function () {
    //     console.log('requested add new');
    //     //TODO if current=Obj -> route host to hierarchy
    //     newRecord();
    // };

    $scope.loadTable = function (name) {
        $scope.current = name;
        $scope.desc = false;
        console.log('asked to load ' + name);
        getData(name);
    };

    $scope.select = function (row) {
        $scope.desc = true;
        $scope.selected = row;
        $scope.selKeys = Object.keys(row);
        $scope.selKeys.pop();
        console.log(row);
        $scope.adding = false;
        $scope.filter2 = '';
        $scope.listStatus = 'Show List';
        $scope.children = 0;
        if(row.Type == 'Exoplanet') {
            console.log('getting nfo');
            dbServer.get('exo_info', '?Id='+row.Id, (e, res) => {
                $scope.exo = res.data[0];
                $scope.exoK = Object.keys(res.data[0]);
                console.log(res.data);
                console.log($scope.exoK);
            });
        }
    };

    $scope.remDesc = function () {
        $scope.desc = false;
    };

    $scope.removeRecord = function () {
        $http.post(apiUrl + 'del/' + $scope.current, $scope.selected)
            .then(function (res) {
                if(res.status == 201) {
                    console.log('item deleted');
                } else {
                    console.log('err - not deleted');
                }
            });
        getData($scope.current);
        $scope.desc = false;
    };

    $scope.showAdd = function (v) {
        if(v) {
            $scope.adding = false;
        } else {
            getSpecial('objects','', (res) => {
                $scope.listAdd = res.data;
            });
            $scope.adding = true;
        }
    };

    $scope.addToList = function (row) {
        console.log($scope.list);
        let id = $scope.selected.Id;
        let Obj_id = row.Id;
        let pos = $scope.list.length + 1;
        let sql = 'INSERT INTO List_Position (Object_Id, List_Id, Place) VALUES (' + Obj_id + ', ' + id + ', ' + pos + ')';
        postSpecial(sql, {},  (v) => {
            console.log('added');
            row.Place = pos;
            row.List_Id = id;
            $scope.list.push(row);
        });
    };

    function updateList() {
        let id = $scope.selected.Id;
        console.log($scope.selected);
        getSpecial('listObjects', '?Id='+id, (res) => {$scope.list = res.data;})
    }

    $scope.showList = function () {
        if($scope.listStatus == 'Hide') {
            $scope.listStatus = 'Show List';
            $scope.adding = false;
        } else {
            $scope.listStatus = 'Hide';
            updateList();
        }
    };

    $scope.deleteFromList = function (row) {
        postSpecial('remListItem', row, (v) => {});
        updateList();
    };

    $scope.getForms = function (cur) {
        if(cur == 'List') {
            console.log('getting Creators');
            dbServer.get('users', '', (e, res) => {
                $scope.Cre = res.data;
                console.log(res.data);
            });
        }
    };

    $scope.getChildren = function () {
        if($scope.children) {
            $scope.children = 0;
            return;
        }
        console.log('getting Children');
        dbServer.get('child', '?Id='+$scope.selected.Id, (e, res) => {
            $scope.child = res.data;
            console.log(res.data);
        });
        $scope.children = 1;
    };
});