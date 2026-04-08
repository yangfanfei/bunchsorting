/**
 * @Author: joey
 * @Date: 2026-04-05 19:56:02
 * @LastEditors: joey
 * @LastEditTime: 2026-04-05 19:56:02
 * @Description: 商城界面
 */

import BaseView from "./BaseView";
import ConfigMgr from "../manager/ConfigMgr";
import ShopItem from "../game/ShopItem";
import { ShopOneInfo } from "../base/Interface";
import UserDataMgr from "../manager/UserDataMgr";
import { events } from "../enum/Enums";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ShopView extends BaseView {

    @property(cc.Label)
    labelAlreadyGet: cc.Label = null;

    @property(cc.Node)
    itemRoot:cc.Node = null;

    @property(cc.Prefab)
    shopItemPrefab:cc.Prefab = null;

    private itemList: cc.Node[] = [];
    private alreadyGetList:Array<ShopOneInfo> = [];
    start () {
        this.initPanelShow();
    }

    onEnable(): void {
        cc.director.on(events.RefreshShopShow, this.initPanelShow, this);
    }

    onDisable() {
        cc.director.off(events.RefreshShopShow, this.initPanelShow, this);
    }

    initPanelShow()
    {
        this.destoryAllItems();
        let dressupList = ConfigMgr.ins.getDressUpList();
        let count = dressupList.length;
        this.alreadyGetList = [];

        for(let i = 0; i < count; ++i)
        {
            let data = dressupList[i];
            if(data.getInfo =="0" || UserDataMgr.ins.isShopItemActive(data.id))
            {
                this.alreadyGetList.push(data)
            }
        }

        console.log(" DressUpList::::::::::: ",dressupList);
        console.log(" ActiveList:::::::::::: ",this.alreadyGetList);
        let startIndex = 0;
        for(; startIndex < this.alreadyGetList.length; ++startIndex)
        {
            let data = this.alreadyGetList[startIndex];
            let ItemPre = cc.instantiate(this.shopItemPrefab);
            let ItemComp = ItemPre.getComponent(ShopItem);
            ItemComp.setItemData(data);
            ItemPre.parent = this.itemRoot;
            this.itemList.push(ItemPre);
        }

        for(let i = 0; i < count; ++i)
        {
            let data = dressupList[i];
            if(this.hasDressupDataWithId(data.id)) continue;

            let ItemPre = cc.instantiate(this.shopItemPrefab);
            let ItemComp = ItemPre.getComponent(ShopItem);
            ItemComp.setItemData(data);
            ItemPre.parent = this.itemRoot;
            this.itemList.push(ItemPre);
        }

        this.labelAlreadyGet.string = this.alreadyGetList.length + "/" + dressupList.length;
    }

    hasDressupDataWithId(id){
        return this.alreadyGetList.some(data => data.id === id);
    }

    private destoryAllItems(){
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

    onClickClose() {
        let count = this.itemList.length;
        for (let i = count - 1; i >= 0; i--) {
            let node = this.itemList[i];
            if (node && node.isValid) {
                node.destroy();
            }
            this.itemList.pop(); // 删除数组最后一个元素
        }
        super.close();
        this.node.destroy();
    }

    protected onDestroy()
    {
        let count = this.itemList.length;
        for (let i = count - 1; i >= 0; i--) {
            let node = this.itemList[i];
            if (node && node.isValid) {
                node.destroy();
            }
            this.itemList.pop(); // 删除数组最后一个元素
        }
        super.close();
        this.node.destroy();
    }
}
