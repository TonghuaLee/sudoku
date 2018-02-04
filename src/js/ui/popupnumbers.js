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

