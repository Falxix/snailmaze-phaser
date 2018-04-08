import { Transition } from "../transition/transition";
import { TransitionSettings } from "../transition/transition-settings";
import { TransitionCompass } from "./transition-compass";

export class StateTransition extends Phaser.Plugin{
    constructor(game: Phaser.Game, parent:Phaser.PluginManager){
        super(game, parent);
    }

    public createTransition(options: TransitionSettings): TransitionSettings{
        return Transition.Default(options);
    }

    public static In: TransitionCompass = {
        SlideLeft: Transition.Default({
            intro: true,
            ease: null,
            duration: null,
            delay: null,
            noStage: null,            
            props: {
                x: function(game: Phaser.Game) {
                    return game.width;
                }
            }
        }),

        SlideRight: Transition.Default({
            intro: true,
            ease: null,
            duration: null,
            delay: null,
            noStage: null,            
            props: {
                x: function(game: Phaser.Game) {
                    return -game.width;
                }
            }
        }), 

        SlideTop: Transition.Default({
            intro: true,
            ease: null,
            duration: null,
            delay: null,
            noStage: null,            
            props: {
                y: function(game: Phaser.Game) {
                    return game.height;
                }
            }
        }), 

        SlideBottom: Transition.Default({
            intro: true,
            ease: null,
            duration: null,
            delay: null,
            noStage: null,            
            props: {
                y: function(game: Phaser.Game) {
                    return -game.height;
                }
            }
        }), 

        ScaleUp: Transition.Default({
            intro: true,
            ease: null,
            duration: null,
            delay: null,
            noStage: null,            
            props: {
                alpha: 0.4,
                scale: new Phaser.Point(2,null)
            }
        })
    };

    public static Out: TransitionCompass = {
        SlideLeft: Transition.Default({
            intro: null,
            ease: null,
            duration: null,
            delay: null,
            noStage: null,            
            props: {
                x: function(game: Phaser.Game) {
                    return -game.width;
                }
            }
        }),

        SlideRight: Transition.Default({
            intro: null,
            ease: null,
            duration: null,
            delay: null,
            noStage: null,            
            props: {
                x: function(game: Phaser.Game) {
                    return game.width;
                }
            }
        }),

        SlideTop: Transition.Default({
            intro: null,
            ease: null,
            duration: null,
            delay: null,
            noStage: null,            
            props: {
                y: function(game: Phaser.Game) {
                    return -game.height;
                }
            }
        }),

        SlideBottom: Transition.Default({
            intro: null,
            ease: null,
            duration: null,
            delay: null,
            noStage: null,            
            props: {
                y: function(game: Phaser.Game) {
                    return game.width;
                }
            }
        }),

        ScaleUp: Transition.Default({
            intro: null,
            ease: null,
            duration: null,
            delay: null,
            noStage: null,            
            props: {
                x: function(game: Phaser.Game) {
                    return game.width / 2;
                },
                scale: {
                    x: 0
                }
            }
        })
    };    
}