import { Routes } from "@angular/router";

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'characters',
    pathMatch: 'full'
  },
  {
    path: 'characters',
    loadChildren: async () => (await import('@pages/characters/characters.routes')).routes
  },
  {
    path: '**',
    redirectTo: 'characters',
    pathMatch: 'full'
  }
]
