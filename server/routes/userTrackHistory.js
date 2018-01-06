const databaseConfig = require('../databaseConfig');

// Google Distance Matrix Api Credentials
const googleMapsClient = require('@google/maps').createClient({
    key : process.env.GOOGLEDISTANCEMATRIXAPIKEY
});

const userTrackHistory = (req,res,conn, responseObj) => {

    const body = req.body;

    let origin = `${body.sourceLat},${body.sourceLong}`;
    let dest = `${body.destLat},${body.destLong}`;

    googleMapsClient.distanceMatrix({
        origins: [origin],
        destinations: [dest],
        language: 'en',
        units: 'metric'
    }, (err, result) => {
        if(err){
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

module.exports = userTrackHistory;