import { FuncUtil } from "../base/FuncUtil";
import { ItemType } from "../enum/Enums";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RewardItem extends cc.Component {

    @property(cc.Label)
    labCount: cc.Label = null;
    
    @property(cc.Node)
    sprIcon: cc.Node = null;

    start () {

    }

    public setItemInfo(itemType:string, itemCount:number)
    {
        console.log(" RewardItem.ItemType::: ",itemType,"  ItemCount::: ",itemCount)
        let spr = FuncUtil.getSprFrameByItemType(itemType);
        this.sprIcon.getComponent(cc.Sprite).spriteFrame = spr;
        if(itemType == "coin")
        {
            this.sprIcon.scale = 1;
            this.labCount.node.active = true;
        }
        else
        {
            this.sprIcon.scale = 0.8;
            this.labCount.node.active = false;
        }
        this.labCount.string = itemCount.toString();
    }

    // update (dt) {}
}
