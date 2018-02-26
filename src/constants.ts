import { MapConfiguration } from "./mapConfiguration";

export class Constants{
    public static FontStyle: Phaser.PhaserTextStyle = {
        font: "16px press_start_kregular",
        fill: "white",
        align: 'center'
    }

    public static readonly StartingMap: MapConfiguration = {
        MapPath: "assets/maps/smaze1.json",
        TilePath: "assets/tile.png",
        MapScale: 3,
        CollisionTiles: [1],
        SpritePath: "assets/objects.png"
    }

    public static readonly StartSpriteName: string = 'snailStart';
    public static readonly EndSpriteName: string = 'goal';
    public static readonly StartTime : number = 60;
    public static readonly WelcomePosition: Phaser.Point=new Phaser.Point(100,100);
    public static readonly RoundPosition: Phaser.Point=new Phaser.Point(400,150);
    public static readonly TimePosition: Phaser.Point=new Phaser.Point(500,150);    
    public static readonly ObjectSize: number=8;
}