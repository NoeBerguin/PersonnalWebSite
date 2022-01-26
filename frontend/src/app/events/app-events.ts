export enum AppEventType {
    OPEN_APP,
    BRAINBOARD_OPEN,
    LIVEBOARD_OPEN,
    VIDEOBOARD_OPEN,
    BRAINBOARD_CLOSE,
    LIVEBOARD_CLOSE,
    VIDEOBOARD_CLOSE
}

export class AppEvent {
    constructor( public type: AppEventType, public data?: any ) { }
}