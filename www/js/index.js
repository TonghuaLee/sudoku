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
	
	const grid=new Grid($("#container"));
	grid.build();
	grid.layout(); 

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * 生成九宫格
	 */
	const Toolkit =__webpack_require__(2);
	
	
	class Grid {
	    constructor(container) {
	        this._$container = container;
	    }
	    build() {
	        const matrix = Toolkit.matrix.maekMatrix();
	
	        const rowGroupClasses = ["row_g_top", "row_g_middle", "row_g_bottom"];
	        const colGroupClassed = ["col_g_left", "col_g_center", "col_g_right"];
	
	        const $cells = matrix.map(rowValues => rowValues
	            .map((cellValues, colIndex) => {
	                return $("<span>")
	                    .addClass(colGroupClassed[colIndex % 3])
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
	
	}
	
	module.exports=Grid;

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

/***/ })
/******/ ]);
//# sourceMappingURL=index.js.map