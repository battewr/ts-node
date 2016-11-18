import * as mysql from 'mysql';

export class DbExecutionWrapper{
    private sqlPool:mysql.IPool;

    constructor(){
        this.sqlPool = mysql.createPool({
            connectionLimit: 10,
            host: 'localhost',
            user: 'todo_usr',
            password: '******',
            database: 'todo'
        });
    }

    public queryPromiseWrapperValues(sql: string, values?: Array<any>):Promise<any>{
        return new Promise((resolve, reject)=>{
            this.sqlPool.query(sql, values, (err, rows)=>{
                if(!err){
                    resolve(rows);
                }else{
                    reject(err);
                }
            });
        });
    }
}