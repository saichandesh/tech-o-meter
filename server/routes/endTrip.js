const databaseConfig = require('../databaseConfig');
const checkForMultiLogin = require('./multiLogin');

const endTrip = (req,res,conn, responseObj, googleMapsClient) => {

    const body = req.body;

    checkForMultiLogin(conn, body.loginID).then(alreadyExists => {
        if(alreadyExists){
            res.status(403).json(`User Exists`);
        }else{
            let sql = `select GeoSourceLat, GeoSourceLong from ${databaseConfig.databaseName}.${databaseConfig.tableNames.TripHistory} where TripID = ${body.tripID}`;

            conn.query(sql, (err, result) => {
                if(err){
                    res.status(501).json(err);
                }else{
                    googleMapsClient.distanceMatrix({
                        origins: [`${result[0].GeoSourceLat},${result[0].GeoSourceLong}`],
                        destinations: [`${body.lat},${body.long}`],
                        language: 'en',
                        units: 'metric'
                    }, (err, results) => {
                        let totalDistance = results.json.rows[0].elements[0].distance.value /1000;

                        sql =  `update ${databaseConfig.databaseName}.${databaseConfig.tableNames.TripHistory} set GeoDestLat = ${body.lat}, GeoDestLong = ${body.long}, EndTime = '${body.endTime}', CashAmount = ${body.cashAmount}, TotalTripAmount = ${body.totalAmount}, TotalDistance = ${totalDistance} where TripID = ${body.tripID}`;
                        
                        conn.query(sql, (err, result) => {
                            if(err){
                                res.status(501).json(err);
                            }else{
                                responseObj.message = 'Trip Ended Successfully';
                                responseObj.data = {}
                                res.json(responseObj);
                            }
                        });
                    });
                }
            });
        }
    });

}

module.exports = endTrip;