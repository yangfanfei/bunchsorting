/*
 * @Author: jxgamestudio
 * @Description: rewardManager
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class PropBlockMgr extends cc.Component {
  @property(cc.Label)
  label: cc.Label = null;

  @property(cc.Boolean)
  labelShow: boolean = true;

  start() {
    if (!this.labelShow) {
      this.label.node.active = false;
    }
    this.setLabelColor(new cc.Color(255, 255, 255));
    this.setLabelFontSize(25)
  }

  setLabel(str: string) {
    this.label.string = str;
  }
  setLabelColor(color: cc.Color) {
    this.label.node.color = color;
  }
  setLabelFontSize(num: number) {
    this.label.fontSize = num;
  }
  // update (dt) {}
}
