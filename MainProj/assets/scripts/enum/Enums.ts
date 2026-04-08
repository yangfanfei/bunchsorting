/*
 * @Author: jxgamestudio
 * @Description: Game Enums
 */

import LuckyDrawView from "../view/LuckyDrawView";
import MainView from "../view/MainView";
import RankListView from "../view/RankListView";
import ShopUseItemView from "../view/ShopUseItemView";
import SignView from "../view/SignView";

const { ccclass, property } = cc._decorator;
@ccclass("adConfig")

export class adConfig {
  @property()
  platform = "platform";
  @property({ type: cc.Integer })
  id = 0;
  @property({ type: cc.String })
  bannerId: string[] = [];
  @property({ type: cc.String })
  intersitialId: string[] = [];
  @property({ type: cc.String })
  videoId: string[] = [];
  @property({ type: cc.String })
  customId: string[] = [];
}

@ccclass("shareContent")
export class shareContent {
  @property()
  shareId: string = "";
  @property()
  shareLink: string = "";
  @property()
  shareText: string = "Share Title";
}

@ccclass("shareVideoContent")
export class shareVideoContent {
  @property()
  shareId: string = "";
  @property()
  title: string = "Share Title";
  @property()
  desc: string = "";
  @property({ type: cc.String })
  videoTopics: string[] = []
}

@ccclass("shareConfig")
export class shareConfig {
  @property()
  platform = "platform";
  @property({ type: shareContent })
  sharePics: shareContent[] = [];
}

@ccclass("shareVideoConfig")
export class shareVideoConfig {
  @property()
  platform = "platform";
  @property({ type: shareVideoContent })
  sharePics: shareVideoContent[] = [];
}

export const MAX_ARR_LEN = 6;

export const SPLIT_COUNT = 4;

export const CUP_SELECTED_MOVE_HEIGHT = 100;

export const dft_lingWidth = 6; // default water flow width

export const spacesArr = {
  [1]: [40, 1], // bunch count 1，
  [2]: [120, 1], // bunch count 2，
  [3]: [120, 1], // bunch count 3，
  [4]: [100, 1], // bunch count 4，
  [5]: [100, 1], // bunch count 5，
  [6]: [80, 1], // bunch count 5，
};

export enum ItemType {
    Reset = 1,
    Back = 2,
    AddBunch = 3,
    Finish = 4,
    Icon = 5
}

export enum SoundStatus {
  on = 1,
  off = -1,
}

