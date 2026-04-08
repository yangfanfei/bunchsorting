/*
 * @Author: jxgamestudio
 * @Description: 一些基础接口类，以及一些辅助函数
 */

import { AccessType, ShopItemState, SignInType } from "../enum/Enums";

/** 一个串的四种颜色 */
export interface BunchInfo {
  colorIds: Array<number>; //长度为4
}

export interface BunchTopInfo {
  /** 空位数量 */
  emptyNum: number; //
  /** 返回Top颜色ID */
  topColorId: number; //
  /** 返回Top颜色数量 */
  topColorNum: number; //
}

/**
 *
 */
export interface SpacesArr {
  [index: number]: Array<number>;
}

/** 抽奖 */
export interface oneRewardInfo {
  /** id */
  id: number;
  /** 标签 */
  label: "重置" | "后退" | "加串" | "金币" | "完成" | "转盘密钥";
  /** key */
  key: "reset" | "back" | "bunch" | "coin" | "finish" | "luckyKey";
  /** 数量 */
  num: number;
}


export interface signInInfo extends oneRewardInfo {
  access: AccessType;
  type: SignInType;
  /** 是否已签到 */
  isSign?: boolean;
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


export interface ToolInfos {
  /** id */
  id: number;
  /** key */
  key: "reset" | "back" | "bunch" | "finish" | "luckyKey";
  /** count */
  num: number;
}

/**
  "id":"15",
  "icon":"15",
  "name":"火龙果2",
  "desc":"描述描述",
  "type":"1",
  "getInfo":"3"
 */
/** 商品信息 */
export interface ShopOneInfo {
  /** 商品id */
  id: number;
  /** 商品icon */
  icon: number;
  /** 商品名称 */
  name: string;
  /** 商品描述 */
  desc: string;
  /** 商品类型 */
  type: number;
  /** 解锁条件 */
  lockText: string;
}

export interface ShopItemStorageData {
  id:number                   //  ID
  activeState:ShopItemState   //  状态
}