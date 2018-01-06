const databaseConfig = require('../databaseConfig');

const endTrip = (req,res,conn, responseObj) => {

    const body = req.body;

    sql =  `update ${databaseConfig.databaseName}.${databaseConfig.tableNames.TripHistory} set GeoDestLat = ${body.lat}, GeoDestLong = ${body.long}, EndTime = '${body.endTime}', CardAmount = ${body.cardAmount}, CashAmount = ${body.cashAmount}, TotalTripAmount = ${body.totalAmount} where TripID = ${body.tripID}`;

    conn.query(sql, (err, result) => {
        if(err){
            res.status(501).json(err);
        }else{
            responseObj.message = 'Trip Ended Successfully';
            responseObj.data = {}
            res.json(responseObj);
        }
    });

}

module.exports = endTrip;