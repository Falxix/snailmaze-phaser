import { TransitionSettings } from "../effects/transition/transition-settings";
import { StateTransition } from "../effects/core/state-transition";
import { MapConfiguration } from "../mapConfiguration";
import { Constants } from "../constants";
import { GameManager } from "../gameManager";
import { State } from "phaser-ce";

export class StateSettings {
    SlideIn: TransitionSettings;
    SlideOut: TransitionSettings;
    Map: MapConfiguration;

    constructor(nextMap: string) {
        this.SlideOut = StateTransition.Out.SlideLeft;
        this.SlideIn = StateTransition.In.SlideLeft;
        
        const newMap = new MapConfiguration();
        newMap.MapPath = 'assets/maps/'+nextMap;
        newMap.TilePath = 'assets/tile.png';
        newMap.MapScale = GameManager.Scale;
        newMap.CollisionTiles = [1];
        newMap.SpritePath = 'assets/objects.png';
        this.Map = newMap;
    }

    static NoTransition: StateSettings = {
        SlideIn: null,
        SlideOut: null,
        Map: null
    };
}