/**
 * 生成数独解决方案
 */
const Toolkit = require("./toolkit");

module.exports = class Generator {

    generate() {
        while (!this.internalGenerate()) {
            console.log("try again!!");
        }
    }

    internalGenerate() {
        this.matrix = Toolkit.matrix.makeMatrix();
        this.orders = Toolkit.matrix.makeMatrix()
            .map(row => row.map((v, i) => i))
            .map(row => Toolkit.matrix.shuffle(row));

        for (let n = 1; n < 10; n++) {
            if (!this.fillNumber(n)) {
                return false;
            }
        }
        return true;
    }

    fillNumber(n) {
        return this.fillRow(n, 0);
    }

    fillRow(n, rowIndex) {
        if (rowIndex > 8) {
            return true;
        }

        const row = this.matrix[rowIndex];
        const orders = this.orders[rowIndex];
        //TODO 随机选择列
        for (let index = 0; index < 9; index++) {
            const colIndex = orders[index];
            //如果这个位置已经有值，跳过
            if (row[colIndex]) {
                continue;
            }

            //检查这个位置是否可以填n
            if (!Toolkit.matrix.checkFillable(this.matrix, n, rowIndex, colIndex)) {
                continue;
            }

            row[colIndex] = n;
            //当前行填写n成功，递归调用 fillRow（）来在下一行中填写n,如果没有填进去，就继续寻找当前行的在一个位置
            if (!this.fillRow(n, rowIndex + 1)) {
                row[colIndex] = 0;
                continue;
            }

            return true;
        }

        return false;
    }
}
