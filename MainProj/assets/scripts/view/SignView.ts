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
import { SdkMgr } from "../sdk/SdkMgr";
import { FuncUtil } from "../base/FuncUtil";

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

    SdkMgr.showSignCustomAd()
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
    //console.log("SignView. Init Info:::::  ",arr," currentData: ",getDate()," SignData: ",SignData);
    let signArr = Global.signArr;
    //let week = getWeek();
    let week = signArr.length;
    if(getDate() != SignData)
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
    console.log("SignView. Init Info:::::  ",arr," currentData: ",getDate()," SignData: ",SignData," Week::: ",week);
    console.log("SignView. Global.signArr:::::::: ",Global.signArr);
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
    this.addFullWeek(fillList, week);

    if(this.todayItem)
    {
      let todayInfo = this.todayItem.info;
      if(todayInfo[0].isSign == true)
      {
        this.hideBtn();
      }
      console.log("  todayInfo::::::::::  ",todayInfo);
    }
    
  }
  //   添加满七天的节点
  addFullWeek(fillList: signInInfo[], week) {
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
      if(+item.type == week)
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

      let spr:cc.SpriteFrame =  FuncUtil.getSprFrameByItemType(item.key);
      let scale = this.getScaleByItemType(item.key);
      signItem.updateSignState(this.signTypes.length >= 7, spr, scale);
      signItem.updateTodayState(todaySignState);
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

  private getScaleByItemType(itemType:string)
  {
    let  scale = 0.65;
    if(itemType == "coin" || itemType == "luckyKey")
    {
      scale = 1;
    }

    return scale;

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
    let spr:cc.SpriteFrame = FuncUtil.getSprFrameByItemType(item.key);
    let scale = this.getScaleByItemType(item.key);
    signItem.updateSignState(item.isSign, spr, scale);
    console.log(" AddSignItem:::  Item:::::::::",item," week:::: ",week);
    signItem.updateTodayState(todaySignState && item.isSign == false);
    signItem.setItemCount(item.num);
    if (todaySignState) {
      console.log(" TodaySignState::::  ",todaySignState, " Item.Type::::  ",item.type);
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
    console.log("  onGetDoubleBtnClick .............. ");
    SdkMgr.showSignRewardAD((retValue) => {
          console.log(" onGetDoubleBtnClick.... retValue: ",retValue);
          if(retValue == 1)
          {
            this.getReward(this.todayItem.info, this.todayItem.signScript, true);
            //this.checkIsFullWeek(true);
            this.hideBtn();
          }
          else
          {
            this.getReward(this.todayItem.info, this.todayItem.signScript, false);
            //this.checkIsFullWeek(true);
            this.hideBtn();
          }
      })
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
      let sprGet = FuncUtil.getSprFrameByItemType(item.key);

      this.showGetItemView(item.key,item.num);
      this.addSignType(item.type);

      Global.addSignArr(item.type);
      Global.saveSignData(getDate());

      if(item.id == 7)
      {
        Global.saveSignFirst(true);
        Global.clearSignArr()
      }
      //#region
      let scale = this.getScaleByItemType(item.key);
      signItemScript.updateSignState(true,sprGet,scale);
      signItemScript.updateTodayState(false);
      //#endregion
      return {
        id: id,
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

  async showGetItemView(itemType:string, count:number){
      SoundMgr.ins.playSound(Clips.modal, 0.5);

      const GetItemViewUI = await ResMgr.ins.getUI(
        ui.GetItemView
      );
      const itemViewScrpit = GetItemViewUI.getComponent(GetItemView);
      console.log(" SignShowGetItemView ::::::  itemType: ",itemType," Count: ",count);
      itemViewScrpit.setItemType(itemType);
      itemViewScrpit.setItemCount(count);
      itemViewScrpit.sendReward();
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
    SdkMgr.hideSignCustomAd();
    this.node.destroy();
  }
  // update (dt) {}
}
