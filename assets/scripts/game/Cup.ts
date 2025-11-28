/*
 * @Author: jxgamestudio
 * @Description: cup class deal  water logic
 */

import { rotatePt } from "../base/Math";
import {
  AnimationTime,
  Clips,
  HEIGHT_FACTOR, 
  PourAction, 
  SPLIT_COUNT,
  CUP_SELECTED_MOVE_HEIGHT, 
  WaterColors, 
  defaultColor, 
} from "../enum/Enums"; 
import { Global } from "../Global";
import { _CupInfo, _CupTopInfo } from "../base/Interface"; 
import { SoundMgr } from "../manager/SoundMgr";
import GameView from "../view/GameView";
import Water from "./Water"; 

const { ccclass, property, executeInEditMode } = cc._decorator; 

@ccclass("CupImgs")
export class CupImgs {
  @property(cc.SpriteFrame)
  tub: cc.SpriteFrame = null;
  @property(cc.SpriteFrame)
  mask: cc.SpriteFrame = null;
}

@ccclass
@executeInEditMode
export default class Cup extends cc.Component {

  @property(Water)
  private water: Water = null; //

  private info: _CupInfo = null; //

  private _finishState:boolean = false;

  private _cupIndex = 0;
  private _isPlayAnimation:boolean = false;

  @property(cc.Sprite)
  private tubeNode: cc.Sprite = null;
  @property(cc.Sprite)
  private maskNode: cc.Sprite = null;
  @property(cc.Sprite)
  private finishMaskNode: cc.Sprite = null;
  @property([CupImgs])
  private cupImgs: CupImgs[] = [];

  changeImg(index: number) {
    this.tubeNode.spriteFrame = this.cupImgs[index].tub;
    this.maskNode.spriteFrame = this.cupImgs[index].mask;
    this.finishMaskNode.spriteFrame = this.cupImgs[index].mask;
    this.finishMaskNode.enabled = false;
  }

  private _colors: string[] = [];
  private _default_color: string = "";
  setWaterColor(colors: string[] = WaterColors, default_color: string = defaultColor) {
    this._colors = colors;
    this._default_color = default_color;
  }
  onLoad() {
    this.setWaterColor()
    this._finishState = false;
  }
  getCupIndex(){
    return this._cupIndex;
  }
  setCupIndex(val:number){
    this._cupIndex = val;
  }

  setPlayAnimation(val:boolean){
    //console.log(" Cup: ",this._cupIndex," SetPlayAnimation: ",val);
    this._isPlayAnimation = val;
  }

  getPlayAnimation(){
    //console.log(" Cup:: ",this._cupIndex," GetPlayAnimation::",this._isPlayAnimation);
    return this._isPlayAnimation;
  }


  initWater() {
    const info = this.info; //
    let arr = [];
    for (let i = SPLIT_COUNT - 1; i >= 0; i--) {
      let colorId = info.colorIds[i]; 
      if (colorId == 0) {
        continue; 
      }

      let lastObj = arr[arr.length - 1]; //
      if (!lastObj || lastObj != colorId) {

        arr.push({
          height: 1 / SPLIT_COUNT, 
          colorId: colorId, 
        });
      } else {

        lastObj.height += 1 / SPLIT_COUNT;
      }
    }
    arr.forEach((obj) => {

      let hex = this._colors[obj.colorId] || this._default_color; 
      obj.color = new cc.Color().fromHEX(hex); 
      obj.height *= HEIGHT_FACTOR; 
    });

    this.water.initInfos(arr);
  }

  setCupInfo(info: _CupInfo) {
    this.info = info; 

    this.initWater();
  }

  update() {
    if (CC_EDITOR) {
      return;
    }

    if (this.water.tiltAngle == this.node.angle) {
      return;
    }

    this.water.tiltAngle = this.node.angle;
  }

  getFinishState(){
    return this._finishState;
  }

  checkIsFinshed(playAnimation:boolean) {
    /////  Already  finish , direct return
    if(this._finishState == true)
    {
      return this._finishState;
    }

    return this.checkFinishImp(playAnimation); 
  }

