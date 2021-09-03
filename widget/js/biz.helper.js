biz.helper = {
	// 请求 省、市、区 html 片段
	reqRegionHtml(options) {
		const op = $.extend({ code: '', callback: null, tpl: '' }, options);
		$.ajax({
			type: 'GET',
			url: biz.server.getUrl(biz.server.regionList, { code: op.code }),
			
			dataType: 'json',
			data: {},
			cache: false,
			global: false,
			success: (json) => {
				if ($.isAjaxStatusOk(json)) {
					let html = template.render(op.tpl, { list: json.data });

					op.callback(html);
				}
			},
			error: biz.ajaxError
		});
	},

	// $.dialog.open 选择省、市、区 渲染函数
	selectRegionRender(tpl, params) {
		const op = $.extend({ target: null, callback: null }, params);

		let html = template.render(tpl.html, {
			UserInfo: UserInfo,
			params: params
		});
		this.html(html).initUI();

		const $province = this.find('ul.dwz-province');
		const $city = this.find('ul.dwz-city');
		const $county = this.find('ul.dwz-county');

		// 请求省份
		biz.helper.reqRegionHtml({
			tpl: tpl.tpl_list,
			callback: function (html_1) {
				$province.html(html_1);

				const $items1 = $province.find('li.item').click(function () {
					const $li1 = $(this);
					$county.html('').parentsUnitBox('dwz-scroll').scrollTo({ y: 0, duration: 300 });
					$items1.removeClass('active');
					$li1.addClass('active');

					// 请求城市
					biz.helper.reqRegionHtml({
						//code: $li1.attr('data-code'),
						code: $li1.attr('data-name'),
						tpl: tpl.tpl_list,
						callback: function (html_2) {
							$city.html(html_2).parentsUnitBox('dwz-scroll').scrollTo({ y: 0, duration: 300 });

							const $items2 = $city.find('li.item').click(function () {
								const $li2 = $(this);
								$items2.removeClass('active');
								$li2.addClass('active');

								// 请求区县
								biz.helper.reqRegionHtml({
									//code: $li2.attr('data-code'),
									code: $li2.attr('data-name'),
									tpl: tpl.tpl_list,
									callback: function (html_3) {
										$county.html(html_3).parentsUnitBox('dwz-scroll').scrollTo({ y: 0, duration: 300 });

										const $items3 = $county.find('li.item').click(function () {
											const $li3 = $(this);
											$items3.removeClass('active');
											$li3.addClass('active');

											const _data = {
												// province: $li1.attr('data-code'),
												// city: $li2.attr('data-code'),
												// county: $li3.attr('data-code'),
                                                province: $li1.attr('data-name'),
												city: $li2.attr('data-name'),
												county: $li3.attr('data-name'),
												names: $li1.attr('data-name') + ' ' + $li2.attr('data-name') + ' ' + $li3.attr('data-name')
											};

											op.callback && op.callback.call($(op.target), _data);
										});
									}
								});
							});
						}
					});
				});
			}
		});
	},

	// $.alert.prompt 多选 渲染函数
	multipleSelectRender(tpl, params) {
		const op = $.extend({ target: null, callback: null }, params);
		let html = template.render(tpl.html, params);
		this.html(html).initUI();

		const $form = this.find('form').on('submit', (event) => {
			const $inputs = $form.find('input[type=checkbox]:checked');
			if (!$inputs.size()) {
				$.alert.error('至少选择一项');
				return false;
			}
			const _data = [];

			$inputs.each(function (index, item) {
				_data.push({
					value: item.value,
					name: $(item).attr('data-name')
				});
			});

			op.callback && op.callback.call($(op.target), _data);

			$.alert.close('prompt');
			return false;
		});
	},

	// $.filterPanel.open 查找带回 渲染函数
	filterPanelRender(tpl, params) {
		const op = $.extend({ target: null, callback: null }, params);

		let html = template.render(tpl.html, params);
		this.html(html).initUI();

		const $form = this.find('form.dwz-list-form'),
			$listBox = $form.find('ul.dwz-list-box');

		$form.requestList = (loadMore) => {
			$.ajax({
				type: params.type || 'GET',
				url: params.searchUrl,
				dataType: 'json',
				data: $form.serializeArray(),
				success: (json) => {
					if ($.isAjaxStatusOk(json)) {
						let _html = template.render(tpl.tpl_list, json.data);

						let $items = $(_html);
						if (loadMore) {
							items.appendTo($listBox).hoverClass();
						} else {
							$listBox.html($items).initUI();
						}

						$items.click(function (event) {
							op.callback && op.callback.call($(op.target), this.dataset);
							$.filterPanel.close();
						});
					}
				},
				error: biz.ajaxError
			});
		};

		$.listForm($form);
	},
	// $.daiolPanel.open 查找带回 上到下列表弹窗
	DaiolPanelRender(tpl, params) {
		const op = $.extend({ target: null, callback: null }, params);

		let html = template.render(tpl.html, params);
		this.html(html).initUI();

		const $form = this.find('form.dwz-list-form'),
			$listBox = $form.find('ul.dwz-list-box');
		
		$form.requestList = (loadMore) => {
			$.ajax({
				type: params.searchMethod,
				url: params.searchUrl,
				dataType: 'json',
				data: $form.serializeArray(),
				success: (res) => {
					let json = [];
					if(res.Entity){
						json = res.Entity;
					}else{
						json = res;
					}
					$form.listTotal(10, json);
					$form.total = json.length +1;
					op.nowData = json;
					let _html = "";
					for(let i = 0;i<json.length;i++){
						_html += "<li class=\"item dwz-open-right dwz-ctl-hover\" data-index=\'"+i+"\'>";
        				_html += "<div class=\"item-content\">";
            			_html += "<div class=\"flex-wrap grid-col-"+params.filterItems.length+"\">";
            			$.each(params.filterItems, function(index,item) {
            				_html += "<p class=\"item item-tinfo"+(index + 1)+"\">"+json[i][item.name]+"</p>";
            			});
            			_html += "</div>";
        				_html += "</div>";
   						_html += "</li>";
					}
					let $items = $(_html);
					
					if (loadMore) {
						items.appendTo($listBox).hoverClass();
					} else {
						$listBox.html($items).initUI();
					}
					
					$form.find("li").on("click",function(event){
						if($(this).hasClass("checked")){
							$(this).removeClass("checked");
						}else{
							if(params.isOne){
								$form.find("li").removeClass("checked");
								$(this).addClass("checked");
							}else{
								if(params.checkedNum && params.checkedNum != "MAX"){
									let len = $form.find("li.checked").length;
									if(len >= params.checkedNum){
										$.alert.toast("只能选择"+params.checkedNum+"条!");
										return false;
									}else{
										$(this).addClass("checked");
									}
								}else{
									$(this).addClass("checked");
								}
							}
						}
						
					})
					
					
					$form.find("button[name=config]").on("click",function(event){
						let daiolArr = [];
						if($form.find("li.checked").length > 0){
							$.each($form.find("li.checked"),(index,item)=>{
								daiolArr.push(op.nowData[$(item).attr("data-index")])
							})
							op.callback && op.callback.call($(op.target), daiolArr);
							$.daiolPanel.close();
						}else{
							$.alert.confirm({
								msg: '您没有选择数据！是否继续关闭？'
							}, function(ret) {
								if(ret.buttonIndex == "1"){
									op.callback && op.callback.call($(op.target), []);
									$.daiolPanel.close();
								}
							})
						}
					})
					$form.find("button[name=search]").on("click",function(event){
						$form.Submit();
					})
					$form.find("*[name=close]").on("click",function(event){
						$.daiolPanel.close();
					})
					
					
						
				},
				error: biz.ajaxError
			});
		};

		$.listForm($form);
	},
//流程弹窗 $.technological.open 查找带回 上到下列表弹窗
TechnologicalRender(tpl, params){
	const op = $.extend({ target: null, callback: null }, params);

		let html = template.render(tpl.html, params);
		this.html(html).initUI();

		const $form = this.find('form.dwz-list-form'),
			$listBox = $form.find('ul.dwz-list-box');
		$form.requestList = (loadMore) => {
			$.ajax({
				type: params.Method || 'GET',
				url: params.GetUrl,
				dataType: 'json',
				data: params.sendData,
				success: (res) => {
					if(res.IsSuccess){
						let json = res.Entity;
						let _html = "";
						for(let i = 0;i<json.length;i++){
							_html += "<div class=\"dwz-panel dwz-collapse margin-h box-round no-line\">";
							_html += "<div class=\"panel-header\">";
							_html += "<label class=\"panel-title blockquote\">"+json[i].workList.InstanceNodeName+"</label>";
							_html += "<a class=\"item-right\"><i class=\"dwz-icon-arrow-up is-collapse\"></i></a>";
							_html += "</div>";
							_html += "<div class=\"panel-content\" style=\"display: none;\">";
							
							_html+="<div class=\"flex-wrap grid-col-2\">";
			        		_html+="<p class=\"item item-tinfo1\">办理人</p>";
			        		_html+="<p class=\"item item-tinfo2\">"+json[i].userName+"</p>";
			        		_html+="</div>";
			        		
			        		_html+="<div class=\"flex-wrap grid-col-2\">";
			        		_html+="<p class=\"item item-tinfo1\">办理状态</p>";
			        		_html+="<p class=\"item item-tinfo2\">"+json[i].workList.InstanceNodeStatusCN+"</p>";
			        		_html+="</div>";
			        		
			        		_html+="<div class=\"flex-wrap grid-col-2\">";
			        		_html+="<p class=\"item item-tinfo1\">提交结果</p>";
			        		_html+="<p class=\"item item-tinfo2\">"+json[i].workList.SubmitResult+"</p>";
			        		_html+="</div>";
			        		
			        		_html+="<div class=\"flex-wrap grid-col-2\">";
			        		_html+="<p class=\"item item-tinfo1\">提交日期</p>";
			        		_html+="<p class=\"item item-tinfo2\">"+json[i].workList.InstanceNodeComplateDate+"</p>";
			        		_html+="</div>";
			        		
			        		_html+="<div class=\"flex-wrap grid-col-1\">";
			        		_html+="<p class=\"item item-tinfo1\">备注</p>";
			        		_html+="<p class=\"item item-tinfo2\">"+(json[i].workList.Remark?json[i].workList.Remark:"")+"</p>";
			        		_html+="</div>";
			        					
							_html += "</div>";
							_html += "</div>";
						}
						let $items = $(_html);
						
						if (loadMore) {
							items.appendTo($listBox).hoverClass();
						} else {
							$listBox.html($items).initUI();
						}
						$form.find("button[type=config]").on("click",function(event){
							$.technological.close();
						})
						
					}else{
						$.alert.open({msg:"未启动流程!"});
						$.technological.close();
					}
					
						
				},
				error: biz.ajaxError
			});
		};

		$.listForm($form);
},
	// 主从表 删除子表元素
	removeUnitBox(target, delId) {
		const $target = $(target),
			$scrollBox = $target.parentsUnitBox('scroll-content'),
			$form = $target.parentsByTag('form');

		$target.parentsUnitBox().remove();
		$scrollBox.scrollTo({ y: 'end', duration: 800 });

		if ($form.size() && delId) {
			const delItem = $form.data('delItem') || [];
			delItem.push(delId);
			$form.data('delItem', delItem);
		}
	},

	// 主从表 新增子表元素 dwz_callback=biz.pageRender?dwz_helper=biz.helper.itemDetailHelper
	itemDetailHelper(tpl, params) {
		const $itemDetailBox = this.find('.dwz-item-detail-box');
		this.find('.dwz-item-detail-btn').click(() => {
			$(tpl.tpl_item_detail).appendTo($itemDetailBox);
			$itemDetailBox.parentsUnitBox('scroll-content').scrollTo({ y: 'end', duration: 800 });
		});
	}
};
