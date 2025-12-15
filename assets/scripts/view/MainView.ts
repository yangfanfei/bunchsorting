/*
 * @Author: jxgamestudio
 * @Description: main view
 */
import BaseView from "./BaseView";
import GameView from "./GameView";
import ResMgr from "../manager/ResMgr";
import { Global } from "../Global";
import { events, ui } from "../enum/Enums";
import { SdkMgr } from "../sdk/SdkMgr";
import SignView from "./SignView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainView extends BaseView {

    @property(cc.Label)
    coinLabel: cc.Label = null;
    //@property(cc.Node)
    //content: cc.Node = null;
    @property(cc.Label)
    lvLabel: cc.Label = null;

    public static ins: MainView = null;

    onEnable() {
      cc.director.on(events.LevelSelectChange, this.eventLevelChange, this);
      cc.director.on(events.BackToMain, this.eventBackToMain, this);
    }
    onDisable() {
      cc.director.off(events.LevelSelectChange, this.eventLevelChange, this);
      cc.director.off(events.BackToMain, this.eventBackToMain, this);
    }

    start () {
      this.setLvLabel();
      this.setCoinLabel();
      MainView.ins = this;
    }

    setLvLabel(_lv?: number) {
      let lv = _lv;
      //console.log(" MainView.Set LV: ",_lv,"  Global.LV:: ",Global.lv)
      if(_lv == null || _lv == 0)
      {
        lv = Global.lv;
      }
      this.lvLabel.string = "第" + lv + "关"; 
    }

    setCoinLabel(){
      this.coinLabel.string = Global.getCurrentCoin().toString();
    }

    async onStartGameClick() {
        const view = await ResMgr.ins.getUI(ui.GameView);
        let gameView = view.getComponent(GameView);
        gameView.init();
        view.parent = this.node.parent;
    }

    async onDressupClick() {

    }
  
    async onTurnTableClick(){

    }

    async onSignClick(){
        const view = await ResMgr.ins.getUI(ui.SignView);
        let signView = view.getComponent(SignView);
        view.parent = this.node.parent;
    }

    async onRankClick(){

    }

    async onSettingClick(){

    }


    eventLevelChange(){
      this.setLvLabel();
    }

    eventBackToMain(){
      this.setLvLabel();
      this.setCoinLabel();
    }
      
    // update (dt) {}
}
