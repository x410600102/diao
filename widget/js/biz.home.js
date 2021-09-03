biz.home = {
	render(tpl, params) {
		let html = template.render(tpl.html, {
			UserInfo,
			params,
			appVersion: biz.getAppVersion(),
			env: biz.server.ENV,
			checkLiveTime: biz.checkLiveTime()
		});
		this.html(html).initUI();

		let $form = this.find('form.dwz-list-form');
		$form.requestList = (loadMore) => {
			let data = $form.serializeArray();

			// 轮播图
			$.ajax({
				type: 'POST',
				url: biz.server.getUrl(biz.server.homeAd),
				dataType: 'json',
				data: data,
				cache: false,
				global: false,
				success: (json) => {
					if ($.isAjaxStatusOk(json)) {
						let _html = template.render(tpl.tpl_home_ad, json);
						this.find('#home-ad-box').html(_html).initUI();
					}
				},
				error: biz.ajaxError
			});

			// 组件列表
			$.ajax({
				type: 'POST',
				url: biz.server.getUrl(biz.server.widgetList),
				dataType: 'json',
				data: data,
				cache: false,
				global: false,
				success: (json) => {
					console.log(json)
					if ($.isAjaxStatusOk(json)) {
					// {IsSuccess: 1, Message: "", Entity: Array(9)}
						json.Entity.map((item) => {
				
							if (!item.url) {
								item.url = `tpl/widget/${item.name}/list.html?dwz_callback=biz.${item.name}List.listRender&dwz_helper=script`;
							// url地址拼接
							}
							return item;
						});
						// 渲染引擎 
						let _html = template.render(tpl.tpl_home_widget, { widgetList: json.Entity });
						this.find('#home-widget-box').html(_html).initUI();
					}
				},
				error: biz.ajaxError

			});
		};

		$.listForm($form);
	},
	aboutRender(tpl, params) {
		let html = template.render(tpl.html, {
			appVersion: biz.getAppVersion(),
			env: biz.server.ENV
		});
		this.html(html).initUI();
	},
    opwechat(){
        api.openWin({
            name: 'page1',
            url: 'http://mp.weixin.qq.com/s?__biz=MzA4NjU2ODExMw==&mid=212190474&idx=1&sn=1b9c14e1a8a89d09112925e9e4155fce&chksm=1697d8d421e051c2066d7216baeb44e6e4cead0c3d8d47d79aac3f46badb00db04c31690b46e#rd',
            pageParam: {
                name: 'test'
            }
        });
    }
};

