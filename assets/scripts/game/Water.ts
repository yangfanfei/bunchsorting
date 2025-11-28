/*
 * @Author: jxgamestudio
 * @Description: Water class
 */

import { radian2angle } from "../base/Math";
import {
  ANGLE_FACTOR,
  BASIC_DATA,
  HEIGHT_FACTOR,
  MAX_ARR_LEN,
  PourAction,
  SPLIT_COUNT,
  WaterInfo,
} from "../enum/Enums";

const {
  ccclass,
  property,
  requireComponent,
  executeInEditMode,
  disallowMultiple,
  executionOrder,
} = cc._decorator;
/**  */

@ccclass
@executeInEditMode
export default class Water extends cc.Component {

  private _ratio: number = 1;
  @property(cc.EffectAsset)
  private effect: cc.EffectAsset = null;
  @property private _tiltAngle: number = 0;
  @property({ tooltip: CC_DEV && "RotateAngle" })

  public get tiltAngle() {
    return this._tiltAngle;
  }

  public set tiltAngle(value: number) {
    value = Math.round(value * 100) / 100;
    // cc.log("angle",value)
    this._tiltAngle = value;
    this.updateAngleHeight();
  }

  private material: cc.Material = null;
  private _action: PourAction = PourAction.none;
  private infos: WaterInfo[] = [];
  private stopIdx = -1;
  private curIdx = 0;
  private _actionHeight = 0;
  public get actionHeight() {
    return this._actionHeight;
  }
  public set actionHeight(value) {
    if (value > HEIGHT_FACTOR) {
      value = HEIGHT_FACTOR;
    }
    if (value < 0) {
      // value = 0;
      throw new Error(`Water height can't less than zero`);
    }
    this._actionHeight = value;
  }


  public changeAction(action: PourAction) {
    console.log(" Water.ChangeAnction:: ", this.node.name);
    this._action = action;
  }

  public addInfo(info: WaterInfo) {
    console.log(" Water.AddInfo:: ",this.node.name," WaterInfo:: ",info);
    let upActionHeight = this.actionHeight;
    
    this.actionHeight = info.height;
    info.height = 0;
    let curInfo = this.infos[this.curIdx];
    if (this._action === PourAction.in) {
      this.actionHeight += upActionHeight - (curInfo?.height || 0);
    }
    this._action = PourAction.in;
    if (curInfo && curInfo.colorId == info.colorId) {
      this.actionHeight += curInfo.height;
      
    } else {
      this.infos.push(info);
    }
    this.curIdx = this.infos.length - 1;
    
    this.initSizeColor();
  }
  protected onLoad() {
    // this.gear_pos = [
    //   HEIGHT_FACTOR / 4,
    //   HEIGHT_FACTOR / 2,
    //   (HEIGHT_FACTOR / 4) * 3,
    //   HEIGHT_FACTOR,
    // ];
    let sp = this.node.getComponent(cc.Sprite);
    if (sp.spriteFrame) sp.spriteFrame.getTexture().packable = false;
    if (this.effect) {
      this.material = cc.Material.create(this.effect);
      sp.setMaterial(0, this.material);
    }
    this.material = sp.getMaterial(0);
    this._ratio = this.node.height / this.node.width;
  }

  public initInfos(infos: Array<WaterInfo>) {
    this.infos = this.waterHandle(infos);

    this.curIdx = this.infos.length - 1;

    this.initSizeColor();
    this.updateAngleHeight();
  }

  public waterHandle(infos: Array<WaterInfo>) {
    let _infos = [];
    for (let i = 0; i < infos.length; i++) {
      const info = infos[i];
      if (
        _infos[_infos.length - 1] &&
        _infos[_infos.length - 1].colorId == info.colorId
      ) {
        _infos[_infos.length - 1].height += info.height;
      } else {
        _infos.push(info);
      }
    }
    return _infos;
  }

  private initSizeColor() {
    let _colors = new Float32Array(MAX_ARR_LEN * BASIC_DATA.BYTE); 
    for (let i = 0; i < this.infos.length; i++) {
      const color = this.infos[i].color;
      _colors[i * BASIC_DATA.BYTE] = color.r / BASIC_DATA.color_range;
      _colors[i * BASIC_DATA.BYTE + BASIC_DATA.color_alpha2] =
        color.g / BASIC_DATA.color_range;
      _colors[i * BASIC_DATA.BYTE + BASIC_DATA.color_alpha3] =
        color.b / BASIC_DATA.color_range;
      _colors[i * BASIC_DATA.BYTE + BASIC_DATA.color_alpha4] =
        BASIC_DATA.color_alpha;
    }

    this.material.setProperty("colors", _colors);

    this.material.setProperty(
      "iResult",
      cc.v2(this.node.width, this.node.height)
    );

    this.material.setProperty("corrugationType", PourAction.none);
  }

  private updateAngleHeight() {
    let _heights = new Float32Array(MAX_ARR_LEN * BASIC_DATA.BYTE);
    for (let i = 0; i < this.infos.length; i++) {
      _heights[i * BASIC_DATA.BYTE] = this.infos[i].height;
    }

    this.material.setProperty("heights", _heights);

    this.material.setProperty("tiltAngle", this._tiltAngle);

    let corrugationType = PourAction.none;
    if (this._action == PourAction.in) {
      corrugationType = PourAction.in;
    } else if (this._action == PourAction.out) {
      corrugationType = PourAction.out;
    }

    this.material.setProperty("corrugationType", corrugationType);
  }

