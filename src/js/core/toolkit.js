/**
 * 工具方法集
 */

 /**
  * 矩阵数组工具集
  */
const matrixTooolkit = {
    makeRow(v = 0) {
        const arr = new Array(9);
        arr.fill(v);
        return arr;
    },

    maekMatrix(v = 0) {
        return Array.from({ length: 9 }, () => this.makeRow(v));
    },
    /**
     * Fisher-Yates 洗牌算法
     */
    shuffle(arr) {
        const endIndex = arr.length - 2;
        for (let i = 0; i <= endIndex; i++) {
            const j = i + Math.floor(Math.random() * (arr.length - i));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

}

/**
 * 宫坐标系工具
 */
const boxToolkits={

}


module.exports = class Toolkit{
    /**
     * 矩阵和数组相关的工具
     */
    static get matrix(){
        return matrixTooolkit;
    }

    /**
     * 宫坐标系相关的工具
     */
    static get box(){
        return boxToolkits;
    }

};