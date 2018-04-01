import { IState } from "./i-state";
import { GameManager } from "../gameManager";
import { Constants } from "../constants";
import { Snail } from "../snail";
import { Maze } from "../maze";
import { Indicator } from "../indicator";

export class PlayState implements IState {
  private game: Phaser.Game;
  private snail: Snail;
  private maze: Maze;
  private welcomeText : Phaser.Text;  
  private gameRound : Indicator;
  private timeRemaining : Indicator;
  private isSolved: boolean = false;
  
  constructor(game: Phaser.Game) {
    this.game = game;
  }

  preload(): void {
    GameManager.MapLoader.loadAssets(Constants.StartingMap);
    this.snail = new Snail();
  }
  create(): void {
    const filter = new Phaser.Filter(this.game, null, this.game.cache.getShader('scanlines'));
    this.game.world.filters = [filter];
    this.maze = GameManager.MapLoader.loadMap(Constants.StartingMap);
    this.welcomeText = this.game.add.text(
      Constants.WelcomePosition.x,
      Constants.WelcomePosition.y,
      "WELCOME TO SNAIL MAZE!",
      Constants.FontStyle
    );
    this.gameRound = new Indicator("RD", 1);
    this.timeRemaining = new Indicator("TIME", Constants.StartTime);

    setInterval(() => {
      if (this.timeRemaining.Value > 0) {
        this.timeRemaining.Value--;
      }
    }, 1000);
    setInterval(() => {
      this.maze.StartGroup.visible = !this.maze.StartGroup.visible;
      this.maze.BannerGroup.visible = !this.maze.BannerGroup.visible;
      //I want this to flash on the off cycle of the start group
      this.maze.GoalGroup.visible = !this.maze.StartGroup.visible;
    }, 500);

    this.gameRound.addToGame(this.game, Constants.RoundPosition);
    this.timeRemaining.addToGame(this.game, Constants.TimePosition);

    this.snail.create(this.game, GameManager.Scale);
    this.snail.sprite.position.x =
      this.maze.StartPosition.x + (1 * this.maze.Scale + 1.5);
    this.snail.sprite.position.y =
      this.maze.StartPosition.y - 1 * this.maze.Scale + 1.5;
  }
  
  update(): void {
    if (this.isSolved === true){
        return;
      }
      //this.game.physics.arcade.collide(this.snail.sprite, this.maze.CollisionLayer,() => {this.snail.stop();});
      const pos = this.snail.collisionSprite.position;    
      let tiles = this.maze.CollisionLayer.getTiles(pos.x,pos.y, 3,3,true);
      if (tiles.length > 0){
        this.snail.stop();
      }
      this.snail.update(this.game);    
      this.gameRound.update();
      this.timeRemaining.update();
      this.game.physics.arcade.overlap(
         this.snail.sprite,
         this.maze.GoalGroup,
         () => 
         {
           this.isSolved = true;
           this.snail.kill();
           this.game.state.start('play', true);
         },
         null,
         this); 
  }
}