  checkFinishImp(playAnimation:Boolean){
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
    if (sameColrCount == SPLIT_COUNT && tmpId != 0) {
      finishedState = true;
    }

    console.log(" Check is finish. SplitCount:::: ",sameColrCount," CupIndex: ",this._cupIndex," FinishState: ",finishedState," TmpId: ",tmpId);
    if(this._finishState == false && finishedState == true){
      if(playAnimation)
      {
        GameView.ins.playCoinAnimation(this.node);
      }

      this.finishMaskNode.enabled = true;
      this._finishState = true;
    }
    return finishedState; 
  }

  // Only Check State Without Change state
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

  resetCheckFinishedState(){
    this._finishState = false
    this.finishMaskNode.enabled = false;
  }

  setStartAddWater(colorId: number, num: number) {
    let acc = 0;
    for (let i = SPLIT_COUNT - 1; i >= 0; i--) {
      if (this.info.colorIds[i] != 0) {
        continue;
      }
      this.info.colorIds[i] = colorId; 
      if (++acc == num) {

        break;
      }
    }
  }

  startAddWater(colorId: number, num: number) {
    let hex = this._colors[colorId] || this._default_color; 
    this.water.addInfo({

      colorId: colorId, 
      height: (num / SPLIT_COUNT) * HEIGHT_FACTOR,
      color: new cc.Color().fromHEX(hex), 
    });
    // UtilAudio.pourWater_effect_play(num / SPLIT_COUNT);
    SoundMgr.ins.playSoundAtTime(Clips.pourWater, num / SPLIT_COUNT);
  }

  private tween: cc.Tween = null;


  private _orignPt: cc.Vec3 = null;
  get orignPt() {
    return this._orignPt;
  }

  setOrignPt(pt: cc.Vec3) {
    this._orignPt = pt;
  }

  ///  Set PourWater Anchor
  public setPourAnchor(isRight: boolean) {

    let pt = cc.v2(3, 2);

    pt.x = isRight ? this.node.width - pt.x : pt.x;
    pt.y = this.node.height - pt.y;

    pt.x = pt.x / this.node.width;
    pt.y = pt.y / this.node.height;

    this.setAnchor(pt);
  }

  /// Set Anchor
  private setAnchor(anchor: cc.Vec2): void {
    let oldAnchor = this.node.getAnchorPoint();

    let selfPt = this.node.getPosition();

    let waterPt = this.water.node.getPosition();

    this.node.setAnchorPoint(anchor);

    let offsetAnchor = cc.v2(anchor.x - oldAnchor.x, anchor.y - oldAnchor.y);

    let offsetPt = cc.v2(
      offsetAnchor.x * this.node.width,
      offsetAnchor.y * this.node.height
    );

    offsetPt = rotatePt(offsetPt, this.node.angle);

    selfPt.x += offsetPt.x;
    selfPt.y += offsetPt.y;
    this.node.setPosition(selfPt);

    waterPt.x -= offsetAnchor.x * this.node.width;
    waterPt.y -= offsetAnchor.y * this.node.height;
    this.water.node.setPosition(waterPt);
  }

  moveToPour(dstPt: cc.Vec2, isRight: boolean, num: number) {
    let startAngle = this.water.getPourStartAngle(); 
    let endAngle = this.water.getPourEndAngle();
    this.water.onStartPour(num);

    if (isRight) {
      startAngle *= -1;
      endAngle *= -1;
    }

    // this.setOrignPt(this.node.position);
    let moveDur = AnimationTime.moveTime;
    let pourDur = AnimationTime.pourTime;
    this.tween = cc
      .tween(this.node)
      .set({ angle: 0 })
      .to(moveDur, { x: dstPt.x, y: dstPt.y, angle: startAngle })
      .to(pourDur, { angle: endAngle })
      .call(() => {
        this.tween = null;
      })
      .start();
    this.pourSameColor(num);
  }

  backToInitPos() {
    if (this.tween) {
      this.tween.stop();
      this.tween = null;
    }

    this.tween = cc
      .tween(this.node)
      .to(AnimationTime.moveTime, { position: this._orignPt, angle: 0 })
      .call(() => {
        this.tween = null;
      })
      .start();
  }

  private _upInfo: _CupTopInfo = null;
  get upCupInfo() {
    return this._upInfo;
  }

