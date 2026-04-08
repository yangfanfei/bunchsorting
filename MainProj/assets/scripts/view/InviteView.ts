/**
 * @Author: joey
 * @Date: 2026-04-05 19:55:30
 * @LastEditors: joey
 * @LastEditTime: 2026-04-05 19:55:30
 * @Description: 好友邀请界面
 */

import BaseView from "./BaseView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class InviteView extends BaseView {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    start () {

    }

    // update (dt) {}
}
