/*
 * @Author: jxgamestudio
 * @Description: 浏览器辅助工具类
 */

function CreateElementForExecCommand(textToClipboard) {
  var forExecElement = document.createElement("div");

  forExecElement.style.position = "absolute";
  forExecElement.style.left = "-10000px";
  forExecElement.style.top = "-10000px";

  forExecElement.textContent = textToClipboard;
  document.body.appendChild(forExecElement);

  //forExecElement.contentEditable = true;
  return forExecElement;
}

function SelectContent(element) {

  var rangeToSelect = document.createRange();
  rangeToSelect.selectNodeContents(element);

  var selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(rangeToSelect);
}
/**
 * @description: save data into localstorage
 * @return {*}
 */
export function save(key: string, val: string | number | any) {
  if (typeof val === "number") {
    val = ("" + val) as string;
  }
  cc.sys.localStorage.setItem(key, val || "");
}

/**
 * @description: load localstorage data,
 * @return {*}
 */
export function load(key: string, type: 0 | 1 | 2 = 1) {
  let res: any = cc.sys.localStorage.getItem(key);
  if (res) {
    switch (type) {
      case 0:
        break;
      case 1:
        res = Number(res);
        break;
      case 2:
        res = JSON.parse(res);
        break;
    }
    return res;
  } else {
    return null;
  }
}

// 获取年月日
export function getDate() {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  // return { year, month, day };
  return `${year}-${month}-${day}`;
}

interface IScrollParams<T> {
  /** 数据 */
  list: T[];
  /** 间距 */
  spacing: number;
  /** 每排几个 */
  row: number;
  /** 滚动组件 */
  scrollView: cc.ScrollView;
  /** 滚动内容 */
  content: cc.Node;
  /** 每个item的高度 */
  receiveItemHeight: number;
  /** 回调函数 */
  cb: (item: T, index: number, list: T[]) => void;
}
/**
 *  滚动函数
 * @param param0  list:数据 spacing:间距 scrollView:滚动组件 content:滚动内容 receiveItemHeight:每个item的高度 cb:回调函数
 */
export function scrollFunc<T>({
  list,
  spacing,
  row,
  scrollView,
  content,
  receiveItemHeight,
  cb,
}: IScrollParams<T>) {
  content.removeAllChildren();
  let nums = list.length;
  content.height = Math.ceil(nums / row) * (receiveItemHeight + spacing);
  for (let i = 0; i < nums; i++) {
    cb && cb(list[i], i, list);
  }
  //滚动到0位置
  scrollView.scrollToTop(0);
}

export class Tools {
  /* node fade In */
  static fadeIn(node: cc.Node, dura = 0.2) {
    cc.tween(node).set({ scale: 0 }).to(dura, { scale: 1 }).start();
  }
  static copyToClipboard(input) {
    var textToClipboard = input; //文本到剪贴板

    var success = true;
    return new Promise<boolean>((resolve, reject) => {
      let api = null
      //if (cc.sys.WECHAT_GAME) {
      //  api = (wx as any)
      //}
      //if (cc.sys.WECHAT_GAME) {
      //  api = (tt as any)
      //}
      if (api) {
        /*wx.setClipboardData({
          data: input,
          success: function (res) {
            success = true
            resolve(success)
            // wx.showToast({
            //   title: '复制成功',
            //   icon: 'success',
            //   duration: 2000
            // });
          },
          fail(e) {
            reject(e)

          }
        });*/
        return
      }

      if (window['clipboardData']) { // 浏览器
        window['clipboardData'].setData("Text", textToClipboard);
      }
      else {
        var forExecElement = CreateElementForExecCommand(textToClipboard);
        SelectContent(forExecElement);

        try {
          //if (window['netscape'] && netscape.security) {
          //  netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
          //}
          //将选定内容复制到剪贴板
          success = document.execCommand("copy", false, null);
          resolve(success)

        }
        catch (e) {
          success = false;
          reject(e)
        }
        //移除临时元素
        document.body.removeChild(forExecElement);
      }


    })

  }
}



