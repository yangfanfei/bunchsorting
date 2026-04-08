/**
 * @Author: joey
 * @Date: 2026-04-05 20:29:44
 * @LastEditors: joey
 * @LastEditTime: 2026-04-05 20:29:44
 * @Description: 商城道具
 */

import { FuncUtil } from "../base/FuncUtil";
import ResMgr from "../manager/ResMgr";
import UserDataMgr from "../manager/UserDataMgr";
import { events, ui } from "../enum/Enums";
import ShopUseItemView from "../view/ShopUseItemView";
import MainView from "../view/MainView";
import ShopGetItemView from "../view/ShopGetItemView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ShopItem extends cc.Component {
    @property(cc.Sprite)
    itemIcon: cc.Sprite = null;

    @property(cc.Sprite)
    itemBg: cc.Sprite = null;

    @property(cc.Sprite)
    itemRight: cc.Sprite = null;

    private itemData = null;
    private isInUseItemView = false;

    public onEnable(): void {
        this.itemRight.node.active = false;
    }

    public setItemData(itemData){
        this.itemData = itemData;
        this.refreshShow();
    }

    public showItemSelect()
    {
        this.itemRight.node.active = true;
    }

    public hideItemSelect(){
        this.itemRight.node.active = false;
    }

    public isItemSelect(){
        return this.itemRight.node.active == true;
    }

    public setInUseItemView()
    {
        this.itemBg.spriteFrame = ResMgr.ins.getFrameMap("ShopNormalBg");
        // 方式1：直接设置尺寸
        this.itemBg.node.width = 112;
        this.itemBg.node.height = 112;
        this.isInUseItemView = true;
    }

    private refreshShow()
    {
        if(Number(this.itemData.type) == 1)
        {
            this.itemIcon.spriteFrame = FuncUtil.getSprFrameByFruitId(this.itemData.icon);
        }
        else if(Number(this.itemData.type) == 2)
        {
            this.itemIcon.spriteFrame = FuncUtil.getSprFrameByBunchId(this.itemData.icon);
        }

        if(this.itemData.getInfo =="0" || UserDataMgr.ins.isShopItemActive(this.itemData.id))
        {
            this.itemBg.spriteFrame = ResMgr.ins.getFrameMap("ShopActiveBg");
            FuncUtil.setSprGray(this.itemIcon, false);
        }
        else
        {
            this.itemBg.spriteFrame = ResMgr.ins.getFrameMap("ShopUnactiveBg");
            FuncUtil.setSprGray(this.itemIcon, true);
        }
    }

    public async onClick(){
        console.log("  OnClick:::::::  itemID::: ",this.itemData.icon," ItemName::: ",this.itemData.name);
        cc.director.emit(events.DressUpSelectChange, "sceneName", { customData: this.itemData })
        if(this.isInUseItemView == true)
        {
            this.showItemSelect();
        }
        else
        {
            if(this.itemData.getInfo =="0" || UserDataMgr.ins.isShopItemActive(this.itemData.id))
            {
                const view = await ResMgr.ins.getUI(ui.ShopUseItemView);
                view.parent = MainView.ins.node.parent;
                const viewComp = view.getComponent(ShopUseItemView);
                viewComp.setItemData(this.itemData);
            }
            else
            {
                const view = await ResMgr.ins.getUI(ui.ShopGetItemView);
                view.parent = MainView.ins.node.parent;
                const viewComp = view.getComponent(ShopGetItemView);
                viewComp.setItemData(this.itemData);
            }
        }
    }

}
