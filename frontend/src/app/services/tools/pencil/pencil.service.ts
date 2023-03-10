import { Injectable } from '@angular/core';
import { Tool } from 'src/app/classes/tool/tool';
import { BasicShapeProperties } from 'src/app/classes/tools-properties/basic-shape-properties';
import { Vec2 } from 'src/app/classes/vec2';
import { MouseButton } from 'src/app/enums/mouse-button.enum';
import { DrawingService } from 'src/app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class PencilService extends Tool {
    currentMousePosition: Vec2;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.name = 'Crayon';
        this.tooltip = 'Crayon(c)';
        this.iconName = 'create';
        this.toolProperties = new BasicShapeProperties();
        this.clearPath();
    }

    override onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();

            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
        }
    }

    override onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            this.draw(this.drawingService.baseCtx);
            this.executedCommand.emit(this.clone());
        }
        this.mouseDown = false;
        this.clearPath();
    }

    override onMouseMove(event: MouseEvent): void {
        this.currentMousePosition = this.getPositionFromMouse(event);
        if (this.mouseDown) {
            this.pathData.push(this.currentMousePosition);
            this.draw(this.drawingService.previewCtx);
        } else {
            this.drawCursor();
        }
    }

    override draw(ctx: CanvasRenderingContext2D): void {
        if (this.mouseDown) this.drawingService.clearCanvas(this.drawingService.previewCtx);
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        for (const point of this.pathData) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
    }

    protected drawCursor(): void {
        const cursorCtx = this.drawingService.previewCtx;
        this.drawingService.clearCanvas(cursorCtx);
        cursorCtx.beginPath();
        cursorCtx.arc(this.currentMousePosition.x, this.currentMousePosition.y, this.toolProperties.thickness / 2, 0, Math.PI * 2);
        cursorCtx.fill();
    }

    protected clearPath(): void {
        this.pathData = [];
    }

    override clone(): Tool {
        const pencilClone: PencilService = new PencilService(this.drawingService);
        this.copyTool(pencilClone);
        return pencilClone;
    }

    override getPositionFromMouse(event: MouseEvent): Vec2 {
        const canvasBoundingRect = this.drawingService.canvas.getBoundingClientRect();
        return { x: event.clientX - canvasBoundingRect.x, y: event.clientY - canvasBoundingRect.y };
    }
}
