import { Constants } from "./constants";

export class Indicator{
    public Label : string;
    public Value : any;
    public Text: Phaser.Text;
    private ValueColor: string = "yellow";

    private get fullText() : string{
        return this.Label + ' '+this.Value;
    }    

    constructor(label : string, value : any){
        this.Label = label;
        this.Value = value;        
    }    

    public addToGame(game: Phaser.Game, position: Phaser.Point){        
        this.Text = game.add.text(position.x, position.y, this.fullText, Constants.FontStyle);
        this.setColor();
    }

    private setColor(){
        const length = this.fullText.length
        const startIndex = this.Label.length;
        for(let i=startIndex;i<length;i++){
            this.Text.addColor(this.ValueColor,i);
        }
    }

    public update(){
        this.Text.setText(this.fullText);
    }
}