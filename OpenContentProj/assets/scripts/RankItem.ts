// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

// #F5DA6A
// #000000
// #FFFFFF
const labelColor = [
    new cc.Color(245, 218, 106),
    new cc.Color(0, 0, 0),
    new cc.Color(255, 255, 255),
]
export enum LinkType {
    My = 0,
    Default = 1,
    Challenge = 2
}
export interface LinkItemData {
    num: number;
    img: string;
    name: string;
    maxLv: string;
    openid: string;
}
/**
* 更新头像
* @param url 头像链接
*/
export function updateAvatar(url: string) {
    return new Promise<cc.SpriteFrame>((resolve, reject) => {
        // resolve()
        let image = wx.createImage();
        image.onload = () => {
            let texture = new cc.Texture2D();
            texture.initWithElement(image);
            texture.handleLoadedTexture();
            resolve(new cc.SpriteFrame(texture))
            // this.ItemNode.getChildByName('HeaderImg').getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
        };
        image.src = url;
    })

}
@ccclass
export default class RankItem extends cc.Component {

    @property([cc.SpriteFrame])
    imgs: cc.SpriteFrame[] = []// 0 我得 1日常 2 无尽
    @property(cc.Sprite)
    rankBg: cc.Sprite = null;
    private linkType: LinkType = LinkType.My
    @property(cc.Node)
    private ItemNode: cc.Node = null;
    // 复选 是否是我的
    // @property(cc.Boolean)
    // isMy: boolean = false;
    // LIFE-CYCLE CALLBACKS:
    ''
    // onLoad () {}
    init(linkType: LinkType = LinkType.My) {
        this.linkType = linkType;
        switch (linkType) {
            case LinkType.My:
                this.rankBg.spriteFrame = this.imgs[0];
                break;
            case LinkType.Default:
                this.rankBg.spriteFrame = this.imgs[1];
                break;
            case LinkType.Challenge:
                this.rankBg.spriteFrame = this.imgs[2];

                break;

            default:
                break;
        }
        this.changeState(linkType);
    }
    changeState(linkType: LinkType) {
        switch (linkType) {
            case LinkType.My:
                this.node.getChildByName('RankNumLabel').color = labelColor[0];
                this.ItemNode.getChildByName('name').color = labelColor[1];
                break;
            case LinkType.Default:
            case LinkType.Challenge:
                this.node.getChildByName('RankNumLabel').color = labelColor[1];
                this.ItemNode.getChildByName('name').color = labelColor[2];
                break;
            default:
                break;
        }
    }
    setLvLabel(linkType: LinkType, num: string) {
        switch (linkType) {
            case LinkType.My:
                this.ItemNode.getChildByName('lvLabel').getComponent(cc.RichText).string = `<color=#000000 >最高<b><size=50><color=#000000>${num}</color></size></b>关</color>`;

                break;

            default:
                this.ItemNode.getChildByName('lvLabel').getComponent(cc.RichText).string = `<color=#ffffff >最高<b><size=50><color=#F5DA6A>${num}</color></size></b>关</color>`;

                break;
        }
    }

    start() {
    }

    async setData(data: LinkItemData) {
        this.node.getChildByName('RankNumLabel').getComponent(cc.Label).string = data.num + '';
        this.ItemNode.getChildByName('HeaderImg').getComponent(cc.Sprite).spriteFrame = await updateAvatar(data.img);
        this.ItemNode.getChildByName('name').getComponent(cc.Label).string = data.name;
        this.setLvLabel(this.linkType, data.maxLv);
    }
    // update (dt) {}
}
