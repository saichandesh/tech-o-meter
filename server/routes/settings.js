const databaseConfig = require('../databaseConfig');
const checkForMultiLogin = require('./multiLogin');

const settings = (req,res,conn, responseObj) => {

    const body = req.body;

    checkForMultiLogin(conn, body.loginID).then(alreadyExists => {
        if(alreadyExists){
            res.status(403).json(`User Exists`);
        }else{

            let sql = `select * from ${databaseConfig.databaseName}.${databaseConfig.tableNames.Users} where UserID = ${body.userID}`;

            conn.query(sql, (err, result) => {

                if(result[0] === undefined){
                    res.status(501).json(`User didn't exist`);
                }else if(result[0].Password !== body.currentPassword){
                    res.status(501).json(`current password didn't match`);
                }else{
                    sql = `update ${databaseConfig.databaseName}.${databaseConfig.tableNames.Users} set Password = '${body.newPassword}' where UserID = ${body.userID}`;
                    
                    conn.query(sql, (err, result) => {
                        if(err){
                            res.status(501).json(err);
                        }else{
                            responseObj.message = 'Password Updated Successfully';
                            res.json(responseObj);
                        }
                    });
                }
            });
        }
    });
}

module.exports = settings;