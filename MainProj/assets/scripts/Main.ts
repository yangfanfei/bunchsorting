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

const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {
  // LIFE-CYCLE CALLBACKS:

  @property({ type: cc.Integer, tooltip: "Max Level" })
  maxLevel = 300;

  @property({ type: cc.Integer, tooltip: "Current Level" })
  currentLevel = 5;

  //@property({ type: adConfig, tooltip: "Ad Config" })
  //Platforms: adConfig[] = [];

  //@property({ type: shareConfig, tooltip: "Share Config" })
  //Shares: shareConfig[] = [];

  //@property({ type: shareVideoConfig, tooltip: "Share Video Config" })
  //ShareVideoes: shareVideoConfig[] = [];

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
    if(cc.sys.platform == cc.sys.WECHAT_GAME)
    {
        //console.log(" Platform in wechat....... ");
        /*if (typeof wx !== 'undefined' && wx.cloud) {
            wx.cloud.init({
                env: 'cloud1-6gmxh81sb3f93d53', // 替换为你的云环境ID，可以在云开发控制台获取
                traceUser: true      // 是否追踪用户
            });
            console.log('云开发初始化成功');
        } else {
            console.error('当前环境不支持云开发');
        }

        SdkMgr.login();
        this.loadGameData();*/
    }
  }

  // 加载游戏数据
  async loadGameData() {
      /*try {
          const db = wx.cloud.database();
          const result = await db.collection('UserInfo').get();
          console.log('游戏数据加载成功', result.data);
      } catch (error) {
          console.error('游戏数据加载失败', error);
      }*/
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
    //console.log(" LoadData.CurMaxLevel:::: ",curMaxLevel," Current System:: ",system," OS.Window：： ",cc.sys.DESKTOP_BROWSER);
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

    const drawCount =   load(Key.LuckyDrawCount, 1);
    //console.log(" LoadData. DrawCount:::::  ",drawCount);
    Global.luckyDrawCount = drawCount ? drawCount : 2;
    //console.log(" Global.DrawCount::::::::  ",Global.luckyDrawCount);

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
  // update (dt) {}
}
