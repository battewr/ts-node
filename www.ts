import { Application } from "./app"
import * as debug from 'debug';
import * as http from 'http';

class Main {
    private port: number;
    private debugLogger:debug.IDebugger;
    init() {
        console.log('starting...');
        this.debugLogger = debug('tsnodeexpress:server');
        this.debugLogger('starting...');
        let applicationBootstapper = new Application();
        let app = applicationBootstapper.bootstrap();

        this.port = this.normalizePort(process.env.PORT || '3000');

        app.set('port', this.port);

        let server = http.createServer(app);
        server.listen(this.port);

        server.on('listening', this.onListening.bind(this));
        server.on('error', this.onError.bind(this));
    }

    private onListening() {
        this.debugLogger('Listening on port: ' + this.port);
    }

    private onError(err: any) {
        if (err.syscall !== 'listen') {
            throw err;
        }
        switch (err.code) {
            case 'EACCES':
                console.error('Port ' + this.port + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error('Port ' + this.port + ' is already in use');
                process.exit(1);
                break;
            default:
                throw err;
        }
    }

    private normalizePort(port: string): number {
        let parsedPort: number = parseInt(port, 10);
        if (isNaN(parsedPort) || parsedPort < 1) {
            throw 'Invalid Port Specification';
        }
        return parsedPort;
    }
}
let program = new Main();
program.init();