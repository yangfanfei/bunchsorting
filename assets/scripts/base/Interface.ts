/*
 * @Author: jxgamestudio
 * @Description: 一些基础接口类，以及一些辅助函数
 */


/**一杯水，分成四组四个颜色，0表示没有水 */
export interface _CupInfo {
  colorIds: Array<number>; //长度为4
}


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
  label: "重置" | "后退" | "试管" | "金币" | "体力" |"下一关";
  /** key */
  key: "reset" | "back" | "bunch" | "coin" | "power" | "next";
  /** 数量 */
  num: number;
}

export enum SignInType {
  // NOT_IN_LIST = '0',
  DAY1 = "1",
  DAY2 = "2",
  DAY3 = "3",
  DAY4 = "4",
  DAY5 = "5",
  DAY6 = "6",
  FULL_WEEK = "7",
}

export interface signInInfo extends oneRewardInfo {
  access: AccessType;
  type: SignInType;
  /** 是否已签到 */
  isSign?: boolean;
}

/** 获取方式 */
export enum AccessType {
  /** 分享 */
  Share = "0",
  /** 视频 */
  Video = "1",
  /** 碎片 */
  Fragment = "2",
  None = "3",
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
