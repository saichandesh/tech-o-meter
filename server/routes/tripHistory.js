const databaseConfig = require('../databaseConfig');
const moment = require('moment');

const tripHistory = (req,res,conn, responseObj) => {
    
    const body = req.body;

    let sql = `SELECT CabID from ${databaseConfig.databaseName}.${databaseConfig.tableNames.Cabs} WHERE CabNumber = '${body.cabNumber}'`;
    
    conn.query(sql, (err, result) => {
        if(err){
            res.status(501).json(err);
        }else{
            let CabID = result[0].CabID;

            sql = `select * from ${databaseConfig.databaseName}.${databaseConfig.tableNames.LoginHistory} where UserID = ${body.userID} and cabID = ${CabID} and LoginTime <= '${body.startTime}' ORDER BY LoginTime DESC`;

            conn.query(sql, (err, result) => {
                if(err){
                    res.status(501).json(err);
                }else{
                    if(result[0].LogoutTime == null){

                    if(body.startTime <= moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss') ){
                      
                        LoginID = result[0].LoginID;
                        
                        sql = `insert into ${databaseConfig.databaseName}.${databaseConfig.tableNames.TripHistory}(LoginID, GeoSourceLat, GeoSourceLong, StartTime, GeoDestLat, GeoDestLong, EndTime, CardAmount, CashAmount, TotalTripAmount) values (${LoginID}, ${body.sourceLat}, ${body.sourceLong}, '${body.startTime}', ${body.destLat}, ${body.destLong}, '${body.endTime}', ${body.cardAmount}, ${body.cashAmount}, ${body.totalAmount}) `;

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
                        sql = `select LoginID from ${databaseConfig.databaseName}.${databaseConfig.tableNames.LoginHistory} where UserID = ${body.userID} and cabID = ${CabID} and LoginTime <= '${body.startTime}' and LogoutTime >= '${body.endTime}'`;

                        conn.query(sql, (err, result) => {
                            if(err){
                                res.status(501).json(err);
                            }else{
            
                                LoginID = result[0].LoginID;
            
                                sql = `insert into ${databaseConfig.databaseName}.${databaseConfig.tableNames.TripHistory}(LoginID, GeoSourceLat, GeoSourceLong, StartTime, GeoDestLat, GeoDestLong, EndTime, CardAmount, CashAmount, TotalTripAmount) values (${LoginID}, ${body.sourceLat}, ${body.sourceLong}, '${body.startTime}', ${body.destLat}, ${body.destLong}, '${body.endTime}', ${body.cardAmount}, ${body.cashAmount}, ${body.totalAmount}) `;
                                
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
            });
        }
    });
}

module.exports = tripHistory;