/*
 * @Author: jxgamestudio
 * @Description: Game Manager
 */

import { Global } from "../Global";
import { Clips, events, spacesArr } from "../enum/Enums";
import { SoundMgr } from "./SoundMgr";
import GameView from "../view/GameView";
import CoinMgr from "./CoinMgr";
import { BunchInfo, SpacesArr } from "../base/Interface";
import Bunch from "../game/Bunch";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameMgr extends cc.Component {

  @property(cc.JsonAsset)
  protected levelCfg: cc.JsonAsset = null;

  @property(cc.Prefab)
  bunchPrefab: cc.Prefab = null;

  @property([cc.SpriteFrame])
  public bunchImgs: cc.SpriteFrame[] = [];

  public static ins: GameMgr = null;

  protected curCfg: Array<BunchInfo> = [];

  private curBunchs: Array<Bunch> = [];

  private layout_v: cc.Layout = null;
  private isPlaying:boolean = false;
  private lastSelectBunch: Bunch = null;

  onLoad() {
    if (CC_EDITOR) {
      return;
    }

    GameMgr.ins = this;

    this.startGame();
  }

  start() {
    cc.director.on(events.Start, this.startGame, this);
  }
  onDisable() {
    cc.director.off(events.Start, this.startGame, this);
  }

  /**
   * start game
   */
  public startGame() {
    Global.action_list = [];

    console.log(" GameMgr.StartGame..........");
    this.initCfg();
    this.createBunches();
    if(CoinMgr.ins)
    {
      console.log("CoinMgr::::::: ",CoinMgr.ins);
       CoinMgr.ins.setCoinLabel();
    }
    if(GameView.ins)
    {
       GameView.ins.setAllFinish(false);
    }
    /*if (Global.lv === 1) {
      console.log(" startGame........... LV:: ",Global.lv);
      setTimeout(() => {
        cc.systemEvent.emit(events.ExcuteGuideTask, {
          taskFlie: 'GuideTask',
          stepIndex: 0
        })
      }, 300);
    }*/
  }

  protected initCfg() {
    this.curCfg = [];
    let  lv = Global.lv;
    let cfgArr: Array<number> = this.levelCfg.json[lv-1]; 
    let acc = 0;
    while (acc < cfgArr.length) {
      let info = {
        colorIds: [
          cfgArr[acc],
          cfgArr[acc + 1] || 0,
          cfgArr[acc + 2] || 0,
          cfgArr[acc + 3] || 0,
        ],
      };
      this.curCfg.push(info);
      acc += 4;
    }

    console.log(" CupMgr.initCfg::::::: curLV:",lv," curCFG: ",this.curCfg);
  }

  async createBunches() {
    if (this.layout_v) {
      this.layout_v.node.destroyAllChildren();
    }

    this.curBunchs = [];
    const len = this.curCfg.length;
    if (len == 0) {
      return;
    }

    for (let i = 0; i < len; i++) {
      let info = this.curCfg[i];

      let cup = this.createBunchNode(info);
      cup.setIndex(i);
      this.curBunchs.push(cup);
    }

    if (!this.layout_v) {
      this.layout_v = this.createLayout(
        cc.Layout.Type.VERTICAL,
        this.node,
        "layout_v"
      );

      this.layout_v.node.zIndex = 1;
    }

    let layoutArr: Array<cc.Layout> = [];

    let cupIdxGroups = this.createBunchIndexGroups(len);
    console.log(" CupMgr.CreateCups::::::::::::: ",cupIdxGroups);

    let maxNum = 1;
    for (let i = 0; i < cupIdxGroups.length; i++) {
      let idGroup = cupIdxGroups[i];
      maxNum = idGroup.length;
      let layout = this.createBunchLayout(
        cupIdxGroups,
        new cc.Vec2(80, 374),
        maxNum,
        spacesArr,
        i
      );
      // layout.enabled = false;
      layoutArr.push(layout);
    }

    // layout.node.parent = this.layout_v.node;
    // layout.enabled = false;

    this.layout_v.enabled = true;
    this.layout_v.node.scale = spacesArr[maxNum][1];
    this.layout_v.spacingY = spacesArr[maxNum][2] || 40;

    for (let layout of layoutArr) {
      layout.updateLayout();
      layout.enabled = false;
    }

    this.layout_v.updateLayout();
    this.layout_v.enabled = false;
    for (let cup of this.curBunchs) {
      cup.setOrignPt(cup.node.position);
    }
  }

  
  createBunchIndexGroups(len: number) {
    let bunchGruoups: Array<Array<number>> = [];
    if (len <= 4) {
      let idGroup: Array<number> = [];
      for (let i = 0; i < this.curBunchs.length; i++) {
        idGroup.push(i);
      }
      bunchGruoups.push(idGroup);
    } else if (len <= 15) {

      let idGroup: Array<number> = [];
      let i = 0;
      let middleId = len / 2;
      for (; i < middleId; i++) {
        idGroup.push(i);
      }
      bunchGruoups.push(idGroup);

      idGroup = [];
      for (; i < len; i++) {
        idGroup.push(i);
      }
      bunchGruoups.push(idGroup);
      idGroup = [];
    }

    return bunchGruoups;
  }

   createBunchLayout(
      bunchIdxGroups: Array<Array<number>>,
      bunchSize: cc.Vec2,
      maxNum: number,
      spacesArr: SpacesArr,
      index: number = 0
    ) {
      let layout = this.createLayout(
        cc.Layout.Type.HORIZONTAL,
        this.layout_v.node,
        `layout_h_${index}`
      );
  
      layout.node.height = bunchSize.y;
  
      console.log("  createCupLayout.Size::::  MaxNum ",maxNum," 间隔Value:  ",spacesArr[maxNum][0]," Bunch.Size:: ",bunchSize);
  
      layout.spacingX = spacesArr[maxNum][0];
      layout.node.scale = 1 || spacesArr[maxNum][1];
      layout.spacingY = spacesArr[maxNum][2] || 40;
  
      let idGroup = bunchIdxGroups[index];
  
      for (let j = 0; j < idGroup.length; j++) {
        let id = idGroup[j];
  
        this.curBunchs[id].node.parent = layout.node;
      }
  
      return layout;
    }

  createBunchNode(info: BunchInfo) {
    const { current } = Global.cupSetting;

    const bunch = cc.instantiate(this.bunchPrefab);
    const bunchComp = bunch.getComponent(Bunch);

    this.node.addChild(bunch);

    bunchComp.setBunchInfo(info);

    console.log(" CreateCupNode:::: SetOnClick........ ");
    bunchComp.setOnClick(this.onClickCup.bind(this, bunchComp));

    return bunchComp;
  }

  private onClickCup(bunch: Bunch) {
       console.log(" GameMgr. Bunch SetOnClick.... bunch: ",bunch.getIndex());
      /*if(this.selectedCup)
      {
        console.log(" CupMgr.OnClickCup............ SelectedCup： ",this.selectedCup.getCupIndex());
      }
      if(cup.getFinishState() == true)
      {
        cc.director.emit(events.Toast, `Cup is Full`)
        return;
      }
  
      if(cup.getPlayAnimation() == true){
        if(this.selectedCup && this.selectedCup != cup)
        {
          
        }
        else
        {
          return;
        }
      }*/
  
    if (this.lastSelectBunch) {
      if (this.lastSelectBunch == bunch) {
        this.doSelect(bunch, false); 
        this.lastSelectBunch = null; 
      } else if (this.checkMove(this.lastSelectBunch, bunch)) {
        //this.startPour(this.selectedCup, cup);
        this.startMove(this.lastSelectBunch, bunch);
      } else {
        this.doSelect(this.lastSelectBunch, false); 
        this.lastSelectBunch = null; 
      }
    } else {
      this.lastSelectBunch = bunch; 
      this.doSelect(bunch, true); 
    }
  }

  private doSelect(bunch: Bunch, bool: boolean) {
    let pt = bunch.orignPt; 
    let y = pt.y + (bool ? bunch.node.height * 0.2 : 0); 
    cc.tween(bunch.node).stop(); 
    cc.tween(bunch.node).to(0.2, { y: y }).start(); 
  }

  private checkMove(src: Bunch, dst: Bunch) {
    const { topColorId: srcColorId, topColorNum: srcColorNum } = src.getTop();
    const { topColorId: dstColorId, emptyNum: dstEmptyNum } = dst.getTop();

    if (!srcColorId || (dstColorId && dstColorId !== srcColorId)) {
      return false;
    }

    if (!dstEmptyNum) {
      return false;
    }

    return true;
  }

  private startMove(src: Bunch, dst: Bunch){
    var srcTopinfo = src.getTop();
    var destTopInfo = dst.getTop();

    let pourNum = Math.min(srcTopinfo.topColorNum, destTopInfo.emptyNum);
    let color = srcTopinfo.topColorId;

    src.removeTop(pourNum);
    dst.addTop(color, pourNum);

    this.doSelect(this.lastSelectBunch, false);
    this.lastSelectBunch = null;

    if(this.checkAllFinish() == true){
      console.log(" AllFinish:::::::: Send.Event...........");
      cc.director.emit(events.LevelFinish);
    }

    console.log(" StartMove.SrcInfo::: ",srcTopinfo," DestInfo: ",destTopInfo);
  }

  createLayout(type: cc.Layout.Type, parent: cc.Node, name?: string) {
    let node = new cc.Node(name);

    node.parent = parent;

    let layout = node.addComponent(cc.Layout);

    layout.type = type;

    layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;

    return layout;
  }

  checkAllFinish(){
    for(var i = 0; i < this.curBunchs.length; ++i){
      if(this.curBunchs[i].checkFinishImpDontChangeState() == false){
        return false;
      }
    }

    return true;
  }
  
}
