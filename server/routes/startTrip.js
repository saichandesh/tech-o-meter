const databaseConfig = require('../databaseConfig');
const checkForMultiLogin = require('./multiLogin');

const startTrip = (req,res,conn, responseObj, googleMaps) => {

    const body = req.body;

    checkForMultiLogin(conn, body.loginID).then(alreadyExists => {
        if(alreadyExists){
            res.status(403).json(`User Exists`);
        }else{
        let sql =  `insert into ${databaseConfig.databaseName}.${databaseConfig.tableNames.TripHistory} (LoginID, GeoSourceLat, GeoSourceLong, StartTime) values(${body.loginID}, ${body.lat}, ${body.long}, '${body.startTime}')`;
        
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
                        body.lat = 41.7508;
                        body.long = -88.1535;
                        googleMaps.reverseGeocode({
                            latlng: [body.lat, body.long],
                        },(error, address) => {
                            if(error){
                                res.status(501).json(error);
                            }else{
                                if(address.json.results === null){
                                    res.status(501).json(`Address null`);
                                }else{
                                    responseObj.data.address = address.json.results[0].formatted_address;
                                }
                            }
                            res.json(responseObj);
                        });
                    }
                });
            }
        });

        }
    });

}

module.exports = startTrip;