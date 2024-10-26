import { Injectable } from '@angular/core';
import { MenuItem } from './interfaces/sidebar.interface';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  public menu: MenuItem[] = [
    {
      titulo: 'Dashboard',
      icono: 'mdi mdi-gauge',
      submenu: [
        { titulo: 'Main', url: '/dashboard' },
        { titulo: 'ProgressBar', url: 'progress' },
        { titulo: 'Graficas', url: 'grafica1' },
        { titulo: 'Promesas', url: 'promises' },
        { titulo: 'RxJs', url: 'rxjs' },
        // { titulo: 'Promesas', url: '/promesas' },
        // { titulo: 'RxJs', url: '/rxjs' },
      ]
    }]

  constructor() { }
}
