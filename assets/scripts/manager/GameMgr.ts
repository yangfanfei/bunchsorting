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

  @property(cc.Prefab)
  flyEffectNode: cc.Prefab = null;

  @property(cc.Node)
  dishBg1: cc.Node = null;

  @property(cc.Node)
  dishBg2: cc.Node = null;

  @property(cc.Node)
  dishBg3: cc.Node = null;

  @property([cc.SpriteFrame])
  public bunchImgs: cc.SpriteFrame[] = [];

  public static ins: GameMgr = null;

  protected curCfg: Array<BunchInfo> = [];

  private curBunchs: Array<Bunch> = [];

  private layout_v: cc.Layout = null;
  private isPlaying:boolean = false;
  private lastSelectBunch: Bunch = null;
  private tween: cc.Tween = null;

  onLoad() {
    if (CC_EDITOR) {
      return;
    }

    GameMgr.ins = this;

    this.startGame();
  }

  start() {
    cc.director.on(events.Start, this.startGame, this);
    cc.director.on(events.Reset, this.resetLv, this);
    cc.director.on(events.AddBunch, this.addBunch, this);
    cc.director.on(events.Back, this.undoAction, this);
  }
  onDisable() {
    cc.director.off(events.Start, this.startGame, this);
    cc.director.off(events.Reset, this.resetLv, this);
    cc.director.off(events.AddBunch, this.addBunch, this);
    cc.director.off(events.Back, this.undoAction, this);
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

  private resetLv(){
      this.startGame();
  }

  private undoAction(){
  if (!this.checkCanUndo()) {
      return;
    }

    let action = Global.action_list.pop();
    if (action == null) {
      return false;
    }

    //console.log(" UndoAction.Data:: ",action);

    let src = this.getBunchByIndex(action.from);
    let dest = this.getBunchByIndex(action.to);

    dest.removeTop(action.num);
    src.addTop(action.colorId, action.num);
    //let toCup = this._cups[to];
    //let fromCup = this._cups[from];
    /*let toCupIsFull = toCup.checkFinishImp(false);
    let fromCupIsFull = fromCup.checkFinishImp(false);

    /////// fall back resetCoin and tube state
    if(toCupIsFull == true){
      toCup.resetCheckFinishedState();
      Global.subCoin(Global.tubeRewardCoin);
      CoinMgr.ins.setCoinLabel();
    }
    if(fromCupIsFull == true){
      fromCup.resetCheckFinishedState();
      Global.subCoin(Global.tubeRewardCoin);
      CoinMgr.ins.setCoinLabel();
    }*/

    //toCup.removeTopWaterImmediately(num);
    //fromCup.addWaterImmediately(colorId, num);
    return true;
  }

  addBunch() {
    if (!this.checkCanAddBunch()) return;
    if (this.lastSelectBunch) {
      this.doSelect(this.lastSelectBunch, false); 
      this.lastSelectBunch = null;
    }

    this.curCfg.push({ colorIds: [0, 0, 0, 0] });
    this.createBunches();
  }

  private getBunchByIndex(val){
    for(var i = 0; i < this.curBunchs.length; ++i){
      var bunch = this.curBunchs[i]
      if(bunch.getIndex() == val){
        return bunch;
      }
    }

    return null;
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

    //console.log(" CupMgr.initCfg::::::: curLV:",lv," curCFG: ",this.curCfg);
  }

  public checkCanAddBunch() {
    return  this.curCfg.length < Global.maxTube;
  }

  public checkCanUndo() {
    return  Global.action_list.length > 0;
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

    this.layout_v.node.setPosition(new cc.Vec3(0, 65, 0));

    let layoutArr: Array<cc.Layout> = [];

    let cupIdxGroups = this.createBunchIndexGroups(len);
    console.log(" CupMgr.CreateBunchGroup::::::::::::: ",cupIdxGroups);

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
    let count = 1;
    if (len <= 4) {
      let idGroup: Array<number> = [];
      for (let i = 0; i < this.curBunchs.length; i++) {
        idGroup.push(i);
      }
      bunchGruoups.push(idGroup);
    } else if (len <= 8) {

      count = 2;
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
    else
    {
      count = 3;
      let id1 = 0;
      let id2 = 0;
      if(len == 13)
      {
        id1 = 5;
        id2 = 9;
      }
      else if(len == 14)
      {
        id1 = 5;
        id2 = 10;
      }
      else
      {
        id1 = len / 3;
        id2 = len*2 / 3;
      }

      let idGroup: Array<number> = [];
      let i = 0;
      for (; i < id1; i++) {
        idGroup.push(i);
      }
      bunchGruoups.push(idGroup);

      idGroup = [];
      for (; i < id2; i++) {
        idGroup.push(i);
      }
      bunchGruoups.push(idGroup);

      idGroup = [];
      for (; i < len; i++) {
        idGroup.push(i);
      }
      bunchGruoups.push(idGroup);
    }

    if(count == 1)
    {
      this.dishBg1.active = false;
      this.dishBg3.active = false;
      this.dishBg2.active = true;

      this.dishBg1.setPosition(new cc.Vec3(0, 470, 0));
      this.dishBg2.setPosition(new cc.Vec3(0, 60, 0));
      this.dishBg3.setPosition(new cc.Vec3(0, -350, 0));
    }
    else if(count == 2)
    {
      this.dishBg3.active = false;
      this.dishBg1.active = true;
      this.dishBg2.active = true;

      this.dishBg1.setPosition(new cc.Vec3(0, 260, 0));
      this.dishBg2.setPosition(new cc.Vec3(0, -150, 0));
    }
    else if(count == 3)
    {
      this.dishBg3.active = true;
      this.dishBg1.active = true;
      this.dishBg2.active = true;

      this.dishBg1.setPosition(new cc.Vec3(0, 470, 0));
      this.dishBg2.setPosition(new cc.Vec3(0, 60, 0));
      this.dishBg3.setPosition(new cc.Vec3(0, -350, 0));
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
  
      //console.log("  createCupLayout.Size::::  MaxNum ",maxNum," 间隔Value:  ",spacesArr[maxNum][0]," Bunch.Size:: ",bunchSize);
  
      layout.spacingX = spacesArr[maxNum][0];
      layout.node.scale = 1 || spacesArr[maxNum][1];
      layout.spacingY = spacesArr[maxNum][2] || 40;
  
      console.log(" CreateBunchLayout:: ",index);
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

    //console.log(" CreateCupNode:::: SetOnClick........ ");
    bunchComp.setOnClick(this.onClickCup.bind(this, bunchComp));

    return bunchComp;
  }

  private onClickCup(bunch: Bunch) {
       //console.log(" GameMgr. Bunch SetOnClick.... bunch: ",bunch.getIndex());
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
    let y = pt.y + (bool ? bunch.node.height * 0.1 : 0); 
    cc.tween(bunch.node).stop(); 
    cc.tween(bunch.node).to(0.1, { y: y }).start(); 
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
    var srcTopEmptyCount = src.getTopEmptyCount()
    var destTopEmptyCount = dst.getTopEmptyCount()

    let moveCount = Math.min(srcTopinfo.topColorNum, destTopInfo.emptyNum);
    let color = srcTopinfo.topColorId;

    //console.log(" StartMove. srcTopEmptyCount:: ",srcTopEmptyCount," destTopEmptyCount:: ",destTopEmptyCount," moveCount: ",moveCount);

    src.removeTop(moveCount);
    //dst.addTop(color, moveCount);

    this.doSelect(this.lastSelectBunch, false);
    this.lastSelectBunch = null;

    if (Global.action_list.length == Global.action_step) {
        Global.action_list.shift();
      }
      Global.action_list.push({
        from: src.getIndex(),
        to: dst.getIndex(),
        colorId: color,
        num: moveCount,
    });

    let srcPos = src.node.parent.convertToWorldSpaceAR(src.node.position);
    srcPos = GameView.ins.effectRoot.convertToNodeSpaceAR(srcPos);
    
    let desPos3 = dst.node.parent.convertToWorldSpaceAR(dst.node.position);
    desPos3 = GameView.ins.effectRoot.convertToNodeSpaceAR(desPos3);

    let desPos1 = new cc.Vec3(srcPos.x, srcPos.y+210, srcPos.z);
    let desPos2 = new cc.Vec3(desPos3.x, desPos3.y+250, desPos3.z);

    //console.log(" Before.DestPos:::: ",desPos3,"  Dest.Count::: ",destTopEmptyCount);
    //let desPos4 = new cc.Vec3(desPos3.x, desPos3.y + 160 - (destTopEmptyCount)*65, desPos3.z);
    //console.log(" After.DestPos:::: ",desPos4);
    
    for(var i = 0 ; i < moveCount; ++i)
    {
      let desPos4 = new cc.Vec3(desPos3.x, desPos3.y + 160 - (destTopEmptyCount - i)*65, desPos3.z);
      let effectNode = cc.instantiate(this.flyEffectNode);
      let effectSprite = effectNode.getComponent(cc.Sprite);
      let sf = this.bunchImgs[color-1];
      sf.getOriginalSize();

      effectSprite.spriteFrame = this.bunchImgs[color-1];
      
      let srcPos1 = new cc.Vec3(srcPos.x, srcPos.y + 80 - (srcTopEmptyCount+i)*60, srcPos.z);

      effectNode.setPosition(srcPos1);
      GameView.ins.effectRoot.addChild(effectNode);

      this.tween = cc
        .tween(effectNode)
        .to(0.2+ i*0.075, { x: desPos1.x, y: desPos1.y }) 
        .to(0.2+ i*0.075, { x: desPos2.x, y: desPos2.y }) 
        .to(0.2+ i*0.075, { x: desPos4.x, y: desPos4.y }) 
        .call(() => {
          this.tween = null; 
          dst.addTop(color, 1);

          effectNode.destroy();

          if(this.checkAllFinish() == true){
            //console.log(" AllFinish:::::::: Send.Event...........");
            cc.director.emit(events.LevelFinish);
          }
        })
        .start();
    }

    //console.log(" StartMove.SrcInfo::: ",srcTopinfo," DestInfo: ",destTopInfo);
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
