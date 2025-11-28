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

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainView extends BaseView {

    @property(cc.Label)
    label: cc.Label = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.RichText)
    lvLabel: cc.RichText = null;

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
      MainView.ins = this;
    }

    setLvLabel(_lv?: number) {
      let lv = _lv;
      //console.log(" MainView.Set LV: ",_lv,"  Global.LV:: ",Global.lv)
      if(_lv == null || _lv == 0)
      {
        lv = Global.lv;
      }
      this.lvLabel.string = `<b><color=#FAFAFA><outline color=#000000 width=4>Level </outline></c><color=#FAFAFA><outline color=#000000 width=4>${lv}</outline></c></b>`; 
    }

    async onStartGameClick() {
        const view = await ResMgr.ins.getUI(ui.GameView);
        let gameView = view.getComponent(GameView);
        gameView.init();
        view.parent = this.node.parent;
    }

    async onSettingClick() {
        const view = await ResMgr.ins.getUI(ui.SettingView);
        view.parent = this.node.parent;
    }
  
    async onShopClick(){
      const view = await ResMgr.ins.getUI(ui.ShopView);
      view.parent = this.node.parent;
    }

    async onLvClick(){
      const view = await ResMgr.ins.getUI(ui.LevelView);
      view.parent = this.node.parent;
    }

    eventLevelChange(){
      this.setLvLabel();
    }

    eventBackToMain(){
      this.setLvLabel();
    }
      
    // update (dt) {}
}
