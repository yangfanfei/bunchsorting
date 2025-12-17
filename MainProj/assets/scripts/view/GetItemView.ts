/*
 * @Author: jxgamestudio
 * @Description: Get Cup View
 */

import GameMgr from "../manager/GameMgr";
import BaseView from "./BaseView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GetItemView extends BaseView {
  @property(cc.Sprite)
  propSprite: cc.Sprite = null;

  @property(cc.Node)
  labelNode: cc.Node = null;

  @property(cc.Node)
  rootNode: cc.Node = null;

  @property(cc.Node)
  getEffectNode: cc.Node = null;

  @property(cc.Node)
  circleEffectNode: cc.Node = null;

  private skeCompGet:sp.Skeleton = null;
  private skeCompCircle:sp.Skeleton = null;

  start() { 
    this.skeCompGet = this.getEffectNode.getComponent(sp.Skeleton);
    this.skeCompCircle = this.circleEffectNode.getComponent(sp.Skeleton);
    this.playAndStopAtLastFrame();
  }

  setItemCount(count:number) {
    this.labelNode.getComponent(cc.Label).string = count + "";
  }

  setPropImg(spr:cc.SpriteFrame) {
    this.propSprite.spriteFrame = spr;
  }

  cancelFn: Function;
  close(): void {
    this.node.destroy();
    if (this.cancelFn) this.cancelFn();
  }

    // 播放动画并在完成后停在最后一帧
  playAndStopAtLastFrame() {
      if (!this.skeCompGet) {
          cc.error('Spine component is null');
          return;
      }
      
      let trackGet = this.skeCompGet.setAnimation(0, "default", false);
      trackGet.listener = {
          complete: (entry: sp.spine.TrackEntry) => {
              this.stopAtLastFrame();
          }
      };

      let trackCirle = this.skeCompCircle.setAnimation(0, "default", false);
      trackCirle.listener = {
          complete: (entry: sp.spine.TrackEntry) => {
              this.playSecondAnimation();
          }
      };
  }
  
  // 停在最后一帧的实现
  private stopAtLastFrame(){
      this.skeCompGet.paused = true;
  }

  private playSecondAnimation(){
      this.skeCompCircle.setAnimation(0, "default2", true);
  }
  
  // update (dt) {}
}
