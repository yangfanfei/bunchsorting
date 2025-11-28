/*
 * @Author: jxgamestudio
 * @Description: shop view
 */

import { Global } from "../Global";
import { Clips, events, ui } from "../enum/Enums";
import { SoundMgr } from "../manager/SoundMgr";
import CoinMgr from "../manager/CoinMgr";
import ResMgr from "../manager/ResMgr";
import { scrollFunc } from "../utils/Tools";
import BaseView from "./BaseView";
import GetCupView from "./GetCupView";
import ShopItemView from "./ShopItemView";
import { SdkMgr } from "../sdk/SdkMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ShopView extends BaseView {
  @property([cc.SpriteFrame])
  cupsFrame: cc.SpriteFrame[] = [];

  @property(cc.Prefab)
  shopCardItem: cc.Prefab = null;

  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;
  @property(cc.Node)
  content: cc.Node = null;
  @property(cc.Label)
  costCoinLabel: cc.Label = null;
  @property(cc.Label)
  getCoinLabel: cc.Label = null;

  @property(cc.Integer)
  spacing: number = 20;

  @property(cc.Integer)
  rowNum: number = 2;
  // LIFE-CYCLE CALLBACKS:
  init(shopList: string[]) {
    //TODO:
    scrollFunc({
      list: shopList,
      spacing: this.spacing * 2,
      row: this.rowNum,
      scrollView: this.scrollView,
      content: this.content,
      receiveItemHeight: this.shopCardItem.data.height,
      cb: this.setPreFab.bind(this),
    });
  }
  shopItems: string[] = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

  setPreFab(item: string, i: number, list: string[]) {
    // console.log(item,'setPreFab');
    let setting, setFn, sprites;
      setting = Global.cupSetting;
      setFn = Global.setCupCurrent;
      sprites = this.cupsFrame;
    const cardItem = cc.instantiate(this.shopCardItem);
    const cardItemScript: ShopItemView =
      cardItem.getComponent(ShopItemView);
    const { current, haveList } = setting;

    cardItem.on("click", () => {
      const haveState = haveList.includes(item);
      if (!haveState || current == item) return;
      setFn(item);
      this.init(this.shopItems);
    });

    if (current == item) {
      cardItemScript.checkState("check");
      cardItem.getChildByName("node").getComponent(cc.Sprite).spriteFrame =
        sprites[+item.replace('C', '') - 1];
      cardItem.getChildByName("node").active = true;
    } else if (haveList.includes(item)) {
      cardItemScript.checkState("have");
      cardItem.getChildByName("node").getComponent(cc.Sprite).spriteFrame =
        sprites[+item.replace('C', '') - 1];
      cardItem.getChildByName("node").active = true;
    }
    cardItem.parent = this.content;
  }
  onLoad() {
     this.init(this.shopItems);
  }
  goBack(): void {
    super.close();
    this.node.destroy();
  }
  start() {
    this.setNeedCoinLabel();
    this.setGetCoinLabel();
  }

  getNeedCoin(){
    let  needCoin = 500;
    let len = Global.cupSetting.haveList.length;

    if(len > 6){  // large than six need 1000
      needCoin = 1000;
    }

    return needCoin;
  }

  setNeedCoinLabel(){
      let  needCoin = this.getNeedCoin();
      this.costCoinLabel.string = needCoin.toString();
  }

  setGetCoinLabel(){
    this.getCoinLabel.string = Global.watchAdReward.toString();
  }

  buyCupClick(){
      let  needCoin = this.getNeedCoin();
      let  currentCoin = Global.getCurrentCoin();
      let len = Global.cupSetting.haveList.length;

      this.costCoinLabel.string = needCoin.toString();

      let itemLen = this.shopItems.length;
      let newItem = (len+1).toString();
      if(len < 9)
      {
        newItem = "0" + newItem;
      }

      if(len >= itemLen){
        let tipText = "All cup is unlock.";
        cc.director.emit(events.Toast, tipText)
        return;
      }

      if(currentCoin < needCoin){
        let tipText = "Need " + needCoin + " coins.";
        cc.director.emit(events.Toast, tipText)
        return
      }
      
      this.showGetItemView(newItem,needCoin);
  }

  showRewardAd(){
    SdkMgr.showRewardAD(() => {
          Global.addCoin(50);
          CoinMgr.ins.setCoinLabel();
      })
  }

  async showGetItemView(newItem:string, needCoin:number){
      SoundMgr.ins.playSound(Clips.modal, 0.5);

      const GetCupViewUI = await ResMgr.ins.getUI(
        ui.GetCupView
      );
      const cupViewScrpit = GetCupViewUI.getComponent(GetCupView);

      cupViewScrpit.setTitleImg();
      let itemFrame = this.cupsFrame[Global.cupSetting.haveList.length]
      cupViewScrpit.setPropImg(itemFrame);
      GetCupViewUI.parent = this.node;

      Global.setCupHavaList( newItem );
      this.init(this.shopItems);
      Global.subCoin(needCoin);
      CoinMgr.ins.setCoinLabel();
  }

}
