/*
 * @Author: jxgamestudio
 * @Description: 商店道具Item
 */

import BaseView from "./BaseView";

const { ccclass, property } = cc._decorator;

@ccclass("ShopModalItemSpriteFrames")
export class ShopModalItemSpriteFrames {
  @property(cc.SpriteFrame)
  default: cc.SpriteFrame = null;
  @property(cc.SpriteFrame)
  have: cc.SpriteFrame = null;
  @property(cc.SpriteFrame)
  check: cc.SpriteFrame = null;
}

@ccclass
export default class ShopItemView extends cc.Component {
  @property(ShopModalItemSpriteFrames)
  imgs: ShopModalItemSpriteFrames = null;

  checkState(state: "default" | "have" | "check") {
    switch (state) {
      case "have":
        this.node.getComponent(cc.Sprite).spriteFrame = this.imgs.have;
        break;
      case "check":
        this.node.getComponent(cc.Sprite).spriteFrame = this.imgs.check;
      default:
        break;
    }
  }
  // LIFE-CYCLE CALLBACKS:

  // onLoad () {}

  // start() {}

  // update (dt) {}
}
