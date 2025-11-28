/*
 * @Author: jxgamestudio
 * @Description: 加载控件
 */

import { Global } from "../Global";
import { ui } from "../enum/Enums";
import ResMgr from "../manager/ResMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoadCtrl extends cc.Component {
  @property(cc.ProgressBar)
  load: cc.ProgressBar = null;

  @property(cc.Node)
  loadingNode: cc.Node = null;

  private isload = true;

  async closeLoad() {
    const view = await ResMgr.ins.getUI(ui.MainView);
    view.parent = this.node.parent;
    this.isload = false;
    this.loadingNode.active = false;

    this.node.destroy();
  }
  once = false
  update(deltaTime: number) {
    if (!this.isload) return;
    this.load.progress = Global.LoadingRate;
    if (Global.LoadingRate >= 0.99 && !this.once) {
      this.once = true;
      this.closeLoad();
    }
  }
}
