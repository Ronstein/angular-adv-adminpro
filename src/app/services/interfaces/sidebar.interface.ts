
export interface MenuItem {
  titulo: string;
  icono: string;
  submenu: SubMenuItem[];
}

interface SubMenuItem {
  titulo: string;
  url: string;
}

