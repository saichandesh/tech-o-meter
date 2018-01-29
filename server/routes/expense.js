const databaseConfig = require('../databaseConfig');
const moment = require('moment');
const checkForMultiLogin = require('./multiLogin');

const expense = (req,res,conn, responseObj) => {
    
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
                    if(result[0] === undefined){
                        res.status(501).json(`CabId not found`);
                    }else{
                        let CabID = result[0].CabID;

                        let LoginID = body.loginID
                        sql = `insert into ${databaseConfig.databaseName}.${databaseConfig.tableNames.Expenses}(LoginID, Date,ExpenseType, Amount) values (${LoginID}, '${body.date}', '${body.expenseType}', ${body.amount}) `;
                        
                        conn.query(sql, (err, result) => {
                            if(err){
                                res.status(501).json(err);
                            }else{
                                responseObj.message = 'Expense Submitted Successfully';
                                res.json(responseObj);
                            }
                        });
                    }
                }
            });
        }
    });
}

module.exports = expense;