import { Transition } from "../transition/transition";
import { ContentSnapshot } from "./content-snapshot";
import { TransitionSettings } from "../transition/transition-settings";
import { Observable } from "rxjs/Observable";

export class Slide {
    private game: Phaser.Game;
    private _contentSnapshot: ContentSnapshot;
    public _transition: Transition;
    public onSlideCompleted: Observable<void>;    

    constructor(game: Phaser.Game, noStage: boolean) {
        this.game = game;
        this._contentSnapshot = new ContentSnapshot(game, 0, 0, noStage);
        this._transition = new Transition(game);
        this.onSlideCompleted = new Observable<void>();        
    }

    go(options: TransitionSettings): Promise<void> {
        var promise = new Promise<void>(resolve => {
            this.game.stage.addChildAt(this._contentSnapshot, this.game.stage.children.length);
            this._transition.start(this._contentSnapshot, options);
            this._transition.onComplete = () => resolve();
        });
        return promise;
    }

}