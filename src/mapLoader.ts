import { MapConfiguration } from "./mapConfiguration";
import { Maze } from "./maze";

export class MapLoader{
    private map: Phaser.Tilemap;
    private objects: any[];    

    constructor(private readonly game: Phaser.Game){}
    
    public loadAssets(config: MapConfiguration): void
    {        
        this.game.load.tilemap("map",config.MapPath,null,Phaser.Tilemap.TILED_JSON);        
        this.game.load.image("tile",config.TilePath);
        this.game.load.spritesheet('atlas',config.SpritePath,8,8);
    }

    public loadMap(config: MapConfiguration): Maze{
        let map = this.game.add.tilemap("map",1,1);        
        map.addTilesetImage("tile");
        let collisionLayer = map.createLayer(0);
        collisionLayer.setScale(config.MapScale);
        collisionLayer.resizeWorld();        
        config.CollisionTiles.map(index => {
            map.setCollision(index);
        });
        let maze = new Maze(config.MapScale);
        maze.GoalGroup = maze.createObjectGroup(this.game);
        maze.StartGroup = maze.createObjectGroup(this.game);
        maze.BannerGroup = maze.createObjectGroup(this.game);
        maze.CollisionLayer = collisionLayer;
        map.createFromObjects("objectLayer",3,'atlas',0,true,false,maze.StartGroup);
        map.createFromObjects("objectLayer",4,'atlas',1,true,false,maze.BannerGroup);
        map.createFromObjects("objectLayer",5,'atlas',2,true,false,maze.BannerGroup);
        map.createFromObjects("objectLayer",6,'atlas',3,true,false,maze.BannerGroup);
        map.createFromObjects("objectLayer",7,'atlas',4,true,false,maze.BannerGroup);
        map.createFromObjects("objectLayer",8,'atlas',5,true,false,maze.BannerGroup);
        map.createFromObjects("objectLayer",9,'atlas',6,true,false,maze.GoalGroup);
        maze.StartGroup.pivot = new Phaser.Point(-1,0);
        let mapObjects = map.objects as any;        
        let objectLayer = mapObjects.objectLayer as any[];        
        maze.Objects = objectLayer;
        return maze;
    }
}
