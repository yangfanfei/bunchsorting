/*
 * @Author: jxgamestudio
 * @Description: 一些公用函数类
 */

import MainView from "../view/MainView";

export class FuncUtil {
  static getSprFrameByItemType(itemType:string)
  {
    let retSpr = null;
    if(itemType == "coin")
    {
      retSpr = MainView.ins.coinSpr;
    }
    else if(itemType == "reset")
    {
      retSpr = MainView.ins.resetSpr;
    }
    else if(itemType == "back")
    {
      retSpr = MainView.ins.backSpr;
    }
    else if(itemType == "finish")
    {
      retSpr = MainView.ins.finishSpr;
    }
    else if(itemType == "bunch")
    {
      retSpr = MainView.ins.bunchSpr;
    }
    else if(itemType == "luckyKey")
    {
      retSpr = MainView.ins.luckyKeySpr;
    }

    return retSpr;
  }

  static setSprGray(sprNode:cc.Sprite, isGray:boolean = false)
  {
    if (isGray) {
        // 获取内置灰度材质并设置
        const grayMaterial = cc.Material.getBuiltinMaterial("2d-gray-sprite");
        sprNode.setMaterial(0, grayMaterial);
    } else {
        // 恢复为普通材质
        const normalMaterial = cc.Material.getBuiltinMaterial("2d-sprite");
        sprNode.setMaterial(0, normalMaterial);
    }
  }
}
