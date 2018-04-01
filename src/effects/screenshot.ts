export class Screenshot {   

    public static getScreenshot(game: Phaser.Game, id: string): Promise<any> {
        var bmd = game.add.bitmapData(game.width, game.height);
        game.world.updateTransform();
        bmd.drawFull(game.world);        

        var tx = game.make.renderTexture(bmd.width, bmd.height);
        tx.render(bmd.addToWorld());
        const promise = new Promise<Phaser.Image>((resolve, reject) => {
            const image = game.load.image(id, tx.getBase64(), true);
            image.onLoadComplete.add(() => {
                console.log('load complete!');
                console.log('loaded: '+id);
                resolve(null);
            });
            game.load.start();
        });
        return promise;        
    }
}