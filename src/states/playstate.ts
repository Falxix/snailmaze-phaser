import { IState } from "./i-state";
import { GameManager } from "../gameManager";
import { Constants } from "../constants";
import { Snail } from "../snail";
import { Maze } from "../maze";
import { Indicator } from "../indicator";
import { StateTransition } from "../effects/core/state-transition";
import { StateSettings } from "./stateOptions";
import { Sprite, State } from "phaser-ce";
import { GoalGroup } from "../effects/goal-group";
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { Subscription } from "rxjs/Subscription";

export class PlayState implements IState {
  private game: Phaser.Game;
  private snail: Snail;
  private maze: Maze;
  private welcomeText : Phaser.Text;
  private timeUp: Phaser.Text;  
  private congratulations: Phaser.Text;  
  private gameRound : Indicator;
  private timeRemaining : Indicator;
  private isSolved: boolean = false;
  private stateSettings: StateSettings;
  private subscription: Subscription;
  private isTimerRunning: boolean = false;
  private music: Phaser.Sound;
  
  constructor(game: Phaser.Game) {
    this.game = game;
  }

  init(stateSettings: StateSettings): void{
      this.stateSettings = stateSettings;
      this.isTimerRunning = false;
  }

  preload(): void {
    GameManager.MapLoader.loadAssets(this.stateSettings.Map);
    this.snail = new Snail();
    this.isSolved = false;
  }

  create(): void {
    this.subscription = new Subscription();
    const filter = new Phaser.Filter(this.game, null, this.game.cache.getShader('scanlines'));
    this.game.world.filters = [filter];
    this.maze = GameManager.MapLoader.loadMap(this.stateSettings.Map);
    
    this.welcomeText = this.game.add.text(
      Constants.WelcomePosition.x,
      Constants.WelcomePosition.y,
      "WELCOME TO SNAIL MAZE!",
      Constants.FontStyle
    );
    this.timeUp = this.game.add.text(
      this.game.width / 2.25,
      this.game.height / 3.25
      ,
      "TIME UP",
      Constants.TimeUpFont
    );    
    this.timeUp.visible = false;
    this.congratulations = this.game.add.text(
      this.game.width / 2.75,
      this.game.height / 3.25
      ,
      "CONGRATULATIONS!",
      Constants.TimeUpFont
    );
    this.congratulations.visible = false;

    this.gameRound = new Indicator("RD", this.stateSettings.CurrentRound);
    this.timeRemaining = new Indicator("TIME", this.stateSettings.CurrentTime + this.maze.TimeAdded);

    const timeIndicator = TimerObservable.create(1000, 1100);
    this.subscription.add(timeIndicator.subscribe(() => {
      if (!this.isTimerRunning) {
        return;
      }
      if (this.timeRemaining.Value > 0) {
        this.timeRemaining.Value--;
      } else {
        this.timeOut();
      }
    }));

    this.gameRound.addToGame(this.game, Constants.RoundPosition);
    this.timeRemaining.addToGame(this.game, Constants.TimePosition);

    this.snail.create(this.game, GameManager.Scale);
    this.snail.sprite.position.x =
      this.maze.StartPosition.x + (1 * this.maze.Scale);
    this.snail.sprite.position.y =
      this.maze.StartPosition.y - (1 * this.maze.Scale);
  }

  // once the transition is over, start playing music,
  // counting time, etc.
  created(): void{
    this.music = this.game.add.audio('main');
    this.music.loop = true;
    this.music.play();
    this.isTimerRunning = true;
    
    const flashers = TimerObservable.create(0, 500);
    this.subscription.add(flashers.subscribe(() => {
      this.maze.StartGroup.visible = !this.maze.StartGroup.visible;
      this.maze.BannerGroup.visible = !this.maze.BannerGroup.visible;
      //I want this to flash on the off cycle of the start group
      this.maze.GoalGroup.visible = !this.maze.StartGroup.visible;
    }));    
  }
  
  update(): void {
    if (this.isSolved === true){
        return;
    }
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
        (sprite: Sprite, group: GoalGroup) => 
        {            
          this.completeMap(group);
        },
        null,
        this); 
  }

  completeMap(group: GoalGroup): void {   
    this.isSolved = true;
    console.log('entered') ;
    this.isTimerRunning = false;
    this.snail.kill();
    this.music.stop();
    const levelEnd: Phaser.Sound = this.game.add.audio('levelend');
    levelEnd.onEndedHandler =() => {
      if (group.nextMap) {
        const settings = new StateSettings(group.nextMap);
        settings.CurrentTime = this.timeRemaining.Value;
        settings.CurrentRound = this.stateSettings.CurrentRound+1;
        this.loadNewLevel(settings);
      } else {
        this.congratulate();
      }
    }
    levelEnd.play();
  }
  
  loadNewLevel(stateSettings: StateSettings): void {
    this.subscription.unsubscribe();    
    this.game.state.start('play', true, false, stateSettings);
  }

  congratulate(): void {
    const gameEnd = this.game.add.sound('gameend');
    this.congratulations.visible = true;
    gameEnd.onEndedHandler = () => {      
        this.subscription.unsubscribe();
        this.game.state.start('boot', true, false, StateSettings.NoTransition);
    };
    gameEnd.play();    
  }

  timeOut(): void {
    this.snail.kill();
    const timer = TimerObservable.create(5000, 5000);
    const flicker = TimerObservable.create(0, 250);
    let isFlipped = false;
    this.timeUp.visible = true;
    this.subscription.add(flicker.subscribe(()=>{
      // flicker the timeout text
      isFlipped = !isFlipped;
      if (isFlipped){
        this.timeUp.setStyle(Constants.TimeUpFont)
      } else {
        this.timeUp.setStyle(Constants.TimeUpFontAlternate);
      }
    }));
    this.subscription.add(timer.subscribe(()=>{
      // kick you back to the boot screen
      this.subscription.unsubscribe();
      this.game.state.start('boot', true, false, StateSettings.NoTransition);
    }));
    
  }
}
