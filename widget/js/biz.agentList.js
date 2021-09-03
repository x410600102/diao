biz.agentList = {
	// 设置表单
	listRender(tpl, params) {
		let html = template.render(tpl.html, {
			UserInfo: UserInfo,vo:params
		});
		this.html(html).initUI();
		let $form = this.find('form.dwz-list-form'),
			// 获取dwz-list-form的元素
			$listBox = $form.find('ul.dwz-list-box');
		  biz.agentList.$form = $form;
		$form.requestList = (loadMore) => {
			let data = $form.serializeArray()
			// 　　serializeArray() 方法通过序列化表单值来创建对象数组（名称和值）,
			$.ajax({
				type: 'POST',
				url: biz.server.getUrl(biz.server.agentList.list),
				dataType: 'json',
				data: data,
				cache: false,
				global: false,
				success: (json) => {
					console.log(json.Entity)
				
            //   此处是后台返回的总title数,现用341条模拟数据
						$form.listTotal("341", json.Entity);
						if($form.total) {
							$form.find('.empty_box').hide();
						}
						let List = {
							// total: json.Title,
							// 后台增加一个Title
							list: json.Entity
						}
						let _html = template.render(tpl.tpl_list, List);

						if(loadMore) {
							$(_html).appendTo($listBox).touchOpenRight().hoverClass();

						} else {
							$listBox.html(_html).initUI();

						}
					
				},
				error: biz.ajaxError
			});
		};
		$.listForm($form);
	},

	//查看流程弹窗
	technological(id, InstanceNodeGuid) {
		$.technological.open({
			data: {
				Title: '流程列表',
				Method: 'POST',
				sendData: {
					quotationId: id,
					InstanceNodeGuid: InstanceNodeGuid,
					flg: 3
				},
				GetUrl: biz.server.getUrl(biz.server.agentList.getTechnological),
			}
		})
	},

	// 编辑或者查看
	EditQuotation(event, item, ) {
		let info = JSON.parse(item);
		title = info.dlsbh;
		urls = 'tpl/widget/agent/Edit.html?dwz_callback=biz.agentList.formRander&agentListId=' + info.dlsbh + '&InstanceNodeGuid=' + info.InstanceNodeGuid + '&projectType=查看数据';
		// 跳转
		$.navView.open({
			url: urls
		})
	},
	// 新建项目
	EditQuotation1(event, item) {
		//此处拿到的数据是agent.json
		let urls = 'tpl/widget/agent/Edit.html?dwz_callback=biz.agentList.formRander&agentListId=0&projectType=新建项目';
		$.navView.open({
			url: urls
		})
	},
	//查看流程弹窗
	technological(id, sqnr) {
		$.technological.open({
			data: {
				Title: '流程列表',
				Method: 'POST',
				sendData: {
					agentId: id,
					sqnr: sqnr
				},
				GetUrl: biz.server.getUrl(biz.server.agentList.GetAgentViewInstanceList_Mobile),
			}
		})
	},

	formRander(tpl, params) {
      
		$.ajax({
			type: 'POST',
			url: biz.server.getUrl(biz.server.agentList.Edit),
			dataType: 'json',
			data: {

				projectId: params.agentListId,
				instanceNodeGuid: params.InstanceNodeGuid
			},
			cache: false,
			global: false,
			success: (json) => {
				let List=json.Entity
				console.log(List)
		                // 获取所有时间

						if(List.bzjdzrq!=null){
							List.bzjdzrq=new Date(parseInt(List.bzjdzrq.substr(6, 13))).toLocaleDateString()
						}
						if(List.bzjdzrq!=null){
							List.zzyxqsjd=new Date(parseInt(List.zzyxqsjd.substr(6, 13))).toLocaleDateString()
						}
					
						
				if($.isAjaxStatusOk(json)) {
					// 获取到InstanceNodeGuid值和 dlsbh: "VAG21053333"的值
					let html = template.render(tpl.html, {
						UserInfo: UserInfo,
						vo: json.Entity
					});
					this.html(html).initUI();
					let $form = this.find('form.dwz-list-form');

					// 判断后台返回值，如果是安装 就隐藏销售，如果是销售就隐藏安装 
					
				} else {
					$.alert.error(json.Message);
				}
				// 如果无返回值就表示是新建
				if(List.InstanceNodeGuid!=null){
					$.ajax({
						type: 'POST',
						url: biz.server.getUrl(biz.server.agentList.Btn),
						dataType: 'json',
						data: {
							InstanceNodeGuid: params.InstanceNodeGuid
						},
						success: (res) => {
							if(res.IsSuccess) {
								let json = res.Entity;
								let btns = [];
								for(let i = 0; i < json.OperationButtonLeft.length; i++) {
									let obj = {
										txt: json.OperationButtonLeft[i].ViewText,
										Id: json.OperationButtonLeft[i].Id
									}
									btns.push(obj);
								}
								for(let i = 0; i < json.OperationButtonRight.length; i++) {
									let obj = {
										txt: json.OperationButtonRight[i].ViewText,
										Id: json.OperationButtonRight[i].Id
									}
									btns.push(obj);
								}
								//判断按钮的值,如果长度等于1就表示 此处没有修改权限,此时把所有的框禁用,如果长度超过1,就是带编辑功能.
							   if(btns.length==1){
							 $("input").attr("disabled", "disabled")
							$("select").attr("disabled", "disabled")
							   }
							}
			
						},
						error: biz.ajaxError
					});
				}

			},
			error: biz.ajaxError
		});
	},

	// 删除
	dellquotaion(agentId) {
		$.alert.confirm({
			msg: '确认要删除吗？'
		}, function(ret) {
			if(ret.buttonIndex == '1') {
				$.ajax({
					type: 'POST',
					url: biz.server.getUrl(biz.server.agentList.del),
					dataType: 'json',
					data: {
						agentId: agentId
					},
					cache: false,
					global: false,
					success: (json) => {
						if($.isAjaxStatusOk(json)) {
							$.alert.toast('删除成功')
							$("li[data-id=" + agentId + "]").remove();
						} else {
							$.alert.error(json.Message);
						}

					},
					error: biz.ajaxError
				});
			}
		})
	},

	// 撤消流程1
	Rollback(agentId) {
		$.alert.confirm({
				msg: '确定要撤销该供应商的审批流程吗？'
			},
			function(ret) {
				if(ret.buttonIndex == "1") {
					$.ajax({
						type: 'POST',
						url: biz.server.getUrl(biz.server.agentList.RollbackAgent_Mobile),
						dataType: 'json',
						data: {
							agentId: agentId
						},
						cache: false,
						global: false,
						success: (ret) => {
							if($.isAjaxStatusOk(ret)) {
								$.alert.toast("撤销供应商的审批流程：" + agentId + "成功！");
								biz.agentList.$form.requestList();
							} else {
								$.alert.error(ret.Message);
							}
						},
						error: (biz.ajaxError)
					});
				}
			})
	},

	OperationButtonOut(id, insNodeId) {
		//获取按钮
		$.ajax({
			type: 'POST',
			url: biz.server.getUrl(biz.server.agentList.Btn),
			dataType: 'json',
			data: {
				aduitStatus: id,
				instanceNodeGuid: insNodeId
			},
			success: (res) => {
				if($.isAjaxStatusOk(res)) {
					let json = res.Entity;
					let btns = [];
					for(let i = 0; i < json.OperationButtonLeft.length; i++) {
						let obj = {
							txt: json.OperationButtonLeft[i].ViewText,
							Id: json.OperationButtonLeft[i].Id
						}
						btns.push(obj);
					}
					for(let i = 0; i < json.OperationButtonRight.length; i++) {
						let obj = {
							txt: json.OperationButtonRight[i].ViewText,
							Id: json.OperationButtonRight[i].Id
						}
						btns.push(obj);
					}
					console.log(btns)
					$.actionSheet.open({
						title: '操作按钮',
						buttons: btns
					}, function(ret) {
						biz.agentList[btns[ret.buttonIndex - 1].Id](btns[ret.buttonIndex - 1].txt, id);
					})
				} else {
					$.alert.error(res.Message);
				}
			},
			error: biz.ajaxError
		});
	},
	saveProceedsButtonOut() {
		$.navView.close();
	},
	// 项目表单提交
	SubmitButton(text, id) {
		var fromEl = $("form[name=" + id + "]");
		let disabledEl = fromEl.find("input:disabled,select:disabled");
		disabledEl.removeAttr("disabled");
		let formSeriv = fromEl.serialize();
		let aduitStatus = fromEl.find("#aduitStatus").val();
		let instanceNodeGuid = fromEl.find("#instanceNodeGuid").val();
		let dlsbh = fromEl.find("#dlsbh").val();
		let submitRemarkValue = fromEl.find("#Remark").val();
		disabledEl.attr("disabled", "disabled");
		let errors = [];
        // 设置验证规则
	

			$("input.required").each(function(index, item) {
				if($(item).val() == "") {
					errors.push($(item).attr("data-error"));
				}
			})
			if(errors.length > 0) {
				$.alert.open({
					msg: errors.join("</br>")
				})
				return false;
			}
			
	
		$.ajax({
			type: 'POST',
			url: biz.server.getUrl(biz.server.agentList.SubmitAgent),
			dataType: 'json',
			data: {
				formStr: formSeriv,
				status: aduitStatus,
				submitResult: text,
				instanceNodeId: instanceNodeGuid,
				nextnextUser: '',
				submitRemark: submitRemarkValue
			},
			cache: false,
			global: false,
			success: (json) => {
				if($.isAjaxStatusOk(json)) {
					$.alert.success();
					$.navView.close();
				} else {
					$.alert.error(json.Message);
				}
			}
		})
		
	    
		


	

		

		

	},
	
	// 项目表单保存
	SaveButton(text, id) {
		var fromEl = $("form[name=" + id + "]");
		let disabledEl = fromEl.find("input:disabled,select:disabled");
		disabledEl.removeAttr("disabled");
		let formSeriv = fromEl.serialize();
		disabledEl.attr("disabled", "disabled");
		// 如果代理商名字为空 就提示
		if($("input[name='dlsmc']").val() == "") {

			$.alert.error('请输入代理商名称');
		} else {
	
			let aa = $("#na").serialize();
			$.ajax({
				type: 'POST',
				url: biz.server.getUrl(biz.server.agentList.SaveAgent_API_Mobile),
				dataType: 'json',
				data: {
					formStr: formSeriv
				},
				cache: false,
				global: false,
				success: (json) => {
					if($.isAjaxStatusOk(json)) {
						$.alert.success("保存成功");
						$.navView.close();
					} else {
						$.alert.error(json.Message);
					}
				}
			})
		}
		// console.log(arrList)
		// readOnly也是禁用，但是readOnly可以获取到值
		// $(e).parentsUnitBox("dwz-list-form").serializeArray()
		// 把删除disabled的属性在添加上去，
		//  switch($("select[name='sqnr']").val()){
		// case "agentInstall": 
		// $("#toggleSelectRef_test1").remove()
		// 如果数据sqnr 就把所有的Id1的值删除

		//    arrList=arrList.remove("")

		// 	break;
		// 	case "agentSale":
		// 	 $("#toggleSelectRef_test2").remove()

		// 	 break;
		// 	 case "xan":
		// 	$("select option").eq(2).attr("selected",true)
		// }

		// 发送ajax请求

	},

	// 点击关闭当前页面
	CloseButton() {
		$.navView.close();
	}

}