import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    title: 'Characters',
    loadComponent: async () => (await import('./characters.component')).CharactersComponent,
  },
]
