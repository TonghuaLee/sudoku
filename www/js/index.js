/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	const Grid=__webpack_require__(1);
	const PopupNumbers = __webpack_require__(6);
	
	const grid=new Grid($("#container"));
	grid.build();
	grid.layout(); 
	
	const popupnumbers=new PopupNumbers($("#popupBumbers"));
	grid.bindPopup(popupnumbers);
	
	$("#check").on("click", e => { 
	    if(grid.check()){
	        alert("恭喜你取得胜利✌️");
	    }
	});
	$("#reset").on("click", e => {
	    grid.reset();
	 });
	$("#clear").on("click", e => { 
	    grid.clear();
	});
	$("#rebuild").on("click",e=>{
	    grid.rebuild();
	});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * 生成九宫格
	 */
	const Toolkit = __webpack_require__(2);
	const Suduku = __webpack_require__(3);
	const Checker = __webpack_require__(5);
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

/***/ }),
/* 2 */
/***/ (function(module, exports) {

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
	
	    makeMatrix(v = 0) {
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
	    },
	
	    /**
	     * 检查指定位置是否可以填写数字 n
	     */
	    checkFillable(matrix,n,rowIndex,colIndex){
	        const row=matrix[rowIndex];
	        const column =this.makeRow().map((v,i)=> matrix[i][colIndex]);
	        const {boxIndex}=boxToolkit.convertToBoxIndex(rowIndex,colIndex);
	        const box=boxToolkit.getBoxCells(matrix,boxIndex);
	        for (let i = 0; i < 9; i++) {
	            if (row[i]===n||column[i]===n||box[i]==n) {
	                return false;
	            }
	        }
	        return true;
	    }
	}
	
	/**
	 * 宫坐标系工具
	 */
	const boxToolkit={
	
	    getBoxCells(matrix,boxIndex){
	        const startRowIndex=Math.floor(boxIndex/3)*3;
	        const startColIndex=boxIndex%3*3;
	        const result=[];
	        for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
	            const rowIndex= startRowIndex+Math.floor(cellIndex/3);
	            const colIndex = startColIndex + cellIndex % 3;
	            result.push(matrix[rowIndex][colIndex]);
	        }
	        return result;
	    },
	
	    convertToBoxIndex(rowIndex,colIndex){
	        return {
	            boxIndex: Math.floor(rowIndex/3)*3+Math.floor(colIndex/3),
	            cellIndex: rowIndex%3*3+colIndex%3
	        };
	    },
	
	    convertFromBoxIndex(boxIndex, cellIndex) {
	        return {
	            rowIndex: Math.floor(boxIndex / 3) * 3 + Math.floor(cellIndex / 3),
	            colIndex: boxIndex % 3 * 3 + cellIndex % 3
	        };
	    }
	
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
	        return boxToolkit;
	    }
	
	};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * 生产数独游戏
	 */
	
	 //1. 生成完成的解决放案：Generator
	 //2. 随机去除部分数据：按比例
	
	 const Generator=__webpack_require__(4);
	
	 module.exports =class Sudoku{
	     constructor(){
	         const generator=new Generator();
	         generator.generate();
	         this.solutionMatrix=generator.matrix;
	     }
	
	     make(level=5){
	         //const shouldRid=Math.random()*9<level;
	        //生成迷盘
	        this.puzzleMatrix=this.solutionMatrix.map(row=>{
	            return row.map(cell=>Math.random()*9<level?0:cell);
	        });
	
	     }
	 }

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * 生成数独解决方案
	 */
	const Toolkit = __webpack_require__(2);
	
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


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * 检查数独解决方案
	 */
	
	function checkArray(array) {
	    const length = array.length;
	    const marks = new Array(length);
	    marks.fill(true);
	    for (let i = 0; i < length; i++) {
	        if (!marks[i]) {
	            continue;
	        }
	        const v = array[i];
	        //是否有效，0=无效，1-9有效
	        if (!v) {
	            marks[i] = false;
	            continue;
	        }
	        //是否有重复，i+1～9，是否与i位置重复
	        for (let j = i + 1; j < length; j++) {
	            if (v === array[j]) {
	                marks[i] = marks[j] = false;
	            }
	        }
	    }
	    return marks;
	}
	
	const Toolkit = __webpack_require__(2);
	/**
	 * 输入：matrix 用户完成的数独数据 9*9
	 * 处理：对matrix行、列、宫进行检查，并填写marks
	 * 输出：检查结果 marks
	 */
	module.exports = class Checker {
	    constructor(matrix) {
	        this._matrix = matrix;
	        this._matrixMarks = Toolkit.matrix.makeMatrix(true);
	    }
	
	    get matrixMarks() {
	        return this._matrixMarks;
	    }
	
	    get isSuccess() {
	        return this._success;
	    }
	
	    check() {
	        this.checkRows();
	        this.checkCols();
	        this.checkBoxes();
	
	        //检查是否成功
	        this._success = this._matrixMarks.every(row => row.every(mark => mark));
	        return this._success;
	    }
	
	    checkRows() {
	        for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
	            const row = this._matrix[rowIndex];
	            const marks = checkArray(row);
	            for (let colIndex = 0; colIndex < marks.length; colIndex++) {
	                if (!marks[colIndex]) {
	                    this._matrixMarks[rowIndex][colIndex] = false;
	                }
	            }
	        }
	    }
	
	    checkCols() {
	        for (let colIndex = 0; colIndex < 9; colIndex++) {
	            const cols = [];
	            for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
	                cols[rowIndex] = this._matrix[rowIndex][colIndex];
	            }
	
	            const marks = checkArray(cols);
	            for (let rowIndex = 0; rowIndex < marks.length; rowIndex++) {
	                if (!marks[rowIndex]) {
	                    this._matrixMarks[rowIndex][colIndex] = false;
	                }
	            }
	        }
	    }
	
	    checkBoxes() {
	        for (let boxIndex = 0; boxIndex < 9; boxIndex++) {
	            const boxes = Toolkit.box.getBoxCells(this._matrix, boxIndex);
	            const marks = checkArray(boxes);
	            for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
	                if (!marks[cellIndex]) {
	                    const { rowIndex, colIndex } = Toolkit.box.convertFromBoxIndex(boxIndex, cellIndex);
	                    this._matrixMarks[rowIndex][colIndex] = false;
	                }
	            }
	        }
	    }
	};

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	/**
	 * 处理弹出的操作面板
	 * cell --(click)-->popup
	 * popup--(click)-->n-->(fill)-->cell
	 */
	
	module.exports = class PopupNumbers {
	
	    constructor($panel) {
	        this._$panel = $panel.hide().removeClass("hidden");
	
	        this._$panel.on("click", "span", e => {
	            const $cell = this._$targetCell;
	            const $span = $(e.target);
	            //mark1，mark2 回填样式
	            if ($span.hasClass("mark1")) {
	                if ($cell.hasClass("mark1")) {
	                    $cell.removeClass("mark1");
	                } else {
	                    $cell.removeClass("mark2")
	                        .addClass("mark1");
	                }
	            } else if ($span.hasClass("mark2")) {
	                if ($cell.hasClass("mark2")) {
	                    $cell.removeClass("mark2");
	                } else {
	                    $cell.removeClass("mark1")
	                        .addClass("mark2");
	                }
	            } else if ($span.hasClass("empty")) {//empty，取消数字填写，取消mark
	                $cell.text(0)
	                    .addClass("empty");
	
	            } else {
	                //1-9,回填数字
	                $cell.removeClass("empty")
	                    .text($span.text());
	            }
	
	            this.hide();
	        });
	    }
	
	    popup($cell) {
	        this._$targetCell=$cell;
	        const { left, top } = $cell.position();
	        this._$panel
	            .css({
	                left: `${left}px`,
	                top: `${top}px`
	            })
	            .show();
	    }
	
	    hide() {
	        this._$panel.hide();
	    }
	}
	


/***/ })
/******/ ]);
//# sourceMappingURL=index.js.map