  pourSameColor(num: number) {
    let count = 0;
    let top = this.getTop();
    let colorIds = this.info.colorIds; 
    this._upInfo = JSON.parse(JSON.stringify(top));
    for (let i = 0; i < SPLIT_COUNT; i++) {
      let _id = colorIds[i];
      if (_id == 0) {
        continue;
      } else if (top.topColorId == _id) {
        if (count++ == num) break;
        colorIds[i] = 0;
      } else {
        break;
      }
    }
  }

  /**
   * Get the top water of the cup
   */
  getTop(): _CupTopInfo {
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
      colorHex: this._colors[topColorId] || this._default_color //
    };
  }


  getBottleMouthCenter() {
    // let pos = this.node.convertToWorldSpaceAR(
    //   cc.v2(this.node.width / 2, this.node.height)
    // );
    return {
      x: this.node.x,
      y: this.node.y + this.node.width / 2,
    };
  }

  checked: boolean;
  private onClick: (c: Cup) => void = null;

  setOnClick(onClick: (c: Cup) => void) {
    this.onClick = onClick;
  }

  /**
   * @param _event
   * @param state
   */
  public changeCheckedState() {
    if (this.isPouring()) {
      return;
    }
    if (this.onClick) {
      this.onClick(this);
    }
  }

  /**
   * @returns {boolean}
   */
  public isPouring() {
    return Math.abs(this.node.angle) > 1.0;
  }

  getWaterSurfacePosY(needAdjust = false) {
    let top = this.getTop();
    let y = (SPLIT_COUNT - top.emptyNum) / SPLIT_COUNT;
    if (y < 0.02) {
      y = 0.02;
    } else if (needAdjust) {
      y -= (1.0 / SPLIT_COUNT) * HEIGHT_FACTOR;
    }
    y *= HEIGHT_FACTOR;
    y -= 0.5;
    let pt = cc.v2(0, this.water.node.height * y);
    pt = this.water.node.convertToWorldSpaceAR(pt);
    return pt.y;
  }

  /**
   * @param onFinish
   */
  setPourInCallback(onFinish: (cup: Cup, isFInish: boolean) => void) {
    console.log(" SetPourInCallBack  Cup Index: ",this._cupIndex)
    const _onFinish = () => {
      this._upInfo = null;
      let isFinished = this.checkIsFinshed(true);
      if (onFinish) {
        onFinish(this, isFinished);
      }
      if (isFinished) {
        //console.log("  SetPourInCallBack  is finished play sound @@@@@@@@@@@@@");
        SoundMgr.ins.playSound(Clips.ContainerFinish, 0.3);
      }
    };
    this.water.setPourInCallback(_onFinish.bind(this));
  }

  /**
   */
  setPourOutCallback(pourStart: (c: Cup) => void, pourEnd: (c: Cup) => void) {
    const _onStart = function () {
      if (pourStart) {
        pourStart(this);
      }
    };
    const _onFinish = function () {
      if (this.tween) {
        this.tween.stop();
        this.tween = null;
      }
      if (pourEnd) {
        pourEnd(this);
      }
    };
    this.water.setPourOutCallback(_onStart.bind(this), _onFinish.bind(this));
  }

  public setNormalAnchor() {
    this.setAnchor(cc.v2(0.5, 0.5));
  }

  addWaterImmediately(colorId: number, num: number) {
    let acc = 0;

    for (let i = SPLIT_COUNT - 1; i >= 0; i--) {

      if (this.info.colorIds[i] != 0) {
        continue;
      }

      this.info.colorIds[i] = colorId;

      if (++acc == num) {
        break;
      }
    }

    this.initWater();
  }

  removeTopWaterImmediately(num: number) {
     console.log(" removeTopWaterImmediately 杯子: ",this.node.name);
    let acc = 0;

    let top = this.getTop();
    let colorIds = this.info.colorIds;

    for (let i = 0; i < SPLIT_COUNT; i++) {
      let _id = colorIds[i];

      if (_id == 0) {
        continue;

      } else if (top.topColorId == _id) {
        colorIds[i] = 0;

        if (++acc >= num) {
          break;
        }
      } else {
        break;
      }
    }

    this.initWater();
    return top;
  }
}
