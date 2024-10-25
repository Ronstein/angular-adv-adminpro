import { Injectable } from '@angular/core';
import { MenuItem } from './interfaces/sidebar.interface';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  public menu: MenuItem[] = [
    {
      titulo: 'Principal!!!',
      icono: 'mdi mdi-gauge',
      submenu: [
        { titulo: 'Main', url: '/' },
        { titulo: 'ProgressBar', url: 'progress' },
        { titulo: 'Graficas', url: 'grafica1' },
        // { titulo: 'Promesas', url: '/promesas' },
        // { titulo: 'RxJs', url: '/rxjs' },
      ]
    }]

  constructor() { }
}
