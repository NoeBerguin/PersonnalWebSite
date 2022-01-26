import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurriculumVitaeComponent } from './components/curriculum-vitae/curriculum-vitae.component';
import { EditorComponent } from './components/editor/editor.component';
import { AlgorithmeComponent } from './components/algorithme/algorithme.component';
import { DijkstraComponent } from './components/dijkstra/dijkstra.component';

const routes: Routes = [
  { path: '', redirectTo: '/curriculumVitae', pathMatch: 'full' },
  { path: 'curriculumVitae', component: CurriculumVitaeComponent },
  { path: 'editor', component: EditorComponent },
  { path: 'algorithme', component: AlgorithmeComponent },
  { path: 'dijkstra', component: DijkstraComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
