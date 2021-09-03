/**
 * @author 张慧华 <350863780@qq.com>
 */

$.daiolPanel = {
	config: {
		box$: '#daiol-panel',
		openClass: 'open',
		frag: '<div id="daiol-panel" class="unitBox"></div>',
		bgBox$: '#mask-daiol-panel',
		bgFrag: '<div id="mask-daiol-panel" class="mask-bg"></div>'
	},
	isOpen: false,
	$box: null,
	$bgBox: null,

	init(options) {
		$.extend($.daiolPanel.config, options);

		$('body').append($.daiolPanel.config.frag).append($.daiolPanel.config.bgFrag);
		this.$box = $($.daiolPanel.config.box$);
		this.$bgBox = $($.daiolPanel.config.bgBox$);

		this.$bgBox.click(function () {
			$.daiolPanel.close();
		});
	},
	open(options) {
		// default, pic, login
		let op = $.extend({ type: 'GET', url: '', pop: 'default', data: {}, callback: null }, options);
		let $box = this.$box,
			$bgBox = this.$bgBox;

		$bgBox.addClass($.daiolPanel.config.openClass);

		$box.show().translateX($box.get(0).clientWidth + 'px');
		setTimeout(function () {
			$box.animate({ x: 0 }, 400, 'ease');
		}, 10);

		if (op.url) {
			let params = $.extend(op.url.getParams(), op.data);
			$.ajax({
				type: 'GET',
				url: op.url,
				data: op.data,
				success: (html) => {
					$box.triggerPageClear();

					if (!op.callback) {
						op.callback = dwz.getUrlCallback(op.url);
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
		}

		this.isOpen = true;
	},
	close() {
		let $box = this.$box,
			$bgBox = this.$bgBox;

		$box.animate({ x: $box.get(0).clientWidth }, 500, 'ease', function () {
			$box.html('').hide();
		});

		$bgBox.removeClass($.daiolPanel.config.openClass);

		this.isOpen = false;
	},
	getBox() {
		return this.$box;
	}
};
