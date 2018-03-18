import { Point, DEV_VERSION } from "phaser-ce";
import { Direction } from "./enums";

export class Snail{
    private spriteName : string = 'snail';
    public movementUnit : number = 200;
    public sprite : Phaser.Sprite;
    public collisionSprite: Phaser.Sprite;
    private isKilled: boolean = false;
    private isMoving: boolean = false;
    private targetPoint: Phaser.Point = new Phaser.Point(0,0);
    private fromPosition: Phaser.Point = new Phaser.Point(0,0);
    private scale: number;
    private unitDistance: number;
    private direction: Direction;
    private animation: Phaser.Animation;

    public create(game : Phaser.Game, scale: number){       
        this.scale = scale;      
        this.unitDistance = 8 * scale;
        this.sprite = this.initializeSprite(game, scale);
        this.animation = this.sprite.animations.add('walk');

        this.collisionSprite = this.initializeSprite(game, scale);
        this.collisionSprite.body.setSize(10,10,3,3);
        this.collisionSprite.visible = false;
    }

    private initializeSprite(game: Phaser.Game, scale: number): Phaser.Sprite {
        const sprite = game.add.sprite(0,0, this.spriteName);
        sprite.anchor.setTo(0.5,0.5); 
        sprite.scale.setTo(scale - 0.4);
        game.physics.enable(sprite, Phaser.Physics.ARCADE);               
        sprite.body.setSize(1,1,3,3);
        return sprite;
    }

    public kill(): void{
        this.sprite.visible = false;
        this.isKilled = true;
    }

    // stop moving if moving into a wall.
    public stop(): void{        
        this.isMoving = false;        
        this.sprite.body.reset(this.fromPosition.x, this.fromPosition.y);   
        this.sprite.position.x = this.fromPosition.x;
        this.sprite.position.y = this.fromPosition.y;
        this.sprite.fresh = false;
        this.animation.stop();

        this.collisionSprite.body.reset(this.fromPosition.x, this.fromPosition.y);
        this.collisionSprite.position.x = this.fromPosition.x;
        this.collisionSprite.position.y = this.fromPosition.y;
        this.collisionSprite.fresh = false;
    }
    
    public update(game : Phaser.Game){
        if (this.isKilled){
            return;
        }        

        this.move(game);        
        if (!this.isMoving) {
            this.checkMovement(game);            
        } else if (!this.animation.isPlaying) {
            this.animation.play(10,true);
        }

    }    

    private move(game: Phaser.Game) {
        let isThere = false;
        switch (this.direction)
        {            
            case Direction.Down: 
                isThere = (this.sprite.position.y >= this.targetPoint.y);                
                break;
            case Direction.Up:
                isThere = (this.sprite.position.y <= this.targetPoint.y);                
                break;
            case Direction.Left:
                isThere = (this.sprite.position.x <= this.targetPoint.x);                
                break;
            case Direction.Right:
                isThere = (this.sprite.position.x >= this.targetPoint.x);                
                break;
        }

        if (isThere) {
            this.animation.stop();
            this.isMoving = false;   
            this.sprite.body.velocity.x = 0;
            this.sprite.body.velocity.y = 0;
            this.sprite.position = new Phaser.Point(this.targetPoint.x, this.targetPoint.y);
            //this.animation.stop();            
        }        
    }

    private checkMovement(game: Phaser.Game)  {
        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))            
        {   
            this.targetPoint = new Phaser.Point(this.sprite.position.x - this.unitDistance, this.sprite.position.y);
            this.sprite.body.velocity.x = -this.movementUnit;
            this.sprite.scale.x = -(Math.abs(this.sprite.scale.x));
            this.sprite.angle = 0;
            this.direction = Direction.Left;
            this.isMoving = true;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))            
        {
            this.targetPoint = new Phaser.Point(this.sprite.position.x + this.unitDistance, this.sprite.position.y);
            this.sprite.body.velocity.x = this.movementUnit;
            this.sprite.scale.x = Math.abs(this.sprite.scale.x);
            this.sprite.angle = 0;
            this.direction = Direction.Right;
            this.isMoving = true;
        }        
        else if (game.input.keyboard.isDown(Phaser.Keyboard.UP))            
        {
            this.targetPoint = new Phaser.Point(this.sprite.position.x, this.sprite.position.y - this.unitDistance);
            this.sprite.body.velocity.y = -this.movementUnit;
            this.sprite.angle = -90;
            this.sprite.scale.x = Math.abs(this.sprite.scale.x);
            this.direction = Direction.Up;
            this.isMoving = true;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))            
        {
            this.targetPoint = new Phaser.Point(this.sprite.position.x, this.sprite.position.y + this.unitDistance);
            this.sprite.body.velocity.y = this.movementUnit;
            this.sprite.angle = 90;
            this.sprite.scale.x = Math.abs(this.sprite.scale.x);
            this.direction = Direction.Down;
            this.isMoving = true;
        }      
        if (this.isMoving) {
            this.fromPosition = new Phaser.Point(this.sprite.position.x, this.sprite.position.y);            
            const line: Phaser.Line = new Phaser.Line(this.fromPosition.x,this.fromPosition.y, this.targetPoint.x, this.targetPoint.y);
            const midPoint: Phaser.Point = line.midPoint();
            this.collisionSprite.position.x = midPoint.x;
            this.collisionSprite.position.y = midPoint.y;
        }
    }        
}
