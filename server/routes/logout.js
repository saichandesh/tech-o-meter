const databaseConfig = require('../databaseConfig');

const logout = (req,res,conn, responseObj) => {
    const body = req.body;
    
    sql = `update ${databaseConfig.databaseName}.${databaseConfig.tableNames.LoginHistory} set LogoutTime = '${body.logoutTime}' where LoginID = ${body.loginID}`;
    
    conn.query(sql, (err, result) => {
        if(err){
            res.status(501).json(err);
        }else{
            responseObj.message = 'Logout Successfully';
            res.json(responseObj);
        }
    });
}

module.exports = logout;