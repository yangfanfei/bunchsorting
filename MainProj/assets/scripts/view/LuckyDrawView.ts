/*
 * @Author: jxgamestudio
 * @Description:  LuckyDrawView  幸运转盘
 */

import { Global } from "../Global";
import { Clips, ui, events } from "../enum/Enums";
import BaseView from "./BaseView";
import { randomNum } from "../base/Math";
import ResMgr from "../manager/ResMgr";
import RewardItem from "../game/RewardItem";
import { SoundMgr } from "../manager/SoundMgr";
import GetItemView from "./GetItemView";
import { FuncUtil } from "../base/FuncUtil";
import { SdkMgr } from "../sdk/SdkMgr";

const { ccclass, property } = cc._decorator;

/** RewardItem */
export class LuckyItem {
  itemType:string;
  itemCount:number;
  itemRate:number;
  randRangeMin:number;
  randRangeMax:number;
}

@ccclass
export default class LuckyDrawView extends BaseView {

  @property(cc.Node)
  rotateNode: cc.Node = null;

  @property([cc.Node])
  public rewardItems: cc.Node[] = [];

  @property(cc.Node)
  public btnItemIcon: cc.Node = null;

  @property(cc.Node)
  public btnItemCountLabel: cc.Node = null;

  @property(cc.Node)
  public btnAdIcon: cc.Node = null;

  @property(cc.Node)
  public btnShareIcon: cc.Node = null;

  @property(cc.Node)
  public btnDescLabel: cc.Node = null;

  @property(cc.Node)
  public itemLabelCount: cc.Node = null;

  private isInRotate:boolean = false;
  private isFirst:boolean = false;
  private lastBackAngle:number = 0;
  private jsonData:cc.JsonAsset;
  private luckyItems:LuckyItem[] = [];
  private randTotal:number = 0;
  private luckyKeyCount:number = 0;
  private oneDayCostArr:string[] = [];
  private currentCost:string = "";
  
  start() {
    this.isFirst = true;
    this.jsonData = ResMgr.ins.getJson("lucky");
    this.luckyKeyCount = Global.getToolSetting("luckyKey");
    this.luckyKeyCount = this.luckyKeyCount ? this.luckyKeyCount : 0;
    this.refreshPanelShow();
    SdkMgr.showLuckyDrawCustomAd()
  }

  private refreshItemCount()
  {
    this.itemLabelCount.getComponent(cc.Label).string = this.luckyKeyCount + "";
  }

  private refreshCostShow() 
  {
    if(this.currentCost == "luckyKey")
    {
      this.btnItemCountLabel.active = true;
      this.btnItemIcon.active = true;
      this.btnAdIcon.active = false;
      this.btnShareIcon.active = false;
    }
    else if(this.currentCost == "showAd")
    {
      this.btnItemCountLabel.active = false;
      this.btnItemIcon.active = false;
      this.btnAdIcon.active = true;
      this.btnShareIcon.active = false;
    }
    else if(this.currentCost == "share")
    {
      this.btnItemCountLabel.active = false;
      this.btnItemIcon.active = false;
      this.btnAdIcon.active = false;
      this.btnShareIcon.active = true;
    }
    else 
    {
      console.log(" 转盘消耗类型::::::::::::  ",this.currentCost);
    }
  }

  private initOneDayInfos()
  {
    if(this.oneDayCostArr.length == 0)
    {
      let cfgStr = this.jsonData.json.oneDayCost
      let cfgArrStr = cfgStr.split(";");
      Global.maxLuckyDrawTime = cfgArrStr.length
      this.oneDayCostArr = cfgArrStr;
      console.log("  oneDayConfig::: ",cfgStr," CfgArr::: ",cfgArrStr,"  MaxTimeOneDay: ",Global.maxLuckyDrawTime);
    }

    console.log(" Global.luckyDrawCount::::::::::::::: ",Global.luckyDrawCount);
    if(Global.luckyDrawCount >= this.oneDayCostArr.length)
    {
      this.currentCost = this.oneDayCostArr[this.oneDayCostArr.length-1]
    }
    else
    {
      this.currentCost = this.oneDayCostArr[Global.luckyDrawCount]
    }

    console.log(" 当前消耗的道具:::::  ",this.currentCost);
    if(this.luckyKeyCount > 0)
    {
      this.currentCost = "luckyKey";
      console.log("道具数量足够，改为使用道具");
    }

    this.refreshCostShow();
  }

  private initLuckyShow()
  {
    let count = this.jsonData.json.data.length;
    let randStart = 0;

    let luckyHistoryInfo = Global.luckyDrawHistory;
    let historyArr = luckyHistoryInfo.split(",");

    for(let i = 0; i < count; ++i)
    {
      let data = this.jsonData.json.data[i]
      let luckyItem:LuckyItem = new LuckyItem();
      let configStr = data.Key;
      let retItem = this.parseLuckyDrawConfig(configStr, Number(historyArr[i]));
      luckyItem.itemType = retItem.itemType;
      luckyItem.itemCount = Number(retItem.itemCount);
      luckyItem.itemRate = Number(retItem.itemRate);
      luckyItem.randRangeMin = randStart;
      luckyItem.randRangeMax = randStart + luckyItem.itemRate;
      randStart = randStart + luckyItem.itemRate;
      //console.log(" OneData:::::::::::: ",data," luckyItem: ",luckyItem)
      let rewardCtrl = this.rewardItems[i];
      let rewardCmp = rewardCtrl.getComponent(RewardItem);
      rewardCmp.setItemInfo(luckyItem.itemType, luckyItem.itemCount);
      this.luckyItems.push(luckyItem)
    }
    this.randTotal = randStart;
  }

