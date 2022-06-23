import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./pages/tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'project-create',
    loadChildren: () => import('./pages/project-create/project-create.module').then( m => m.ProjectCreatePageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'note-create',
    loadChildren: () => import('./pages/note-create/note-create.module').then( m => m.NoteCreatePageModule)
  },
  {
    path: 'note-detail/:id',
    loadChildren: () => import('./pages/note-detail/note-detail.module').then( m => m.NoteDetailPageModule)
  },
  {
    path: 'comment-create/:id',
    loadChildren: () => import('./pages/comment-create/comment-create.module').then( m => m.CommentCreatePageModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('./pages/menu/menu.module').then( m => m.MenuPageModule)
  },



];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
