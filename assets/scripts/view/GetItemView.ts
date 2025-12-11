/*
 * @Author: jxgamestudio
 * @Description: Get Cup View
 */

import GameMgr from "../manager/GameMgr";
import BaseView from "./BaseView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GetItemView extends BaseView {
  //@property(cc.Sprite)
  //titleSprite: cc.Sprite = null;
  @property(cc.Sprite)
  propSprite: cc.Sprite = null;
  // LIFE-CYCLE CALLBACKS:
  @property(cc.Node)
  rootNode: cc.Node = null;
  // onLoad () {}

  start() { 

  }

  setTitleImg() {

  }

  setPropImg(spr:cc.SpriteFrame) {
    this.propSprite.spriteFrame = spr;
  }

  setScale(scale: number) {
    this.rootNode.scale = scale;
  }
  
  cancelFn: Function;
  close(): void {
    this.node.destroy();
    if (this.cancelFn) this.cancelFn();
  }
  // update (dt) {}
}
