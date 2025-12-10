/*
 * @Author: jxgamestudio
 * @Description:  Sign View
 */

import { Global } from "../Global";
import { Clips, Key, ui } from "../enum/Enums";
import { AccessType, SignInType, signInInfo } from "../base/Interface";
import ResMgr from "../manager/ResMgr";
import { getDate, load } from "../utils/Tools";
import BaseView from "./BaseView";
import GetItemView from "./GetItemView";
import SignItemView from "./SignItemView";
import { SoundMgr } from "../manager/SoundMgr";

const { ccclass, property } = cc._decorator;

// TODO:补签没测，广告分享没加
interface ISignItem {
  info: signInInfo[];
  signScript: SignItemView;
}
// 判断今天是周几
function getWeek(str?: string) {
  let date = str ? new Date(str) : new Date();
  let week = date.getDay();
  if (week === 0) {
    week = 7;
  }
  return week;
}
@ccclass
export default class SignView extends BaseView {
  // LIFE-CYCLE CALLBACKS:
  @property(cc.Prefab)
  itemPre: cc.Prefab = null;

  @property(cc.Prefab)
  fullPre: cc.Prefab = null;

  @property(cc.Node)
  content: cc.Node = null;
  // onLoad () {}

  @property(cc.Node)
  btnGrousp: cc.Node = null;

  async start() {
    // setTimeout(async () => {
    let json = ResMgr.ins.getJson("sign");
    await this.init(json.json.data);
    // }, 3000);
  }
  private todayItem: ISignItem = null;
  private allList: ISignItem[] = [];
  signTypes: SignInType[] = [];
  /**
   *  添加签到类型
   * @param type 签到类型
   */
  addSignType(type: SignInType) {
    Global.addSignArr(type);
    if (!this.signTypes.includes(type)) {
      this.signTypes.push(type);
    }
  }
  /**
   * 初始化
   * @param arr
   */
  init(arr: signInInfo[]) {
    console.log("SignView. Init Info:::::  ",arr);
    let week = getWeek();
    let today = load(Key.Today, 0);
    // 清空签到记录 TODO:
    if (!today || (week < getWeek(today))) {
      Global.clearSignArr();
    }
    arr = arr.map((item) => {
      let isSign = Global.signArr.includes(item.id.toString());
      if (isSign) {
        this.addSignType(item.type);
      }
      return {
        ...item,
        isSign,
      };
    });
    // let len = arr.length;
    let fillList = arr.filter((item) => item.type === SignInType.FULL_WEEK);
    // 剔除满七天的
    arr = arr.filter((item) => item.type !== SignInType.FULL_WEEK);
    for (const item of arr) {
      this.addSignItem(item, week);
    }
    this.addFullWeek(fillList);
    //if (!this.todayItem) {
   //   this.hideBtn();
    //}
  }
  //   添加满七天的节点
  addFullWeek(fillList: signInInfo[]) {
    let full = cc.instantiate(this.fullPre);
    full.parent = this.content;
    let signItem = full.getComponent(SignItemView);
    this.allList.push({
      info: fillList,
      signScript: signItem,
    });
    signItem.updateSignState(this.signTypes.length >= 7);
    signItem.updateTodayState(this.signTypes.length == 6);
    //signItem.setMaskState(this.signTypes.length >= 7);
    for (let i = 0; i < fillList.length; i++) {
      let item = fillList[i];
      signItem.addContentNode(item);
    }
  }
  /**
   *  添加普通节点
   * @param item  签到信息
   * @param week  今天是周几
   */
  addSignItem(item: signInInfo, week: number) {
    let node = cc.instantiate(this.itemPre);
    node.parent = this.content;
    let signItem = node.getComponent(SignItemView);
    this.allList.push({
      info: [item],
      signScript: signItem,
    });
    let todaySignState = +item.type === week && !item.isSign;
    signItem.setDayLabel(+item.type);
    //signItem.addContentNode(item);
    //signItem.updateMendSignState(item.access, +item.type < week);
    //signItem.setMaskState(+item.type < week || item.isSign);
    signItem.updateSignState(item.isSign);
    signItem.updateTodayState(todaySignState);
    if (todaySignState) {
      this.todayItem = {
        info: [item],
        signScript: signItem,
      };
    }
    /*signItem.mendSignFn = () => {
      if (item.isSign) return;

      if (item.access === AccessType.Share) {
        console.log("分享");
        /*super.share(() => {
          signItem.updateSignState(true);
          // TODO:分享
          this.getReward([item], signItem, false);
          this.checkIsFullWeek();
        });
      } else {
        console.log("视频");
        // TODO:视频
        /*super.showVideo(() => {
          signItem.updateSignState(true);
          this.getReward([item], signItem, false);
          this.checkIsFullWeek();
        });
      }
    };*/
  }

