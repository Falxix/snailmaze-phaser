import "pixi";
import "p2";
import * as Phaser from "phaser-ce";

declare global {
  interface Window {
    game: any;
  }
}
window.game = window.game || {};

import { Snail } from "./snail";
import { Tilemap } from "phaser-ce";

class SimpleGame {
  baseX: number = 256;
  baseY: number = 192;
  scale: number = 3;

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

  game: Phaser.Game;
  snail: Snail;
  mapScroll: number;
  collisionLayer: Phaser.TilemapLayer;

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

    //this.collisionLayer.debug = true;

    this.game.camera.y = map.heightInPixels;
    this.snail.create(this.game,this.scale);
  }

  update(): void {
    this.game.physics.arcade.collide(this.snail.sprite, this.collisionLayer);
    this.game.debug.text(
      `Sun Sprite: ${this.snail.sprite.x},${this.snail.sprite.y}`, 0, 20
    );
    this.game.debug.text(
      `Camera: ${this.game.camera.x},${this.game.camera.y}`,0,40
    );
    this.snail.update(this.game);
  }
}

window.onload = () => {
  var game = new SimpleGame();
};
