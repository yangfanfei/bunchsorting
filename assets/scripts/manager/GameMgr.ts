/*
 * @Author: jxgamestudio
 * @Description: Game Manager
 */

import { Global } from "../Global";
import { Clips, events } from "../enum/Enums";
import { SoundMgr } from "./SoundMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameMgr extends cc.Component {

  start() {
    cc.director.on(events.Pour, this.onPour, this);
    cc.director.on(events.LevelFinish, this.onLevelFinish, this);
  }
  onDisable() {
    cc.director.off(events.Pour, this.onPour, this);
    cc.director.off(events.LevelFinish, this.onLevelFinish, this);
  }
  /**
   *
   */
  private onPour() {
    console.log('====================================');
    console.log('onPour');
    console.log('====================================');
  }
  /**
   * level finish
   */
  private onLevelFinish() {
    console.log('====================================');
    console.log('onLevelFinish');
    console.log('====================================');
    //SoundMgr.ins.playSound(Clips.Show_Victory);
  }
}