  // 直接领取 按钮事件
  onGetBtnClick() {
    if (this.todayItem)
      this.getReward(this.todayItem.info, this.todayItem.signScript, false);
    this.checkIsFullWeek();
    this.hideBtn();
  }
  // 领双份按钮事件
  onGetDoubleBtnClick() {
    function handle() {
      this.getReward(this.todayItem.info, this.todayItem.signScript, true);
      this.checkIsFullWeek(true);
      this.hideBtn();
    }
    //super.showVideo(handle.bind(this));

    // TODO:视频 item.access === AccessType.Share
    // if (this.todayItem) {
    //   if (this.todayItem.info[0].access === AccessType.Share) {
    //     super.share(handle.bind(this));
    //   } else {
    //     super.showVideo(handle.bind(this));
    //   }
    // }
  }
  /**
   *  领取奖励方法
   * @param items  奖励列表
   * @param signItemScript  签到item脚本
   * @param isDouble  是否双倍
   */
  async getReward(
    items: signInInfo[],
    signItemScript: SignItemView,
    isDouble: boolean = false
  ) {
    // 已签到返回
    if (this.checkIsSign(items)) return;
    SoundMgr.ins.playSound(Clips.modal, 0.5);

    let infos = items.map((item) => {
      let id = item.id;
      item.num *= isDouble ? 2 : 1;
      // Global.signArr.push(id.toString());
      if (item.key === 'power') {
        //EnergyMgr.ins.changeEnergy(true, +item.num)
      } else {
        //Global.addPropsSetting(item.key, +item.num);

      }
      // Global.addPropsSetting(item.key, +item.num);
      this.addSignType(item.type);
      //#region
      signItemScript.updateMendSignState(item.access, false);
      signItemScript.updateSignState(true);
      signItemScript.updateTodayState(false);
      signItemScript.setMaskState(true);
      //#endregion
      return {
        id: id,
        label: item.label,
        key: item.key,
        num: item.num,
      };
    });

    /*let propsView = await ResMgr.ins.getUI(ui.PropsModalView);
    let propModalView = propsView.getComponent(PropModalView);

    propModalView.renderProps(infos);
    propModalView.watchVideoCallback = () => {
      // super.showVideo(() => {
        for (const info of infos) {
          if (info.key === 'power') {
            EnergyMgr.ins.changeEnergy(true, +info.num)
          } else {
            Global.addPropsSetting(info.key, +info.num);
          }
          // Global.addPropsSetting(info.key, info.num * 2);
        }
      // });
      // Global.addPropsSetting(ids);
      console.log("领取奖励X2");
    };
    propsView.parent = this.node;*/
  }
  /**
   *  判断有没有领取过的
   * @param infos  签到信息
   * @returns
   */
  checkIsSign(infos: signInInfo[]) {
    return infos.some((item) => item.isSign);
  }
  /**
   *  检查是否满七天
   * @param isDouble 是否双倍
   * @returns
   */
  checkIsFullWeek(isDouble: boolean = false) {
    if (this.signTypes.length >= 7) {
      let fillList = this.allList.filter(
        (item) => item.info[0].type === SignInType.FULL_WEEK
      );
      // 判断是否已经领取
      for (const item of fillList) {
        // if (this.checkIsSign(item.info)) return;
        this.getReward(item.info, item.signScript, isDouble);
      }
    }
  }

  /**
   * 按钮隐藏
   */
  hideBtn() {
    this.todayItem = null;
    this.btnGrousp.active = false;
  }
  close(): void {
    this.node.destroy();
  }
  // update (dt) {}
}
