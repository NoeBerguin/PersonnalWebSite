import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Tool } from 'src/app/classes/tool/tool';
import { ToolbarService } from 'src/app/services/toolbar/toolbar.service';
import { CreateNewDrawingComponent } from '../create-new-drawing/create-new-drawing.component';
import { ExportDrawingComponent } from '../export-drawing/export-drawing.component';

@Component({
  selector: 'app-sidebar-editor',
  templateUrl: './sidebar-editor.component.html',
  styleUrls: ['./sidebar-editor.component.scss']
})
export class SidebarEditorComponent implements OnInit {
  tools: Tool[] = [];
  @ViewChild('toolProperties') sidenavProperties: MatSidenav;
  @ViewChild(CreateNewDrawingComponent) newDrawingRef: CreateNewDrawingComponent;
  @ViewChild(ExportDrawingComponent) exportRef: ExportDrawingComponent;
  @Output() requestCanvasFocus: EventEmitter<void> = new EventEmitter();

  constructor(protected toolbarService: ToolbarService) {
    this.tools = this.toolbarService.getTools();
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  isCurrentTool(tool: Tool): boolean {
    return tool === this.currentTool;
  }

  onToolChanged(tool: Tool): void {
    if (tool !== this.currentTool) {
      this.toolbarService.changeTool(tool);
      this.sidenavProperties.open();
    }
  }

  createNewDrawing(): void {
    this.newDrawingRef.createNewDrawing();
  }

  exportDrawing(): void {
    this.exportRef.exportDrawing();
  }


  onTextPropertyChange(): void {
    this.requestCanvasFocus.emit();
  }

  get currentTool(): Tool {
    return this.toolbarService.currentTool;
  }
}