  private refreshPanelShow(){
    this.refreshItemCount();
    this.initOneDayInfos();
    this.initLuckyShow();
  }

  private parseLuckyDrawConfig(conf:string, indexHistory:number)
  {
    let strArr1 = conf.split(";");
    if(indexHistory >= strArr1.length)
    {
      indexHistory = strArr1.length-1;
    }

    let strArr2 = strArr1[indexHistory];
    let dataArr = strArr2.split(",");
    return {
      itemType:dataArr[0],
      itemCount:dataArr[1],
      itemRate:dataArr[2]
    }
  }

  getDrawItem(randNum:number)
  {
    let selectItem = null;
    let index = 0;
    let selIndex = 0;
    this.luckyItems.forEach(item => {
      if(item.randRangeMin < randNum && item.randRangeMax >= randNum)
      {
        selectItem = item;
        selIndex = index;
        //console.log(" 随机道具 下限：",item.randRangeMin," 上限: ",item.randRangeMax," 随机数值: ",randNum);
      }
      index = index + 1;
    });

    return {
      item:selectItem,
      itemIndex:selIndex
    }
  }

  onConfirmClick()
  {
    if(this.isInRotate == true) return;

    if(Global.maxLuckyDrawTime <= Global.luckyDrawCount)
    {
      cc.director.emit(events.Toast, `今日抽取次数已达上限！`)
      return;
    }

    if(this.currentCost == "showAd")
    {
      SdkMgr.showLuckyDrawRewardAD((retValue) => {
        if(retValue == 1)
        {
          this.playLuckyDrawAnimation();
        }
      });
    }
    else if(this.currentCost == "share")
    {
      SdkMgr.shareFn(() => {
          console.log(" 分享回调 Share... Callback.");
          this.playLuckyDrawAnimation();
      })
    }
    else
    {
      this.playLuckyDrawAnimation();
    }
  }

  playLuckyDrawAnimation()
  {
    this.isInRotate = true;

    let  randCount = randomNum(0, this.randTotal);
    let  randomOffset = randomNum(0, 22);
    let  randomSign = randomNum(-1, 1)

    let  randomItemData = this.getDrawItem(randCount);
    let  offsetAngle = randomItemData.itemIndex*45 + randomSign*randomOffset
    //console.log("selectItem2.itemIndex: ",selectItem2.itemIndex," RandomOffset: ",randomOffset," RandomSign: ",randomSign," randomItem2:  ",randomItem2)
    
    let backAngle = 360 - offsetAngle
    /// toDo  添加指针回正逻辑
    if(this.isFirst == true)
    {
      cc.tween(this.rotateNode)
      .by(2.5, { angle: 1800 + offsetAngle }, { easing: 'quadOut' })  //// quadInOut circInOut
      .call(() => {
        this.isInRotate = false;
        this.lastBackAngle = backAngle;

        this.sendRewardItems(randomItemData.item)
        Global.luckyDrawCount = Global.luckyDrawCount + 1;
        Global.setLuckyDrawCount(Global.luckyDrawCount);
        Global.addLuckyDrawHistory(randomItemData.itemIndex);

        if(this.currentCost == "luckyKey")
        {
          Global.addToolSetting("luckyKey", -1);
          this.luckyKeyCount = this.luckyKeyCount - 1;
        }
        this.refreshPanelShow();
      })
      .start();
      this.isFirst  = false;
    }
    else
    {
      cc.tween(this.rotateNode)
      .by(0.1, { angle: this.lastBackAngle }, { easing: 'quadOut' }) 
      .delay(0.5)
      .by(2.5, { angle: 1800 + offsetAngle }, { easing: 'quadOut' })  //// quadInOut circInOut
      .call(() => {
        this.isInRotate = false;
        this.lastBackAngle = backAngle;

        this.sendRewardItems(randomItemData.item)
        Global.luckyDrawCount = Global.luckyDrawCount + 1;
        Global.setLuckyDrawCount(Global.luckyDrawCount);
        Global.addLuckyDrawHistory(randomItemData.itemIndex);

        if(this.currentCost == "luckyKey")
        {
          Global.addToolSetting("luckyKey", -1);
          this.luckyKeyCount = this.luckyKeyCount - 1;
        }
        this.refreshPanelShow();
      })
      .start();
    }
  }

  resetRotateNode()
  {
    cc.tween(this.rotateNode)
    .to(0.5, { angle: 0 })
    .call(() => {
      this.isInRotate = false;
    })
    .start();
  }

  async sendRewardItems(item:LuckyItem)
  {
    SoundMgr.ins.playSound(Clips.modal, 0.5)

    const GetItemViewUI = await ResMgr.ins.getUI(
      ui.GetItemView
    );

    const itemViewScrpit = GetItemViewUI.getComponent(GetItemView);
    itemViewScrpit.setItemType(item.itemType)
    itemViewScrpit.setItemCount(item.itemCount);
    itemViewScrpit.sendReward();
    GetItemViewUI.parent = this.node;
  }

  close() {
    SdkMgr.hideLuckyDrawCustomAd()
    super.close()
    this.node.destroy();
  }
  // update (dt) {}
}
