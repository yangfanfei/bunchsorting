/*
 * @Author: jxgamestudio
 * @Description: Main Logic
 */
import { Global } from "./Global";
import { Assets, Key, adConfig, events, shareConfig, shareVideoConfig, ui } from "./enum/Enums";
import { Tools, load } from "./utils/Tools";
import ResMgr from "./manager/ResMgr";
import { SdkMgr } from "./sdk/SdkMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {
  // LIFE-CYCLE CALLBACKS:

  @property({ type: cc.Integer, tooltip: "Max Level" })
  maxLevel = 300;

  @property({ type: cc.Integer, tooltip: "Current Level" })
  currentLevel = 5;

  /*@property({ type: adConfig, tooltip: "Ad Config" })
  Platforms: adConfig[] = [];

  @property({ type: shareConfig, tooltip: "Share Config" })
  Shares: shareConfig[] = [];

  @property({ type: shareVideoConfig, tooltip: "Share Video Config" })
  ShareVideoes: shareVideoConfig[] = [];*/

  public static ins: Main = null;

  onLoad() {
    cc.debug.setDisplayStats(false)
    this.loadData();
    this.initMgr();
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

  initMgr(){

  }

  // load all local data
  loadData() {
    Global.maxLv = this.maxLevel;
    let level = load(Key.Lv);
    if (!level) {
      level = this.currentLevel || 1;
    }
    Global.setLv(level);
    let curMaxLevel = load(Key.CurMaxLevel);
    let system = cc.sys.platform;
    console.log(" LoadData.CurMaxLevel:::: ",curMaxLevel," Current System:: ",system," OS.Window：： ",cc.sys.DESKTOP_BROWSER);
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

    const cupSetting = load(Key.CupSetting, 2);
    Global.cupSetting = cupSetting ? cupSetting : Global._cupSetting;
    const receiveList = load(Key.ReceiveList, 2);
    Global.receiveList = receiveList ? receiveList : Global._receiveList;

    const codeList = load(Key.CodeList, 2);
    Global.codeList = codeList ? codeList : Global._codeList;

    const currentCoin = load(Key.CoinCount)
    Global.currentCoin = currentCoin ? currentCoin : Global.currentCoin;

    // Global.setLv(this.currentLevel);
  }
  // update (dt) {}
}
