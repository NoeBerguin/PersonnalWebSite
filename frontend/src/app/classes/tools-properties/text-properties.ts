import { TextAlignment } from 'src/app/enums/text-alignment.enum';
import { TextFont } from 'src/app/enums/text-font.enum';
import { BasicToolProperties } from './basic-tool-properties';
export class TextProperties extends BasicToolProperties {
    isBold: boolean = false;
    isItalic: boolean = false;
    fonts: string[] = [TextFont.Arial, TextFont.Verdana, TextFont.TimesNewRoman, TextFont.Georgia, TextFont.CourierNew];
    font: string = TextFont.Arial;
    size: number = 20;
    textAlignments: string[] = [TextAlignment.Left, TextAlignment.Middle, TextAlignment.Right];
    textAlignment: string = TextAlignment.Left;
}
