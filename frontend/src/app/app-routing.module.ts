import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurriculumVitaeComponent } from './components/curriculum-vitae/curriculum-vitae.component';
import { EditorComponent } from './components/editor/editor.component';
import { AlgorithmeComponent } from './components/algorithme/algorithme.component';
import { DijkstraComponent } from './components/dijkstra/dijkstra.component';
import { HorizonComponent } from './components/horizon/horizon.component';
import { SnakeComponent } from './components/snake/snake.component';
import { SpaceInvadersComponent } from './components/space-invaders/space-invaders.component';
import { CrazyflieComponent } from './components/crazyflie/crazyflie/crazyflie.component';
import { CubeComponent } from './components/cube/cube.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { AgeOfEmpireComponent } from './components/age-of-empire/age-of-empire.component';
import { ImageComponent } from './components/image/image.component';

const routes: Routes = [
  { path: '', redirectTo: '/curriculumVitae', pathMatch: 'full' },
  { path: 'curriculumVitae', component: CurriculumVitaeComponent },
  { path: 'editor', component: EditorComponent },
  { path: 'algorithme', component: AlgorithmeComponent },
  { path: 'dijkstra', component: DijkstraComponent },
  { path: 'horizon', component: HorizonComponent },
  { path: 'snake', component: SnakeComponent },
  { path: 'spaceInvaders', component: SpaceInvadersComponent },
  { path: 'crazyflie', component: CrazyflieComponent },
  { path: 'cube', component: CubeComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'aoe', component: AgeOfEmpireComponent },
  { path: 'image', component: ImageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
