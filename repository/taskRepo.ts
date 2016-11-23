import * as uuid from 'uuid';
import * as mysql from 'mysql';
import {DbExecutionWrapper} from '../lib/db';
import {Ticket} from '../domain/ticket';

export class TaskRepository{
    private _db:DbExecutionWrapper;
    constructor(db:DbExecutionWrapper){
        this._db = db;
    }

    // public getTaskCount():Promise<Number>{
    //     return new Promise((resolve, reject)=>{

    //     });
    // }

    public insertTask(newTicket:Ticket):Promise<Ticket>{
        newTicket.id = uuid.v4();
        const sql:string = 'insert into task (id, description, title) values(?,?,?)';
        let params = new Array<string>();
        params.push(newTicket.id);
        params.push(newTicket.description);
        params.push(newTicket.name);
        
        return new Promise((resolve, reject)=>{
            this._db.queryPromiseWrapperValues(sql, params)
                .then((rows:any)=>
                    {
                        if(rows.affectedRows < 1){
                            reject({status:500, reason:"insert failed"});
                        }
                        resolve(newTicket);
                    })
                .catch((err)=>{reject({status:500, reason:err})});
        });
    }

    public getAllTasks():Promise<Array<Ticket>>{
        const sql:string = 'select * from task limit 100';
        let params = new Array<string>();
        return new Promise((resolve, reject)=>{
            this._db.queryPromiseWrapperValues(sql, params)
                .then((rows:Array<any>)=>
                    {
                        if(rows.length < 1){
                            reject({status:404, reason:"not found"});
                        }
                        // id is a primary key, there can only be 1
                        let results:Array<Ticket> = new Array<Ticket>();
                        for(let item of rows){
                            results.push(new Ticket(item));
                        }
                        resolve(results);
                    })
                .catch((err)=>{reject({status:500, reason:err})});
        });
    }

    public findTaskById(id:string):Promise<Ticket>{
        const sql:string = 'select * from task where id = ?';
        let params = new Array<string>();
        params.push(id.toString());
        return new Promise((resolve, reject)=>{
            this._db.queryPromiseWrapperValues(sql, params)
                .then((rows:Array<any>)=>
                    {
                        if(rows.length < 1){
                            reject({status:404, reason:"not found"});
                        }
                        // id is a primary key, there can only be 1
                        let row = new Ticket(rows[0]);
                        resolve(row);
                    })
                .catch((err)=>{reject({status:500, reason:err})});
        });
    }
}