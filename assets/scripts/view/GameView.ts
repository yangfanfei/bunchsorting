/*
 * @Author: jxgamestudio
 * @Description: game view
 */

import { Global } from "../Global";
import { Clips, Key, events, ui } from "../enum/Enums";
import PropMgr from "../manager/PropMgr";
import { SoundMgr } from "../manager/SoundMgr";
import CoinMgr from "../manager/CoinMgr";
import CupMgr from "../manager/CupMgr";
import ResMgr from "../manager/ResMgr";
import { load, save } from "../utils/Tools";
import BaseView from "./BaseView";
import VictoryView from "./VictoryView";
import { SdkMgr } from "../sdk/SdkMgr";

interface Props {
  reset: number;
  back: number;
  tube: number;
}
const { ccclass, property } = cc._decorator;

@ccclass
export default class GameView extends BaseView {
  @property(cc.RichText)
  lvLabel: cc.RichText = null;

  @property(PropMgr)
  resetMgr: PropMgr = null;

  @property(PropMgr)
  backMgr: PropMgr = null;

  @property(PropMgr)
  tubeMgr: PropMgr = null;

  @property(cc.Prefab)
  coinPrefab: cc.Prefab = null;

  @property(cc.Node)
  effectRoot: cc.Node = null;

  @property(cc.Node)
  coinBgNode: cc.Node = null;
  @property(cc.Node)
  coinManagerNode: cc.Node = null;

  public static ins: GameView = null;
  public initLevel:number = Global.lv;
  private isAllFinish:boolean = false;

  onEnable() {
    cc.director.on(events.LevelFinish, this.GameResult, this);
    cc.director.on(events.LevelSelectChange, this.eventLevelChange, this);
    cc.director.on(events.AddBunch, this.toolCountChange, this);
    cc.director.on(events.Back, this.toolCountChange, this);
    cc.director.on(events.Reset, this.toolCountChange, this);
  }
  onDisable() {
    cc.director.off(events.LevelFinish, this.GameResult, this);
    cc.director.off(events.LevelSelectChange, this.eventLevelChange, this);
    cc.director.off(events.AddBunch, this.toolCountChange, this);
    cc.director.off(events.Back, this.toolCountChange, this);
    cc.director.off(events.Reset, this.toolCountChange, this);
  }

  start() {
    save('isPlayGame', true)
    GameView.ins = this;
    console.log(" GameView:::::::::::  Start.... ");
    CoinMgr.ins.setCoinLabel();
  }

  setAllFinish(val:boolean){
    this.isAllFinish = val;
  }

  setLvLabel(_lv?: number) {
    let lv = _lv;
    console.log(" _Lv:::: ",_lv,"  Global.Lv:::  ",Global.lv);
    if(_lv == null || _lv == 0)
    {
      lv = Global.lv;
    }
    this.lvLabel.string = `<b><color=#608bc1><outline color=#000000 width=2>level </outline></c><color=#FAFAFA><outline color=#000000 width=2>${lv}</outline></c></b>`; 
  }

  //#region 
  public onResetClick(e) {
    console.log(Global.getToolSetting("reset"));
    this.onceAdd = false
    if (Global.getToolSetting("reset") > 0) {
      Global.addToolSetting("reset", -1);
      cc.director.emit(events.Reset);
    } else {
        console.log(e.target);
        SdkMgr.showRewardAD(() => {
        cc.director.emit(events.Reset);
      });
    }
    this.setProps(Global._toolSetting);
  }

  /** fall back */
  public onBackClick(e) {
    if (!CupMgr.ins.checkCanUndo()) return;
    
    cc.director.emit(events.Back);
    if (Global.getToolSetting("back") > 0) {
      Global.addToolSetting("back", -1);
      cc.director.emit(events.Back);
    } else {
      //console.log(e.target);
      SdkMgr.showRewardAD(() => {
         cc.director.emit(events.Back);
      });
    }
    this.setProps(Global._toolSetting);
  }

