/**
 * @author 张慧华 <350863780@qq.com>
 */

$.technological = {
	config: {
		box$: '#technological-panel',
		openClass: 'open',
		frag: '<div id="technological-panel" class="unitBox"></div>',
		bgBox$: '#mask-technological-panel',
		bgFrag: '<div id="mask-technological-panel" class="mask-bg"></div>'
	},
	isOpen: false,
	$box: null,
	$bgBox: null,

	init(options) {
		$.extend($.technological.config, options);

		$('body').append($.technological.config.frag).append($.technological.config.bgFrag);
		this.$box = $($.technological.config.box$);
		this.$bgBox = $($.technological.config.bgBox$);

		this.$bgBox.click(function () {
			$.technological.close();
		});
	},
	open(options) {
		// default, pic, login
		let op = $.extend({ type: 'GET', url: '', pop: 'default', data: {}, callback: null }, options);
		let $box = this.$box,
			$bgBox = this.$bgBox;

		$bgBox.addClass($.technological.config.openClass);

		$box.show().translateX($box.get(0).clientWidth + 'px');
		setTimeout(function () {
			$box.animate({ x: 0 }, 400, 'ease');
		}, 10);

			let params = $.extend(op.url.getParams(), op.data);
			$.ajax({
				type: 'GET',
				url: "tpl/widget/template/technological.html?dwz_callback=biz.helper.TechnologicalRender",
				data: op.data,
				success: (html) => {
					$box.triggerPageClear();

					if (!op.callback) {
						op.callback = dwz.getUrlCallback("tpl/widget/template/technological.html?dwz_callback=biz.helper.TechnologicalRender");
					}

					const tpl = $.templateWrap(html);
					if (op.callback) {
						op.callback.call($box, tpl, params);
					} else {
						$box.html(html).initUI();
						$.execHelperFn($box, tpl, params);
					}
				},
				error: dwz.ajaxError
			});
	},
	close() {
		let $box = this.$box,
			$bgBox = this.$bgBox;

		$box.animate({ x: $box.get(0).clientWidth }, 500, 'ease', function () {
			$box.html('').hide();
		});

		$bgBox.removeClass($.technological.config.openClass);

		this.isOpen = false;
	},
	getBox() {
		return this.$box;
	}
};
