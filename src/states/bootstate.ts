import { IState } from "./i-state";
import { Constants } from "../constants";
import { MapLoader } from "../mapLoader";
import { GameManager } from "../gameManager";
import { Point, StateManager } from "phaser-ce";
import { stateManagerStart } from "../effects/core/state-manager-start";
import { StateTransition } from "../effects/core/state-transition";

export class BootState implements IState {    
    private game: Phaser.Game;

    constructor(game: Phaser.Game) {        
        this.game = game;
        const cachedStart = Phaser.StateManager.prototype.start;
        Phaser.StateManager.prototype.start = function start(stateId, slideInOption, slideOut, ...args) {
            console.log('test');
            stateManagerStart.call(this, stateId, slideInOption, slideOut);
            cachedStart.call(this, stateId, ...args);
        }
    }

    public preload(): void {        
        this.game.load.image('enjoy', 'assets/enjoy.png');        
        this.game.load.spritesheet('snail', 'assets/snails.png',8,8,2);
        this.game.load.shader('scanlines', 'assets/shaders/scanline.frag');
        GameManager.MapLoader = new MapLoader(this.game);
    }

    public create(): void {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);        
        const filter = new Phaser.Filter(this.game, null, this.game.cache.getShader('scanlines'));
        this.game.world.filters = [filter];

        const versionLabel = this.game.add.text(210 * GameManager.Scale, 15 * GameManager.Scale, 'V1.X', Constants.BootFontStyle);
        const loadingLabel = this.game.add.text(15 * GameManager.Scale, 25 * GameManager.Scale, "WELCOME TO SNAIL MAZE.", Constants.BootFontStyle);
        const toPlayLabel = this.game.add.text(15 * GameManager.Scale, 45 * GameManager.Scale, 'TO PLAY,JUST FOLLOW THESE INSTRUCTIONS:', Constants.BootFontStyle);
        const instructionsLabel = this.game.add.text(15 * GameManager.Scale, 75 * GameManager.Scale, "1.DON'T CLOSE YOUR BROWSER.", Constants.BootFontStyle);
        const instructionsLabel2 = this.game.add.text(15 * GameManager.Scale, 95 * GameManager.Scale, "2.BE ON THE CORRECT WEBSITE (THIS ONE).", Constants.BootFontStyle);
        const instructionsLabel3 = this.game.add.text(15 * GameManager.Scale, 125 * GameManager.Scale, "3.PRESS ENTER,AND. . . ", Constants.BootFontStyle);
        const enjoy = this.game.add.sprite(50 * GameManager.Scale, 145 * GameManager.Scale, 'enjoy');
        enjoy.scale.setMagnitude(GameManager.Scale / 1.25);
    }
    
    public update(): void {        
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {            
            this.game.state.start('play', StateTransition.Out.SlideLeft, StateTransition.In.SlideLeft);
        }
    }
}