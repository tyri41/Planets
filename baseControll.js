const sqlite3 = require('sqlite3').verbose();
var fs = require('fs');

let db;

function sanitize(sql) {
    const col = /;/g;
    const eq = /=/g;
    const ap = /'/g;
    // const ap2 = /"/g;
    // const lb = /(/g;
    // const rb = /)/g;
    let str = sql.replace(col, '').replace(eq, '').replace(ap, '');
    return str;
}

function connect() {
    // open database in memory
    db = new sqlite3.Database('./db/planets.db', (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Connected to the SQlite database.');
    });
}

function close() {
// close the database connection
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Closed the database connection.');
    });
}

function init() {
    let superCommand = fs.readFileSync('BD.sql').toString();
    db.exec(superCommand, err => {
        if (err) throw err;
        else console.log("init OK");
    });
}

exports.handleG = function (type, params, callback) {
    let sql = '';
    switch (type) {
        case 'listObjects':
            sql = 'SELECT Place, Name, Id, List_Id FROM Object JOIN List_Position ON Id = Object_Id AND List_Id = '
                + sanitize(params.Id);
            break;
        case 'objects':
            sql = 'SELECT * FROM Object';
            break;
        case 'objectFull':
            sql = 'SELECT ';
            break;
        case 'users':
            sql = 'SELECT * FROM DB_User';
            break;
        case 'child':
            sql = 'SELECT * FROM object_child_list WHERE Host = ' + params.Id;
            break;
        case 'exo_info':
            sql = 'SELECT * FROM object_exo_info WHERE Id = ' + params.Id;
    }
    console.log(sql);
    connect();
    db.all(sql, [], (err, rows) => {
        callback(err, rows);
    });
    close();
};

exports.getAllData = function (tableName ,callback) {
    connect();
    console.log('got asked for ' + tableName);
    sql = 'select * from ' + tableName;
    ret = db.all(sql, [], (err, rows) => {
        // if(err) {throw err;}
        callback(err, rows);
    });
    close();
};

let addRecord = function (tableName, record, callback) {
    connect();
    let sql = 'INSERT INTO ' + tableName + '(' +
        sanitize(Object.keys(record).join(', ')) + ') VALUES ("' +
        sanitize(Object.values(record).join('", "')) + '")';
    console.log(sql);
    db.run(sql, function (err) {
        console.log(this);
        callback(err, this.lastID);
    });
    close();
};

exports.delRecord = function (tableName, record, callback) {
    connect();
    let sql = 'DELETE FROM ' + tableName + ' WHERE Id = ' + record.Id;
    if(tableName == 'List') {
        let sql2 = 'DELETE FROM List_Position WHERE List_Id = ' + record.Id;
        console.log(sql2);
        db.run(sql2);
    }
    if(tableName == 'Object') {
        let sql2 = 'DELETE FROM Hierarchy WHERE Object_Id = ' + record.Id + ' OR Object_Host_Id =' + record.Id;
        console.log(sql2);
        db.run(sql2);
    }
    console.log(sql);
    db.run(sql);
    close();
};

exports.handleP = function (arg, callback) {
    let sql = arg.insertString;
    let args = arg.obj;

    switch (sql) {
        case 'remListItem':
            connect();
            sql = 'DELETE FROM List_Position WHERE Object_Id = ' +  args.Id + ' AND List_Id = ' + args.List_Id;
            db.run('UPDATE List_Position SET Place = Place - 1 WHERE Place > ? AND List_Id = ?', [args.Place, args.List_Id], (err) => {
                if (err) console.log(err.message);
            });
            break;
        case 'Object':
            let host = args.Host;
            delete args.Host;
            addRecord(sql, args, (err, id) => {
                let sql2 = 'INSERT INTO Hierarchy (Object_Id, Object_Host_Id) VALUES (' + id + ", " + host + ')';
                console.log(sql2);
                db.run(sql2);
            });
            return;
        case 'DB_User':
        case 'List':
        case 'Organization':
            addRecord(sql, args, (err, id) => {});
            return;
        default:
            connect();
    }
    console.log(sql);
    db.exec(sql, (err) => {
        callback(err);
    });
    close();
};
