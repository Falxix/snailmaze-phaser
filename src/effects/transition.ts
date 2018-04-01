import { Screenshot } from "./screenshot";
import { Guid } from "../guid";
import { Point } from "phaser-ce";

export class Transition {
    private game: Phaser.Game;
    private image: Phaser.Image;
    private id: string;
    private onLoaded: Promise<any>;
    private endPosition: Point;
    private transitionState: string;
    private finishedPromise: (value: any) => void;

    constructor(game: Phaser.Game, endPosition: Point, transitionState: string) {
        this.transitionState = transitionState;
        this.game = game;
        this.endPosition = endPosition;
        this.id = Guid.newGuid();
        this.onLoaded = new Promise<any>((resolve,reject) => {
            Screenshot.getScreenshot(game, this.id).then((image) => {
                this.image = image;
                resolve(true);
            });
        });
    }

    public start(): void {
        const promise = new Promise((resolve, reject) => {
            this.onLoaded.then(() => {
                this.game.world.removeAll();
                this.image = this.game.add.image(0, 0, this.id);
                resolve(null);
            });
        });        
    }

    public update(): void {
        if (!this.image) {
            return;
        }        
        if (this.image.position.x <= -1000) {
            this.game.state.start('play');
        }
        this.image.position.add(-10,0);
    }
}