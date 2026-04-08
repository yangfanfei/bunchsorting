/*
 * @Author: jxgamestudio
 * @Description: Global
 */

import { Key, SoundStatus, events } from "./enum/Enums";
import { Action, ShopItemStorageData, ToolInfos } from "./base/Interface";
import { getDate, load, save } from "./utils/Tools";
import { LinkType, SubContent } from "./sdk/WX/SubContent";
import WXRecordManager from "./sdk/WX/WXRecordManager";
import UserDataMgr from "./manager/UserDataMgr";
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
  static maxLv = 2000;
  /** current max level */
  static currentMaxLv = 1;
  /** one step action */
  static action_list: Array<Action> = [];
  /** record max step action */
  static action_step = 5;

  /*  current coin count  */
  static currentCoin = 0;
  /*  fnish one tube award coin count */
  static tubeRewardCoin = 5;
  /*  finish one level award coin count  */
  static rewardCoin = 10;
  /*  finish one level award coin count  */ 
  static watchAdReward = 50;
  /*  lucky draw count */ 
  static luckyDrawCount = 0;
  /*  lucky draw show Ad time */ 
  static luckyDrawAdTime = 0;
  /*  max lucky draw count per day*/ 
  static maxLuckyDrawTime = 0;
  /*  上一次转盘的时间  */ 
  static lastLuckyDrawTime = "";
  /*  转盘的抽奖历史记录  */
  static luckyDrawHistory = ""; 

  static _receiveList: string[] = []

  static get receiveList(): string[] {
    return Global._receiveList
  }

  static set receiveList(v: string[]) {
    this._receiveList = v;
  }

  static _toolSetting = {
    /** reset */
    reset: 1,
    /** fall back */
    back: 1,
    /** add bunch */
    bunch: 1,
    /** finish */
    finish: 1,
    /** lucky Key */
    luckyKey: 1,
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

  static setLuckyDrawCount(value:number){
    this.luckyDrawCount = value;
    if(this.luckyDrawCount == 1)  // 每日首次抽取后记录时间，方便次日刷新
    {
      save(Key.LuckyDrawTime, getDate());
      //console.log("  保存抽奖时间::::::::  ",getDate())
    }
    save(Key.LuckyDrawCount, this.luckyDrawCount);
  }

  static loadLuckyDrawCount(){
    let drawCount = load(Key.LuckyDrawCount, 1)
    this.luckyDrawCount = drawCount;
  }

  static addLuckyDrawHistory(addIndex:number){
    //console.log(" AddLuckyDrawHistory:::::::  Index:: ",addIndex);
    let addBeforeArr = this.luckyDrawHistory.split(",");
    //console.log("Add HistoryBefore &&&&& LuckDrawHistory: ",this.luckyDrawHistory,"  ARR: ",addBeforeArr," Add.Index:::::: ",addIndex);
    let currentCount = Number(addBeforeArr[addIndex]);
    currentCount = currentCount+1;
    addBeforeArr[addIndex] = currentCount+"";

    let tSr = "";
    for(let i = 0; i < addBeforeArr.length; ++i)
    {
      tSr += addBeforeArr[i];
      if(i != addBeforeArr.length-1)
      {
        tSr += ","
      }
    }

    this.luckyDrawHistory = tSr;
    save(Key.LuckyDrawHistory, this.luckyDrawHistory);
    console.log(" addLuckyDrawHistory.After &&&&& ",tSr);
  }

  static saveLuckyDrawHistory(){
    save(Key.LuckyDrawHistory, this.luckyDrawHistory);
    //console.log(" LuckyDraw History:::::::::  ", this.luckyDrawHistory);
  }

  static setReceiveList(value: string) {
    Global._receiveList.push(value)
    this.saveReceiveListLocal()
  }

  static clearLuckyDrawData(){
    this.luckyDrawCount = 0;
    this.luckyDrawAdTime = 0;
    this.lastLuckyDrawTime = "";

    save(Key.LuckyDrawCount, 0);
    save(Key.LuckyDrawTime,"");
    save(Key.LuckyShowAdTime, 0);
  }

  static saveReceiveListLocal() {
    save(Key.ReceiveList, JSON.stringify(Global._receiveList));
    save(Key.ReceiveListTime, getDate());
  }

  static clearReceiveList() {
    Global._receiveList = []
    this.saveReceiveListLocal()
  }

  /**
   * add Tool Setting
   */
  static addToolSetting(key: ToolInfos["key"], value: number) {
    this._toolSetting[key] += +value;
    //console.log(" addToolSetting::::::::::  ",key, " Value::::: ",value, " this._toolSetting[key] .Value: ",this._toolSetting[key]);
    save(Key.ToolSetting, JSON.stringify(this._toolSetting));
    //WXRecordManager.ins.updateUserToolInfo();
    //console.log("  addToolSetting:::: KEY::: ",key," Value::: ",value, " this._toolSetting:::: ",this._toolSetting)
  }

  /**
   * get Tool Setting
   * @returns
   */
  static getToolSetting(key: ToolInfos["key"]) {
    return +this._toolSetting[key];
  }

  static setToolSettingToZero(key: ToolInfos["key"]){
    this._toolSetting[key] = 0;
    save(Key.ToolSetting, JSON.stringify(this._toolSetting));
    //console.log(" setToolSettingToZero::::::::: ",this._toolSetting);
  }

  static setToolSettingValue(key: ToolInfos["key"], value:number){
    this._toolSetting[key] = value;
    save(Key.ToolSetting, JSON.stringify(this._toolSetting));
    //console.log(" setToolSettingValue:::::::  ",this._toolSetting);
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
      SubContent.setMaxLevel(this.currentMaxLv);
      console.log(" Save New Max Level::::: ",this.currentMaxLv);
    }
    save(Key.Lv, this.lv);
    //WXRecordManager.ins.updateUserLevel(this.lv);
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

  static saveLife(life:number){
    save(Key.CurrentLife, life);
    console.log("  Save  Life:::::::  ",life);
  }

  static loadLife()
  {
    let data = load(Key.CurrentLife, 1)
    //console.log(" Global  Load  Life:::::::: ",data);
    data = data ? data:90;    //默认90
    UserDataMgr.ins.setLife(data);
  }

  static saveLifeTimeTick(timeTick:number){
    save(Key.LifeTimeTick, timeTick);
    //console.log(" Save Life Time Tick::: ",timeTick);
  }

  static loadLifeTimeTick(){
    let data = load(Key.LifeTimeTick, 1)
    //console.log(" Global  Load  Life:::::::: ",data);
    data = data ? data:0;
    UserDataMgr.ins.setLifeTimeTick(data);
  }

  static loadActiveDressupItems(){
    let data = load(Key.ActiveDressupItems, 0);
    console.log("loadActiveDressupItems::: DATA:  ",data);
    data = data?data:"default";
    UserDataMgr.ins.setActiveDressUpItemsByStr(data);
  }

  static saveActiveDressupItems(datas){
    console.log(" save Active DressUp Datas::::::::: ",datas);
    console.log(" JSON::::::::::::  ",datas);
    save(Key.ActiveDressupItems, JSON.stringify(datas));
  }

  static loadUseDressupItems(){
    let data = load(Key.UseDressupItems, 0)
    data = data?data:"default";
    console.log("loadUseDressupItems::: DATA:  ",data);
    UserDataMgr.ins.setUseDressUpItemsByStr(data);
  }

  static clearActiveItems()
  {
    save(Key.ActiveDressupItems, null);
  }

  static saveUseDressupItems(data){
    //console.log(" Save Use Dress Up Items:::: ",data);
    //console.log(" Save... JSON:::: ",JSON.stringify(data));
    save(Key.UseDressupItems, JSON.stringify(data));
  }

  static loadAccAdCount()
  {
    let data = load(Key.AccAdCount, 1);
    data = data?data:0
    UserDataMgr.ins.setAccAdCount(data);
  }

  static saveAccAdCount()
  {
    let val = UserDataMgr.ins.getAccAdCount();
    //console.log("Save Acc Ad Count::::::: ",val);
    save(Key.AccAdCount, val);
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

    //WXRecordManager.ins.updateUserCoin(this.currentCoin);
  }

  static getCurrentCoin(){
    return this.currentCoin;
  }

    /** 已签到的数组 */
  static _signArr: string[] = [];
  static get signArr() {
    if (Global._signArr.length === 0) {
      Global._signArr = load(Key.SignArr, 2) || [];
    }
    //console.log(" Load.SignArr:::::  ",Global._signArr);
    return Global._signArr;
  }

  static set signArr(arr: string[]) {
    Global._signArr = arr;
    //console.log(" Set.SignArr:::::  ",Global._signArr);
    save(Key.SignArr, JSON.stringify(arr));
  }

  /** 添加到已签到的数组 */
  static addSignArr(id: string) {
    save(Key.Today, getDate());
    let arr = this._signArr;
    arr.push(id);
    this.signArr = arr.slice()
    //console.log(" Add.SignArr:::::: ",this.signArr);
  }
  
  /** 清空已签到的数组 */
  static clearSignArr() {
    //console.log(" Clear.SignArr::::::::: ");
    this.signArr = [];
  }

  /* used for game pause */
  static Pause(isPause = true) {
    cc.director.emit(events.Pause, isPause);
    Global.start = !isPause;
  }

  static loadSignFirst(){
    let data = load(Key.SignFirst)
    return data != null
  }

  static saveSignFirst(val:boolean){
    save(Key.SignFirst, val);
  }

  static loadSignData(){
    let signData = load(Key.SignDate, 0)
    return signData
  }

  static saveSignData(saveStr:String){
    //console.log(" SaveSignData::::::::::: ",saveStr);
    save(Key.SignDate, saveStr);
  }

  static clearSignData(){
    save(Key.SignDate, "");
  }
}
