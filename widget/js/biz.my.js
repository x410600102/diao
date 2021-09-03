/**
 * @author 张慧华 <350863780@qq.com>
 */
biz.my = {
	render(tpl, params) {
		let data = {
			UserInfo: UserInfo,
			appVersion: biz.getAppVersion(),
			env: biz.server.ENV
		};
		let html = template.render(tpl.html, data);
		this.html(html).initUI();

		let $form = this.find('form.dwz-list-form');
		let $listBox = $('#my-announce-box');

		$form.requestList = (loadMore) => {
			let data = $form.serializeArray();

			// 运输单
			$.ajax({
				type: 'POST',
				url: biz.server.getUrl(biz.server.transport.task),
				dataType: 'json',
				data: data,
				cache: false,
				global: false,
				success: (json) => {
					if ($.isAjaxStatusOk(json)) {
						let _html = template.render(tpl.tpl_transport, json);
						this.find('#transport-card-box').html(_html);
					}
				},
				error: biz.ajaxError
			});

			// 通知
			$.ajax({
				type: 'POST',
				url: biz.server.getUrl(biz.server.announce.recommend),
				dataType: 'json',
				data: data,
				cache: false,
				global: false,
				success: (json) => {
					if ($.isAjaxStatusOk(json)) {
						let _html = template.render(tpl.tpl_announce, json);
						$listBox.html(_html).initUI();
					}
				},
				error: biz.ajaxError
			});
		};

		$.listForm($form);
	},
	settingRender(tpl, params) {
		let html = template.render(tpl.html, {
			UserInfo: UserInfo,
			appVersion: biz.getAppVersion(),
			env: biz.server.ENV
		});
		this.html(html).initUI();

		this.find('.dwz-user-icon').click((event) => {
			dwz.plus.chooseImage({
				title: '修改用户头像',
				maximum: 1,
				callback(imgPath) {
					if (!imgPath) {
						return;
					}

					$.navView.open({
						url: 'tpl/my/settingsIcon.html',
						rel: 'mySettingsIcon',
						data: { imgPath: imgPath },
						callback: biz.my.settingIconRender
					});
				}
			});

			// $.navView.open({
			// 	url: 'tpl/test_croppic.html?dwz_callback=biz.my.settingIconRender',
			// 	rel: 'test'
			// });
		});
	},
	settingIconRender(tpl, params) {
		let html = template.render(tpl.html, { UserInfo: UserInfo });
		this.html(html).initUI();

		// let $croppic = this.find('.croppic');
		// $.croppic.render($croppic);
		// $croppic.find('.btn-item').touchwipe({
		// 	touch(){
		// 		let imgCropData = $.croppic.imgCropData($croppic);
		// 		console.log(imgCropData);
		// 	}
		// });

		let headerH = biz.safeAreaTop + 44;
		FNImageClip = api.require('FNImageClip');
		FNImageClip.open(
			{
				rect: {
					x: 0,
					y: headerH,
					w: api.winWidth,
					h: api.winHeight - headerH
				},
				srcPath: params.imgPath,
				highDefinition: false,
				isHideGrid: true,
				style: {
					mask: 'rgba(0,0,0,0.6)',
					clip: {
						w: 300,
						h: 300,
						x: (api.winWidth - 300) / 2,
						y: (api.winHeight - 300) / 2,
						borderColor: '#0f0',
						borderWidth: 3,
						appearance: 'rectangle' // rectangle, circular
					}
				},
				mode: 'image', // image, clip, all
				fixedOn: api.frameName
			},
			function (ret, err) {
				if (ret) {
					console.log(JSON.stringify(ret));
				} else {
					alert(JSON.stringify(err));
				}
			}
		);

		this.find('header .back-btn').touchwipe({
			touch() {
				$.navView.close();
				FNImageClip.close();
			}
		});
		this.find('header .txt-button').touchwipe({
			touch() {
				FNImageClip.save(
					{
						destPath: 'fs://image/croppic_' + new Date().getTime() + '.jpg',
						copyToAlbum: false,
						quality: 1
					},
					function (ret, err) {
						if (ret) {
							console.log(JSON.stringify(ret));

							FNImageClip.close();
							$.navView.close();

							dwz.plus.getBase64Image({
								destinationType: 'url',
								imgPath: ret.destPath,
								maxWidth: 300,
								maxHeight: 300,
								callback(strBase64) {
									console.log(strBase64);
									if ($.isFunction(params.callbackFn)) {
										params.callbackFn(strBase64);
									} else {
										$.ajax({
											type: 'POST',
											dataType: 'json',
											global: true,
											url: biz.server.getUrl(biz.server.uploadUserIcon),
											data: {
												type: 4,
												imgUrl: strBase64
											},
											success: (json) => {
												if (json.info) $.alert.toast(json.info);

												let $myUserIcon = $('#my_user_icon_img');
												if ($myUserIcon.size() > 0) {
													$myUserIcon.attr('src', strBase64);
												}
												let $settomgUserIcon = $('#setting_user_icon_img');
												if ($settomgUserIcon.size() > 0) {
													$settomgUserIcon.attr('src', strBase64);
												}

												UserInfoUtil.update({
													headimgurl: strBase64
												});
											}
										});
									}
								}
							});
						} else {
							alert(JSON.stringify(err));
						}
					}
				);
			}
		});
	},
    ladderTypeInfoRender(tpl,ept) {
        $.ajax({
			type: 'POST',
			url: biz.server.getUrl(biz.server.my.initinfo),
			dataType: 'json',
			data: "VE(V100/V200)",
			cache: false,
			global: false,
			success: (json) => {
                if ($.isAjaxStatusOk(json)) {
                    console.log(json);
                    let html = template.render(tpl.html, { UserInfo: UserInfo,vo: json.data });
                    this.html(html).initUI();
                }
			},
			error: biz.ajaxError
		});
        $.ajax({
			type: 'POST',
			url: biz.server.getUrl(biz.server.my.initinfoV),
			dataType: 'json',
			data: "VF",
			cache: false,
			global: false,
			success: (json) => {
                if ($.isAjaxStatusOk(json)) {
                    console.log(json);
                    let html = template.render(tpl.html, { UserInfo: UserInfo,vo: json.data });
                    this.html(html).initUI();
                }
			},
			error: biz.ajaxError
		});
    },
    // 计算直梯价格
    verticalLadder(from) {
        //$.alert.toast("计算直梯价格")
        //return false;
        //const $form = $(form);
		const $NF = $('input[name="NF"]');
        const $VerticalLadderCount = $('input.VerticalLadderCount');

		if ($NF && $NF.val() == "") {
			$.alert.error('请输入层站数')
			return false;
		}

        return $.validateCallback(form, function (json) {
			//console.log(JSON.stringify(json));

			if ($.isAjaxStatusOk(json)) {
				//navViewAjaxDoneClose(json);
                $VerticalLadderCount.val(json.data.total);

			} else {
				$.ajaxDone(json);
			}
		});
    },
    // 计算扶梯价格
    escalatorLadder(form) {
        //$.alert.toast("计算扶梯价格")
        //return false;
		const $CAWTH = $('select[name="CAWTH"]');
		const $R = $('input[name="R"]');
        const $EscalatorCount = $('input.EscalatorCount');
		const $NOHS = $('select[name="NOHS"]');
		const $TFS = $('select[name="TFS"]');


		if ($CAWTH.val() == "" || $CAWTH.val() == "请选择") {
			$.alert.error('请选择梯级宽度')
			return false;
		}
		if ($R.val() == "" || $R.val() <= 0) {
			$.alert.error('请输入提升高度')
			return false;
		}
        if ($NOHS.val() == "" || $NOHS.val() == "非标") {
			$.alert.error('请选择请选择正确的水平梯级')
			return false;
		}
        if ($TFS.val() == "" || $TFS.val() == "非标") {
			$.alert.error('请选择正确分段')
			return false;
		}

        return $.validateCallback(form, function (json) {
			console.log(JSON.stringify(json));

			if ($.isAjaxStatusOk(json)) {
				//navViewAjaxDoneClose(json);
                $EscalatorCount.val(json.data.total);
			} else {
				$.ajaxDone(json);
			}
		});
    },
    GetQuotationSimpleByEpt(params,target) {
        console.log(params);
        const $EscalatorFrom = $(params).find('#F')
        const $LadderFrom = $(params).find('#Z')
        const ept = $(target).val();
        //const $p = $(params).parent()
        //const tpl = $p.parent().parent().parent().parent().parent('from')//.get(0);
        let CAWTH_html = ''
        let FTA_html = ''
        let NOHS_html = ''
        let INSEN_html = ''
        let TFS_html = ''
        let DL_html = ''
        let V_html = ''
        $.ajax({
			type: 'POST',
			url: biz.server.getUrl(biz.server.my.initinfoChange),
			dataType: 'json',
			data: ept,
			cache: false,
			global: false,
			success: (json) => {
                // if ($.isAjaxStatusOk(json)) {
                //     console.log(json);
                //     let html = template.render(tpl.outerHTML, { UserInfo: UserInfo,vo: json.data });
                //     this.html(html).initUI();
                // }
                if(ept == "VF" || ept == "VR"){
                    $(json.data.CAWTH).each(function(index,item){
                        CAWTH_html += '<option value="' + item.ParamValue + '">' + item.ParamText +'</option>'
                    })
                    $(json.data.FTA).each(function(index,item){
                        FTA_html += '<option value="' + item.ParamValue + '">' + item.ParamText +'</option>'
                    })
                    $(json.data.NOHS).each(function(index,item){
                        NOHS_html += '<option value="' + item.ParamValue + '">' + item.ParamText +'</option>'
                    })
                    $(json.data.INSEN).each(function(index,item){
                        INSEN_html += '<option value="' + item.ParamValue + '">' + item.ParamText +'</option>'
                    })
                    $(json.data.TFS).each(function(index,item){
                        TFS_html += '<option value="' + item.ParamValue + '">' + item.ParamText +'</option>'
                    })
                    $EscalatorFrom.find('select[name=CAWTH]').html(CAWTH_html).initUI();
                    $EscalatorFrom.find('select[name=FTA]').html(FTA_html).initUI();
                    $EscalatorFrom.find('select[name=NOHS]').html(NOHS_html).initUI();
                    $EscalatorFrom.find('select[name=INSEN]').html(INSEN_html).initUI();
                    $EscalatorFrom.find('select[name=TFS]').html(TFS_html).initUI();
                } else {
                    $(json.data.DL).each(function(index,item){
                        DL_html += '<option value="' + item.ParamValue + '">' + item.ParamText +'</option>'
                    })
                    $(json.data.V).each(function(index,item){
                        V_html += '<option value="' + item.ParamValue + '">' + item.ParamText +'</option>'
                    })
                    $LadderFrom.find('select[name=DL]').html(DL_html).initUI();
                    $LadderFrom.find('select[name=V]').html(V_html).initUI();
                }
			},
			error: biz.ajaxError
		});
    }
};
