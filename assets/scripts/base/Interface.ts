/*
 * @Author: jxgamestudio
 * @Description: 一些基础接口类，以及一些辅助函数
 */

import Cup from "../game/Cup";

/**一杯水，分成四组四个颜色，0表示没有水 */
export interface _CupInfo {
  colorIds: Array<number>; //长度为4
}

/**
 *
 */
export interface SpacesArr {
  [index: number]: Array<number>;
}

// 记录选中的杯子
export interface _SelectCupInfo {
  oneSecectCup: Cup;
  twoSecectCup: Cup;
}
//
export interface _CupTopInfo {
  /** 返回空位数量 */
  emptyNum: number; //
  /** 返回杯顶颜色ID */
  topColorId: number; //
  /** 返回杯顶颜色数量 */
  topColorNum: number; //
  /** 返回杯顶颜色的十六进制表示，如果颜色ID无效，则返回默认颜色 */
  colorHex: string; //
}

/**
 * 杯子管理器接口
 */
export interface CupManager {
  /** 目标点 */
  dstPt: cc.Vec2;
  /** 目标全局位置 */
  dstGlobal: cc.Vec2;
  /** 视图大小 */
  viewSize: cc.Size;
  /** 是否在右侧 */
  isRight: boolean;
}

/**
 * Action接口，表示一个动作
 */
export interface Action {
  /** 动作的起始位置 */
  from: number;
  /** 动作的结束位置 */
  to: number;
  /** 动作的数量 */
  num: number;
  /** 动作的颜色ID */
  colorId: number;
}

/**
 * 称号接口
 */
export interface ITitle {
  title: string;
  lv: number;
  desc?: string;
  children?: ITitle[];
}

export interface ToolInfos {
  /** id */
  id: number;
  /** key */
  key: "reset" | "back" | "tube" ;
  /** count */
  num: number;
}

/** 商品 */
export interface ShopOneInfo {
  /** 商品id */
  id: number;
  /** 商品名称 */
  name: string;
  /** 商品价格 */
  price: number;
  /** 条件要求（ask） */
  ask?: string;
  /** 商品描述 */
  describe: string;
  /** 未解锁描述 */
  lockText: string;
}
