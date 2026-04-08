/*
 * @Author: jxgamestudio
 * @Description:  Setting View
 */


import { Global } from "../Global";
import { events } from "../enum/Enums";
import { SoundMgr } from "../manager/SoundMgr";
import BaseView from "./BaseView";
import ConfigMgr from "../manager/ConfigMgr";

const { ccclass, property } = cc._decorator;


@ccclass
export default class SettingView extends BaseView {
  @property(cc.Node)
  soundNode: cc.Node = null;

  @property(cc.Node)
  musicNode: cc.Node = null;

  start() {
    this.checkSoundSpriteFrame();
    this.checkMusicSpriteFrame();
  }

  checkSoundSpriteFrame() {
      if (Global.sound == 1) {
        this.soundNode.active = true;
      } else {
        this.soundNode.active = false;
      }
  }

  checkMusicSpriteFrame() {
      if (Global.bgm == 1) {
        this.musicNode.active = true;
      } else {
        this.musicNode.active = false;
      }
  }

  changeSound() {
    Global.sound *= -1;
    this.checkSoundSpriteFrame();
    cc.director.emit(events.ChangeSound, "sound");
  }

  changeMusic() {
    Global.bgm *= -1;
    this.checkMusicSpriteFrame();
    console.log("  ChangeMusic:::  bgmState:: ",Global.bgm);
    if(Global.bgm == 1)
    {
      SoundMgr.ins.playBackMusic(SoundMgr.ins.curLoopAudioName);
    }
    else
    {
      SoundMgr.ins.stopBackMusic();
    }
    cc.director.emit(events.ChangeMusic, "music");
  }

  close() {
    super.close()
    this.node.destroy();
  }
  // update (dt) {}
}
