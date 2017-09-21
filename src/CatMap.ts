module uilayout {

    var UIComponentClass = "eui.UIComponent";

    /**自定义的布局类*/
    export class CatMap extends eui.LayoutBase{
        public constructor(){
            super();
        }
        /**
         * 计算target的尺寸
         * 如果您的自定义布局需要根据内部子项计算尺寸，请重写这个方法
         **/
        public measure():void{
            super.measure();
        }
        /**
         * 重写显示列表更新
         */
        public updateDisplayList(unscaledWidth:number, unscaledHeight:number):void{
            super.updateDisplayList(unscaledWidth, unscaledHeight);
            if (this.target==null)
                return;
			let sunElement:eui.UIComponent;		
			//子元素个数		
            let count:number = this.target.numElements;
			//元素x轴方向间隔
			let gapX:number = 0;
			//元素y轴方向间隔
            let gapY:number = 0;
			//元素所在列数
			let column:number = 0;
			//元素所在行数
			let row:number = 0;
			//奇偶行数错位距离
			let parityWidth:number = 0;
            if(count > 0) {
				sunElement = <eui.UIComponent> this.target.getElementAt(0);
				gapX = (unscaledWidth - sunElement.width * 9 - sunElement.width / 2)/8;
				gapY = (unscaledHeight - sunElement.height * 9 - sunElement.height / 2)/8;
				//console.log(unscaledWidth,unscaledHeight,sunElement.width,sunElement.height);
			}
            for (let i:number = 0; i < count; i++){

                let layoutElement:eui.UIComponent = <eui.UIComponent> ( this.target.getElementAt(i) );
                if ( !egret.is(layoutElement,UIComponentClass) || !layoutElement.includeInLayout ) {
                    continue;
                }
				row = Math.floor(i / 9);
				column = i % 9;
				if(row % 2 == 0) {
					parityWidth = 0;
				}else{
					parityWidth = layoutElement.width / 2;
				} 
				let childX:number = column * (layoutElement.width + gapX) + parityWidth;
				let childY:number = row * (layoutElement.height + gapY);
                layoutElement.setLayoutBoundsPosition(childX, childY);
            }
            //this.target.setContentSize(maxX,maxY);
        }
    }
}