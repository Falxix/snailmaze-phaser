/// <reference path="../node_modules/@types/webfontloader/index.d.ts" />

import "pixi";
import "p2";
import * as WebFont from 'webfontloader';
import { Constants } from './constants';
import { Snail } from "./snail";
import { Tilemap } from "phaser-ce";
import { Indicator } from './indicator';
import { MapLoader } from "./mapLoader";
import { Maze } from "./maze";
import { BootState } from "./states/bootstate";
import { PlayState } from "./states/playstate";
import { GameManager } from "./gameManager";

declare global {
  interface Window {
    game: any;
  }  
}
window.game = window.game || {};


class SimpleGame {
  game: Phaser.Game;
  mapScroll: number;
  mapLoader: MapLoader;
  isSolved: boolean = false;

  constructor() {
    this.game = new Phaser.Game(
      GameManager.BaseWidth * GameManager.Scale,
      GameManager.BaseHeight * GameManager.Scale,
      Phaser.AUTO,
      "content"
    );
    const bootState = new BootState(this.game);
    const playState = new PlayState(this.game);
    this.game.state.add('boot', bootState);
    this.game.state.add('play', playState);
    this.game.state.start('boot');
  }  

  preload() {
    
  }

  create() {
    
  }

  update(): void {
          
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
