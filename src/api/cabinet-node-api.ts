import { Request, Response } from 'express';

import * as express from 'express';

import * as bodyParser from 'body-parser';
import { insertText } from '../cabinet-core/utils/insert-text';
import { CabinetNode, Card } from 'cabinet-node';
import * as cors from 'cors';


const app = express();
// json body parser
app.use(bodyParser.json());
// allow cors

app.use(cors({
  origin: '*'
}));

export class CabinetNodeApi {

  cabinetNode: CabinetNode;
  port = '18008';
  constructor(cabinetNode: CabinetNode) {
    this.cabinetNode = cabinetNode;

    this.init(cabinetNode);

  }

  async init(cabinetNode: CabinetNode) {
    app.get('/', (req: Request, res: Response) => {
      res.send('Hello World!');
    });

    // insert card cci into current cursor
    app.post('/addcards', function (request: Request, response: Response) {
      console.log(request.body);      // your JSON
      response.send(request.body);    // echo the result back

      const cards = (request.body as Card[]).map(card => {
        return Object.assign(new Card(), card);
      });
      console.log(cards);

      const opt = getInsertOption(request);

      cabinetNode.addCards(cards);
      cards.forEach(card => {
        insertText(card.getCci().toCciMarker(), opt);
      });
    });

    const getInsertOption = (request: Request) => {

      const linesAfter = parseInt(request.query.linesAfter as string, 10);
      const select = Boolean(request.query.select);
      return {
        linesAfter,
        select
      };
    };

    app.post('/insert', async function (request: Request, response: Response) {
      console.log(request.query);      // your JSON
      const { text } = request.body;

      const opt = getInsertOption(request);;;
      await insertText(text, opt);

      return `inserted\n${text}`;
    });

    app.listen(this.port, () => {
      console.log(`Cabinet Api listening at http://localhost:${this.port}`);
    })
  }


}
