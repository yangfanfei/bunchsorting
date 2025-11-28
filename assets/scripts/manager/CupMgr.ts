/*
 * @Author: jxgamestudio
 * @Description: cup Manger
 */

import { Global } from "../Global";
import { AnimationTime, SPLIT_COUNT, events, spacesArr } from "../enum/Enums";
import Cup from "../game/Cup";
import { WaterFlow } from "../game/WaterFlow";
import {
  Action,
  CupManager,
  SpacesArr,
  _CupInfo,
  _CupTopInfo,
  _SelectCupInfo,
} from "../base/Interface";
import GameView from "../view/GameView";
import CoinMgr from "./CoinMgr";

const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
export default class CupMgr extends cc.Component {
  @property(cc.Prefab)
  cupPrefab: cc.Prefab = null;

  @property(cc.JsonAsset)
  protected levelCfg: cc.JsonAsset = null;

  @property private _debugLevel: number = 0;
  @property({ tooltip: CC_DEV && "debug level" })
  public get debugLevel() {
    return this._debugLevel;
  }

  public set debugLevel(value: number) {
    this._debugLevel = value;
    Global.setLv(value);
    this.startGameWithoutSetFinishState();
  }


  private _isPlaying: boolean = false;
  private _waterFlow: WaterFlow = null;
  onLoad() {
    if (CC_EDITOR) {
      return;
    }

    let _node = new cc.Node();
    _node.parent = this.node;
    this._waterFlow = _node.addComponent(WaterFlow);
    //this.startGameWithoutSetFinishState();
  }

  private selectedCup: Cup = null;

  private onClickCup(cup: Cup) {
    if(this.selectedCup)
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
    }

