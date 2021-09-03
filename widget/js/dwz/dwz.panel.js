/**
 * @author 张慧华 <350863780@qq.com>
 */
(function ($) {
	let _config = {
		panelCentent$: '.panel-content',
		collapseBtn$: '.item-right',
		collapseClass: 'is-collapse'
	};

	$.fn.extend({
		panel(options) {
			let op = $.extend(_config, options);

			return this.each(function () {
				let $this = $(this);
				let $btn = $this.children(".panel-header").find(op.collapseBtn$);
				let $icon = $btn.children('i.dwz-icon-arrow-up');
				$btn.click((event) => {
					if ($icon.hasClass(op.collapseClass)) {
						$this.panelExpand(op);
					} else {
						$this.panelCollapse(op);
					}
					event.stopPropagation();
				});
			});
		},

		// 展开
		panelExpand(options) {
			let op = $.extend(_config, options);

			return this.each(function () {
				let $this = $(this);
				let $btn = $this.children(".panel-header").find(op.collapseBtn$);
				let $icon = $btn.children('i.dwz-icon-arrow-up');
				$this.children(op.panelCentent$).show();
				$icon.removeClass(op.collapseClass);
			});
		},
		// 折叠
		panelCollapse(options) {
			let op = $.extend(_config, options);

			return this.each(function () {
				let $this = $(this);
				let $btn = $this.children(".panel-header").find(op.collapseBtn$);
				let $icon = $btn.children('i.dwz-icon-arrow-up');
				$this.children(op.panelCentent$).hide();
				$icon.addClass(op.collapseClass);
			});
		}
	});
})(dwz);
