const databaseConfig = require('../databaseConfig');

const startTrip = (req,res,conn, responseObj) => {

    const body = req.body;
    
    sql =  `insert into ${databaseConfig.databaseName}.${databaseConfig.tableNames.TripHistory} (LoginID, GeoSourceLat, GeoSourceLong, StartTime) values(${body.loginID}, ${body.lat}, ${body.long}, '${body.startTime}')`;
    conn.query(sql, (err, result) => {
        if(err){
            res.status(501).json(err);
        }else{
            sql = `select TripID from ${databaseConfig.databaseName}.${databaseConfig.tableNames.TripHistory} where LoginID = ${body.loginID} and StartTime = '${body.startTime}'`;
            conn.query(sql, (err, result) => {
                if(err){
                    res.status(501).json(err);
                }else{
                    responseObj.message = 'Trip Started Successfully';
                    responseObj.data = {
                        tripID : result[0].TripID
                    }
                    res.json(responseObj);
                }
            });
        }
    });

}

module.exports = startTrip;