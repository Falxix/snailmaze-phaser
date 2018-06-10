import { Slide } from "./slide";
import { ContentSnapshot } from "./content-snapshot";
import { TransitionSettings } from "../transition/transition-settings";

const cleanup = (children: any[]) => {
    let i = 0;
    let l = children.length;

    for(; i < l; i += 1) {
        if (children[i] && (children[i] instanceof ContentSnapshot)) {
            children[i].destroy();
        }
    }
};

export function stateManagerStart(stateId: string, slideOutOptions: TransitionSettings, slideInOptions: TransitionSettings) {
    let _slide: Slide,
        _introSlide,
        _stateManager = this,
        _state = _stateManager.states[stateId],
        _cachedStateCreate = _state.create;

    _stateManager.game.stage && cleanup(_stateManager.game.stage.children);

    if (_stateManager.game.isBooted && slideOutOptions) {
        _slide = new Slide(_stateManager.game, slideOutOptions.noStage);

        (function (_state, slideOutOptions, slideInOptions) {
            _state.create = function () {
                _cachedStateCreate.call(this);

                // Slide in intro
                if (slideInOptions) {
                    _introSlide = new Slide(_stateManager.game, slideInOptions.noStage);
                    _stateManager._created = false;
                    _introSlide.go(slideInOptions);

                    _introSlide._transition.onComplete = function () {
                        _stateManager._created = true;
                        cleanup(_stateManager.game.stage.children);
                    };
                }

                // Put the original create back
                _state.create = _cachedStateCreate;

                _slide.go(slideOutOptions)
                    .then(() => {
                        _state.created();
                    });
            };
        }(_state, slideOutOptions, slideInOptions));
    }
}