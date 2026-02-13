/*
 * @Author: jxgamestudio
 * @Description:  Setting View
 */


import { Global } from "../Global";
import { events } from "../enum/Enums";
import BaseView from "./BaseView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RoundView extends BaseView {

  @property([cc.Node])
  itemList: cc.Node[] = [];

  start() {

  }

  close() {
    super.close()
    this.node.destroy();
  }
  // update (dt) {}
}
