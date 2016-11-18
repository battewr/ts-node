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
        return router;
    }

    private end(pr: Promise<any>, res: express.Response) {
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

    private insertNewTicket(req: express.Request, res: express.Response, next: express.NextFunction) {
        let body: Ticket = req.body;
        this.end(this._taskRepo.insertTask(body), res);
    }

    private getTicketList(req: express.Request, res: express.Response, next: express.NextFunction) {
        this.end(this._taskRepo.getAllTasks(), res);
    }

    private getTicketAction(req: express.Request, res: express.Response, next: express.NextFunction) {
        this.end(this._taskRepo.findTaskById(req.params.id), res);
    }
}