import { Point } from "phaser-ce";
import { Constants } from "./constants";

export class Maze {
  CollisionLayer: Phaser.TilemapLayer;
  StartPosition: Phaser.Point;
  GoalPosition: Phaser.Point;
  Scale: number;
  GoalGroup: Phaser.Group;
  StartGroup: Phaser.Group;
  BannerGroup: Phaser.Group;

  constructor(scale: number){
    this.Scale = scale;
  }

  private objects: any[];
  
  public createObjectGroup(game: Phaser.Game): Phaser.Group{
    let group = game.add.group();
    group.enableBody = true;
    group.scale.x = this.Scale;
    group.scale.y = this.Scale;
    group.physicsBodyType = Phaser.Physics.ARCADE;
    return group;
  }

  public set Objects(input: any[]) {
    this.objects = input;
    let startSprite = input.find(x => {
      return x.name === Constants.StartSpriteName;
    });
    let endSprite = input.find(x =>{
        return x.name === Constants.EndSpriteName;
    });
    this.StartPosition = new Point(
      this.Scale * startSprite.x,
      this.Scale * startSprite.y
    );
    this.GoalPosition = new Point(
        this.Scale * endSprite.x,
        this.Scale * endSprite.y
    );
  }

  public get Objects(): any[]{
      return this.objects;
  }
}
