const databaseConfig = require('../databaseConfig');
const checkForMultiLogin = require('./multiLogin');

const userTrackHistory = (req,res,conn, responseObj, googleMapsClient) => {
    const body = req.body;
    checkForMultiLogin(conn, body.loginID).then(alreadyExists => {
        if(alreadyExists){
            res.status(403).json(`User Exists`);
        }else{
            if(body.loginID === null){
                responseObj.message = 'Login Id is null';
                responseObj.data = {}
                res.json(responseObj);
            }
            let origin = `${body.sourceLat},${body.sourceLong}`;
            let dest = `${body.destLat},${body.destLong}`;
        
            googleMapsClient.distanceMatrix({
                origins: [origin],
                destinations: [dest],
                language: 'en',
                units: 'metric'
            }, (err, result) => {
                if(err){
                    console.log(`err + ${err}`);
                    res.status(501).json(err);
                }else{
                    let totalDistance = result.json.rows[0].elements[0].distance.value /1000;
        
                    sql = `insert into ${databaseConfig.databaseName}.${databaseConfig.tableNames.UserTrackHistory}(LoginID, SourceLat, SourceLong, DestLat, DestLong, TotalDistance, StartTime, EndTime) values (${body.loginID}, ${body.sourceLat}, ${body.sourceLong}, ${body.destLat}, ${body.destLong}, ${totalDistance}, '${body.startTime}', '${body.endTime}')`
        
                    conn.query(sql, (err, result) => {
                        if(err){
                            res.status(501).json(err);
                        }else{
                            responseObj.message = 'Trip Details are saved successfully';
                            responseObj.data = {}
                            res.json(responseObj);
                        }
                    });
                }
            }); 
        }
        });

}

module.exports = userTrackHistory;