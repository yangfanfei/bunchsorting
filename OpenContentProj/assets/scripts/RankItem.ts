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
    rankNumIcon: cc.SpriteFrame[] = [] // 0 first 1second 2 third
    @property(cc.Node)
    private NameNode: cc.Node = null;
    @property(cc.Node)
    private HeadNode: cc.Node = null;
    @property(cc.Node)
    private lvNode: cc.Node = null;
    @property(cc.Node)
    private rankNumIconNode: cc.Node = null;
    @property(cc.Node)
    private rankNumLabelNode: cc.Node = null;

    private linkType: LinkType = LinkType.My
    // 复选 是否是我的
    // @property(cc.Boolean)
    // isMy: boolean = false;
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}
    init(linkType: LinkType = LinkType.My) {
        this.linkType = linkType;
        this.changeState(linkType);
    }
    changeState(linkType: LinkType) {
        /*switch (linkType) {
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
        }*/
    }
    setLvLabel(linkType: LinkType, num: string) {
        this.lvNode.getComponent(cc.RichText).string =` <color=#6ca9c4><b><size=32>${num}关</b> </size></color> `;
    }

    start() {
    }

    async setData(data: LinkItemData) {
        console.log("RankItem.SetData::: ",data);
        this.setRankData(data.num);
        //this.HeadNode.getComponent(cc.Sprite).spriteFrame = await updateAvatar(data.img);
        this.NameNode.getComponent(cc.Label).string = data.name;
        this.setLvLabel(this.linkType, data.maxLv);
    }

    setRankData(rankNum:number)
    {
        if(rankNum <= 3)
        {
            this.rankNumIconNode.active = true;
            this.rankNumLabelNode.active = false;
            if(rankNum == 1)
            {
                this.rankNumIconNode.getComponent(cc.Sprite).spriteFrame = this.rankNumIcon[0];
            }
            else if(rankNum == 2)
            {
                this.rankNumIconNode.getComponent(cc.Sprite).spriteFrame = this.rankNumIcon[1];
            }
            else if(rankNum == 3)
            {
                this.rankNumIconNode.getComponent(cc.Sprite).spriteFrame = this.rankNumIcon[2];
            }
        }
        else
        {
            this.rankNumIconNode.active = false;
            this.rankNumLabelNode.active = true;
            this.rankNumLabelNode.getComponent(cc.Label).string = rankNum.toString();
        }
    }
    // update (dt) {}
}
