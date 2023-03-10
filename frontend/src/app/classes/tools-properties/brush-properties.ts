import { BrushType } from 'src/app/enums/brush-filters.enum';
import { BasicToolProperties } from './basic-tool-properties';

export class BrushProperties extends BasicToolProperties {
    override thickness: number = 1;

    filterType: string[] = [BrushType.Blurred, BrushType.Brushed, BrushType.Spray, BrushType.Splash, BrushType.Cloud];
    currentFilter: string = BrushType.Blurred;
}
