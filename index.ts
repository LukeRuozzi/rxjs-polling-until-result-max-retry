import { of, Observable, interval } from 'rxjs';
import {
  tap,
  filter,
  take,
  mergeMap
} from 'rxjs/operators';
import moment from 'moment';

let cnt = 0;  // contatore dei tentativi (usato solo per logging)

const intervalTime = 250;  // intervallo che passa tra un tentativo e l'altro

// simula la chiamata a BE che restituisce i dati se è terminata l'elaborazione
const ocrCall$ = new Observable(subscriber => {
  const data = Math.random();
  subscriber.next(data > 0.85 ? {msg: 'SUCCESS', data: data} : {msg: 'PENDING', data: data});
}).pipe(
  tap(() => console.log('ocr call')),  // solo per logging
);

const interval$ = interval(intervalTime);

const intervalCall$ = interval$.pipe(
  tap(() => console.log('interval call')),  // solo per logging
  take(10),  // dopo 10 tentativi mi fermo
  mergeMap(() => ocrCall$),  // merge tra l'interval e la chiamata a BE
  tap(data => printLog(data)),  // solo per logging
  filter(res => res.msg === 'SUCCESS'), // filtro solo le chiamate che hanno avuto esito positivo
  take(1),  // se il risultato è SUCCESS mi fermo subito
);

intervalCall$.subscribe(
  res => console.log('res: ',res), 
  err => console.log('Error: ', err)
);

function printLog(data) {
    console.log(`#${++cnt} ${moment().format('HH:mm:ss:SSS')}  --> `, data.msg);
}
