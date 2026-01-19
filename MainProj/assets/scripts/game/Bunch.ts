/*
 * @Author: jxgamestudio
 * @Description: one bunch class 
 */

import { BunchInfo, BunchTopInfo } from "../base/Interface";
import { SPLIT_COUNT } from "../enum/Enums";
import GameMgr from "../manager/GameMgr";

const { ccclass, property } = cc._decorator; 

@ccclass
export default class Bunch extends cc.Component{

    private info: BunchInfo = null; 
    private index:number = 0;
    private _orignPt: cc.Vec3 = null;

    private sprArr:Array<cc.Sprite> = [];

    onLoad(){
        this.initSprite();
    }

    setBunchInfo(info: BunchInfo) {
        this.info = info; 
        this.initBunchData();
    }

    private initBunchData(){
        //console.log("Init CurBunchInfo::::: ",this.info.colorIds);
        for(var i = 0; i < this.info.colorIds.length; ++i){
            var color = this.info.colorIds[i];
            if(color == 0)
            {
                this.sprArr[i].node.active = false;
            }
            else
            {
                this.sprArr[i].node.active = true;
                this.sprArr[i].spriteFrame = GameMgr.ins.bunchImgs[color-1];
                //console.log("IIIIIII : ",i," Color: ",color," SprFrame:: ",GameMgr.ins.bunchImgs[color-1]);
            }
        }
    }

    private initSprite(){
        let iCount = this.node.childrenCount;
        for(var  i = 0; i < iCount; ++i)
        {
            var child = this.node.children[i];
            var spr = child.getComponent(cc.Sprite);
            if(spr)
            {
                this.sprArr.push(spr)
            }
        }
    }

      /**
       * Get the top water of the cup
       */
    getTop(): BunchTopInfo {
        let colorIds = this.info.colorIds; //
        let emptyNum = 0; //
        let topColorId = 0; //
        let topColorNum = 0; //
    
        for (let i = 0; i < SPLIT_COUNT; i++) {
          if (colorIds[i] == 0) {
            emptyNum++; 
            continue;
          }
          if (topColorId == 0 || topColorId == colorIds[i]) {
            topColorId = colorIds[i];
            topColorNum++;
          } else {
            break;
          }
        }

        return {
          emptyNum: emptyNum, //
          topColorId: topColorId, //
          topColorNum, //
        };
    }

    public addTop(colorId, num){
        //console.log(" addTop.Before::  curIndex: ",this.index," Add.ColorID: ",colorId," Num: ",num," Original.Color: ",this.info.colorIds);
        let emptyNum = this.getTopEmptyCount();
        let startIndex  = emptyNum-num
        let endIndex = startIndex + num;
        for(;startIndex < endIndex; ++startIndex)
        {
            this.info.colorIds[startIndex] = colorId;
            this.sprArr[startIndex].node.active = true;
            this.sprArr[startIndex].spriteFrame = GameMgr.ins.bunchImgs[colorId-1];
        }
    }

    public removeTop(num){
        //console.log(" removeTopBefore:: curIndex: ",this.index," Num: ",num," Orininal.Color: ",this.info.colorIds);
        let emptyNum = this.getTopEmptyCount();
        let startIndex  = emptyNum
        let endIndex = startIndex + num;
        for(;startIndex < endIndex; ++startIndex)
        {
            this.info.colorIds[startIndex] = 0;
            this.sprArr[startIndex].node.active = false
        }
    }

    checkFinishImpDontChangeState(){
        let finishedState = false;
        let colorIds = this.info.colorIds; 
        let tmpId = colorIds[0]; // tmp ColorId
        let sameColrCount = 0;
        for (let i = 0; i < SPLIT_COUNT; i++) {
            if (tmpId != colorIds[i]) {
                break;
            } else {
                // Same Color SplitCount + 1
                sameColrCount++;
            }
        }

        ///  Same color and game is Passed
        if (sameColrCount == SPLIT_COUNT) {
            finishedState = true;
        }

        //console.log("checkFinishImpDontChangeState. SplitCount:::: ",sameColrCount," CupIndex: ",this._cupIndex," FinishState: ",finishedState," TmpId: ",tmpId);
        return finishedState; 
    }

    checkCanMove(){
        let  color = 0;
        for(let i = this.info.colorIds.length-1; i >= 0; --i){
            color = this.info.colorIds[i];
            if(color != 0)
            {
                break
            }
        }

        let bunchArrs = GameMgr.ins.getBunchs();
        for(let k = 0; k < bunchArrs.length; ++k)
        {
            let bunch = bunchArrs[k];
            let top = bunch.getTop();
            if(top.topColorId == color)
            {
                return true;
            }
        }

        console.log("  Current Bunch Index:: ",this.index," Top Color:: ",color)
        return false;
    }

    public removeOneColor(colorID:Number){
        let startIndex  = 0
        let endIndex = startIndex + SPLIT_COUNT;
        for(;startIndex < endIndex; ++startIndex)
        {
            if(this.info.colorIds[startIndex] == colorID)
            {
                this.info.colorIds[startIndex] = 0;
            }
        }

        let tmpArr = []
        startIndex = 0;
        for(; startIndex < SPLIT_COUNT; ++startIndex)
        {
            let colorID = this.info.colorIds[startIndex]
            if(colorID != 0)
            {
                tmpArr.push(colorID)
            }
        }

        startIndex = tmpArr.length
        for(; startIndex < SPLIT_COUNT; ++startIndex)
        {
            tmpArr.unshift(0)
        }

        //console.log(" TmpArr::::::  ",tmpArr);
        this.info.colorIds = tmpArr;
        this.initBunchData();
    }

    public getTopEmptyCount(){
        let emptyNum = 0;
        for (let i = 0; i < SPLIT_COUNT; i++) {
            if (this.info.colorIds[i] == 0) {
                emptyNum++; 
                continue;
            }
        }

        return emptyNum;
    }

    private onClick: (c: Bunch) => void = null;

    setOnClick(onClick: (c: Bunch) => void) {
        //console.log(" Bunch SetOnClick.... ");
        this.onClick = onClick;
    }

    /**
   * @param _event
   * @param state
   */
    public changeClickState() {
        if (this.onClick) {
            this.onClick(this);
        }
    }

    get orignPt() {
        return this._orignPt;
    }

    setOrignPt(pt: cc.Vec3) {
        this._orignPt = pt;
    }

    getIndex(){
        return this.index
    }

    setIndex(val){
        this.index = val
    }

}