const databaseConfig = require('../databaseConfig');
const moment = require('moment');
const checkForMultiLogin = require('./multiLogin');

const tripHistory = (req,res,conn, responseObj) => {
    
    const body = req.body;

    checkForMultiLogin(conn, body.loginID).then(alreadyExists => {
        if(alreadyExists){
            res.status(403).json(`User Exists`);
        }else{

            let sql = `SELECT CabID from ${databaseConfig.databaseName}.${databaseConfig.tableNames.Cabs} WHERE CabNumber = '${body.cabNumber}'`;
            
            conn.query(sql, (err, result) => {
                if(err){
                    res.status(501).json(err);
                }else{
                    if(result === undefined){
                        res.status(501).json(`cabId not found`);
                    }else{
                        let CabID = result[0].CabID;
                        
                        sql = `select * from ${databaseConfig.databaseName}.${databaseConfig.tableNames.LoginHistory} where UserID = ${body.userID} and cabID = ${CabID} and LoginTime <= '${body.startDate}' ORDER BY LoginTime DESC`;
            
                        conn.query(sql, (err, result) => {
                            if(err){
                                res.status(501).json(err);
                            }else{
                                if(result[0] === undefined){
                                    res.status(501).json(`LoginId doesn't exist`);
                                }else{
                                    if(result[0].LogoutTime == null){
                                    if(body.startDate <= moment(new Date().getTime()).format('DD-MM-YYYY   hh:mm:ss a') ){
                                        
                                        LoginID = result[0].LoginID;
                                        
                                        sql = `insert into ${databaseConfig.databaseName}.${databaseConfig.tableNames.TripHistory}(LoginID, StartTime, EndTime, CashAmount, TotalTripAmount, TotalDistance) values (${LoginID}, '${body.startDate}', '${body.endDate}', ${body.cashAmount}, ${body.totalAmount}, ${body.totalDistance}) `;
                
                                        conn.query(sql, (err, result) => {
                                            if(err){
                                                res.status(501).json(err);
                                            }else{
                                                responseObj.message = 'Trip History Submitted Successfully';
                                                res.json(responseObj);
                                            }
                                        });
                                    }else{
                                        res.status(501).json('Check the date');
                                    }
                
                                    }else{
                                        sql = `select LoginID from ${databaseConfig.databaseName}.${databaseConfig.tableNames.LoginHistory} where UserID = ${body.userID} and cabID = ${CabID} and LoginTime <= '${body.startDate}' and LogoutTime >= '${body.endDate}'`;
                
                                        conn.query(sql, (err, result) => {
                                            if(err){
                                                res.status(501).json(err);
                                            }else{
                            
                                                LoginID = result[0].LoginID;
                            
                                                sql = `insert into ${databaseConfig.databaseName}.${databaseConfig.tableNames.TripHistory}(LoginID, StartTime, EndTime, CashAmount, TotalTripAmount, TotalDistance) values (${LoginID}, '${body.startDate}', '${body.endDate}', ${body.cashAmount}, ${body.totalAmount}, ${body.totalDistance}) `;
                                                
                                                conn.query(sql, (err, result) => {
                                                    if(err){
                                                        res.status(501).json(err);
                                                    }else{
                                                        responseObj.message = 'Trip History Submitted Successfully';
                                                        res.json(responseObj);
                                                    }
                                                });
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
    });

   
}

module.exports = tripHistory;