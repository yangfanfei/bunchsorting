/*
 * @Author: jxgamestudio
 * @Description: Global
 */

import { Key, SoundStatus, events } from "./enum/Enums";
import { Action, ToolInfos } from "./base/Interface";
import { getDate, load, save } from "./utils/Tools";
export class Global {
  static Debug = true;

  static bgm = SoundStatus.on;

  static sound = SoundStatus.on;

  static LoadingRate = 0;


  static enableShareAd = true;

  static start = false;

  static layer: cc.Node[] = [];
  /** current level */
  static lv = 1;
  /** max level */
  static maxLv = 300;
  /** current max level */
  static currentMaxLv = 1;
  /** max Tube */
  static maxTube = 15;
  /** one step action */
  static action_list: Array<Action> = [];
  /** record max step action */
  static action_step = 5;

  /*  init coin count  */
  static startCoin = 0;
  /*  current coin count  */
  static currentCoin = 0;
  /*  fnish one tube award coin count */
  static tubeRewardCoin = 5;
  /*  finish one level award coin count  */
  static rewardCoin = 10;
  /*  finish one level award coin count  */ 
  static watchAdReward = 50;

  static _receiveList: string[] = []

  static get receiveList(): string[] {
    return Global._receiveList
  }

  static set receiveList(v: string[]) {
    this._receiveList = v;
  }


  static setReceiveList(value: string) {
    Global._receiveList.push(value)
    this.saveReceiveListLocal()
  }
  static saveReceiveListLocal() {
    save(Key.ReceiveList, JSON.stringify(Global._receiveList));
    save(Key.ReceiveListTime, getDate());
  }
  static clearReceiveList() {
    Global._receiveList = []
    this.saveReceiveListLocal()
  }
  static _toolSetting = {
    /** reset */
    reset: 1,
    /** fall back */
    back: 1,
    /** add tube */
    tube: 1,
  };

  /** cup config */
  static _cupSetting = {
    haveList: ['01'],
    current: '01',
  };
  static _codeList: string[] = []

  static get codeList(): string[] {
    return this._codeList
  }
  static setCodeList(value: string) {
    this._codeList.push(value)
    save(Key.CodeList, JSON.stringify(this._codeList));
  }
  static set codeList(value) {
    this._codeList = value;
  }
  static get cupSetting() {
    return this._cupSetting;
  }
  static set cupSetting(value) {
    this._cupSetting = value;
  }
  static setCupCurrent(val) {
    //console.log(" Set Cup Current::: ",val);
    Global._cupSetting.current = val == Global._cupSetting.current ? null : val;
    save(Key.CupSetting, JSON.stringify(Global._cupSetting));
  }
  static setCupHavaList(val) {
    //console.log(" Set Cup Have List::: ",val);
    if (Global._cupSetting.haveList.includes(val)) return;
    Global._cupSetting.haveList.push(val);
    //console.log(" After Set Cup Have List::: ",Global._cupSetting.haveList);
    save(Key.CupSetting, JSON.stringify(Global._cupSetting));
  }
  static resetCupHaveList(){
    Global._cupSetting.haveList = ['01'];
    Global._cupSetting.current = "01";
  }

  /**
   * add Tool Setting
   */
  static addToolSetting(key: ToolInfos["key"], value: number) {
    this._toolSetting[key] += +value;
    save(Key.ToolSetting, JSON.stringify(this._toolSetting));
  }
  /**
   *  get Tool Setting
   * @returns
   */
  static getToolSetting(key: ToolInfos["key"]) {
    return +this._toolSetting[key];
  }
  /**
   * add Level
   */
  static addLv() {
    if (this.lv < this.maxLv) {
      this.lv++;
    }
    if(this.lv > this.currentMaxLv)
    {
      this.currentMaxLv = this.lv;
      save(Key.CurMaxLevel, this.currentMaxLv);
      console.log(" Save New Max Level::::: ",this.currentMaxLv);
    }
    save(Key.Lv, this.lv);
  }
  /**
   * Sub Level
   */
  static subLv() {
    if (this.lv > 1) {
      this.lv--;
    }
    save(Key.Lv, this.lv);
  }
  /**
   * Set Level
   * @param lv 
   */
  static setLv(lv: number) {
    if (lv > 0 && lv <= this.maxLv) {
      this.lv = lv;
    }
    save(Key.Lv, this.lv);
  }

  /**
   * AddCoin
   */
  static addCoin(number){
    this.currentCoin = this.currentCoin + number
    save(Key.CoinCount, this.currentCoin);
  }

  /**
   * SubCoin
   */
  static subCoin(number){
    if(number > this.currentCoin)
    {
      console.error("Sub coin is not enough ！！！！");
      return;
    }

    this.currentCoin = this.currentCoin - number;
    save(Key.CoinCount, this.currentCoin);
  }

  static getCurrentCoin(){
    return this.currentCoin;
  }

  /* used for game pause */
  static Pause(isPause = true) {
    cc.director.emit(events.Pause, isPause);
    Global.start = !isPause;
  }
}
