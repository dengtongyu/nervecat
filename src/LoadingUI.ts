//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class LoadingUI extends egret.Sprite {

    public constructor() {
        super();

        this.width = 400;
        this.height = 60;

        //this.createView();
        this.initProgressBar();
    }

    private textField:egret.TextField;

    private createView():void {
        this.textField = new egret.TextField();
        this.addChild(this.textField);
        this.textField.width = 480;
        this.textField.height = 100;
        //this.textField.x = (this.stage.width - this.textField.width)/2;
        //this.textField.y = (this.stage.height - this.textField.height)/2;
        this.textField.textAlign = "center";
    }

    //private pBarBgBox:egret.Sprite;
    private pBarBg:egret.Shape;
    private pBarMove:egret.Shape;
    private initProgressBar():void{
        this.pBarBg = new egret.Shape();
        this.pBarBg.graphics.beginFill( 0x989898, 1); 
        this.pBarBg.graphics.drawRect( 0, 0, this.width, this.height ); 
        this.pBarBg.graphics.endFill();
        this.addChild(this.pBarBg);
        
        this.pBarMove = new egret.Shape();
        this.addChild(this.pBarMove);

        this.textField = new egret.TextField();
        this.textField.width = this.width;
        this.textField.textAlign = "center";
        this.textField.y = 15;
        this.addChild(this.textField);
    }

    private moveProgressBar(percent:number):void{
        //this.pBarMove.clear();
        this.pBarMove.graphics.beginFill( 0x518cdd, 1); 
        this.pBarMove.graphics.drawRect( 0, 0, this.width*percent, this.height); 
        this.pBarMove.graphics.endFill();
    }

    public setProgress(current:number, total:number):void {
        //this.textField.text = `Loading...${current}/${total}`;
        var num = Math.floor(current / total * 100);
        this.textField.text = 'Loading...  ' + num.toString() + " %";
        //this.pBar.maximum = total;
        this.moveProgressBar(current/total);
        //console.log(current,total);
    }
}
