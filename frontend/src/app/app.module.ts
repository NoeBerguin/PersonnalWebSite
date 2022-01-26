import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { CurriculumVitaeComponent } from './components/curriculum-vitae/curriculum-vitae.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClientModule } from '@angular/common/http';
import { MatChipsModule } from '@angular/material/chips';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ColorPickerFormComponent } from './components/color/color-picker-form/color-picker-form.component';
import { ColorPickerComponent } from './components/color/color-picker/color-picker.component';
import { ColorToolComponent } from './components/color/color-tool/color-tool.component';
import { RecentColorsComponent } from './components/color/recent-colors/recent-colors.component';
import { ContinueDrawingComponent } from './components/continue-drawing/continue-drawing.component';
import { CreateNewDrawingComponent } from './components/create-new-drawing/create-new-drawing.component';
import { NewDrawingDialogComponent } from './components/create-new-drawing/new-drawing-dialog/new-drawing-dialog.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { EditorComponent } from './components/editor/editor.component';
import { ExportDrawingDialogComponent } from './components/export-drawing/export-drawing-dialog/export-drawing-dialog.component';
import { ExportDrawingComponent } from './components/export-drawing/export-drawing.component';
import { GuideComponent } from './components/guide/guide.component';
import { OpenGuideComponent } from './components/guide/open-guide/open-guide.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { BrushComponent } from './components/tools-options/brush/brush.component';
import { SVGFilterComponent } from './components/tools-options/brush/svgfilter/svgfilter.component';
import { BucketComponent } from './components/tools-options/bucket/bucket.component';
import { CalligraphyComponent } from './components/tools-options/calligraphy/calligraphy.component';
import { EllipseComponent } from './components/tools-options/ellipse/ellipse.component';
import { EraseComponent } from './components/tools-options/erase/erase.component';
import { EyedropperComponent } from './components/tools-options/eyedropper/eyedropper.component';
import { GridComponent } from './components/tools-options/grid/grid.component';
import { LineComponent } from './components/tools-options/line/line.component';
import { PencilComponent } from './components/tools-options/pencil/pencil.component';
import { PolygonComponent } from './components/tools-options/polygon/polygon.component';
import { RectangleComponent } from './components/tools-options/rectangle/rectangle.component';
import { MagnetismComponent } from './components/tools-options/selection/magnetism/magnetism.component';
import { SelectionComponent } from './components/tools-options/selection/selection.component';
import { SprayComponent } from './components/tools-options/spray/spray.component';
import { StampComponent } from './components/tools-options/stamp/stamp.component';
import { TextComponent } from './components/tools-options/text/text.component';
import { ThicknessSliderComponent } from './components/tools-options/thickness-slider/thickness-slider.component';
import { UndoRedoComponent } from './components/undo-redo/undo-redo.component';
import { SidebarEditorComponent } from './components/sidebar-editor/sidebar-editor.component';
import { AlgorithmeComponent } from './components/algorithme/algorithme.component';
import { ToolBarComponent } from './components/tool-bar/tool-bar.component';
import { DijkstraComponent } from './components/dijkstra/dijkstra.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    HeaderComponent,
    CurriculumVitaeComponent,
    EditorComponent,
    SidebarComponent,
    DrawingComponent,
    MainPageComponent,
    ColorPickerComponent,
    ColorToolComponent,
    RecentColorsComponent,
    PencilComponent,
    RectangleComponent,
    EllipseComponent,
    GuideComponent,
    LineComponent,
    ThicknessSliderComponent,
    SVGFilterComponent,
    BrushComponent,
    ColorPickerFormComponent,
    EraseComponent,
    CreateNewDrawingComponent,
    NewDrawingDialogComponent,
    OpenGuideComponent,
    PolygonComponent,
    UndoRedoComponent,
    EyedropperComponent,
    ExportDrawingComponent,
    ExportDrawingDialogComponent,
    SelectionComponent,
    BucketComponent,
    TextComponent,
    StampComponent,
    GridComponent,
    MagnetismComponent,
    ContinueDrawingComponent,
    CalligraphyComponent,
    SprayComponent,
    SidebarEditorComponent,
    AlgorithmeComponent,
    ToolBarComponent,
    DijkstraComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatSlideToggleModule,
    MatTooltipModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatTabsModule,
    MatDividerModule,
    MatSidenavModule,
    MatRadioModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatSelectModule,
    MatChipsModule,
    MatSnackBarModule,
  ],
  providers: [{ provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }],
  bootstrap: [AppComponent],
})
export class AppModule { }
