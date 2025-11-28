/*
 * @Author: jxgamestudio
 * @Description: Sound Manager
 */

import { Global } from "../Global";
import ResMgr from "./ResMgr";
import { SoundStatus } from "../enum/Enums";

/**
 * Sound Manager Class
 */
export class SoundMgr {
  /**
   * 播放单个音频剪辑
   */
  private _audioComp: cc.AudioSource = null;
  /**
   * 当前正在播放的循环音频剪辑的名称。
   */
  private _curLoopAudioName: string = "";

  private static _ins: SoundMgr = null!;

  /**
   * 返回 AudioMgr 类的单例实例。
   */
  public static get ins() {
    if (!this._ins) {
      this._ins = new SoundMgr();
      this._ins.initAudio();
    }

    return this._ins;
  }
  /**
   * 初始化 AudioMgr 类使用的音频组件。
   */
  private initAudio() {
    this._audioComp = new cc.AudioSource();
    this._audioComp.loop = true;
  }

  /**
   * 停止播放音乐
   */
  public stopSound() {
    this._audioComp.stop();
  }

  /**
   * 播放音效
   * @param {string} audio 音频文件名
   * @param {number} scale 音量缩放比例
   */
  public async playSound(audio: string, scale = 1) {
    if (Global.sound == SoundStatus.off) return;
    if(this._audioComp)this.stopSound()
    let clip = await ResMgr.ins.getClip(audio);
    var audioID = cc.audioEngine.play(clip, false, scale);
  }

  /**
   * 获取当前循环音效的文件名
   * @returns {string} 当前循环音效的文件名
   */
  public get curLoopAudioName(): string {
    return this._curLoopAudioName;
  }

  // 指定时间播放音效
  public async playSoundAtTime(audio: string, time: number) {
    if (Global.sound == SoundStatus.off) return;
    let clip = await ResMgr.ins.getClip(audio);
    var audioID = cc.audioEngine.play(clip, false, 1);
    this._audioComp.clip = clip;
    this._audioComp.play();
    this._audioComp.scheduleOnce(() => {
      cc.audioEngine.stop(audioID);
      this._audioComp.stop();
    }, time*2);
  }
}
