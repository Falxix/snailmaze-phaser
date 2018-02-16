import { Point } from "phaser-ce";

export class Snail{
    private spriteName : string = 'snail';
    public movementUnit : number = 100;
    public sprite : Phaser.Sprite;
    private baseSize : Point = new Phaser.Point(5,5);
    

    public create(game : Phaser.Game, scale: number){
        let startX = 50;
        let startY = 550;
        this.sprite = game.add.sprite(startX, startY, this.spriteName);
        this.sprite.anchor.setTo(0.5,0.5);
        this.sprite.scale.setTo(scale - 0.4);
        game.physics.enable(this.sprite, Phaser.Physics.ARCADE);                
        
    }
    
    public update(game : Phaser.Game){
        
        this.sprite.body.velocity.x = 0;
        this.sprite.body.velocity.y = 0;

        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))            
        {            
            this.sprite.body.velocity.x = -this.movementUnit;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))            
        {
            this.sprite.body.velocity.x = this.movementUnit;
        }
        
        if (game.input.keyboard.isDown(Phaser.Keyboard.UP))            
        {
            this.sprite.body.velocity.y = -this.movementUnit;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))            
        {
            this.sprite.body.velocity.y = this.movementUnit;
        }
        
    }
}
