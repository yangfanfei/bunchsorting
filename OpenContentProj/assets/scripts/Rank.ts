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

    @property(cc.Prefab)
    rankItemPrefab: cc.Prefab = null;

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
    // onLoad () {}
    init(arr: LinkItemData[], openid: string) {
        console.log(" OpenDataContext .......  Rank:::::::::::::::::::::: Init ArrData::: ",arr)
        this.content.removeAllChildren();
        this.dataList = arr.sort((a, b) => +b.maxLv - +a.maxLv);
        let courceData = this.dataList = arr.map((item, i) => ({ ...item, num: i + 1 }))
        let nums = arr.length - 3;
        this.content.height = nums * (this.receiveItemHeight + this.spacing);
        for (let i = 0; i < this.dataList.length; i++) {
            let item = this.dataList[i];
            let itemPre = cc.instantiate(this.rankItemPrefab);
            itemPre.getComponent(RankItem).setData(item);
            itemPre.parent = this.content;
        }
        const one = courceData.find(item => item.openid === openid);
        //滚动到0位置
        this.scrollView.scrollToTop(0);
    }

    // 刷新
    openid: string = '';
    refresh(list: LinkItemData[], openid: string) {
        console.log(" OpenDataContext .......  Rank :::::: refresh openid：：",openid)
        this.init(list, openid);
        this.openid = openid
    }
    
    start() {

    }
    
    // update (dt) {}
}
