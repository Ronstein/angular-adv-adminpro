import { Component, OnDestroy } from '@angular/core';
import { Observable, retry, interval, take, map, filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: ``
})
export class RxjsComponent implements OnDestroy {
  public intervalSubs: Subscription;
  constructor() {
    // this.retornaObservable()
    //   .pipe(
    //     retry(2)
    //   )
    //   .subscribe(
    //     valor => console.log('Subs:', valor),
    //     (error) => console.warn(error),
    //     () => console.info('OBS Completado')
    //   );

    this.intervalSubs = this.retornaIntervalo()
      .subscribe(console.log);
  }
  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }

  retornaIntervalo(): Observable<number> {
    return interval(100)
      .pipe(
        take(10),
        map(valor => valor + 1),
        filter(valor => valor % 2 === 0),
        // map(valor => {
        //   //return valor + 1;
        //   return 'hola mundo ' + valor;
        // })
      );
  }

  retornaObservable(): Observable<number> {
    let i = -1;

    //const obs$ = new Observable<number>(subscriber => {
    return new Observable<number>(subscriber => {

      const intervalo = setInterval(() => {
        //console.log('tick', subscriber);
        i++;
        subscriber.next(i);
        if (i === 4) {
          clearInterval(intervalo);
          subscriber.complete();
        }
        if (i === 2) {
          //console.log('i===2 error');
          //i = 0;
          subscriber.error('Error en la secuencia en el 2');
        }
      }, 1000);
    });
  }
}
