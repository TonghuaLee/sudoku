/**
 * 生成九宫格
 */
const Toolkit = require("../core/toolkit");
const Suduku = require("../core/sudoku");
const Checker = require("../core/checker");
class Grid {
    constructor(container) {
        this._$container = container;
    }
    build() {
        const sudoku = new Suduku();
        sudoku.make();
        const matrix = sudoku.puzzleMatrix;

        const rowGroupClasses = ["row_g_top", "row_g_middle", "row_g_bottom"];
        const colGroupClassed = ["col_g_left", "col_g_center", "col_g_right"];

        const $cells = matrix.map(rowValues => rowValues
            .map((cellValues, colIndex) => {
                return $("<span>")
                    .addClass(colGroupClassed[colIndex % 3])
                    .addClass(cellValues ? "fixed" : "empty")
                    .text(cellValues);
            }));

        const $divArray = $cells.map(($spanArray, rowIndex) => {
            return $("<div>")
                .addClass("row")
                .addClass(rowGroupClasses[rowIndex % 3])
                .append($spanArray);
        });

        this._$container.append($divArray);
    }

    layout() {
        const width = $("span:first", this._$container).width();
        $("span", this._$container)
            .height(width)
            .css({
                "line-height": `${width}px`,
                "font-size": width < 32 ? `${width / 2}px` : ""
            });
    }

    bindPopup(popupNumbers) {
        this._$container.on("click", "span", e => {
            const $cell = $(e.target);
            if ($cell.is(".fixed")) {
                return;
            }
            popupNumbers.popup($cell);
        });
    }

    /**
     * 检查用户的结果，成功则提示，失败则显示错误的位置
     */
    check() {
        const $rows = this._$container.children();
        const data = $rows.map((rowIndex, div) => {
            return $(div).children()
                .map((cloIndex, span) => parseInt($(span).text()) || 0);
        }).toArray()
            .map($data => $data.toArray());
        const checker = new Checker(data);
        if (checker.check()) {
            return true;
        }

        const marks=checker.matrixMarks;
        this._$container.children()
        .each((rowIndex,div)=>{
            $(div).children().each((colIndex,span)=>{
                const $span=$(span);
                if ($span.is(".fixed")|| marks[rowIndex][colIndex]) {
                    $span.removeClass("error");
                }else{
                    $(span).addClass("error");
                }
            });
        });
    }

    /**
     * 重置到当前迷盘的初始状态
     */
    reset() {
        this._$container.find("span:not(.fixed)")
        .removeClass("error mark1 mark2")
        .addClass("empty")
        .text(0);
    }

    /**
     * 清除标记
     */
    clear() {
        this._$container.find("span.error")
        .removeClass("error");
    }

    /**
     * 新建一局
     */
    rebuild() {
        this._$container.empty();
        this.build();
        this.layout();
    }
}

module.exports = Grid;