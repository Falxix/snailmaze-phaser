import { TransitionSettings } from "./transition-settings";

/**
 * Transition Class
 * @constructor
 * @name Transition
 * @param {object} game Game instance
 */
export class Transition {    
    public onComplete: any;
    public update: any;
    public currentTarget: any;

    private _tweens: any[];   
    private _active: boolean; 
    private game: Phaser.Game;

    constructor(game: Phaser.Game) {
        this.game = game;
        this.onComplete = null;
        this._tweens = [];
    }

    public static Default(options: TransitionSettings): TransitionSettings{
        const settings = new TransitionSettings();
        settings.ease = options.ease || Phaser.Easing.Linear.None;
        settings.duration = options.duration || 3000;
        settings.intro = options.intro || false;
        settings.props = options.props || {};
        return settings;
    }

    start(target: any, options: TransitionSettings) {
        let prop,
            _props = options.props,
            _isIntro = !!options.intro,
            _tweenTarget,
            _tweenInstance,
            _queue: any = {
                '_': {}
            };

        // Store the currentTarget
        this.currentTarget = target;

        // If we need to compile the output
        if (typeof _props === 'function') {
            _props = _props(this.game);
        }

        // Make sure the proper values for props are there
        _isIntro && this._prepareTargetForTweening(_props);

        // Parse the options.props and generate the tweens options
        for (prop in _props) {
            if (_props.hasOwnProperty(prop)) {
                // If we need to compile the output
                if (typeof _props[prop] === 'function') {
                    _props[prop] = _props[prop](this.game);
                }

                // If the original value is an object
                // we need a separate tween
                if (typeof target[prop] === 'object') {
                    _queue[prop] = _props[prop];
                } else {
                    _queue['_'][prop] = _props[prop];
                }
            }
        }

        for (prop in _queue) {
            if (_queue.hasOwnProperty(prop)) {
                _tweenTarget = prop === '_' ? target : target[prop];

                this._tweens.push(
                    this.game.add.tween(_tweenTarget)
                        [_isIntro ? 'from' : 'to'](
                        _queue[prop],
                        options.duration,
                        options.ease,
                        true,
                        options.delay
                    )
                );

                _tweenInstance = this._tweens[this._tweens.length - 1];
                _tweenInstance.onComplete.addOnce(this._checkForComplete, this);
                _tweenInstance.onLoop.addOnce(function () {
                    console.log('progress', this);
                }, this);
            }
        }
    }

    _checkForComplete(target: any, tween: any) {
        var i = 0,
            l = this._tweens.length,
            _currentTween,
            completed = 0;

        for(; i < l; i++) {
            _currentTween = this._tweens[i];
            if (_currentTween.isRunning === false) {
                completed++;
                this.game.tweens.remove(tween);
            }
        }

        if (completed === l) {
            this.onComplete && this.onComplete();
            this.currentTarget.destroy();
        }
    }

    _prepareTargetForTweening(props: any) {
        if (props.hasOwnProperty('alpha')) {
            this.currentTarget.alpha = 0;
        }
    }

    destroy(target: any) {
        target.destroy();
    }

    stop() {
        this._active = false;
        this.update();
    }

}