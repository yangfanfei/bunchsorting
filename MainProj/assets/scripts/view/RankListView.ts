// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { LinkType, SubContent } from "../sdk/WX/SubContent";
import BaseView from "./BaseView";

const { ccclass, property } = cc._decorator;
enum TabIndex {
    Default = 1,
    Challenge = 2
}
@ccclass("LinkImg")
/** 广告配置 */
export class LinkImg {
    @property(cc.SpriteFrame)
    defaultImg: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    checkImg: cc.SpriteFrame = null;
}
@ccclass
export default class RankListView extends BaseView {

    @property([LinkImg])
    imgs: LinkImg[] = [];
    @property(cc.Node)
    btnsNode: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    currentIndex: TabIndex = TabIndex.Default;
    start() {
        this.changeState(undefined, this.currentIndex)
        // setTimeout(() => {
        //     SubContent.setData({
        //         type: Math.random() > 0.5 ? 1 : 2,
        //         // type: this.currentIndex as unknown as LinkType,
        //         score: 100,
        //     })
        // }, 2000);
    }
    changeState(e, index: TabIndex) {
        this.currentIndex = index;
        this.btnsNode.children.forEach((node: cc.Node, index) => {
            node.getComponent(cc.Sprite).spriteFrame = this.imgs[index].defaultImg;
        });
        setTimeout(() => {
            SubContent.getData(index as unknown as LinkType)
        }, 300);
        this.btnsNode.children[index - 1].getComponent(cc.Sprite).spriteFrame = this.imgs[index - 1].checkImg;
    }
    goBack() {
        super.close();
        //  PoolMgr.ins.getNode("HomeView", this.node.parent);
        this.node.destroy();
    }
    // update (dt) {}
}
