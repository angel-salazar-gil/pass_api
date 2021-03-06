import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import {Request, Response} from "express";
import * as cors from "cors";
import helmet from "helmet";
import routes from "./routes";

const PORT = process.env.PORT || 3000;

//import * as bodyParser from "body-parser";
//import {Routes} from "./routes";
//import {User} from "./entity/User";

createConnection().then(async () => {

    // create express app
    const app = express();
    //Middlewares
    app.use(cors());
    app.use(helmet());

    app.use(express.json());
    //Rputes
    app.use('/', routes);

    /* register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next);
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);

            } else if (result !== null && result !== undefined) {
                res.json(result);
            }
        });
    });*/

    // setup express app here

    // start express server
    app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));

    /* insert new users for test
    await connection.manager.save(connection.manager.create(User, {
        firstName: "Timber",
        lastName: "Saw",
        age: 27
    }));
    await connection.manager.save(connection.manager.create(User, {
        firstName: "Phantom",
        lastName: "Assassin",
        age: 24
    }));

    console.log("Express server has started on port 3000. Open http://localhost:3000/users to see results");*/

}).catch(error => console.log(error));