  public upHeight() {
    //console.log(" Water.UpHeight:: ", this.node.name);
    if (this.isFull()) {
      this.actionHeight = 0;
      this._action = PourAction.none;
      return;
    }
    if (this.curIdx < 0) {
      return;
    }

    let info = this.infos[this.curIdx];

    info.height += ANGLE_FACTOR;
    
    if (info.height >= this.actionHeight) {
      info.height = this.actionHeight;
      this.actionHeight = 0;
      this._action = PourAction.none;
      if (this.onInFInish) {
        this.onInFInish();
        this.onInFInish = null;
      }
    }
    if (this.isFull()) {
      // cc.director.emit("custom_event", PourAction.in, this.node.parent);
      //#endregion
    }

    this.updateAngleHeight();
  }
  eventState = false;

  public downHeight() {
    //    console.log(" Water.DownHeight:: ", this.node.name);
    if (this.stopIdx < 0) {
      this._action = PourAction.none;
      return;
    }
    let info = this.infos[this.curIdx];

    if (!this.isAtBottleTop()) {
      if (info.height < 0.05) {
      } else {
        return;
      }
    }

    this.eventState = true;

    if (this.onOutStart) {
      this.onOutStart();
      this.onOutStart = null;
    }

    info.height -= ANGLE_FACTOR;
    if (this.actionHeight < 0) this.actionHeight = 0;

    if (info.height <= this.actionHeight) {
      info.height = this.actionHeight;
      if (this.actionHeight <= 0) {
        this.infos.pop();
        this.curIdx--;
        this.stopIdx = -1;
      }
      this.eventState = false;
      if (this.onOutFinish) {
        this.onOutFinish();
        this.onOutFinish = null;
      }
      this._action = PourAction.none;
      this.actionHeight = 0;
    }

    this.updateAngleHeight();
  }

  public isFull() {
    let cur_height = this.infos.reduce((pre, cur) => {
      return pre + cur.height;
    }, 0);
    return cur_height >= HEIGHT_FACTOR;
  }

  isEmpty() {
    return this.infos.length == 0;
  }

  getTopInfo() {
    return this.infos[this.curIdx];
  }

  public getPourStartAngle() {
    //console.log(" Water.GetPourStartAngle ", this.node.name);
    let _height = 0;
    for (let i = 0; i <= this.curIdx; i++) {
      _height += this.infos[i].height; 
    }
    return this.getCriticalAngleWithHeight(_height); 
  }

  public getPourEndAngle() {
    //console.log(" Water.getPourEndAngle ", this.node.name);
    this.stopIdx = this.curIdx - this.getTopSameColorNum();

    let _height = 0;
    for (let i = 0; i <= this.stopIdx; i++) {
      _height += this.infos[i].height;
    }

    return this.getCriticalAngleWithHeight(_height);
  }

  private getCriticalAngleWithHeight(_height: number) {
    let ret = 0;
    if (_height == 0) {
      ret = 90;
      return ret;
    }

    if (_height < 0.5) {
      let tanVal = this._ratio / (_height * 2.0);
      ret = Math.atan(tanVal);
    } else {

      let tanVal = 2.0 * this._ratio * (1.0 - _height);
      ret = Math.atan(tanVal);
    }
    ret = radian2angle(ret); 
    console.log(" Water.GetCriticalAngleWithHeight::: ",this.node.name," Angle: ",ret);
    return ret;
  }

  public onStartPour(num?: number) {
    this._action = PourAction.out;
    let oneBlockHeight = HEIGHT_FACTOR / SPLIT_COUNT;
    console.log(" Water.OnStartPour::: Num: ",num," ActionHeight: ",this.actionHeight,
      " OneBlockHeight: ",oneBlockHeight," CurIndx: ",this.curIdx," Info.Height: ",this.infos[this.curIdx].height);
    if (num) {
      this.actionHeight = this.infos[this.curIdx].height - num * oneBlockHeight;
    }
    if (this.actionHeight <= 0) {
      this.actionHeight = 0;
    }
    this.stopIdx = this.curIdx - this.getTopSameColorNum();
    if (this.stopIdx < 0) {
      this.stopIdx = 0;
    }
  }

  private getTopSameColorNum() {
    let sameColorNum = 0; //
    let colorId = null; 
    for (let i = this.curIdx; i >= 0; i--) {
      if (colorId == null) {
        sameColorNum++;
        colorId = this.infos[i].colorId;
      } else if (this.infos[i].colorId == colorId) {
        sameColorNum++;
      } else {
        break;
      }
    }
    return sameColorNum; 
  }

  private isAtBottleTop(): boolean {
    let totalHeight = 0; 
    for (let i = 0; i <= this.curIdx; i++) {
      totalHeight += this.infos[i].height; 
    }
    const angle = ((this.tiltAngle % 360) * Math.PI) / 180.0; 
    const tangent = Math.abs(Math.tan(angle)); 
    if (totalHeight < 0.5) {

      return tangent > this._ratio / (totalHeight * 2.0); 
    } else {

      const remainingHeight = 1.0 - totalHeight;
      return tangent > 2.0 * this._ratio * remainingHeight;
    }
  }

  update(dt) {
    if (this._action == PourAction.out) {
      this.downHeight();
    } else if (this._action == PourAction.in) {
      this.upHeight();
    }

    // console.log(this.isFull());
  }

  private onInFInish: Function = null;
  public setPourInCallback(onInFInish: Function) {
    this.onInFInish = onInFInish;
  }

  private onOutStart: Function = null;
  private onOutFinish: Function = null;
  public setPourOutCallback(onOutStart: Function, onOutFinish: Function) {
    this.onOutStart = onOutStart;
    this.onOutFinish = onOutFinish;
  }
}
