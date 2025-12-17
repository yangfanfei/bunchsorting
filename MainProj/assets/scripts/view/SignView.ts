/*
 * @Author: jxgamestudio
 * @Description:  Sign View
 */

import { Global } from "../Global";
import { Clips, Key, ui } from "../enum/Enums";
import { AccessType, SignInType, signInInfo } from "../base/Interface";
import ResMgr from "../manager/ResMgr";
import { getDate, load, Tools } from "../utils/Tools";
import BaseView from "./BaseView";
import GetItemView from "./GetItemView";
import SignItemView from "./SignItemView";
import { SoundMgr } from "../manager/SoundMgr";

const { ccclass, property } = cc._decorator;

// TODO:补签没测，广告分享没加
interface ISignItem {
  info: signInInfo[];
  signScript: SignItemView;
}
// 判断今天是周几
function getWeek(str?: string) {
  let date = str ? new Date(str) : new Date();
  let week = date.getDay();
  if (week === 0) {
    week = 7;
  }
  return week;
}
@ccclass
export default class SignView extends BaseView {
  // LIFE-CYCLE CALLBACKS:
  @property(cc.Prefab)
  itemPre: cc.Prefab = null;

  @property(cc.Prefab)
  fullPre: cc.Prefab = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Node)
  btnGrousp: cc.Node = null;

  @property(cc.SpriteFrame)
  coinSpr:cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  coinGetedSpr:cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  resetSpr:cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  backSpr:cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  bunchSpr:cc.SpriteFrame = null;


  async start() {
    // setTimeout(async () => {
    let json = ResMgr.ins.getJson("sign");

    let GetSignFirst = Global.loadSignFirst();
    //console.log(" SignView.Start:::::::  GetSignFirst::::  ",GetSignFirst);
    if(GetSignFirst == true)
    {
      await this.init(json.json.loop);
    }
    else
    {
      await this.init(json.json.first);
    }
    //await this.init(json.json.first);
    // }, 3000);
  }
  private todayItem: ISignItem = null;
  private allList: ISignItem[] = [];
  signTypes: SignInType[] = [];
  /**
   *  添加签到类型
   * @param type 签到类型
   */
  addSignType(type: SignInType) {
    //console.log(" SignView.AddSignType::: ",type);
    //Global.addSignArr(type);
    if (!this.signTypes.includes(type)) {
      this.signTypes.push(type);
    }
  }
  /**
   * 初始化
   * @param arr
   */
  init(arr: signInInfo[]) {
    let  SignData = Global.loadSignData()
    console.log("SignView. Init Info:::::  ",arr," currentData: ",getDate()," SignData: ",SignData);
    let signArr = Global.signArr;
    //if(signArr.length > 7){
    //  Global.saveSignFirst(true);
    //  Global.clearSignArr()
    //  console.log(" Clear.Data.......... ");
    //}
    //let week = getWeek();
    let week = signArr.length;
    if(getDate() != Global.loadSignData())
    {
      week = signArr.length+1;
    }
    if(week == 0)
    {
      week = 1
    }
    //let today = load(Key.Today, 0);
    // 清空签到记录 TODO:
    //if (!today || (week < getWeek(today))) {
    //  Global.clearSignArr();
    //}
    arr = arr.map((item) => {
      let isSign = Global.signArr.includes(item.type.toString());
      if (isSign) {
        this.addSignType(item.type);
      }
      return {
        ...item,
        isSign,
      };
    });
    // let len = arr.length;
    let fillList = arr.filter((item) => item.type === SignInType.FULL_WEEK);
    // 剔除满七天的
    arr = arr.filter((item) => item.type !== SignInType.FULL_WEEK);
    for (const item of arr) {
      this.addSignItem(item, week);
    }
    this.addFullWeek(fillList);

    //if(SignData == getDate())
    //{
    //  this.hideBtn()
    //}
    
    /*if (!this.todayItem) {
      this.hideBtn();
    }
    else if(this.todayItem){
      var  todayInfo = this.todayItem.info
      if(todayInfo[0].isSign == true)
      {
        this.hideBtn();
      }
    }*/
  }
  //   添加满七天的节点
  addFullWeek(fillList: signInInfo[]) {
    let full = cc.instantiate(this.fullPre);
    full.parent = this.content;
    let signItem = full.getComponent(SignItemView);
    this.allList.push({
      info: fillList,
      signScript: signItem,
    });
    
    let globalArr = Global.signArr;
    for (let i = 0; i < fillList.length; i++) {
      let item = fillList[i];
      let todaySignState = false;
      if(+item.type == 7)
      {
          if(getDate() == Global.loadSignData())
          {
            todaySignState = true;
          }
          else
          {
            todaySignState = false;
          }
      }
      else
      {
        todaySignState = false;
      }
      let spr:cc.SpriteFrame = this.coinSpr;
      if(item.key == "coin")
      {
        if(item.isSign == true)
        {
          spr = this.coinGetedSpr
        }
        else
        {
          spr = this.coinSpr;
        }
      }
      else if(item.key == "back")
      {
        spr = this.backSpr;
      }
      else if(item.key == "reset")
      {
        spr = this.resetSpr;
      }
      else if(item.key == "bunch")
      {
        spr = this.bunchSpr;
      }
      signItem.updateSignState(this.signTypes.length >= 7, spr);
      signItem.updateTodayState(this.signTypes.length == 6);
      signItem.setItemCount(item.num);
      signItem.setDayLabel(+item.type);
        if (todaySignState && globalArr.length >= 6) {
        console.log(" TodaySignState::::  ",todaySignState, " Item.Type::::  ",item.type);
        this.todayItem = {
          info: [item],
          signScript: signItem,
        };
      }
    }
  }
  /**
   *  添加普通节点
   * @param item  签到信息
   * @param week  今天是周几
   */
  addSignItem(item: signInInfo, week: number) {
    let node = cc.instantiate(this.itemPre);
    node.parent = this.content;
    let signItem = node.getComponent(SignItemView);
    this.allList.push({
      info: [item],
      signScript: signItem,
    });
    let todaySignState = false;
    if(+item.type == week)
    {
      todaySignState = true;
    }
    else
    {
      todaySignState = false;
    }
    //let todaySignState = (getDate() != Global.loadSignData())
    signItem.setDayLabel(+item.type);
    let spr:cc.SpriteFrame = this.coinSpr;
    if(item.key == "coin")
    {
      if(item.isSign == true)
      {
        spr = this.coinGetedSpr
      }
      else
      {
        spr = this.coinSpr;
      }
    }
    else if(item.key == "back")
    {
      spr = this.backSpr;
    }
    else if(item.key == "reset")
    {
      spr = this.resetSpr;
    }
    else if(item.key == "bunch")
    {
      spr = this.bunchSpr;
    }
    signItem.updateSignState(item.isSign, spr);
    //console.log(" AddSignItem:::  Item:::::::::",item," week:::: ",week);
    signItem.updateTodayState(todaySignState && item.isSign == false);
    signItem.setItemCount(item.num);
    if (todaySignState) {
      //console.log(" TodaySignState::::  ",todaySignState, " Item.Type::::  ",item.type);
      this.todayItem = {
        info: [item],
        signScript: signItem,
      };
    }
  }

  // 直接领取 按钮事件
  onGetBtnClick() {
    if (this.todayItem)
      this.getReward(this.todayItem.info, this.todayItem.signScript, false);
    //this.checkIsFullWeek();
    this.hideBtn();
  }
  // 领双份按钮事件
  onGetDoubleBtnClick() {
    function handle() {
      this.getReward(this.todayItem.info, this.todayItem.signScript, true);
      //this.checkIsFullWeek(true);
      this.hideBtn();
    }

    Global.clearSignArr();
    Global.saveSignFirst(false);
    Global.clearSignData();
    //super.showVideo(handle.bind(this));

    // TODO:视频 item.access === AccessType.Share
    // if (this.todayItem) {
    //   if (this.todayItem.info[0].access === AccessType.Share) {
    //     super.share(handle.bind(this));
    //   } else {
    //     super.showVideo(handle.bind(this));
    //   }
    // }
  }
  /**
   *  领取奖励方法
   * @param items  奖励列表
   * @param signItemScript  签到item脚本
   * @param isDouble  是否双倍
   */
  async getReward(
    items: signInInfo[],
    signItemScript: SignItemView,
    isDouble: boolean = false
  ) {
    // 已签到返回
    if (this.checkIsSign(items)) return;
    SoundMgr.ins.playSound(Clips.modal, 0.5);

    let infos = items.map((item) => {
      let id = item.id;
      item.num *= isDouble ? 2 : 1;
      // Global.signArr.push(id.toString());
      let spr = this.coinSpr;
      let sprGet = this.coinGetedSpr;
      if (item.key === 'coin') {
        Global.addCoin(item.num);
      }else if(item.key == "reset") {
        Global.addToolSetting("reset", 1);
        spr = this.resetSpr;
        sprGet = this.resetSpr;
      }else if(item.key == "back"){
        spr = this.backSpr;
        sprGet = this.backSpr
        Global.addToolSetting("back", 1);
      }else if(item.key == "bunch"){
        spr = this.bunchSpr;
        sprGet = this.bunchSpr
        Global.addToolSetting("bunch", 1);
      }
      // Global.addPropsSetting(item.key, +item.num);

      //propsView.parent = this.node;

      this.showGetItemView(spr,item.num);

      this.addSignType(item.type);
      Global.addSignArr(item.type);

      Global.saveSignData(getDate());

      if(item.id == 7)
      {
        Global.saveSignFirst(true);
        Global.clearSignArr()
        console.log(" Clear.Data.......... ");
      }
      //#region
      signItemScript.updateSignState(true,sprGet);
      signItemScript.updateTodayState(false);
      //#endregion
      return {
        id: id,
        label: item.label,
        key: item.key,
        num: item.num,
      };
    });
  }
  /**
   *  判断有没有领取过的
   * @param infos  签到信息
   * @returns
   */
  checkIsSign(infos: signInInfo[]) {
    return infos.some((item) => item.isSign);
  }
  /**
   *  检查是否满七天
   * @param isDouble 是否双倍
   * @returns
   */
  checkIsFullWeek(isDouble: boolean = false) {
    if (this.signTypes.length >= 7) {
      let fillList = this.allList.filter(
        (item) => item.info[0].type === SignInType.FULL_WEEK
      );
      // 判断是否已经领取
      for (const item of fillList) {
        // if (this.checkIsSign(item.info)) return;
        this.getReward(item.info, item.signScript, isDouble);
      }
    }
  }

  async showGetItemView(itemSpr:cc.SpriteFrame, count:number){
      SoundMgr.ins.playSound(Clips.modal, 0.5);

      const GetItemViewUI = await ResMgr.ins.getUI(
        ui.GetItemView
      );
      const itemViewScrpit = GetItemViewUI.getComponent(GetItemView);

      itemViewScrpit.setItemCount(count);
      itemViewScrpit.setPropImg(itemSpr);
      GetItemViewUI.parent = this.node;
  }

  /**
   * 按钮隐藏
   */
  hideBtn() {
    this.todayItem = null;
    this.btnGrousp.active = false;
  }
  close(): void {
    this.node.destroy();
  }
  // update (dt) {}
}
