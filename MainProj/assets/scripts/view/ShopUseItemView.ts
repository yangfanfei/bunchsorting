/**
 * @Author: joey
 * @Date: 2026-04-06 15:23:43
 * @LastEditors: joey
 * @LastEditTime: 2026-04-06 15:23:43
 * @Description: 商城二级界面
 */

import { FuncUtil } from "../base/FuncUtil";
import { events } from "../enum/Enums";
import ShopItem from "../game/ShopItem";
import ConfigMgr from "../manager/ConfigMgr";
import UserDataMgr from "../manager/UserDataMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ShopUseItemView extends cc.Component {
    @property(cc.Label)
    labName: cc.Label = null;

    @property(cc.Node)
    itemRoot: cc.Node = null;

    @property(cc.Sprite)
    itemIcon: cc.Sprite = null;

    @property(cc.Prefab)
    itemPre: cc.Prefab = null;

    private itemData = null;
    private itemList:Array<cc.Node> = [];
    private currentSelectData = null;

    start () {

    }

    protected onEnable(): void {
        cc.director.on(events.DressUpSelectChange, this.hideAllItemSelect, this);
    }

    onDisable() {
        cc.director.off(events.DressUpSelectChange, this.hideAllItemSelect, this);
    }

    public setItemData(data){
        this.itemData = data;
        this.labName.string = data.name;
        if(this.itemData.type == "1")
        {
            this.itemIcon.spriteFrame = FuncUtil.getSprFrameByFruitId(this.itemData.icon);
        }
        else
        {
            this.itemIcon.spriteFrame = FuncUtil.getSprFrameByBunchId(this.itemData.icon);
        }
        console.log("  当前数据:::::::  ",this.itemData);
        this.clearAllItemList();
        this.refreshItemShow();
    }

    private refreshItemShow(){
        let itemList = UserDataMgr.ins.getUseItemList();
        let count = itemList.length;
        for(let i = 0; i < count; ++i)
        {
            let id = itemList[i];
            let itemData = ConfigMgr.ins.getDressUpDataById(id);
            if(itemData.type != this.itemData.type) continue;

            let item = cc.instantiate(this.itemPre);
            item.parent = this.itemRoot;
            let ItemComp = item.getComponent(ShopItem);
            ItemComp.setItemData(itemData);
            ItemComp.setInUseItemView();
            if(itemData.id == this.itemData.id)
            {
                ItemComp.showItemSelect();
            }
            this.itemList.push(item);
            //console.log(" ID::::::: ",id," ItemData:: ",itemData);
        }
    }

    onClickUse(){
        console.log("  点击 使用。。。。。。。。。。。。  ");
        if(this.currentSelectData)
        {
            UserDataMgr.ins.changeUseDressUpItem(this.itemData.id, this.currentSelectData.id);
            this.setItemData(this.currentSelectData);
        }
        else
        {
            //console.log(" 没有选择，暂时不用切换！");
            cc.director.emit(events.Toast, `请选择一个不同的水果替换！`)
        }
    }

    onClickClose(){
        this.onDestroy();
    }

    private clearAllItemList(){
        let count = this.itemList.length;
        for (let i = count - 1; i >= 0; i--) {
            let node = this.itemList[i];
            if (node && node.isValid) {
                node.destroy();
            }
            this.itemList.pop(); // 删除数组最后一个元素
        }

        this.itemList = [];
    }

    private hideAllItemSelect(event, data){
        console.log( " hideAllItemSelect。。。。  Data:: ",data);
        this.currentSelectData = data.customData;
        let count = this.itemList.length
        for (let i = 0; i  < count; i++) {
            let node = this.itemList[i];
            let itemComp = node.getComponent(ShopItem);
            itemComp.hideItemSelect();
        }
    }

    protected onDestroy(): void {
        let count = this.itemList.length;
        for (let i = count - 1; i >= 0; i--) {
            let node = this.itemList[i];
            if (node && node.isValid) {
                node.destroy();
            }
            this.itemList.pop(); // 删除数组最后一个元素
        }
        this.node.destroy();
    }
}
