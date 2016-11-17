import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import {RestfulError} from './ErrorWrapper'
import {IndexRoute}from'./routes/Index'

export class Application{
    private val:number = 10;
    bootstrap():express.Express{
        let app = express();
        app.use(logger('dev'));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: false}));

        let indexRoute = new IndexRoute();
        app.use('/', indexRoute.attach());

        app.use(this.notFoundHandler);
        app.use(this.finalErrorHandleCatch.bind(this));
        return app;
    }

    notFoundHandler(req:express.Request, res:express.Response, next:express.NextFunction){
        let err = new RestfulError('Resource Not Found', 404);
        next(err);
    }

    finalErrorHandleCatch(err:any, req:express.Request, res:express.Response, next:express.NextFunction){
        let error:any = req.app.get('env') === 'development'? err.toString() : "Failed";
        res.status(err.status || 500);
        res.send(error);
    }
}
