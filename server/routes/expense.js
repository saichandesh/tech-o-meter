const databaseConfig = require('../databaseConfig');
const moment = require('moment');

const expense = (req,res,conn, responseObj) => {
    
    const body = req.body;

    let sql = `SELECT CabID from ${databaseConfig.databaseName}.${databaseConfig.tableNames.Cabs} WHERE CabNumber = '${body.cabNumber}'`;
    
    conn.query(sql, (err, result) => {
        if(err){
            res.status(501).json(err);
        }else{
            let CabID = result[0].CabID;

            sql = `select * from ${databaseConfig.databaseName}.${databaseConfig.tableNames.LoginHistory} where UserID = ${body.userID} and cabID = ${CabID} and LoginTime <= '${body.date}' ORDER BY LoginTime DESC`;

            conn.query(sql, (err, result) => {
                if(err){
                    res.status(501).json(err);
                }else{
                    if(result[0].LogoutTime == null){

                    if(body.date <= moment(new Date().getTime()).format('YYYY-MM-DD hh:mm:ss') ){
                        LoginID = result[0].LoginID;
                        
                        sql = `insert into ${databaseConfig.databaseName}.${databaseConfig.tableNames.Expenses}(LoginID, Date,ExpenseType, Amount) values (${LoginID}, '${body.date}', '${body.expenseType}', ${body.amount}) `;
                
                        conn.query(sql, (err, result) => {
                            if(err){
                                res.status(501).json(err);
                            }else{
                                responseObj.message = 'Expense Submitted Successfully';
                                res.json(responseObj);
                            }
                        });
                    }else{
                        res.status(501).json('Check the date');
                    }

                    }else{
                        sql = `select LoginID from ${databaseConfig.databaseName}.${databaseConfig.tableNames.LoginHistory} where UserID = ${body.userID} and cabID = ${CabID} and LoginTime <= '${body.date}' and LogoutTime >= '${body.date}'`;

                        conn.query(sql, (err, result) => {
                            if(err){
                                res.status(501).json(err);
                            }else{
            
                                LoginID = result[0].LoginID;
            
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
                        });
                    }
                }
            });
        }
    });
}

module.exports = expense;