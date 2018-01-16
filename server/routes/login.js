const databaseConfig = require('../databaseConfig');

const login = (req,res,conn, responseObj) => {

    const body = req.body;
    
    let sql = `SELECT CabID from ${databaseConfig.databaseName}.${databaseConfig.tableNames.Cabs} WHERE CabNumber = '${body.cabNumber}'`;

    conn.query(sql, (err, result) => {
        if(err){
            res.status(501).json(err);
        }else{
            if(result.length === 0){
                res.status(501).json('Please Try Again');
            }else{
                let CabID = result[0].CabID;
                sql = `SELECT * from ${databaseConfig.databaseName}.${databaseConfig.tableNames.Users} WHERE UserName = '${body.userName}'`;
                
                conn.query(sql, (err, result) => {
                    if(err){
                        res.status(501).json(err);
                    }else{
                        if(result.length == 0){
                            res.status(501).json("User doesn't exist");
                        }else{
                            let {UserID, UserName, Password} = result[0];
    
                            if(body.password != Password){
                                res.status(501).json("Passwords doesn't match");
                            }else{
    
                                sql = `select * from ${databaseConfig.databaseName}.${databaseConfig.tableNames.LoginHistory} where UserID = ${UserID} ORDER BY LoginTime DESC`;
    
                                conn.query(sql, (err, result) => {
                                    if (err) {
                                        res.status(501).json(err);
                                    } else {
                                        if(result.length >0){
                                            if(result[0].LogoutTime === null){
                                                sql = `update ${databaseConfig.databaseName}.${databaseConfig.tableNames.LoginHistory} set LogoutTime = '${body.loginTime}' where LoginID = ${result[0].LoginID}`;
                                                conn.query(sql, (err, result) => {
                                                    if (err) {
                                                        res.status(501).json(err);
                                                    } else {
                                                        // insert into login history
                                                        sql = `insert into ${databaseConfig.databaseName}.${databaseConfig.tableNames.LoginHistory}(UserID, CabID, LoginTime) values(${UserID}, ${CabID}, '${body.loginTime}')`
                                                        conn.query(sql, (err, result) => {
                                                            if (err) {
                                                                res.status(501).json(err);
                                                            } else {
                                                                sql = `select LoginID from ${databaseConfig.databaseName}.${databaseConfig.tableNames.LoginHistory} where UserID = ${UserID} and CabID = ${CabID} and LoginTime = '${body.loginTime}'`;
        
                                                                conn.query(sql, (err, result) => {
                                                                    if(err){
                                                                        res.status(501).json(err);
                                                                    }else{
                                                                        responseObj.message = 'Login Successfully';
                                                                        responseObj.data = {
                                                                            loginID : result[0].LoginID
                                                                        }
                                                                        res.json(responseObj);
                                                                    }
                                                                });
                                                            }
                                                        }); 
                                                    }
                                                });
                                            }else{
                                                // insert into login history
                                                sql = `insert into ${databaseConfig.databaseName}.${databaseConfig.tableNames.LoginHistory}(UserID, CabID, LoginTime) values(${UserID}, ${CabID}, '${body.loginTime}')`
                                                conn.query(sql, (err, result) => {
                                                    if (err) {
                                                        res.status(501).json(err);
                                                    } else {
                                                        sql = `select LoginID from ${databaseConfig.databaseName}.${databaseConfig.tableNames.LoginHistory} where UserID = ${UserID} and CabID = ${CabID} and LoginTime = '${body.loginTime}'`;
        
                                                        conn.query(sql, (err, result) => {
                                                            if(err){
                                                                res.status(501).json(err);
                                                            }else{
                                                                responseObj.message = 'Login Successfully';
                                                                responseObj.data = {
                                                                    loginID : result[0].LoginID
                                                                }
                                                                res.json(responseObj);
                                                            }
                                                        });
                                                    }
                                                }); 
                                            }
                                        }else{
                                            res.status(501).json("Please Try Again");
                                        }
                                    }
                                });                          
                            }
                        }
                    }
                });
            }
        }
    });
}

module.exports = login;