  onceAdd = false
  /** add Tube */
  public onAddTubeClick(e: cc.Event.EventTouch) {
    if (this.onceAdd) {
      cc.director.emit(events.Toast, `Only add one tuber per level`)
      return
    }

   if (Global.getToolSetting("tube") > 0) {
      Global.addToolSetting("tube", -1);
      this.onceAdd = true
      cc.director.emit(events.AddBunch);
    } else {
      console.log(e.target);
      SdkMgr.showRewardAD(() => {
        this.onceAdd = true
        cc.director.emit(events.AddBunch);
      });
    }
    this.setProps(Global._toolSetting);
  }

  public onTimeStopClick(e: cc.Event.EventTouch) {
    console.log(e.target);
    //super.showVideo(() => {
    //  cc.director.emit(events.TimeStop);
    //});
  }

  public onBackMainClick(){
    super.close();
    this.node.destroy();
    cc.director.emit(events.BackToMain);
    console.log("  emit  BackMain Event. ");
  }

  //#endregion

    private tween: cc.Tween = null;
  public playCoinAnimation(cupNode:cc.Node)
  {
     let origPos = cupNode.position;
     let origWorldPos = cupNode.parent.convertToWorldSpaceAR(origPos);
     let coinNode = cc.instantiate(this.coinPrefab);
     let labelPos = CoinMgr.ins.getLabelPosition();
     let labelWorldPos2 = CoinMgr.ins.coinLabel.node.parent.convertToWorldSpaceAR(labelPos);
     let labelWorldPos3 = this.coinManagerNode.convertToWorldSpaceAR(labelWorldPos2);
     let labelDestNodePos = this.effectRoot.convertToNodeSpaceAR(labelWorldPos2);
     this.effectRoot.addChild(coinNode);
     /*console.log(" playCoinAnimation.origPos:: (",origPos.x,",",origPos.y,",",origPos.z,") labelOrigPos:: (",labelPos.x,",",labelPos.y,",",labelPos.z,")",
       "origWorldPos:: (",origWorldPos.x,",",origWorldPos.y,",",origWorldPos.z,")",
       "labelDestNodePos:: (",labelDestNodePos.x,",",labelDestNodePos.y,",",labelDestNodePos.z,")",
       "labelWorldPos2:: (",labelWorldPos2.x,",",labelWorldPos2.y,",",labelWorldPos2.z,")",
       "labelWorldPos3:: (",labelWorldPos3.x,",",labelWorldPos3.y,",",labelWorldPos3.z,")"
     );*/
     coinNode.position = origPos;
      this.tween = cc
        .tween(coinNode)
        .to(1, { x: labelPos.x, y: labelPos.y, angle: 360 }, { easing: 'quartIn' }) 
        .call(() => {
          this.tween = null; 
          coinNode.destroy();
          Global.addCoin(Global.tubeRewardCoin);
          CoinMgr.ins.setCoinLabel();
        })
        .start();
  }

  async GameResult() {
    if(this.isAllFinish == true){
      return;   
    }

    console.log(" GameView... GameResult::: ");
    this.onceAdd = false
    Global.addLv();
    this.init();
    SoundMgr.ins.playSound(Clips.Show_Victory);
    const view = await ResMgr.ins.getUI(ui.VictoryView);
    // cc.instantiate(view)
    cc.find("Canvas").addChild(view);
    view.getComponent(VictoryView).init();
    this.isAllFinish = true;
  }
  
  init(_lv?: number) {
    this.initLevel = _lv;
    if(_lv != null)
    {
      Global.lv = _lv;      
    }

    this.setLvLabel(_lv);
    let toolSetting = load(Key.ToolSetting, 2);
    Global._toolSetting = toolSetting ? toolSetting : Global._toolSetting;
    // TODO:
    this.setProps(Global._toolSetting);
  }

  async onLevelClick(){
    const view = await ResMgr.ins.getUI(ui.LevelView);
    view.parent = this.node.parent;
  }

  toolCountChange(){
    this.setProps(Global._toolSetting);
  }

  setProps(props: Props) {
    this.resetMgr.setNum(props.reset);
    this.backMgr.setNum(props.back);
    this.tubeMgr.setNum(props.tube);
  }

  eventLevelChange(){
    this.setLvLabel();
  }
}
