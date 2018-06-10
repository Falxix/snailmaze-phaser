export interface IState {
    preload(): void;
    create(isTransitionOver: boolean): void;
    update(): void;
}