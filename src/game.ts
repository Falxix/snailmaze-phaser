/// <reference path="../node_modules/@types/webfontloader/index.d.ts" />

import "pixi";
import "p2";
import * as Phaser from "phaser-ce";
import * as WebFont from 'webfontloader';
import { Constants } from './constants';
import { Snail } from "./snail";
import { Tilemap } from "phaser-ce";
import { Indicator } from './indicator';

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
  collisionLayer: Phaser.TilemapLayer;
  welcomeText : Phaser.Text;
  gameRound : Indicator;
  timeRemaining : Indicator;

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
    this.game.load.tilemap(
      "map",
      "assets/maps/smaze1.json",
      null,
      Phaser.Tilemap.TILED_JSON
    );
    this.game.load.image("tile", "assets/tile.png");
    this.game.load.image("snail", "assets/snail.png");
    this.snail = new Snail();
    this.mapScroll = 1;
    this.scale = 3;
  }

  create() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    let map = this.game.add.tilemap("map", 1, 1);
    map.addTilesetImage("tile");    

    this.collisionLayer = map.createLayer(0);
    this.collisionLayer.setScale(this.scale);
    this.collisionLayer.resizeWorld();
    map.setCollision(1);
        
    this.welcomeText = this.game.add.text(Constants.WelcomePosition.x,Constants.WelcomePosition.y,"WELCOME TO SNAIL MAZE!",Constants.FontStyle);
    this.gameRound = new Indicator('RD',1);
    this.timeRemaining = new Indicator('TIME',Constants.StartTime);
    setInterval(() => {
      if (this.timeRemaining.Value > 0){
        this.timeRemaining.Value--;
      }
    },1000)

    this.gameRound.addToGame(this.game, Constants.RoundPosition);
    this.timeRemaining.addToGame(this.game, Constants.TimePosition);

    //this.collisionLayer.debug = true;

    this.game.camera.y = map.heightInPixels;
    this.snail.create(this.game,this.scale);
  }

  update(): void {
    this.game.physics.arcade.collide(this.snail.sprite, this.collisionLayer);
    this.snail.update(this.game);
    this.gameRound.update();
    this.timeRemaining.update();
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
