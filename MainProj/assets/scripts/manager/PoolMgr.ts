/*
 * @Author: jxgamestudio
 * @Description: pool manager
 */
export class PoolMgr {
  private _dictPool: { [key: string]: cc.NodePool } = {};
  private _dictPrefab: { [key: string]: cc.Prefab } = {};

  static _ins: PoolMgr;
  /* class member could be defined like this */
  // dummy = '';

  static get ins() {
    if (this._ins) {
      return this._ins;
    }

    this._ins = new PoolMgr();

    return this._ins;
  }

  public copyNode(copynode: cc.Node, parent: cc.Node | null): cc.Node {
    let name = copynode.name;
    let node = null;
    if (this._dictPool.hasOwnProperty(name)) {
      let pool = this._dictPool[name];
      if (pool.size() > 0) {
        node = pool.get();
      } else {
        node = cc.instantiate(copynode);
      }
    } else {
      let pool = new cc.NodePool();
      this._dictPool[name] = pool;

      node = cc.instantiate(copynode);
    }
    if (parent) {
      node.parent = parent;
      node.active = true;
    }
    return node;
  }

  /**
   * @description: get the node from the pool
   * @param {Prefab} prefab
   * @param {Node} parent
   * @param {Vec3} pos
   * @return {*}
   */
  public getNode(
    prefab: cc.Prefab | string,
    parent?: cc.Node,
    pos?: cc.Vec3
  ): cc.Node {
    let tempPre: cc.Prefab;
    let name;
    if (typeof prefab === "string") {
      tempPre = this._dictPrefab[prefab];
      name = prefab;
    } else {
      tempPre = prefab;
      name = prefab.data.name;
    }

    let node: cc.Node;
    if (this._dictPool.hasOwnProperty(name)) {
      //已有对应的对象池
      let pool = this._dictPool[name];
      if (pool.size() > 0) {
        node = pool.get();
      } else {
        if (!tempPre) {
          console.log("Pool invalid prefab name = ", name);
          return null;
        }
        node = cc.instantiate(tempPre);
      }
    } else {
      if (!tempPre) {
        console.log("Pool invalid prefab name = ", name);
        return null;
      }
      //没有对应对象池，创建他！
      let pool = new cc.NodePool();
      this._dictPool[name] = pool;

      node = cc.instantiate(tempPre);
    }

    if (parent) {
      node.parent = parent;
      node.active = true;
      if (pos) node.position = pos;
    }

    return node;
  }

  /**
   * @description: put the node into the pool
   * @param {Node} node
   * @param {*} isActive
   * @return {*}
   */
  public putNode(node: cc.Node | null, isActive = false) {
    if (!node) {
      return;
    }

    //console.log("回收信息",node.name,node)
    let name = node.name;
    let pool = null;
    // node.active = isActive
    if (this._dictPool.hasOwnProperty(name)) {

      pool = this._dictPool[name];
    } else {

      pool = new cc.NodePool();
      this._dictPool[name] = pool;
    }

    pool.put(node);
  }

  /**
   * @description: clear the pool based on name
   * @param {string} name
   * @return {*}
   */
  public clearPool(name: string) {
    if (this._dictPool.hasOwnProperty(name)) {
      let pool = this._dictPool[name];
      pool.clear();
    }
  }

  public setPrefab(name: string, prefab: cc.Prefab): void {
    this._dictPrefab[name] = prefab;
  }

  public getPrefab(name: string): cc.Prefab {
    return this._dictPrefab[name];
  }
}
