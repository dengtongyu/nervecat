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

class Main extends egret.DisplayObjectContainer {

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView: LoadingUI;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.loadingView.x = (640 - this.loadingView.width)/2;
        this.loadingView.y = (1136 - this.loadingView.height)/2;
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event: RES.ResourceEvent) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event: RES.ResourceEvent) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event: RES.ResourceEvent) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event: RES.ResourceEvent) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    private textfield: egret.TextField;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        this.init();
    }
    
    private SW:number;//舞台宽
    private SH:number;//舞台高
    private SCORE:number = 0;//分数

    private  mapGroup:eui.Group;//地图容器
    private  circleArray:Array<Object>;
    private  cat:egret.MovieClip;

    private bg:egret.Bitmap;//开始Bitmap
    private popGroup:eui.Group;//开始画面容器
    private btnStart:eui.Button;//开始按钮
    private btnStartPng:egret.Bitmap;//开始Bitmap

    private catPos:number;//神经猫的位置

    private init():void{
        this.SW = this.stage.stageWidth;
        this.SH = this.stage.stageHeight;

        //利用白鹭预设的创建bitmap方法创建背景图片
        this.bg = this.createBitmapByName("bg_jpg");
        this.stage.addChild(this.bg);

        //地图容器
        this.mapGroup = new eui.Group();
        this.mapGroup.width = 560;
        this.mapGroup.height = 560;
        this.mapGroup.x = 40;
        this.mapGroup.y = 400;
        this.stage.addChild(this.mapGroup);
        
        // var outline:egret.Shape = new egret.Shape;
        // outline.graphics.lineStyle(3,0x00ff00);
        // outline.graphics.beginFill(0x000000,0);
        // outline.graphics.drawRect(0,0,this.mapGroup.width,this.mapGroup.height);
        // outline.graphics.endFill();
        // this.mapGroup.addChild( outline );

        this.creatMap();

        //开始画面容器
        this.popGroup = new eui.Group();
        this.popGroup.width = this.SW;
        this.popGroup.height = this.SH;
        this.popGroup.layout = new eui.BasicLayout();
        this.stage.addChild(this.popGroup);

        //开始Bitmap
        this.btnStartPng = this.createBitmapByName("btn_start_png");
        this.btnStartPng.scaleX = this.btnStartPng.scaleY = 1.2;

        //开始按钮
        this.btnStart = new eui.Button();
        this.btnStart.width = this.btnStartPng.width;
        this.btnStart.height = this.btnStartPng.height;
        this.btnStart.horizontalCenter = 0;
        this.btnStart.verticalCenter = 0;
        this.popGroup.addChild(this.btnStart);
        this.btnStart.addChild(this.btnStartPng);
        this.btnStart.addEventListener(egret.TouchEvent.TOUCH_TAP,this.touchHandler,this);

        
        
        //this.cat.addEventListener(egret.Event.LOOP_COMPLETE, (e:egret.Event)=>{
            //console.log(e.type);//输出3次
        //}, this);
     }

     private touchHandler(event:TouchEvent) {
        //console.log(event.target);
        //if(event.target == this.btnStart) {}
        this.popGroup.visible = this.btnStartPng.visible = false;
        this.cat.visible = true;
        this.btnStart.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.touchHandler,this);
     }

    private touchCircle(event:TouchEvent) {
        //console.log(event.target);
        let currentTarget:any = event.target;
        let boxName = currentTarget.parent.name;
        let circleData = this.circleArray[boxName];
        //console.log(boxName);
        circleData['img1'].visible = false;
        circleData['img2'].visible = true;
        circleData['val'] = 1;
        circleData['img1'].touchEnabled = false;
        circleData['img1'].removeEventListener(egret.TouchEvent.TOUCH_TAP,this.touchCircle,this);

        //let catBox = this.cat.parent;
        //this.insertWeiZhuCat(catBox);
        if(this.isLine(this.catPos)) {
            this.deleteCat();
            this.catEscaped();
        }else{
            let nextPos = this.nextRandomPosition(this.catPos);
            if(nextPos > 0) {
                this.catMove(nextPos);
                this.catPos = nextPos;
            }else{
                let catBox = this.cat.parent;
                this.insertWeiZhuCat(catBox);
                this.catCaught();
            }
            
        }
        
     }

     /**神经猫下一步的位置**/
     private nextPosition(sign:number) {
        let roads:Array<Object> = this.passRoads(sign);
        console.log(roads);
        let allSteps:Array<number> = new Array();
        let allPositions:Array<number> = new Array();
        for(let i:number=0;i<roads.length;i++){
            let step = this.isRoadPass(roads[i]['sign'],roads[i]['type']);
            if(step > 0) {
                allSteps.push(step);
                allPositions.push(roads[i]['sign']);
            }
        }
        let index:number = this.minIndex(allSteps);
        return allPositions[index];
     }

     /**神经猫下一步的位置**/
     private nextRandomPosition(sign:number) {
        let roads:Array<Object> = this.passRoads(sign);
        if(roads.length == 0) {
            return -1;
        }else{
            let index:number = Math.floor((roads.length - 1)*Math.random());
            return roads[index]['sign'];
        }
        
     }

     /**创建网格**/
     private creatMap() {
        this.circleArray = new Array();
        for(let i = 0;i<81;i++){
            let circleData = new Object();
            circleData['ui'] = new eui.Group();
            circleData['ui'].name = i;
            circleData['img1'] = this.createBitmapByName('pot1_png');
            circleData['img2'] = this.createBitmapByName('pot2_png');
            if(i == 40) {
                 circleData['img1'].visible = true;
                 circleData['img2'].visible = false;
                 circleData['val'] = 0;
                 
            }else{
                 if(Math.random()*10 > 8) {
                    circleData['img1'].visible = false;
                    circleData['img2'].visible = true;
                    circleData['val'] = 1;
                }else{
                    circleData['img1'].visible = true;
                    circleData['img2'].visible = false;
                    circleData['val'] = 0;
                }
            }
            this.circleArray.push(circleData);
            circleData['img1'].scaleX = circleData['img1'].scaleY = 1.2;
            circleData['img2'].scaleX = circleData['img2'].scaleY = 1.2;
            circleData['ui'].width = circleData['img1'].width;
            circleData['ui'].height = circleData['img1'].height;
            //circleData['ui'].layout = new eui.BasicLayout();
            circleData['ui'].addChild(circleData['img1']);
            circleData['ui'].addChild(circleData['img2']);
            if(i == 40) {//中间神经猫的位置
                this.insertRunCat(circleData['ui']);
                this.cat.visible = false;
                this.catPos = 40;
            }
            if(circleData['val'] == 0) {
                circleData['img1'].touchEnabled = true;
                circleData['img1'].addEventListener(egret.TouchEvent.TOUCH_TAP,this.touchCircle,this);
            }
            // let lab = new egret.TextField();
            // lab.width = circleData['ui'].width;
            // lab.height = circleData['ui'].height;
            // lab.textAlign = egret.HorizontalAlign.CENTER;
            // lab.verticalAlign = egret.VerticalAlign.MIDDLE;
            // lab.text = String(i);
            // circleData['ui'].addChild(lab);
            this.mapGroup.addChild(circleData['ui']);
        }
        //引用自定义布局
        this.mapGroup.layout = new uilayout.CatMap();
     }

     /**神经猫移动**/
    private catMove(sign:number) {
        let circleData = this.circleArray[sign];
        this.deleteCat();
        this.insertRunCat(circleData['ui']);
    }

     /**插入逃跑的神经猫**/
    private insertRunCat(box:any) {
        this.deleteCat();
        this.cat = this.createMCByName('stay');
        this.cat.x = 0;
        this.cat.y = (box.height - this.cat.height);
        box.addChild(this.cat);
        this.cat.gotoAndPlay(1,-1);
    }

     /**插入围住的神经猫**/
    private insertWeiZhuCat(box:any) {
        this.deleteCat();
        this.cat = this.createMCByName('weizhu');
        this.cat.x = 0;
        this.cat.y = (box.height - this.cat.height);
        box.addChild(this.cat);
        this.cat.gotoAndPlay(1,-1);
    }

    /**删除神经猫**/
    private deleteCat() {
         if(this.cat && this.cat.parent) {
            let catBox = this.cat.parent;
            catBox.removeChild(this.cat);
            this.cat.stop();
            this.cat = null;
        }
    }

    /**结束弹窗**/
    private endPop(bitmapName:string) {
        //弹窗容器
        let boxGroup = new eui.Group();
        //弹窗背景Bitmap
        let pngBg:egret.Bitmap = this.createBitmapByName(bitmapName);
        //failedPng.scaleX = this.btnStartPng.scaleY = 1.2;
        boxGroup.width = pngBg.width;
        boxGroup.height = pngBg.height;
        boxGroup.horizontalCenter = 0;
        boxGroup.verticalCenter = 0;
        boxGroup.addChild(pngBg);
        boxGroup.addChild(this.replayBtn());
        this.popGroup.addChild(boxGroup);
        this.popGroup.visible = true;
    }

    /**神经猫逃跑了**/
    private catEscaped() {
        this.endPop('failed_png');
    }

    /**神经猫抓住了**/
    private catCaught() {
        this.endPop('victory_png');
    }

    /**再来玩一次按钮**/
    private replayBtn() {
        let btnReplay:eui.Button = new eui.Button();
        let replayPng:egret.Bitmap = this.createBitmapByName("replay_png");
        btnReplay.width = replayPng.width;
        btnReplay.height = replayPng.height;
        btnReplay.horizontalCenter = 0;
        //btnReplay.verticalCenter = 0;
        btnReplay.y = 190;
        btnReplay.addChild(replayPng);
        btnReplay.addEventListener(egret.TouchEvent.TOUCH_TAP,this.replayTouchHandler,this);
        return btnReplay;
    }

    private replayTouchHandler(event:egret.TouchEvent) {
        window.location.reload();
    }

    /**获取神经猫身边可通行的方向**/
    private passRoads(sign:number) {
        let passSignArray:Array<Object> = new Array();
        let row:number = Math.floor(sign / 9);
        if(this.circleArray[sign-1]['val'] == 0) {
            let data:Object = new Object();
            data['sign'] = sign-1;
            data['type'] = 0;
            passSignArray.push(data);
        }
        if(this.circleArray[sign+1]['val'] == 0) {
            let data:Object = new Object();
            data['sign'] = sign+1;
            data['type'] = 1;
            passSignArray.push(data);
        }
        if(row % 2 == 0) {
            if(this.circleArray[sign-9]['val'] == 0) {
                let data:Object = new Object();
                data['sign'] = sign-9;
                data['type'] = 2;
                passSignArray.push(data);
            }
            if(this.circleArray[sign-9-1]['val'] == 0) {
                let data:Object = new Object();
                data['sign'] = sign-9-1;
                data['type'] = 3;
                passSignArray.push(data);
            }
            if(this.circleArray[sign+9]['val'] == 0) {
                let data:Object = new Object();
                data['sign'] = sign+9;
                data['type'] = 4;
                passSignArray.push(data);
            }
            if(this.circleArray[sign+9-1]['val'] == 0) {
                let data:Object = new Object();
                data['sign'] = sign+9-1;
                data['type'] = 5;
                passSignArray.push(data);
            }
        }else{
            if(this.circleArray[sign-9+1]['val'] == 0) {
                let data:Object = new Object();
                data['sign'] = sign-9+1;
                data['type'] = 2;
                passSignArray.push(data);
            }
            if(this.circleArray[sign-9]['val'] == 0) {
                let data:Object = new Object();
                data['sign'] = sign-9;
                data['type'] = 3;
                passSignArray.push(data);
            }
            if(this.circleArray[sign+9+1]['val'] == 0) {
                let data:Object = new Object();
                data['sign'] = sign+9+1;
                data['type'] = 4;
                passSignArray.push(data);
            }
            if(this.circleArray[sign+9]['val'] == 0) {
                let data:Object = new Object();
                data['sign'] = sign+9;
                data['type'] = 5;
                passSignArray.push(data);
            }
        }
        return passSignArray;
    }

    /**此路是否可通行**/
    private isRoadPass(sign:number,type:number) {
        let row:number = Math.floor(sign / 9);
		let column:number = sign % 9;
        let step:number = 0;
        if(type == 0) {
            for(let i:number = sign;i >= sign - column;i--) {
                if(this.isLine(i)) {
                    if(this.circleArray[i]['val'] == 0) {
                        step++;
                        return step;
                    }else{
                        step = 0;
                        return step;
                    }
                }else{
                    if(this.circleArray[i]['val'] == 0) {
                        step++;
                    }else{
                        step = 0;
                        return step;
                    }
                }
            }
        }
        if(type == 1) {
            for(let i:number = sign;i <= (sign + 8 - column);i++) {
                if(this.isLine(i)) {
                    if(this.circleArray[i]['val'] == 0) {
                        step++;
                        return step;
                    }else{
                        step = 0;
                        return step;
                    }
                }else{
                    if(this.circleArray[i]['val'] == 0) {
                        step++;
                    }else{
                        step = 0;
                        return step;
                    }
                }
            }
        }
        if(type == 2) {
            for(let i:number = sign;i >= 0;i = (i - (Math.floor(i / 9) % 2 == 0?9:8))) {
                console.log('type2下标：'+i);
                if(this.isLine(i)) {
                    if(this.circleArray[i]['val'] == 0) {
                        step++;
                        return step;
                    }else{
                        step = 0;
                        return step;
                    }
                }else{
                    if(this.circleArray[i]['val'] == 0) {
                        step++;
                    }else{
                        step = 0;
                        return step;
                    }
                }
            }
        }
        if(type == 3) {
            for(let i:number = sign;i >= 0;i = (i - (Math.floor(i / 9) % 2 == 0?10:9))) {
                console.log('type3下标：'+i);
                if(this.isLine(i)) {
                    if(this.circleArray[i]['val'] == 0) {
                        step++;
                        return step;
                    }else{
                        step = 0;
                        return step;
                    }
                }else{
                    if(this.circleArray[i]['val'] == 0) {
                        step++;
                    }else{
                        step = 0;
                        return step;
                    }
                }
            }
        }
        if(type == 4) {
            for(let i:number = sign;i <= 80;i = (i + (Math.floor(i / 9) % 2 == 0?9:10))) {
                console.log('type4下标：'+i);
                if(this.isLine(i)) {
                    if(this.circleArray[i]['val'] == 0) {
                        step++;
                        return step;
                    }else{
                        step = 0;
                        return step;
                    }
                }else{
                    if(this.circleArray[i]['val'] == 0) {
                        step++;
                    }else{
                        step = 0;
                        return step;
                    }
                }
            }
        }
        if(type == 5) {
            for(let i:number = sign;i <= 80;i = (i + (Math.floor(i / 9) % 2 == 0?8:9))) {
                console.log('type5下标：'+i);
                 if(this.isLine(i)) {
                    if(this.circleArray[i]['val'] == 0) {
                        step++;
                        return step;
                    }else{
                        step = 0;
                        return step;
                    }
                }else{
                    if(this.circleArray[i]['val'] == 0) {
                        step++;
                    }else{
                        step = 0;
                        return step;
                    }
                }
            }
        }
    }

    /**是否达到边界**/
    private isLine(number: number) {
        if((number >= 0 && number <= 8) || (number >= 72 && number <= 80) || (number % 9 == 0) || ((number + 1) % 9 == 0)) {
            return true;
        }else {
            return false;
        }
        
    }

    /**取小值的小标**/
    private minIndex(arr:Array<number>) {
        let min = arr[0];
        for(var i=1;i<arr.length;i++){
            if (arr[i] < min){ 
                min = arr[i]; 
            } 
        }
        for(var i=0;i<arr.length;i++){
            if (arr[i] == min){ 
                return i;
            } 
        }
    }

    /**获取序列帧动画**/
    private createMCByName(name: string) {
        let data = RES.getRes(name+"_json");
        let txtr = RES.getRes(name+"_png");
        let mcFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory( data, txtr );
        let mc:egret.MovieClip = new egret.MovieClip(mcFactory.generateMovieClipData(name));
        return mc;
    }

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string) {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    private startAnimation(result: string[]) {
        let parser = new egret.HtmlTextParser();

        let textflowArr = result.map(text => parser.parse(text));
        let textfield = this.textfield;
        let count = -1;
        let change = () => {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            let textFlow = textflowArr[count];

            // 切换描述内容
            // Switch to described content
            textfield.textFlow = textFlow;
            let tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, this);
        };

        change();
    }
}


