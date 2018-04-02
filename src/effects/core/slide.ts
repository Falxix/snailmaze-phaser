import { Transition } from "../transition/transition";
import { ContentSnapshot } from "./content-snapshot";
import { TransitionSettings } from "../transition/transition-settings";

export class Slide {
    private game: Phaser.Game;
    private _contentSnapshot: ContentSnapshot;
    public _transition: Transition;

    constructor(game: Phaser.Game, noStage: boolean) {
        this.game = game;
        this._contentSnapshot = new ContentSnapshot(game, 0, 0, noStage);
        this._transition = new Transition(game);
    }

    go(options: TransitionSettings) {
        this.game.stage.addChildAt(this._contentSnapshot, this.game.stage.children.length);
        this._transition.start(this._contentSnapshot, options);
    }

}