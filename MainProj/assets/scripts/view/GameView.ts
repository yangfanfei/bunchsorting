/*
 * @Author: jxgamestudio
 * @Description: game view
 */

import { Global } from "../Global";
import { Clips, Key, events, ui } from "../enum/Enums";
import PropMgr from "../manager/PropMgr";
import { SoundMgr } from "../manager/SoundMgr";
import ResMgr from "../manager/ResMgr";
import { load, save } from "../utils/Tools";
import BaseView from "./BaseView";
import VictoryView from "./VictoryView";
import { SdkMgr } from "../sdk/SdkMgr";
import GameMgr from "../manager/GameMgr";
import UserDataMgr from "../manager/UserDataMgr";

interface Props {
  reset: number;
  back: number;
  bunch: number;
  finish: number;
}
const { ccclass, property } = cc._decorator;

@ccclass
export default class GameView extends BaseView {

  @property(PropMgr)
  backMgr: PropMgr = null;

  @property(PropMgr)
  bunchMgr: PropMgr = null;

  @property(PropMgr)
  finishMgr: PropMgr = null;

  @property(cc.Prefab)
  coinPrefab: cc.Prefab = null;

  @property(cc.Node)
  effectRoot: cc.Node = null;

  @property(cc.Label)
  labLevel:cc.Label = null;

  public static ins: GameView = null;
  public initLevel:number = Global.lv;
  private isAllFinish:boolean = false;
  public coinLabelTest:cc.Label = null;

  onEnable() {
    cc.director.on(events.LevelFinish, this.GameResult, this);
    cc.director.on(events.LevelSelectChange, this.eventLevelChange, this);
    cc.director.on(events.AddBunch, this.toolCountChange, this);
    cc.director.on(events.Back, this.toolCountChange, this);
    cc.director.on(events.Finish, this.toolCountChange, this);
    cc.director.on(events.ToolItemChange, this.toolCountChange, this);
  }
  onDisable() {
    cc.director.off(events.LevelFinish, this.GameResult, this);
    cc.director.off(events.LevelSelectChange, this.eventLevelChange, this);
    cc.director.off(events.AddBunch, this.toolCountChange, this);
    cc.director.off(events.Back, this.toolCountChange, this);
    cc.director.off(events.Finish, this.toolCountChange, this);
    cc.director.off(events.ToolItemChange, this.toolCountChange, this);
  }

  start() {
    console.log("  GameView/////////// Start/// ");
    save('isPlayGame', true)
    GameView.ins = this;
    this.toolCountChange();
    this.setLevelLabel();
    SoundMgr.ins.playBackMusic(Clips.back_inGame);
  }

  setAllFinish(val:boolean){
    this.isAllFinish = val;
  }

  setLevelLabel(){
    this.labLevel.string = "第" + Global.lv + "关";
  }

  addTool(){
   // Global.addToolSetting("back", 1);
   //Global.addToolSetting("bunch", 1);
    //Global.addToolSetting("finish", 1);
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
        SdkMgr.showRewardAD((retValue) => {
        if(retValue == 1)
        {
          //cc.director.emit(events.Reset);
          Global.addToolSetting("reset", 1);
          this.setProps(Global._toolSetting);
          UserDataMgr.ins.adAccAdCountAndSave();
        }
      });
    }
    this.setProps(Global._toolSetting);
  }

  /** fall back */
  public onBackClick(e) {
    if (!GameMgr.ins.checkCanUndo()) return;
    
    if (Global.getToolSetting("back") > 0) {
      Global.addToolSetting("back", -1);
      cc.director.emit(events.Back);
    } else {
      //console.log(e.target);
      SdkMgr.showBackRewardAD((retValue) => {
        if(retValue == 1)
        {
          //cc.director.emit(events.Back);
          Global.addToolSetting("back", 1);
          this.setProps(Global._toolSetting);
          UserDataMgr.ins.adAccAdCountAndSave();
        }
      });
    }

    this.setProps(Global._toolSetting);
  }

  onceAdd = false
  public onAddBunchClick(e: cc.Event.EventTouch) {
    if (this.onceAdd) {
      cc.director.emit(events.Toast, `每局只能加一次串！`)
      return
    }

   if (Global.getToolSetting("bunch") > 0) {
      Global.addToolSetting("bunch", -1);
      this.onceAdd = true
      cc.director.emit(events.AddBunch);
    } else {
      console.log(e.target);
      //SdkMgr.showBunchRewardAD((retValue) => {
      //  if(retValue == 1)
        {
          this.onceAdd = true
          cc.director.emit(events.AddBunch);
      //    Global.addToolSetting("bunch", 1);
      //    this.setProps(Global._toolSetting);
      //    UserDataMgr.ins.adAccAdCountAndSave();
        }
      //});
    }
    this.setProps(Global._toolSetting);
  }

  public onFinishClick(e:cc.Event.EventTouch){
    if (Global.getToolSetting("finish") > 0) {
      Global.addToolSetting("finish", -1);
      console.log(" Btn.Click...  Finish...");
      //cc.director.emit(events.LevelFinish);
      GameMgr.ins.randomRemoveColor();
    } else {
      console.log(e.target);
      SdkMgr.showFinishRewardAD((retValue) => {
        if(retValue == 1)
        {
          //GameMgr.ins.randomRemoveColor();
          //cc.director.emit(events.LevelFinish);
          Global.addToolSetting("finish", 1);
          this.setProps(Global._toolSetting);
          UserDataMgr.ins.adAccAdCountAndSave();
        }
      });
    }
    this.setProps(Global._toolSetting);
  }

  public onBackMainClick(){
    GameMgr.ins.setInGame(false);
    super.close();
    this.node.destroy();
    cc.director.emit(events.BackToMain);
    console.log("  emit  BackMain Event. ");
  }

  public onBGClick(){
    this.setGuideStateHide();
  }

  async GameResult() {
    if(this.isAllFinish == true){
      return;   
    }

    //console.log(" GameView... GameResult::: ");
    this.onceAdd = false
    Global.addLv();
    this.init();
    SoundMgr.ins.playSound(Clips.Show_Victory);
    const view = await ResMgr.ins.getUI(ui.VictoryView);

    cc.find("Canvas").addChild(view);
    view.getComponent(VictoryView).init();
    view.getComponent(VictoryView).setLevel(Global.lv);
    this.isAllFinish = true;
    this.setLevelLabel();
  }
  
  init(_lv?: number) {
    this.initLevel = _lv;
    if(_lv != null)
    {
      Global.lv = _lv;
    }
    
    //let toolSetting = load(Key.ToolSetting, 2);
    //Global._toolSetting = toolSetting ? toolSetting : Global._toolSetting;
    // TODO:
    //this.setProps(Global._toolSetting);
  }

  toolCountChange(){
    //console.log("  ToolCountChange: ToolSetting:::: ",Global._toolSetting)
    this.setProps(Global._toolSetting);
  }

  setProps(props: Props) {
    console.log("  SetProps: setProps:::: ",props)
    this.bunchMgr.setNum(props.bunch);
    this.backMgr.setNum(props.back);
    this.finishMgr.setNum(props.finish);
  }

  eventLevelChange(){
    this.setLevelLabel();
  }

  checkShowGuide(){
    if(this.backMgr.checkGuideState() == false)
    {
      if(this.bunchMgr.checkGuideState() == false)
      {
        if(this.finishMgr.checkGuideState() == false)
        {

        }
      }
    }
  }

  setGuideStateHide(){
    this.backMgr.hideGuideState();
    this.bunchMgr.hideGuideState();
    this.finishMgr.hideGuideState();
  }
}
