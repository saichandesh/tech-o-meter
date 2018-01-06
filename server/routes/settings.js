const databaseConfig = require('../databaseConfig');

const settings = (req,res,conn, responseObj) => {

    const body = req.body;

    sql = `update ${databaseConfig.databaseName}.${databaseConfig.tableNames.Users} set Password = '${body.password}' where UserID = ${body.userID}`;

    conn.query(sql, (err, result) => {
        if(err){
            res.status(501).json(err);
        }else{
            responseObj.message = 'Password Updated Successfully';
            res.json(responseObj);
        }
    });
}

module.exports = settings;