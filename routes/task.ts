import * as express from 'express';
import * as uuid from 'uuid';
import { TaskRepository } from '../repository/taskRepo';
import { DbExecutionWrapper } from '../lib/db';
import { Ticket } from '../domain/ticket';
export class TaskRoute {
    private _taskRepo: TaskRepository;

    constructor(dbPool: DbExecutionWrapper) {
        this._taskRepo = new TaskRepository(dbPool);
    }
    public attach(): express.Router {
        let router = express.Router();
        router.put('/', this.insertNewTicket.bind(this));
        router.get('/:id', this.getTicketAction.bind(this));
        router.get('/', this.getTicketList.bind(this));
        router.delete('/:id', this.deleteTicket.bind(this));
        router.options('', this.allowOptions.bind(this));
        router.options('/:id', this.allowOptions.bind(this));
        return router;
    }

    private end(pr: Promise<any>, res: express.Response) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods','PUT, POST, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', "content-type");
        if (!pr) {
            res.status(500);
            res.send("invalid promise state!");
        } else {
            pr.then((result) => {
                res.send(result);
            }).catch((error) => {
                res.status(error.status);
                res.send(error);
            });
        }
    }

    private allowOptions(req:express.Request, res: express.Response, next: express.NextFunction){
        let pr = new Promise<any>((resolve, reject)=>{resolve({result: "ok"})});
        this.end(pr, res);
    }

    private deleteTicket(req:express.Request, res: express.Response, next: express.NextFunction){
        this.end(this._taskRepo.deleteTask(req.params.id), res);
    }

    private insertNewTicket(req: express.Request, res: express.Response, next: express.NextFunction) {
        let body: Ticket = req.body;
        console.log(JSON.stringify(body));
        this.end(this._taskRepo.insertTask(body), res);
    }

    private getTicketList(req: express.Request, res: express.Response, next: express.NextFunction) {
        this.end(this._taskRepo.getAllTasks(), res);
    }

    private getTicketAction(req: express.Request, res: express.Response, next: express.NextFunction) {
        this.end(this._taskRepo.findTaskById(req.params.id), res);
    }
}