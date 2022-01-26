import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { Command } from 'src/app/classes/commands/command';
import { ResizerProperties } from 'src/app/classes/resizer-properties';
import { CANVAS_MIN_WIDTH, CANVAS_MIN_HEIGHT, SELECTION_CONTROL_POINT_SIZE } from 'src/app/constants/constants';
import { ControlPoint } from 'src/app/enums/control-point.enum';
import { MouseButton } from 'src/app/enums/mouse-button.enum';
import { AutomaticSavingService } from 'src/app/services/automatic-saving/automatic-saving.service';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { ResizeService } from 'src/app/services/resize/resize.service';
import { ToolbarService } from 'src/app/services/toolbar/toolbar.service';
import { PencilService } from 'src/app/services/tools/pencil/pencil.service';
import { SprayService } from 'src/app/services/tools/spray/spray.service';
import { StampService } from 'src/app/services/tools/stamp/stamp.service';
import { UndoRedoService } from 'src/app/services/undo-redo/undo-redo.service';

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('baseCanvas', { static: false })
    baseCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('previewCanvas', { static: false })
    previewCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('gridCanvas', { static: false })
    gridCanvas!: ElementRef<HTMLCanvasElement>;

    @Input()
    drawingContainerWidth!: number;
    @Input()
    drawingContainerHeight!: number;
    @Input()
    dimensionsUpdatedEvent!: Observable<number[]>;

    @Output() requestDrawingContainerDimensions: EventEmitter<void> = new EventEmitter();

    previewCtx!: CanvasRenderingContext2D;
    gridCtx!: CanvasRenderingContext2D;
    private subscribeCreateNewDrawing!: Subscription;
    private subscribeResetCanvasSize!: Subscription;
    private subscribeDimensionsUpdated!: Subscription;
    private subscribeExecutedCommand!: Subscription;

    constructor(
        private drawingService: DrawingService,
        private toolbarService: ToolbarService,
        private undoRedoService: UndoRedoService,
        private resizeService: ResizeService,
        private automaticSavingService: AutomaticSavingService,
    ) {
        this.undoRedoService.resetUndoRedo();
    }

    ngOnInit(): void {
        this.subscribeCreateNewDrawing = this.drawingService.createNewDrawingEventListener().subscribe(() => {
            this.toolbarService.resetSelection();
            this.drawingService.clearCanvas(this.drawingService.baseCtx);
            this.undoRedoService.resetUndoRedo();
            this.requestDrawingContainerDimensions.emit();
        });
        this.subscribeResetCanvasSize = this.drawingService.resetCanvasSizeEventListener().subscribe(() => {
            this.requestDrawingContainerDimensions.emit();
        });
        this.subscribeDimensionsUpdated = this.dimensionsUpdatedEvent.subscribe((dimensions) => {
            if (this.automaticSavingService.savedDrawingExists()) {
                this.automaticSavingService.recover();
                return;
            }
            this.drawingContainerWidth = dimensions[0];
            this.drawingContainerHeight = dimensions[1];
            if (!!dimensions[2]) {
                this.newCanvasSetSize();
                setTimeout(() => {
                    this.toolbarService.applyCurrentTool();
                }, 0);
            }
        });
        this.subscribeExecutedCommand = this.resizeService.executedCommand.subscribe((command: Command) => {
            this.toolbarService.addCommand(command);
        });
    }

    ngAfterViewInit(): void {
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gridCtx = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.gridCtx = this.gridCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;

        this.toolbarService.initializeListeners();
    }

    ngOnDestroy(): void {
        this.subscribeCreateNewDrawing.unsubscribe();
        this.subscribeDimensionsUpdated.unsubscribe();
        this.subscribeResetCanvasSize.unsubscribe();
        this.toolbarService.unsubscribeListeners();
        this.subscribeExecutedCommand.unsubscribe();
    }

    @HostListener('window:mousemove', ['$event'])
    onMouseMoveWindow(event: MouseEvent): void {
        if (!this.isResizing()) {
            if (
                this.toolbarService.isAreaSelected() ||
                this.toolbarService.currentTool instanceof PencilService ||
                this.toolbarService.currentTool instanceof SprayService ||
                this.toolbarService.currentTool instanceof StampService
            ) {
                this.toolbarService.onMouseMove(event);
            }
        } else {
            if (!this.isAreaSelected()) {
                this.onResize(event);
            } else {
                this.toolbarService.resizeSelection(event);
            }
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (
            !(
                this.toolbarService.currentTool instanceof PencilService ||
                this.toolbarService.currentTool instanceof SprayService ||
                this.toolbarService.currentTool instanceof StampService ||
                this.toolbarService.isAreaSelected()
            )
        ) {
            this.toolbarService.onMouseMove(event);
        }
    }

    onMouseDown(event: MouseEvent): void {
        event.preventDefault();
        this.previewCanvas.nativeElement.focus();
        if (!this.isResizing()) {
            this.toolbarService.onMouseDown(event);
        }
    }

    @HostListener('window:mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        event.preventDefault();
        if (this.isResizing()) {
            this.toolbarService.mouseDown = false;
            if (!this.isAreaSelected()) {
                this.resizeService.resize(this.previewCanvas.nativeElement.width, this.previewCanvas.nativeElement.height);
            } else {
                this.toolbarService.resizeSelection(event);
            }

            setTimeout(() => {
                if (!this.isAreaSelected()) this.toolbarService.applyCurrentTool();
            }, 0);
            this.resizeService.resetResize();
        } else {
            this.toolbarService.onMouseUp(event);
        }
    }

    @HostListener('mousewheel', ['$event'])
    onMouseWheel(event: WheelEvent): void {
        this.toolbarService.onMouseScroll(event);
    }

    onMouseEnter(event: MouseEvent): void {
        this.toolbarService.onMouseEnter(event);
    }

    onMouseLeave(event: MouseEvent): void {
        this.toolbarService.onMouseLeave(event);
    }

    onDoubleClick(event: MouseEvent): void {
        this.toolbarService.onDoubleClick(event);
    }

    onClick(event: MouseEvent): void {
        this.toolbarService.onClick(event);
    }

    onContextMenu(event: MouseEvent): boolean {
        this.toolbarService.onContextMenu(event);
        return false;
    }

    onResize(event: MouseEvent): void {
        if (!this.isAreaSelected() && this.isResizing()) {
            this.resizeService.onResizeWidth(event, this.drawingContainerWidth);
            this.resizeService.onResizeHeight(event, this.drawingContainerHeight);
        } else if (this.isResizing()) {
            this.toolbarService.resizeSelection(event);
        }
    }

    onResizeStart(event: MouseEvent, controlPoint: ControlPoint): void {
        if (event.button === MouseButton.Left) {
            this.toolbarService.mouseDown = true;
            this.resizeService.onResizeStart(controlPoint);
        }
    }

    newCanvasSetSize(): void {
        const newWidth = this.drawingContainerWidth / 2;
        const newHeight = this.drawingContainerHeight / 2;

        const width = newWidth >= CANVAS_MIN_WIDTH ? newWidth : CANVAS_MIN_WIDTH;
        const height = newHeight >= CANVAS_MIN_HEIGHT ? newHeight : CANVAS_MIN_HEIGHT;
        this.resizeService.resize(width, height);
    }

    isAreaSelected(): boolean {
        return this.toolbarService.isAreaSelected();
    }

    isResizing(): boolean {
        return this.resizeService.isResizing;
    }

    get width(): number {
        return this.resizeService.canvasSize.x;
    }

    get height(): number {
        return this.resizeService.canvasSize.y;
    }

    onBaseCanvasMouseDown(event: MouseEvent): void {
        if (this.isAreaSelected()) {
            this.toolbarService.resetSelection();
            this.onMouseDown(event);
        }
    }

    calculateResizerStyle(rowPosition: number, columnPosition: number): ResizerProperties {
        let resizerPosition: ResizerProperties;

        if (this.previewCanvas) {
            const previewCanvasElement = this.previewCanvas.nativeElement;
            const canvasTopOffset = previewCanvasElement.offsetTop;
            const canvasLeftOffset = previewCanvasElement.offsetLeft;

            resizerPosition = {
                top: canvasTopOffset + (previewCanvasElement.height * rowPosition) / 2 - SELECTION_CONTROL_POINT_SIZE / 2 + 'px',
                left: canvasLeftOffset + (previewCanvasElement.width * columnPosition) / 2 - SELECTION_CONTROL_POINT_SIZE / 2 + 'px',
            };
        } else {
            resizerPosition = {
                top: (this.height * rowPosition) / 2 - SELECTION_CONTROL_POINT_SIZE / 2 + 'px',
                left: (this.width * columnPosition) / 2 - SELECTION_CONTROL_POINT_SIZE / 2 + 'px',
            };
        }
        return resizerPosition;
    }

    get ControlPoint(): typeof ControlPoint {
        return ControlPoint;
    }
}
