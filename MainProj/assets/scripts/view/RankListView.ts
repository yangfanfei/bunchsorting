/*
 * @Author: jxgamestudio
 * @Description:  RankList View
 */

import { SdkMgr } from "../sdk/SdkMgr";
import { LinkType, SubContent } from "../sdk/WX/SubContent";
import BaseView from "./BaseView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RankListView extends BaseView {

    @property(cc.Node)
    btnsNode: cc.Node = null;

    @property(cc.Node)
    mainNode: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    start() {
        this.changeState()
    }

    changeState() {
        setTimeout(() => {
            SubContent.getRankData()
        }, 300);
    }

    onClickClose() {
        super.close();
        //  PoolMgr.ins.getNode("HomeView", this.node.parent);
        this.node.destroy();
    }

    onClickShare(){
        console.log(" OnClick.Share......................  ");
        SdkMgr.shareFn(() => {
            console.log(" Share... Callback.");
        })
    }
    // update (dt) {}
}
