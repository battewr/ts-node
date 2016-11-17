import * as express from 'express';
export class IndexRoute{
    public attach():express.Router{
        let router = express.Router();
        router.get('/', this.getActionDefault.bind(this));
        return router;
    }

    private getActionDefault(req:express.Request, res:express.Response, next:express.NextFunction){
        res.send("found slash!");
    }
}