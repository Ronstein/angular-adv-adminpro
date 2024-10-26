import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promises',
  templateUrl: './promises.component.html',
  styles: ``
})
export class PromisesComponent implements OnInit {
  ngOnInit(): void {
    this.getUsuarios().then(usuario => {
      console.log(usuario);
    })
    //   const promesa = new Promise((resolve, reject) => {
    //     if (false) {
    //       resolve('Todo bien');
    //     } else {
    //       reject('Todo mal');
    //     }
    //   });

    //   promesa.then((mensaje) => {
    //     console.log('termine', mensaje);
    //   })
    //     .catch((err) => {
    //       console.log('error en la promesa', err);
    //     })
    //     ;

    //   console.log('end init');

  }

  getUsuarios() {
    return new Promise(resolve => {
      fetch('https://reqres.in/api/users')
        .then(resp => resp.json())
        .then(body => resolve(body.data));
    })
  }

}
