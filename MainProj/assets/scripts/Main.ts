/*
 * @Author: jxgamestudio
 * @Description: Main Logic
 */
import { Global } from "./Global";
import { Assets, Clips, Key, adConfig, events, shareConfig, shareVideoConfig, ui } from "./enum/Enums";
import { Tools, getDate, load } from "./utils/Tools";
import ResMgr from "./manager/ResMgr";
import { SdkMgr } from "./sdk/SdkMgr";
import { SoundMgr } from "./manager/SoundMgr";
import WXRecordManager from "./sdk/WX/WXRecordManager";
import UserDataMgr from "./manager/UserDataMgr";
import ConfigMgr from "./manager/ConfigMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {
  // LIFE-CYCLE CALLBACKS:

  @property({ type: cc.Integer, tooltip: "最大关卡" })
  maxLevel = 2000;

  @property({ type: cc.Integer, tooltip: "当前关卡" })
  currentLevel = 1;

  public static ins: Main = null;

  onLoad() {
    cc.debug.setDisplayStats(false)
    this.loadLocalData();
    Main.ins = this;
  }

  async start() {
    await this.loadRes();
  }

  async loadRes() {
    console.log("  Main.......LoadRes");
    Global.LoadingRate = 0.04
    await ResMgr.ins.loadBundle(1, 0.01);
    await ResMgr.ins.loadRes(1, Assets.Json, 0.03);
    await ResMgr.ins.loadRes(1, Assets.UiFrame, 0.1);
    await ResMgr.ins.loadRes(1, Assets.Sound, 0.2);
    
    await ResMgr.ins.loadRes(1, Assets.UiPrefab, 0.35);
    await ResMgr.ins.loadRes(1, Assets.CommonPrefab, 0.35);

    ResMgr.ins.getUI(ui.ToastView);
  }

  // load all local data
  loadLocalData() {
    Global.maxLv = this.maxLevel;
    let level = load(Key.Lv);
    if (!level) {
      level = this.currentLevel || 1;
    }
    Global.setLv(level);
    let curMaxLevel = load(Key.CurMaxLevel);
    if(!curMaxLevel){
      curMaxLevel = level;
      Global.currentMaxLv = curMaxLevel;
      console.log(" Current Max Level::: ",level);
    }
    else{
      Global.currentMaxLv = curMaxLevel;
    }

    let toolSetting = load(Key.ToolSetting, 2);

    Global._toolSetting = toolSetting ? toolSetting : Global._toolSetting;
    console.log("  Main.Load。。.........。 ToolSetting:::: ",Global._toolSetting);

    const cupSetting = load(Key.CupSetting, 2);
    Global.cupSetting = cupSetting ? cupSetting : Global._cupSetting;
    const receiveList = load(Key.ReceiveList, 2);
    Global.receiveList = receiveList ? receiveList : Global._receiveList;

    const codeList = load(Key.CodeList, 2);
    Global.codeList = codeList ? codeList : Global._codeList;

    const currentCoin = load(Key.CoinCount)
    Global.currentCoin = currentCoin ? currentCoin : Global.currentCoin;

    const drawCount =   load(Key.LuckyDrawCount, 1);
    Global.luckyDrawCount = drawCount ? drawCount : 2;

    const drawAdTime = load(Key.LuckyShowAdTime, 1);
    Global.luckyDrawAdTime = drawAdTime ? drawAdTime : Global.luckyDrawAdTime;
    //console.log(" loadData. ShowAdTime::::： ",drawAdTime," Global.showTime: ",Global.luckyDrawAdTime)

    const drawDate = load(Key.LuckyDrawTime, 0);
    const currentDate = getDate();

    Global.lastLuckyDrawTime = drawDate ? drawDate:Global.lastLuckyDrawTime

    const saveDrawHistory = load(Key.LuckyDrawHistory, 0);
    Global.luckyDrawHistory = saveDrawHistory ? saveDrawHistory:"0,0,0,0,0,0,0,0";
    console.log(" Save Draw History::::::::::  ",saveDrawHistory," LuckyDrawHistory::: ",Global.luckyDrawHistory);

    if(drawDate != currentDate)
    {
      //////////////// ToDo
      Global.luckyDrawCount = 0;
      Global.luckyDrawAdTime = 0;
      console.log(" 保存抽奖时间和 当前时间不同，重置次数")
    }
    else
    {
      //Global.luckyDrawCount = 0;
      //Global.setToolSettingValue("luckyKey", 0);
      console.log(" 保存时间与当前抽奖时间相同。。。。。。。。。。。。。。。。 ")
    }
  }

  onDestroy()
  {
    console.log("   Main::::::::::::  Destroy ");
    UserDataMgr.ins.clearIntervalTimer();
  }
  
  //update (dt) {
    //console.log("  Main. Update:::::::::  DT: ",dt);
  //}
}
