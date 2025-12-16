// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import RankItem, { LinkItemData, LinkType, updateAvatar } from "./RankItem";

const { ccclass, property } = cc._decorator;
@ccclass("LinkImg")
/** 广告配置 */
export class LinkImg {
    @property(cc.SpriteFrame)
    DImg: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    CImg: cc.SpriteFrame = null;
}

@ccclass
export default class Rank extends cc.Component {

    @property([LinkImg])
    oneToThree: LinkImg[] = [];
    @property(cc.Node)
    topNode: cc.Node = null;
    @property(cc.Prefab)
    rankItemPrefab: cc.Prefab = null;
    @property(RankItem)
    myRankItem: RankItem = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Integer)
    receiveItemHeight: number = 0;

    /** 间距 */
    @property(cc.Integer)
    spacing: number = 20;
    // #FAE847   #ffffff
    // LIFE-CYCLE CALLBACKS:

    private dataList: LinkItemData[] = []
    private topList: LinkItemData[] = []
    // onLoad () {}

    init(arr: LinkItemData[], openid: string) {

        this.content.removeAllChildren();
        this.dataList = arr.sort((a, b) => +b.maxLv - +a.maxLv);
        let courceData = this.dataList = arr.map((item, i) => ({ ...item, num: i + 1 }))
        this.topList = this.dataList.slice(0, 3);
        this.dataList = this.dataList.slice(3);
        let nums = arr.length - 3;
        this.content.height = nums * (this.receiveItemHeight + this.spacing);
        this.setTopData(this.topList)
        for (let i = 0; i < this.dataList.length; i++) {
            let item = this.dataList[i];
            let itemPre = cc.instantiate(this.rankItemPrefab);
            itemPre.getComponent(RankItem).init(this.linkType);
            itemPre.getComponent(RankItem).setData(item);
            itemPre.parent = this.content;
        }
        const one = courceData.find(item => item.openid === openid);
        if (one) this.myRankItem.setData(one);

        //滚动到0位置
        this.scrollView.scrollToTop(0);
    }

    async setTopData(arr: LinkItemData[]) {
        const chnidren = this.topNode.children;
        for (let i = 0; i < chnidren.length; i++) {
            const itemNode = chnidren[i];
            const item = arr[i];
            if (!item) return
            itemNode.getChildByName('lvLabel').getComponent(cc.RichText).string = `<color=#FFFFFF>最高 <b><size=24><color=#F5DA6A>${item.maxLv}</color></size></b> 关</color>`;
            itemNode.getChildByName('name').getComponent(cc.Label).string = item.name;
            // itemNode.getChildByName('oneLabel').getComponent(cc.Label).string = item.name;
            itemNode.getChildByName('HeaderImg').getComponent(cc.Sprite).spriteFrame = await updateAvatar(item.img);
            // updateAvatar
        }
    }
    private linkType: LinkType = null
    // 刷新
    openid: string = '';
    refresh(linkType: LinkType, list: LinkItemData[], openid: string) {
        this.linkType = linkType
        this.init(list, openid);
        this.openid = openid
    }
    start() {
        // this.linkType = LinkType.Default
        // this.init(list);

    }
    changeState(sate: LinkType.Challenge | LinkType.Default) {
        const firstBg = this.topNode.getChildByName('firstBg')
        const secondBg = this.topNode.getChildByName('secondBg')
        const thirdBg = this.topNode.getChildByName('thirdBg')
        switch (sate) {
            case LinkType.Default:
                // oneLabel name
                firstBg.getComponent(cc.Sprite).spriteFrame = this.oneToThree[0].DImg;
                secondBg.getComponent(cc.Sprite).spriteFrame = this.oneToThree[1].DImg;
                thirdBg.getComponent(cc.Sprite).spriteFrame = this.oneToThree[2].DImg;
                firstBg.getChildByName('oneLabel').color = new cc.Color(255, 255, 255);;
                firstBg.getChildByName('name').color = new cc.Color(0, 0, 0);;
                break;
            case LinkType.Challenge:
                firstBg.getComponent(cc.Sprite).spriteFrame = this.oneToThree[0].CImg;
                secondBg.getComponent(cc.Sprite).spriteFrame = this.oneToThree[1].CImg;
                thirdBg.getComponent(cc.Sprite).spriteFrame = this.oneToThree[2].CImg;
                firstBg.getChildByName('oneLabel').color = new cc.Color(250, 232, 76);;
                firstBg.getChildByName('name').color = new cc.Color(255, 255, 255);;
                break;
        }
    }
    // update (dt) {}
}
