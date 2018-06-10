import { MapConfiguration } from "./mapConfiguration";
import { GameManager } from "./gameManager";

export class Constants{
    public static FontStyle: Phaser.PhaserTextStyle = {
        font: "16px press_start_kregular",
        fill: "white",
        align: 'center'
    };

    public static BootFontStyle: Phaser.PhaserTextStyle = {
        font: "24px press_start_kregular",
        fill: "white",
        align: 'left',
        wordWrap: true,
        wordWrapWidth: GameManager.BaseWidth * GameManager.Scale
    };

    public static TimeUpFont: Phaser.PhaserTextStyle = {
        font: "16px press_start_kregular",
        fill: "white",
        align: "center",
        backgroundColor: "black"
    };

    public static TimeUpFontAlternate: Phaser.PhaserTextStyle = {
        font: "16px press_start_kregular",
        fill: "yellow",
        align: "center",
        backgroundColor: "black"
    };
    
    public static readonly StartSpriteName: string = 'snailStart';
    public static readonly EndSpriteName: string = 'goal';
    public static readonly StartTime : number = 60;
    public static readonly WelcomePosition: Phaser.Point=new Phaser.Point(100,100);
    public static readonly RoundPosition: Phaser.Point=new Phaser.Point(400,150);
    public static readonly TimePosition: Phaser.Point=new Phaser.Point(500,150);    
    public static readonly ObjectSize: number=8;
    public static readonly StartingMap = 'smaze12.json';
}