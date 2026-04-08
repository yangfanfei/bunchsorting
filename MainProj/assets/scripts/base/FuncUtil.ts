/*
 * @Author: jxgamestudio
 * @Description: 一些公用函数类
 */

import ResMgr from "../manager/ResMgr";
import MainView from "../view/MainView";

export class FuncUtil {

  static grayColor = new  cc.Color(128,128,128,255);

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

  static setNodeAndChildrenGray(node: cc.Node) {
      // 设置当前节点颜色
      let spr = node.getComponent(cc.Sprite);
      let lab = node.getComponent(cc.Label);
      let laboutline = node.getComponent(cc.LabelOutline);
      if(spr)
      {
        this.setSprGray(spr, true);
      }
      if(lab)
      {
        lab.node.color = cc.Color.GRAY;
      }
      if(laboutline)
      {
        console.log(" 字体边框置灰：：：  Node.Name::: ",node.name);
        laboutline.color = new cc.Color(64,64,64);
      }
      
      // 递归处理子节点
      node.children.forEach(child => {
          this.setNodeAndChildrenGray(child);
      });
  }

  static getSprFrameByFruitId(iconID:number)
  {
    let index = "fruiticon" + iconID; // convert to icon index
    return ResMgr.ins.getFrameMap(index);
  }

  static getSprFrameByBunchId(iconID:number)
  {
    let index = "bunchicon" + iconID; // convert to icon index
    console.log(" GetSprFrameByBunchID:::: ",index);
    return ResMgr.ins.getFrameMap(index);
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