export enum ShopItemState {
  ST_UNACTIVE = 0,
  ST_ACTIVE = 1,
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

/**
 * sound Clips
 */
export const Clips = {
  Button_Click: "Button_Click",
  ContainerFinish: "ContainerFinish",
  firework_1: "firework_1",
  modal: "modal",
  pourWater: "pourWater",
  Show_Victory: "Show_Victory",
  reward: "reward",
  back_inGame: "back_inGame",
  back_inMain: "back_inMain",
};

/**
 * asset type
 */
export type AssetType = {
  type: typeof cc.Asset;
  path: string;
};

/**
 * assettypes and paths
 */
export const Assets = {
  UiPrefab: { type: cc.Prefab, path: "Preload/Prefabs/UI/" } as AssetType,
  CommonPrefab: { type: cc.Prefab, path: "Preload/Prefabs/Common/" } as AssetType,
  Json: { type: cc.JsonAsset, path: "Preload/Jsons/" } as AssetType,
  Sound: { type: cc.AudioClip, path: "Preload/Clips/" } as AssetType,
  UiFrame: { type: cc.SpriteFrame, path: "Preload/UI/" } as AssetType,
};

/** local storage */
export const Key = {
  ToolSetting: "ToolSetting",
  Lv: "Lv",
  Today: "Today",
  CupSetting: "CupSetting",
  ReceiveList: 'ReceiveList',
  ReceiveListTime: 'ReceiveListTime',
  CodeList:'CodeList',
  CoinCount: 'CoinCount',
  CurMaxLevel: 'CurMaxLevel',
  SignArr: 'SignArr',
  SignFirst: 'SignFirst',
  SignDate: 'SignDate',
  LuckyDrawCount:"LuckyDrawCount",
  LuckyDrawTime:"LuckyDrawTime",
  LuckyShowAdTime:"LuckyShowAdTime",
  LuckyDrawHistory:"LuckyDrawHistory",
  CurrentLife:"CurrentLife",
  LifeTimeTick:"LifeTimeTick",
  ActiveDressupItems:"ActiveDressupItems",
  UseDressupItems:"UseDressUpItems",
  AccAdCount:"AccAdCount"
};

/** Event List */
export const events = {
  GameStart: "GameStart",
  Toast: "Toast",
  ChangeSound: "ChangeSound",
  ChangeMusic: "ChangeMusic",
  Reset: "Reset",
  Back: "Back",
  Finish: "Finish",
  AddBunch: "AddBunch",
  Start: "Start",
  TimeStop: "TimeStop",
  LevelFinish: "LevelFinish",
  ExcuteGuideTask: 'ExcuteGuideTask',
  Pause: "Pause",
  LevelSelectChange: "LevelSelectChange",
  BackToMain: "BackToMain",
  ToolItemChange: "ToolItemChange",
  CoinChange:"CoinChange",
  LifeChange:"LifeChange",
  DressUpSelectChange:"DressUpSelectChange",
  RefreshShopShow:"RefreshShopShow"
};

/* for ui prefabs config */
export const ui = {
  GameView: { name: "GameView", layer: 3, clear: false },
  MainView: { name: "MainView", layer: 3, clear: false },
  VictoryView: { name: "VictoryView", layer: 3, clear: false },
  GetItemView: { name: "GetItemView", layer: 3,clear: false },
  ToastView: { name: 'ToastView', layer: 6, clear: false },
  SettingView: { name: 'SettingView', layer: 6, clear: false },
  LuckyDrawView: { name: 'LuckyDrawView', layer: 6, clear: false },
  SignView: { name: "SignView", layer: 6, clear: false },
  RankListView: { name: "RankListView", layer: 6, clear: false },
  ShopView: { name: 'ShopView', layer: 6, clear: false },
  ShopUseItemView: { name: 'ShopUseItemView', layer: 6, clear: false },
  ShopGetItemView: { name: 'ShopGetItemView', layer: 6, clear: false },
};

/*export const prop = {
  reset: { name: "reset", layer: 3, clear: false },
  back: { name: "back", layer: 3, clear: false },
  tube: { name: "tube", layer: 3, clear: false },
};*/

interface colorList {
    colors: string[];
    default_color: string;
}
const color_list: colorList[] = [
    {
        colors: ["#FF7B31", "#FFBA09", "#F7C850", "#FFAE4F", "#E8770F", "#DA6F33", "#F3B865", "#F3A165", "#C95141", "#E38F74", "#99221A", "#F29F3E", "#F88848", "#BE5A12", "#FFB198",],
        default_color: '#FFB198'
    },
    {
        colors: ["#DD8C71", "#E9BE85", "#E7CA95", "#E6B58C", "#CA8565", "#BE7C65", "#E0BC95", "#DBA98C", "#AC635C", "#CB988B", "#803B39", "#D9A77E", "#DA957A", "#A46750", "#E8B9AC",],
        default_color: '#E8B9AC'
    },
    {
        colors: ["#FFB48B", "#FFE0A4", "#FFE8B6", "#FFDAAC", "#FFAF78", "#FFA67B", "#FFE0B6", "#FFD1AF", "#FE8475", "#FFC3B1", "#E53528", "#FFCF9C", "#FFBF98", "#FA8A49", "#FFDCCF",],
        default_color: '#FFDCCF'
    },
    {
        colors: ["#000000", "#4F4F4F", "#737373", "#939393", "#B8B8B8", "#DBDBDB", "#FFFFFF", "#4A4E6D", "#696E97", "#7D84B1", "#949DD6", "#ADB0FF", "#BFC7FF", "#939EE2", "#6F7CD0",],
        default_color: '#6F7CD0'
    },
    {
        colors: ["#008FF7", "#3AACFF", "#6EC2FF", "#5B6CFF", "#1E33F4", "#650DF5", "#003397", "#6C9EFF", "#4A76B8", "#006FD5", "#8A8FFF", "#ADB0FF", "#0075FF", "#00529E", "#001EB9",],
        default_color: '#001EB9'
    },
    {
        colors: ["#758DB8", "#8CA7C8", "#A5BCD4", "#7276B4", "#484BA0", "#5C49A1", "#333A66", "#909FC5", "#69758F", "#5D709A", "#9596C2", "#B3B4D2", "#6679B4", "#455272", "#323478",],
        default_color: '#323478'
    },
    {
        colors: ["#BCE6FF", "#D2F1FF", "#E4F6FF", "#C8D2FF", "#8193FF", "#CD7EFF", "#4E85FF", "#DCECFF", "#BCD8FF", "#9FD3FF", "#E5E7FF", "#F1F2FF", "#ACD8FF", "#75B7FF", "#4C63FF",],
        default_color: '#4C63FF'
    },
    {
        colors: ["#2D9179", "#11A670", "#1AAF67", "#73AA59", "#41C998", "#36DA33", "#65F3AC", "#65F3D1", "#65C941", "#91E374", "#00B8B8", "#D8FF98", "#559040", "#1FCA59", "#98FFA9",],
        default_color: '#98FFA9'
    },
    {
        colors: ["#69887E", "#739A85", "#79A287", "#8DA285", "#91BCA8", "#97C997", "#B4E4C8", "#B6E5D7", "#98BC91", "#B8D7B0", "#82ADAD", "#E7F7D2", "#72886D", "#8BBB93", "#CCF2D1",],
        default_color: '#CCF2D1'
    },
    {
        colors: ["#44CEAF", "#48DFA2", "#4DE697", "#91E55E", "#60F7C3", "#88FC87", "#C1FEDD", "#C0FEEE", "#89F760", "#C1FCAD", "#53EAEA", "#F2FFDF", "#74CF4B", "#5AF887", "#DCFFE2",],
        default_color: '#DCFFE2'
    },
]

