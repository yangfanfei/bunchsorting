/**
 * @Author: joey
 * @Date: 2026-04-06 15:23:43
 * @LastEditors: joey
 * @LastEditTime: 2026-04-06 15:23:43
 * @Description: 商城二级界面,获取道具
 */

import { FuncUtil } from "../base/FuncUtil";
import { events } from "../enum/Enums";
import { Global } from "../Global";
import ConfigMgr from "../manager/ConfigMgr";
import ResMgr from "../manager/ResMgr";
import UserDataMgr from "../manager/UserDataMgr";
import { SdkMgr } from "../sdk/SdkMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ShopGetItemView extends cc.Component {
    @property(cc.Label)
    labName: cc.Label = null;

    @property(cc.Label)
    labDesc: cc.Label = null;

    @property(cc.Label)
    labActive: cc.Label = null;

    @property(cc.Label)
    labCostItemCount: cc.Label = null;

    @property(cc.Sprite)
    sprCostItemIcon:cc.Sprite = null;

    @property(cc.Sprite)
    itemIcon: cc.Sprite = null;

    @property(cc.Button)
    btnUse:cc.Button = null;

    private itemData = null;
    private getType = 0;
    private getCount = 0;
    start () {

    }

    public setItemData(data){
        this.itemData = data;
        this.refreshItemShow();
    }

    private refreshItemShow(){
        let configData = ConfigMgr.ins.getDressUpDataById(this.itemData.id);
        this.labName.string = this.itemData.name;
        if(configData.type == "1")
        {
            this.itemIcon.spriteFrame = FuncUtil.getSprFrameByFruitId(this.itemData.icon);
        }
        else
        {
            this.itemIcon.spriteFrame = FuncUtil.getSprFrameByBunchId(this.itemData.icon);
        }

        this.labDesc.string = this.itemData.desc;
        this.labActive.string = "激活";
        let getInfo = configData.getInfo;
        let getArr = getInfo.split(";");

        this.getType = Number(getArr[0])
        this.getCount = Number(getArr[1]);
        if(this.getType == 1)
        {
            this.labActive.node.setPosition(0,-11);
            this.labCostItemCount.node.active = true;
            this.sprCostItemIcon.node.active = true;
            this.sprCostItemIcon.spriteFrame = ResMgr.ins.getFrameMap("siginCoin");
            this.labCostItemCount.string = Global.currentCoin + "/" + this.getCount;
            if(Global.currentCoin < this.getCount)
            {
                this.btnUse.interactable = false
                FuncUtil.setNodeAndChildrenGray(this.btnUse.node);
            }
        }
        else if(this.getType == 2)
        {
            this.labActive.node.setPosition(0,-11);
            this.labCostItemCount.node.active = true;
            this.sprCostItemIcon.node.active = true;
            this.sprCostItemIcon.spriteFrame = ResMgr.ins.getFrameMap("video");
            this.labCostItemCount.string = UserDataMgr.ins.getAccAdCount() + "/" + this.getCount;
        }
        else if(this.getType == 3)
        {
            this.labActive.node.setPosition(0, 0);
            this.labCostItemCount.node.active = false;
            this.sprCostItemIcon.node.active = false;
            this.labActive.string = "活动激活";
        }

        //console.log("  当前数据:::::::  ",this.itemData, " GetInfo:::: ",getInfo,"  GetArr: ",getArr);
    }

    onClickUse(){
        //console.log("  点击 获取 。。。。。。。。。。。 ");
        if(this.getType == 1)
        {
            if(Global.currentCoin >= this.getCount)
            {
                console.log("  激活 对应皮肤：：：：：：： ",this.itemData.name);
                UserDataMgr.ins.addToActiveDressUpItems(this.itemData.id);
                cc.director.emit(events.RefreshShopShow);
                Global.addCoin(-this.getCount);
                this.onDestroy();
            }
            else
            {
                cc.director.emit(events.Toast, `金币不足，无法激活！`)
            }
        }
        else if(this.getType == 2)
        {
            if(UserDataMgr.ins.getAccAdCount() >= this.getCount)
            {
                console.log("  激活 对应皮肤：：：：：：： ",this.itemData.name);
                UserDataMgr.ins.addToActiveDressUpItems(this.itemData.id);
                cc.director.emit(events.RefreshShopShow);
                this.onDestroy();
            }
            else
            {
                SdkMgr.showDressupRewardVideo((retValue) => {
                    if(retValue == 1)
                    {
                        //UserDataMgr.ins.addToActiveDressUpItems(this.itemData.id);
                        UserDataMgr.ins.adAccAdCountAndSave();
                        this.refreshItemShow();
                    }
                });
            }
        }
    }

    onClickClose(){
        this.onDestroy();
    }

    protected onDestroy(): void {
        this.node.destroy();
    }
}
