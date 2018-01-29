const databaseConfig = require('../databaseConfig');

const checkForMultiLogin = (conn, loginID) => {
    return new Promise((resolve, reject) => {
        let sql = `select LogoutTime from ${databaseConfig.databaseName}.${databaseConfig.tableNames.LoginHistory} WHERE LoginID = ${loginID}`;
        conn.query(sql, (err, result) => {
            if(!err){
                if(result[0].LogoutTime === null){
                    resolve(false);
                }else{
                    resolve(true);
                }
            }else{
                resolve(true);
            }
        });
    });
}

module.exports = checkForMultiLogin;