import { BasicToolProperties } from './basic-tool-properties';
export class LineProperties extends BasicToolProperties {
    override thickness: number = 1;
    withPoint: boolean = false;
    pointSize: number = 10;
}
