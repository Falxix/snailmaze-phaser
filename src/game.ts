/// <reference path="../node_modules/@types/webfontloader/index.d.ts" />

import "pixi";
import "p2";
import * as Phaser from "phaser-ce";
import * as WebFont from 'webfontloader';
import { Constants } from './constants';
import { Snail } from "./snail";
import { Tilemap } from "phaser-ce";
import { Indicator } from './indicator';
import { MapLoader } from "./mapLoader";
import { Maze } from "./maze";

declare global {
  interface Window {
    game: any;
  }  
}
window.game = window.game || {};


class SimpleGame {
  baseX: number = 256;
  baseY: number = 192;
  scale: number = 3;
  game: Phaser.Game;
  snail: Snail;
  mapScroll: number;
  welcomeText : Phaser.Text;
  gameRound : Indicator;
  timeRemaining : Indicator;
  mapLoader: MapLoader;
  maze: Maze;
  isSolved: boolean = false;

  constructor() {
    this.game = new Phaser.Game(
      this.baseX * this.scale,
      this.baseY * this.scale,
      Phaser.AUTO,
      "content",
      { preload: this.preload, create: this.create, update: this.update },
      false,
      false
    );    
  }  

  preload() {
    this.mapLoader = new MapLoader(this.game);    
    this.mapLoader.loadAssets(Constants.StartingMap);    
    this.game.load.image("snail", "assets/snail.png");
    this.snail = new Snail();
    this.scale = 3;
  }

  create() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.maze = this.mapLoader.loadMap(Constants.StartingMap);        
        
    this.welcomeText = this.game.add.text(Constants.WelcomePosition.x,Constants.WelcomePosition.y,"WELCOME TO SNAIL MAZE!",Constants.FontStyle);
    this.gameRound = new Indicator('RD',1);
    this.timeRemaining = new Indicator('TIME',Constants.StartTime);    
    setInterval(() => {
      if (this.timeRemaining.Value > 0){
        this.timeRemaining.Value--;
      }      
    },1000);
    setInterval(() => {
        this.maze.StartGroup.visible = !this.maze.StartGroup.visible;
        this.maze.BannerGroup.visible = !this.maze.BannerGroup.visible;
        //I want this to flash on the off cycle of the start group
        this.maze.GoalGroup.visible = !this.maze.StartGroup.visible; 
    }, 500);

    this.gameRound.addToGame(this.game, Constants.RoundPosition);
    this.timeRemaining.addToGame(this.game, Constants.TimePosition);

    //this.collisionLayer.debug = true;
    this.snail.create(this.game,this.scale);
    this.snail.sprite.position.x = this.maze.StartPosition.x + (1 * this.maze.Scale);
    this.snail.sprite.position.y = this.maze.StartPosition.y - (1 * this.maze.Scale);
    console.log(this.maze.StartPosition);
    console.log(this.maze.GoalGroup);    
  }

  update(): void {
    if (this.isSolved === true){
      return;
    }
    this.game.physics.arcade.collide(this.snail.sprite, this.maze.CollisionLayer);    
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
         alert("Congratulations!");         
       },
       null,
       this);       
  }  
}

window.onload = () => {
let webFontLoading : WebFont.Config = {
  active: () => {
    runGame();
  },
    custom: {
      families: ['press_start_kregular'],
      urls: ['assets/fonts/stylesheet.css']
    }
  };
  WebFont.load(webFontLoading);

  function runGame(){
    var game = new SimpleGame();
  }
}
