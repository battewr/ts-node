import * as express from 'express';
export class IndexRoute{
    private startTime:number;
    public constructor(){
        this.startTime = Date.now();
    }
    public attach():express.Router{
        let router = express.Router();
        router.get('/', this.getActionDefault.bind(this));
        return router;
    }

    private getActionDefault(req:express.Request, res:express.Response, next:express.NextFunction){
        let delta = Date.now()-this.startTime;
        let seconds = Math.floor((delta/1000)%60);
        let minutes = Math.floor(((delta/1000)/60)%60);
        let hours = Math.floor((((delta/1000)/60)/60)%24);
        let days = Math.floor((((delta/1000)/60)/60)/24);

        let result = days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's';
        res.send({uptime: result , startTime: new Date(this.startTime), currentTime: new Date(Date.now()), status: "online"});
    }
}