    if (this.selectedCup) {
      if (this.selectedCup == cup) {
        this.doSelect(cup, false); 
        this.selectedCup = null; 
      } else if (this.checkPour(this.selectedCup, cup)) {
        this.startPour(this.selectedCup, cup);
      } else {
        this.doSelect(this.selectedCup, false); 
        this.selectedCup = null; 
      }
    } else {
      this.selectedCup = cup; 
      this.doSelect(cup, true); 
    }
  }

  private doSelect(cup: Cup, bool: boolean) {
    let pt = cup.orignPt; 
    let y = pt.y + (bool ? cup.node.height * AnimationTime.moveTime : 0); 
    cc.tween(cup.node).stop(); 
    cc.tween(cup.node).to(AnimationTime.moveTime, { y: y }).start(); 
  }
  // oneCheckInfo: _CupTopInfo;

  private startPour(src: Cup, dst: Cup) {
    console.log("  CupMgr.StartPour.........  ");
    let dstPt = cc.v2(dst.node.position);
    let dstGlobal = dst.node.parent.convertToWorldSpaceAR(dstPt);
    let viewSize = cc.view.getVisibleSize();
    let isRight = dstGlobal.x > viewSize.width * 0.5; //

    let srcTop = JSON.parse(JSON.stringify(src.getTop()));
    // this.oneCheckInfo = JSON.parse(JSON.stringify(src.getTop()));
    let pourNum = Math.min(srcTop.topColorNum, dst.getTop().emptyNum);

    let pour = this.pourLiquid(src, dst, {
      dstPt,
      dstGlobal,
      viewSize,
      isRight,
    });
    dstPt = pour.dstPt;
    isRight = pour.isRight;
    this.selectedCup = null;

    // let dstMouthCenter = dst.getBottleMouthCenter();
    this._isPlaying = true;
    src.setPlayAnimation(true);
    dst.setPlayAnimation(true);
    src.moveToPour(
      // new cc.Vec2(dstMouthCenter.x, dstMouthCenter.y),
      dstPt,
      isRight,
      pourNum
    );
    src.setPourOutCallback(
      () => this.onPourStart(src, dst, srcTop),
      () => this.onPourFinish(src, dst, this._waterFlow)
    );

  }

  onPourFinish(src: Cup, dst: Cup, flow: WaterFlow) {
    let startPt = src.node.convertToWorldSpaceAR(cc.v2()); 
    startPt = flow.node.parent.convertToNodeSpaceAR(startPt);
    let endPt = cc.v2(startPt.x, dst.getWaterSurfacePosY(true)); 
    endPt = flow.node.parent.convertToNodeSpaceAR(endPt); 
    endPt.x = startPt.x; 
    flow.playFlowAni(startPt, endPt, AnimationTime.moveTime, true, () => {
      flow.clear(); 
    });
    src.setNormalAnchor(); 
    let pt = src.orignPt; 
    let moveBack = cc
      .tween(src.node)
      // .delay(0.1)
      .to(
        AnimationTime.moveTime,
        { x: pt.x, y: pt.y, angle: 0 },
        { easing: "sineOut" }
      )
      .call(() => {
        src.node.zIndex = 0; 
        src.node.parent.zIndex = 0; 
      });
    moveBack.start(); 
  }

  private checkPour(src: Cup, dst: Cup) {
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

  createCupNode(info: _CupInfo) {
    const { current } = Global.cupSetting;

    const cup = cc.instantiate(this.cupPrefab);
    const cupComp = cup.getComponent(Cup);
    cupComp.changeImg(+current - 1);

    this.node.addChild(cup);

    cupComp.setCupInfo(info);

    console.log(" CreateCupNode:::: SetOnClick........ ");
    cupComp.setOnClick(this.onClickCup.bind(this, cupComp));

    return cupComp;
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

  _createLayout(type: cc.Layout.Type, parent: cc.Node, name?: string) {
    let node = new cc.Node(name);

    node.parent = parent;

    let layout = node.addComponent(cc.Layout);

    layout.type = type;

    layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;

    return layout;
  }

  private pourLiquid(
    src: Cup,
    dst: Cup,
    { dstPt, dstGlobal, viewSize, isRight }: CupManager
  ) {
    dst.node.zIndex = 0;
    dst.node.parent.zIndex = 0;
    src.node.zIndex = 10;
    src.node.parent.zIndex = 10;

    if (Math.abs(dstGlobal.x - viewSize.width * 0.5) < 2) {
      let srcPt = src.node.parent.convertToWorldSpaceAR(
        cc.v2(src.node.position)
      );
      isRight = srcPt.x < viewSize.width * 0.5;
    }
    // dstPt.y += 20;
    dstPt.y += 30 + dst.node.height * 0.5;
    let offsetX = 0; //dst.node.width*0.5-20;
    dstPt.x = dstPt.x + (isRight ? -offsetX : offsetX);

    dstPt = dst.node.parent.convertToWorldSpaceAR(dstPt);

    src.setPourAnchor(isRight);
    dstPt = src.node.parent.convertToNodeSpaceAR(dstPt);
    return { dstPt, isRight };
  }

  onPourStart(src: Cup, dst: Cup, srcTop: _CupTopInfo) {
    // let srcTop = src.getTop(); 
    console.log(" CupMgr.onPourStart:::: SRC::: ",src.getCupIndex(),"  DST::: ",dst.getCupIndex());
    const flow = this._waterFlow; 
    flow.setLineScale(this.layout_v.node.scale);
    let startPt = src.node.convertToWorldSpaceAR(cc.v2()); 
    startPt = flow.node.parent.convertToNodeSpaceAR(startPt);
    let endPt = cc.v2(startPt.x, dst.getWaterSurfacePosY()); 
    endPt = flow.node.parent.convertToNodeSpaceAR(endPt); 
    endPt.x = startPt.x; 

    flow.strokeColor = new cc.Color().fromHEX(srcTop.colorHex); 
    let pourNum = Math.min(srcTop.topColorNum, dst.getTop().emptyNum);

    const finishFn = (cup: Cup, isFinished: boolean) => {
      this._isPlaying = false;
      this.onPourOneFinished(src, dst, srcTop.topColorId, pourNum);
    };
    dst.setStartAddWater(srcTop.topColorId, pourNum);
    flow.playFlowAni(startPt, endPt, AnimationTime.moveTime, false, () => {
      dst.setPourInCallback(finishFn);
      dst.startAddWater(srcTop.topColorId, pourNum);
    });
  }

  // private _actions: Array<Action> = Global.action_list;
  private onPourOneFinished(from: Cup, to: Cup, colorId: number, num: number) {
    console.log(" CupMgr.OnPourOneFinished::: From: ",from.getCupIndex()," To: ",to.getCupIndex());
    let fromCupIdx = this._cups.indexOf(from);
    let toCupIdx = this._cups.indexOf(to);
    if (Global.action_list.length == Global.action_step) {
      Global.action_list.shift();
    }
    Global.action_list.push({
      from: fromCupIdx,
      to: toCupIdx,
      colorId: colorId,
      num: num,
    });

    from.setPlayAnimation(false);
    to.setPlayAnimation(false);
    //// All cup is full, level is finish
    let isAllFinished = this.checkIsAllFinished();
    if (isAllFinished) {
      // Global.lv++;
      // cc.sys.localStorage.setItem(COOKIE_LEVEL, Global.lv);
      console.log(" onPourOneFinished... IsAllFinished...... Send.Events ");
      cc.director.emit(events.LevelFinish);
    } else {

      cc.director.emit(events.Pour);
    }
  }

  private checkIsAllFinished() {
    console.log("Check  Is  All  Finished ……………………………………………………………………",this._cups);
    for (let cup of this._cups) {
      if (!cup.checkFinishImpDontChangeState()) {
        return false;
      }
    }
    return true;
  }

  private layout_v: cc.Layout = null;

  private _cups: Array<Cup> = [];

  protected curCfg: Array<_CupInfo> = [];

  async createCups() {

    if (this.layout_v) {
      this.layout_v.node.destroyAllChildren();
    }

    this._cups = [];
    const len = this.curCfg.length;
    if (len == 0) {
      return;
    }

    for (let i = 0; i < len; i++) {
      let info = this.curCfg[i];

      let cup = this.createCupNode(info);
      cup.setCupIndex(i);

      this._cups.push(cup);
    }

    if (!this.layout_v) {
      this.layout_v = this._createLayout(
        cc.Layout.Type.VERTICAL,
        this.node,
        "layout_v"
      );

      this.layout_v.node.zIndex = 1;
    }

    let layoutArr: Array<cc.Layout> = [];

    let cupIdxGroups = this.createCupIndexGroups(len);
    console.log(" CupMgr.CreateCups::::::::::::: ",cupIdxGroups);

    let maxNum = 1;
    for (let i = 0; i < cupIdxGroups.length; i++) {
      let idGroup = cupIdxGroups[i];
      maxNum = idGroup.length;
      let layout = this.createCupLayout(
        cupIdxGroups,
        this._cups[0].node.getContentSize(),
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
    for (let cup of this._cups) {
      cup.setOrignPt(cup.node.position);
    }
  }

  createCupIndexGroups(len: number) {
    let cupIdxGroups: Array<Array<number>> = [];
    if (len <= 4) {

      let idGroup: Array<number> = [];
      for (let i = 0; i < this._cups.length; i++) {
        idGroup.push(i);
      }
      cupIdxGroups.push(idGroup);
    } else if (len <= 15) {

      let idGroup: Array<number> = [];
      let i = 0;
      let middleId = len / 2;
      for (; i < middleId; i++) {
        idGroup.push(i);
      }
      cupIdxGroups.push(idGroup);
      idGroup = [];

      for (; i < len; i++) {
        idGroup.push(i);
      }
      cupIdxGroups.push(idGroup);
      idGroup = [];
    }
    return cupIdxGroups;
  }


  createCupLayout(
    cupIdxGroups: Array<Array<number>>,
    cupSize: cc.Size,
    maxNum: number,
    spacesArr: SpacesArr,
    index: number = 0
  ) {
    let layout = this._createLayout(
      cc.Layout.Type.HORIZONTAL,
      this.layout_v.node,
      `layout_h_${index}`
    );

    layout.node.height = cupSize.height;

    console.log("  createCupLayout.Size::::  MaxNum ",maxNum," 间隔Value:  ",spacesArr[maxNum][0]);

    layout.spacingX = spacesArr[maxNum][0];

    layout.node.scale = 1 || spacesArr[maxNum][1];

    layout.spacingY = spacesArr[maxNum][2] || 40;

    // for (let i = 0; i < cupIdxGroups.length; i++) {
    let idGroup = cupIdxGroups[index];

    for (let j = 0; j < idGroup.length; j++) {
      let id = idGroup[j];

      this._cups[id].node.parent = layout.node;
    }

    return layout;
  }
  public static ins: CupMgr = null;

  protected start(): void {
    CupMgr.ins = this;
    //cc.director.on(events.Reset, this.resetLv, this);
    //cc.director.on(events.Back, this.undoAction, this);
    //cc.director.on(events.Start, this.startGame, this);
    //cc.director.on(events.AddTube, this.addcup, this);
  }
  protected onDisable(): void {
    //cc.director.off(events.Reset, this.resetLv, this);
    //cc.director.off(events.Back, this.undoAction, this);
    //cc.director.off(events.Start, this.startGame, this);
    //cc.director.off(events.AddTube, this.addcup, this);
  }
  private resetLv() {
    Global.action_list = [];
    this.startGame();
  }
  /**
   * start game
   */
  public startGame() {
    Global.action_list = [];
    if (this._isPlaying) return;

    this.initCfg();
    this.createCups();
    CoinMgr.ins.setCoinLabel();
    GameView.ins.setAllFinish(false);
    if (Global.lv === 1) {
      console.log(" startGame........... LV:: ",Global.lv);
      setTimeout(() => {
        cc.systemEvent.emit(events.ExcuteGuideTask, {
          taskFlie: 'GuideTask',
          stepIndex: 0
        })
      }, 300);
    }
  }


    /**
   * start game
   */
  public startGameWithoutSetFinishState() {
    Global.action_list = [];
    if (this._isPlaying) return;

    this.initCfg();
    this.createCups();
    if (Global.lv === 1) {
      console.log(" startGameWithoutSetFinishState........... LV:: ",Global.lv);
      setTimeout(() => {
        cc.systemEvent.emit(events.ExcuteGuideTask, {
          taskFlie: 'GuideTask',
          stepIndex: 0
        })
      }, 300);
    }
  }

  /**
   * fallback function
   * @param fn 
   * @returns
   */
  public async undoAction(fn?: Function) {
    if (!this.checkCanUndo()) {
      return;
    }

    if (fn) {
      if (!fn()) return false;
    }

    let action = Global.action_list.pop();
    if (action == null) {
      return false;
    }

    let { from, to, num, colorId } = action;
    let toCup = this._cups[to];
    let fromCup = this._cups[from];
    let toCupIsFull = toCup.checkFinishImp(false);
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
    }

    if (toCup.isPouring() || fromCup.isPouring()) {
      return false;
    }

    toCup.removeTopWaterImmediately(num);
    fromCup.addWaterImmediately(colorId, num);
    return true;
  }

  addcup() {
    if (!this.checkCanAddTube()) return;
    if (this.selectedCup) {
      this.doSelect(this.selectedCup, false); 
      this.selectedCup = null;
    }
    this._waterFlow.clear();
    this.curCfg.push({ colorIds: [0, 0, 0, 0] });
    this.createCups();
  }

  public checkCanUndo() {
    return !this._isPlaying && Global.action_list.length > 0;
  }

  public checkCanAddTube() {
    return !this._isPlaying && this.curCfg.length < Global.maxTube;
  }
  // update (dt) {}
}
