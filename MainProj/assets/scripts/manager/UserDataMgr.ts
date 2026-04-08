/**
 * @Author: joey
 * @Date: 2026-04-03 11:49:41
 * @LastEditors: joey
 * @LastEditTime: 2026-04-03 11:49:41
 * @Description: 用户数据管理
 */

import { MAX_LIFE, RECOVER_LIFE_INTERVAL } from "../base/Const";
import { ShopItemStorageData } from "../base/Interface";
import { events, ShopItemState } from "../enum/Enums";
import { Global } from "../Global";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UserDataMgr  {

  private static _ins: UserDataMgr = null!;

  private life = 0;               //  当前体力
  private lifeIntervalId = null;  //  当前体力计时器
  private lifeTimeTick = 0;       //  计时器时间

  private accAdCount = 0;         //  累计看广告次数

  private activeDressUpItemList: Array<number> = [];         ///// 当前已经激活的皮肤道具
  private useDressUpItemList: Array<number> = [];            ///// 当前使用中的皮肤道具
  /**
   * 返回 用户数据 类的单例实例。
   */
  public static get ins() {
    if (!this._ins) {
      this._ins = new UserDataMgr();
      //this._ins.init();
    }

    return this._ins;
  }

  public init()
  {
    this.loadData();
    this.startLifeSchedule();
  }

  private loadData(){
    Global.loadLife();
    Global.loadAccAdCount();
    Global.loadLifeTimeTick();
    Global.loadActiveDressupItems();
    Global.loadUseDressupItems();
  }

  public setActiveDressUpItemsByStr(dataStr){
    console.log("setActiveDressUpItemsByStr:::::::: ",dataStr);
    this.activeDressUpItemList = [];

    if(dataStr == "default")    // 默认初始值
    {
      for(let i = 0; i < 12; ++i)
      {
        let oneData = i+1;
        //console.log(" setUseDressUpItemsByStr:: OneData: ",oneData,"  III: ",i," arr[i]: ",arr[i]);
        this.activeDressUpItemList.push(oneData);
      }
    }
    else
    {
      let arr = JSON.parse(dataStr)
      let count = arr.length;
      for(let i = 0; i < count; ++i)
      {
        let oneData = Number(arr[i]);
        //console.log(" setActiveDressUpItemsByStr:: OneData: ",oneData,"  III: ",i," arr[i]: ",arr[i]);
        this.activeDressUpItemList.push(oneData);
      }
    }

    console.log(" setActiveDressUpItemsByStr After ListData:::::::::: ",this.activeDressUpItemList);
  }

  public setActiveDressUpItems(dataArr){
    let count = dataArr.length;
    for(let i = 0; i < count; ++i)
    {
      let oneData = Number(dataArr[i]);
      this.activeDressUpItemList.push(oneData);
    }

    //console.log("  setActiveDressUpItems After ListData:::::::::: ",this.activeDressUpItemList);
  }

  public addToActiveDressUpItems(data){
    let id = Number(data);
    this.activeDressUpItemList.push(id)
    console.log(" addOne Data  To List::: ",id);
    console.log(" addToActiveDressupItems::::::: ",this.activeDressUpItemList);
    Global.saveActiveDressupItems(this.activeDressUpItemList);
  }

  public setUseDressUpItemsByStr(dataStr){
    //console.log("setUseDressUpItemsByStr:::::::: ",dataStr);
    this.useDressUpItemList = [];

    if(dataStr == "default") // 默认初始值
    {
      for(let i = 0; i < 12; ++i)
      {
        let oneData = i+1;
        //console.log(" setUseDressUpItemsByStr:: OneData: ",oneData,"  III: ",i," arr[i]: ",arr[i]);
        this.useDressUpItemList.push(oneData);
      }
    }
    else
    {
      let arr = JSON.parse(dataStr)
      let count = arr.length;
      for(let i = 0; i < count; ++i)
      {
        let oneData = Number(arr[i]);
        //console.log(" setUseDressUpItemsByStr:: OneData: ",oneData,"  III: ",i," arr[i]: ",arr[i]);
        this.useDressUpItemList.push(oneData);
      }
    }

    //console.log(" setUseDressUpItemsByStr After ListData:::::::::: ",this.useDressUpItemList);
  }

  public setUseDressUpItems(dataArr){
    let count = dataArr.length;
    for(let i = 0; i < count; ++i)
    {
      let oneData = Number(dataArr[i]);
      this.useDressUpItemList.push(oneData);
    }

    console.log("  setUseDressUpItems After ListData:::::::::: ",this.useDressUpItemList);
  }

  public setUserShopDressItems(dataArr)
  {
    console.log(" setUserShopDressItems::::::: ",dataArr);
  }

  public indexToActualColorId(colorIndex){
    if(colorIndex == 0) return 0;   ///0代表空串

    let colorID = this.useDressUpItemList[colorIndex-1]
    //console.log("  ColorINDEX :::::::::: ",colorIndex," ColorID:::: ",colorID);
    return colorID;
  }

  ///////// 参数是 iconID
  public changeUseDressUpItem(oldId, newId){
    console.log("  交换使用 ，老ID: ",oldId," 新ID: ",newId);
    //1... 首先判断这个new ID 是不是也在列表中
    let oldIndex = -1;
    let newIndex = -1;
    for(let i = 0 ; i < this.useDressUpItemList.length; ++i)
    {
      let data = this.useDressUpItemList[i];
      if(data == oldId)
      {
        oldIndex = i;
        console.log(" oldID::::::::: ",oldId," Index::::::: ",i);
      }
      if(data == newId)
      {
        newIndex = i
        console.log(" newID::::::::::: ",newId," Index::::::: ",i)
      }
    }

    console.log("  交换前：：：：：：：：：：：：：：：：：：：：：：：：  ",this.useDressUpItemList);
    //2... 如果NewID存在，替换 oldID 和  newID，不存在 直接覆盖到oldID的索引上。
    if(newIndex == -1)
    {
      //////// 直接覆盖
      this.useDressUpItemList[oldIndex] = Number(newId)
    }
    else
    {
      //////// Old New 交换
      this.useDressUpItemList[oldIndex] = Number(newId)
      this.useDressUpItemList[newIndex] = Number(oldId)
    }

    console.log("  交换后：：：：：：：：：：：：：：：：：：：：：： ",this.useDressUpItemList);
    Global.saveUseDressupItems(this.useDressUpItemList);
  }

  public getUseItemList(){
    return this.useDressUpItemList;
  }

  public isShopItemActive(id){
    let count = this.activeDressUpItemList.length;
    console.log(" activeDressUpItemList.Len:::: ",this.activeDressUpItemList.length);
    for(let i = 0; i < count; ++i)
    {
      let data = this.activeDressUpItemList[i]
      //console.log(" isShopItemActive ::::::::::  ID: ",id," ItemID: ",data);
      if(id == data)
      {
        return true;
      }
    }

    return false;
  }

  public setAccAdCount(val)
  {
    this.accAdCount = val;
    console.log(" SetAccADCount::::: ",val);
  }

  public adAccAdCountAndSave()
  {
    this.accAdCount = this.accAdCount + 1;
    Global.saveAccAdCount();
  }

  public getAccAdCount(){
    console.log(" GetAccADCount::::: ",this.accAdCount);
    return this.accAdCount;
  }

  public getCurrentLife(){
    console.log(" Get Current Life:::: ",this.life);
    return this.life;
  }

  public setLife(val ){
    this.life = val;
    console.log(" UserDataManager::::::::  SetLife: ",val);
    if(this.life < MAX_LIFE)
    {
      this.startLifeSchedule(); 
    }
    Global.saveLife(this.life);
  }

  public getLifeTimeTick(){
    return this.lifeTimeTick
  }

  public setLifeTimeTick(val ){
    this.lifeTimeTick = val;
  }

  public startLifeSchedule(){
    if(this.lifeIntervalId != null) return;

    this.lifeIntervalId = setInterval(() => {
      this.onTimerTick();
    }, 1000);
  }

  public clearIntervalTimer() {
      if (this.lifeIntervalId !== null) {
          clearInterval(this.lifeIntervalId);
          this.lifeIntervalId = null;
      }
  }
  
  private onTimerTick() {
    this.lifeTimeTick += 1;
    console.log(`Timer tick: ${this.lifeTimeTick}`);
    if(this.lifeTimeTick > RECOVER_LIFE_INTERVAL)
    {
      if(this.life < MAX_LIFE)
      {
        this.life = this.life + 1;
      }
      this.lifeTimeTick = 0;
      cc.director.emit(events.LifeChange);
      if(this.life >= MAX_LIFE)
      {
        this.clearIntervalTimer();
        console.log(" 停止生命计数TimeTick");
      }
      //console.log(" setLifeLabel....... SendEvent  Life: ",this.life,"  TimeTick:: ",this.lifeTimeTick);
    }
  }

}
