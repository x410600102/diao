/**
 * @author 张慧华 <350863780@qq.com>
 */
biz.projectList = {
		removeItem({
			id = null
		}, event) {
			if(event) {
				event.stopPropagation();
			}
			$.ajax({
				type: 'POST',
				url: biz.server.getUrl(biz.server.message.del),
				dataType: 'json',
				data: {
					id: id
				},
				cache: false,
				global: false,
				success: (json) => {
					if($.isAjaxStatusOk(json)) {
						$(event.target)
							.parentsUnitBox()
							.find('ul.list li[data-id="' + id + '"]')
							.remove();
					}
				},
				error: biz.ajaxError
			});
		},
		// 项目查询列表渲染
		listRender(tpl, params) {
			let html = template.render(tpl.html, {
				UserInfo: UserInfo
			});
			this.html(html).initUI();
			let $form = this.find('form.dwz-list-form'),
				$listBox = $form.find('ul.dwz-list-box');
			$form.requestList = (loadMore) => {
				let data = $form.serializeArray();
				$.ajax({
					type: 'POST',
					url: biz.server.getUrl(biz.server.projectList.list),
					dataType: 'json',
					data: data,
					cache: false,
					global: false,
					success: (json) => {
						console.log(json)
							$form.listTotal("213", json.Entity);
							if($form.total) {
								$form.find('.empty_box').hide();
							}
							let List = {
								 total: json.Entity.length,
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
		formRander(tpl, params) {
			console.log(params)

			$.ajax({
				type: 'POST',
				url: biz.server.getUrl(biz.server.projectList.Edit),
				dataType: 'json',
				data: {
					projectId: (params.projectListId ? params.projectListId :""),
					instanceNodeGuid: (params.InstanceNodeGuid ? params.InstanceNodeGuid :"")
				},
				cache: false,
				global: false,
				success: (json) => {
				        let List=json.Entity
						// 根据返回的按钮数据,判断是否有权限去修改
						// 合并帝奥梯形数据
					    let diAo1= List.ProjectElevatorTypeDL
						let diAo2=List.ProjectElevatorTypeDR
						let diAo3=List.ProjectElevatorTypeDZ
						let diAo1List=diAo1.concat(diAo2,diAo3)
				       
						// 合并天奥梯形数据
						let tian1= List.ProjectElevatorTypeTL
						let tian2=List.ProjectElevatorTypeTR
						let tian3=List.ProjectElevatorTypeTZ
						let tianList=tian1.concat(tian2,tian3)
                       
						//  添加帝奥和天奥的数据集					
						List.diAo1List=diAo1List
						List.tianList=tianList
						  console.log(json.Entity)
						let html = template.render(tpl.html, {
							UserInfo: UserInfo,
							vo: json.Entity,
						});
						this.html(html).initUI();				
						let $form = this.find('form.dwz-list-form');
						let projectInfo = json.Entity.dict;
						// if(projectInfo[0]) {
						// 	for(let i = 0; i < projectInfo.length; i++) {
						// 		if($form.find("#" + projectInfo[i].ParamCode).length > 0) {
						// 			$form.find("#" + projectInfo[i].ParamCode).val(projectInfo[i].ParamValue);

						// 		}
						// 	}
						// } else {
						// 	for(let item in projectInfo) {
						// 		$form.find("#" + item).val(projectInfo[item]);
						// 	}
						// 	$form.find("#ProjectCountry").val("中国");
						// 	$form.find("#ElevatorCount").val(projectInfo.EleCount);

						// }

						// if((UserInfo.UserRoleId.indexOf("Saler") >= 0 || UserInfo.UserRoleId.indexOf("StrategicProjectSpecialist") >= 0) && (json.Entity.InstanceNodeName == '' || json.Entity.InstanceNodeName == '项目录入')) {
						// 	$form.find("#ladderTypeSet input").removeAttr("disabled");
						// } else {
						// 	// $form.find("input,select").attr("disabled", "disabled");
						// 	// $form.find("#ladderTypeSet input").attr("disabled", "disabled");
						// }
						// if(json.Entity.TransactUser == UserInfo.UserId && json.Entity.InstanceNodeName == '销售区域分总审批') {
						// 	if(json.Entity.CrossDist == '区域跨区') { //判断跨区
						// 		$form.find("#Ratio").attr("disabled", "disabled");
						// 	}
						// }
						// if(json.Entity.TransactUser == UserInfo.UserId && json.Entity.InstanceNodeName == '项目区域分总审批') {
						// 	if(json.Entity.CrossDist == '区域跨区') { //判断跨区
						// 		$form.find("#SalerInCharge").removeAttr("disabled").css("border-color", "#2467ff");
						// 	}
						// }
						// if(json.Entity.InstanceNodeName == '项目跟踪' && UserInfo.UserRoleId.indexOf("Saler") >= 0) {
						// 	if(!json.Entity.isEdit) {
						// 		$form.find("input,select,textarea").attr("disabled", "disabled");
						// 	} else {
						// 		$form.find("#ladderTypeSet input").removeAttr("disabled");
						// 		$form.find("#ElevatorCount").attr("disabled", "disabled")
						// 	}
						// }
						// 如果InstanceNodeGuid为null就说明是走新建,拿按钮返回的数据的长度来整
					if(List.InstanceNodeGuid!=null){
						$.ajax({
							type: 'POST',
							url: biz.server.getUrl(biz.server.projectList.Btn),
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
		// 编辑或者查看
		EditQuotation(event, item) {   
			let info = JSON.parse(item);
			let Version = info.Version
			title = info.ProjectId;
			urls = 'tpl/widget/project/Edit.html?dwz_callback=biz.projectList.formRander&projectListId=' + info.ProjectId + '&InstanceNodeGuid=' + info.InstanceNodeGuid + '&Version=' + Version + ' &projectType=查看数据&pageName=' + info.ProjectId + '';
			// 跳转
			$.navView.open({
				boxId: info.ProjectId,
				url: urls
			})
		},

		// 项目待办列表渲染
		todolistRender(tpl, params) {
			let html = template.render(tpl.html, {
				UserInfo: UserInfo
			});
			this.html(html).initUI();

			let $form = this.find('form.dwz-list-form'),
				$listBox = $form.find('ul.dwz-list-box');

			$form.requestList = (loadMore) => {
				let data = $form.serializeArray();
				console.log(JSON.stringify(data));
				$.ajax({
					type: 'GET',
					url: biz.server.getUrl(biz.server.projecttodoList.list),
					dataType: 'json',
					data: data,
					cache: false,
					global: false,
					success: (json) => {
						if($.isAjaxStatusOk(json)) {
							$form.listTotal(json.Entity.total, json.Entity.list);
							if($form.total) {
								$form.find('.empty_box').hide();
							}

							let _html = template.render(tpl.tpl_list, json.Entity);

							if(loadMore) {
								$(_html).appendTo($listBox).touchOpenRight().hoverClass();
							} else {
								$listBox.html(_html).initUI();
							}
						}
					},
					error: biz.ajaxError
				});
			};

			$.listForm($form);
		},

		// 项目台量
		changeElevatorCount({
			name,
			name1,
			name2
		}, callback) {
			let EPTinput = $(name).find("input");
			let num = 0;
			$.each(EPTinput, (index, item) => {
				console.log(index, $(item).val())
				num += $(item).val() * 1;
			})
			$(name1).val(num);
			$(name2).val(num);
		},
		//获取代理商协议台量
		getSignCount(e, dlsbh) {
			let form = $(e).parentsByTag('form').get(0);
			$.ajax({
				type: 'POST',
				url: biz.server.getUrl(biz.server.projectList.getSignCount),
				dataType: 'json',
				data: {
					agentId: dlsbh
				},
				cache: false,
				global: false,
				success: (json) => {
					if($.isAjaxStatusOk(json)) {
						form.find("#SignCount").val(json.Entity.jlxytl);
					}
				},
				error: biz.ajaxError
			});
		},

		// 项目删除
		delproject(projectId) {
			$.alert.confirm({
				msg: '确认要删除吗？'
			}, function(ret) {
				if(ret.buttonIndex == "1") {
					$.ajax({
						type: 'POST',
						url: biz.server.getUrl(biz.server.projectList.del),
						dataType: 'json',
						data: {
							projectId: projectId,
							nextIndex: 0
						},
						cache: false,
						global: false,
						success: (json) => {
							$.alert.toast('删除成功');
							$("li[data-id=" + projectId + "]").remove();
						},
						error: biz.ajaxError
					});
				}
			})
		},

	
		// 项目转移
		projectTransfer(ProjectId, tpl) {
			let userId = UserInfo.UserId;
			$.ajax({
				type: 'POST',
				url: biz.server.getUrl(biz.server.projectList.transfer),
				dataType: 'json',
				data: {
					ProjectId: ProjectId,
					userId: userId
				},
				cache: false,
				global: false,
				success: (json) => {
					console.log(json)
					let html = template.render(tpl.html, {
						UserInfo: UserInfo,
						vo: json.Entity
					});
					this.html(html).initUI();
					let $pop = this.find('.page-signpop');
					console.log(pop)
					$pop.listTotal(json.Entity.total, json.Entity.list);
					if($pop.total) {
						$pop.find('.empty_box').hide();
						console.log($pop.find('.empty_box'));
					} else {
						$pop.find('.TableList').hide();
					}

				},
				error: biz.ajaxError
			});
		},

		// 项目转移确认
		projectTransferConfirm(tpl, params) {
			// $.alert.toast('项目转移成功')
			// console.log(UserInfo)
			// console.log(params)
			// $.ajax({
			// 	type: 'POST',
			// 	url: biz.server.getUrl(biz.server.projectList.transfer),
			// 	dataType: 'json',
			// 	data: {projectId:params.projectId,userId: ""},
			// 	cache: false,
			// 	global: false,
			// 	success: (json) => {
			//         $.alert.toast('项目转移成功')
			// 	},
			// 	error: biz.ajaxError
			// });
		},

		// 项目复制
		projectCopy(projectId, version) {
			$.alert.confirm({
				msg: '确认要复制并创建新的项目吗？'
			}, function(ret) {
				$.ajax({
					type: 'POST',
					url: biz.server.getUrl(biz.server.projectList.copy),
					dataType: 'json',
					data: {
						projectId: projectId,
						version: version
					},
					cache: false,
					global: false,
					success: (json) => {
						$.alert.toast('复制成功')
					},
					error: biz.ajaxError
				});
			})
		},

		projectLogSave(tpl, params) {
			$.alert.success("成功");
		},

		// 项目跟踪删除信息
		removeitemDetail(target, delId) {
			const $target = $(target),
				$scrollBox = $target.parentsUnitBox('dwz-panel'),
				$form = $target.parentsByTag('form');

			$target.parentsByTag('tr').remove();
			$scrollBox.scrollTo({
				y: 'end',
				duration: 800
			});
			//return false;
			if($form.size() && delId) {
				const delItem = $form.data('delItem') || [];
				delItem.push(delId);
				$form.data('delItem', delItem);
			}
		},

		itemDetailadd(name) {
			const $name = $(name);
			let now = new Date();
			let date = now.formatDate('yyyy-MM-dd');
			//const $itemDetailBox = $form.find('.dwz-item-detail-box');
			let html = '<tr>' +
				'<td>杭州</td>' +
				'<td><input type="text" /></td>' +
				'<td><input type="text" /></td>' +
				'<td><input type="text" /></td>' +
				'<td><input type="text" readonly value="' + date + '" /></td>' +
				'<td><input type="text" readonly value="' + date + '" /></td>' +
				'<td><input type="text" /></td>' +
				'<td><a class="item dwz-ctl-hover" onclick="biz.projectList.removeitemDetail(this)"><i class="dwz-icon-delete"></i>删除</a></td>' +
				'</tr>'
			$(html).prependTo($name);
			$name.parentsUnitBox('scroll-content').scrollTo({
				y: 'end',
				duration: 800
			});

		},
		// 项目跟踪弹出按钮
		operation(target) {
			biz.projectList.open({
				title: '',
				buttons: ['创建信息', '完善信息', '保存']
			}, function(ret) {
				switch(ret.buttonVal) {
					case '创建信息':
						biz.projectList.itemDetailadd($(target).parentsByTag('form').find('.dwz-item-detail-box'));
						break;
					case '完善信息':
						$.navView.open({
							boxId: '12345_跟踪',
							url: 'tpl/widget/project/Edit.html?dwz_callback=biz.projectList.Edit_API&pageName=12345_跟踪',
							rel: 'projectEdit'
						})
						break;
					case '保存':
						biz.projectList.projectLogSave($(target).parentsByTag('form'));
						break;
					default:
						break;
				}
			})
		},
		// 项目跳转
		sd(ProjectId, InstanceGuid) {
			$.navView.open({
				boxId: ProjectId + '_跟踪',
				url: urls = 'tpl/widget/project/projectLog.html?dwz_callback=biz.projectList.projectLogInfo&projectListId=' + ProjectId + '&InstanceGuid=' + InstanceGuid + '&pageName=' + ProjectId + '_跟踪'
			})
		},

		// 项目跟踪页面信息
		projectLogInfo(tpl, params) {
			$.ajax({
				type: 'POST',
				url: biz.server.getUrl(biz.server.projectList.tracking),
				dataType: 'json',
				data: {
					ProjectId: params.projectListId,
					InstanceGuid: params.InstanceGuid
				},
				cache: false,
				global: false,
				success: (json) => {
					console.log(json)
					// if ($.isAjaxStatusOk(json)) {
					console.log($("input[name='tyshxydm']"))
					// $("input[name='tyshxydm']").val(""+json.Entity.PronjectId)

					$("#Quot_CreateDate").val("" + json.Entity.sqqy)

					let html = template.render(tpl.html, {
						UserInfo: UserInfo,
						vo: json.Entity
					});
					this.html(html).initUI();
					let $form = this.find('form.dwz-list-form');
					$form.listTotal(json.Entity.total, json.Entity.list);
					if($form.total) {
						$form.find('.empty_box').hide();
						console.log($form.find('.empty_box'));
					} else {
						$form.find('#ladderTypeSet').hide();
					}
					// 主从表 新增子表元素 dwz_callback=biz.pageRender?dwz_helper=biz.helper.itemDetailHelper

					let $itemDetailBox = this.find('.dwz-collapse').last();

					this.find('.dwz-item-detail-btn').click(() => {
						$(tpl.tpl_item_detail).appendTo($itemDetailBox).initUI();
						$itemDetailBox.parentsUnitBox('scroll-content').scrollTo({
							y: 'end',
							duration: 800
						});
					});

					// }
				},
				error: biz.ajaxError
			})
		},

		config: {
			box$: '#action-sheet'
		},

		// 弹出按钮
		open({
			title,
			buttons = [],
			cancelTxt = $.regional.actionSheet.cancelTxt
		}, callback) {
			let html = `<div id="action-sheet" onclick="return $.actionSheet.close(event)">
            <div class="action-sheet-pane hide-down">
                <div class="action-sheet-ul">
                    ${title ? '<a class="action-sheet-title">' + title + '</a>' : ''}
                    ${buttons
                .map((item) => {
                    let btn = { txt: item.txt || item, style: item.style || '' };
                    return ` < a class = "action-sheet-item"
			style = "${btn.style}" > $ {
				btn.txt
			} < /a>`;
		})
	.join('')
} <
/div> <
a class = "action-sheet-cancel"
onclick = "return $.actionSheet.close(event)" > $ {
		cancelTxt
	} < /a>  < /
	div > <
	/div> `;

$(this.config.box$).remove();
let $box = $(html).appendTo($('body'));
setTimeout(() => {
	$box.find('.action-sheet-pane').removeClass('hide-down');
}, 50);

let $btns = $box.find('a.action-sheet-item');
$.fn.hoverClass && $btns.hoverClass();

for(let i = 0; i < buttons.length; i++) {
	$btns.eq(i).click(i, (event) => {
		let buttonIndex = event.data + 1;
		let buttonVal = buttons[event.data];
		callback && callback({
			buttonIndex,
			buttonVal
		});

		$.actionSheet.close(event);
	});
}
},
//查看流程弹窗
technological(id, InstanceNodeGuid) {
		$.technological.open({
			data: {
				Title: '流程列表',
				Method: 'POST',
				sendData: {
					projectId: id,
					InstanceNodeGuid: InstanceNodeGuid,
					flg: 3
				},
				GetUrl: biz.server.getUrl(biz.server.projectList.getTechnological),
			}
		})
	},
	// 撤消流程1
	Rollback(projectId, InstanceNodeGuid) {
		$.alert.confirm({
				msg: '确定要撤销该供应商的审批流程吗？'
			},
			function(ret) {
				if(ret.buttonIndex == "1") {
					$.ajax({
						type: 'POST',
						url: biz.server.getUrl(biz.server.projectList.RollbackProject),
						dataType: 'json',
						data: {
							projectId: projectId,
							InstanceNodeGuid: InstanceNodeGuid
						},
						cache: false,
						global: false,
						success: (ret) => {
							if(ret.IsSuccess) {
								$.alert.toast("撤销供应商的审批流程：" + projectId + "成功！");
								// 少一个页刷新
								// biz.projectList.$form.requestList();
						
							} else {
								$.alert.toast(ret.Message);

							}
						},
						error: (biz.ajaxError)
					});
				}
			})
	},
	//绑定下拉按钮
	Selectbutton(event,e,item){
    	let ProjectId = JSON.parse(item).ProjectId;
    	let InstanceGuid = JSON.parse(item).InstanceGuid;
    	// let InsId = JSON.parse(item).InstanceGuid;
    	// let InsNodeName = JSON.parse(item).InstanceNodeName;
    	// let version = JSON.parse(item).Version;
    	if($(event.target).attr("class") && $(event.target).attr("class").indexOf("Expandbutton")  > -1  ||  $(event.target).attr("class").indexOf("ExpandbuttonBG") > -1){
		  	biz.Expandbutton.open({
				zIndexP:"#nav-view-widget",
				element:e,
				config:[
					{title:"项目跟踪",callback:"biz.projectList.sd('"+ProjectId+"','"+InstanceGuid+"')",icon:"copyIcon"},
					// {title:"项目转移",callback:"biz.projectList.projectTransfer('"+ProjectId+"')",icon:"deleteIcon"},
				]
			})
		}else{
			$(".ExpandbuttonBG").remove();
		}
    },
	sd(ProjectId, InstanceGuid){
        $.navView.open({
		url:urls = 'tpl/widget/project/projectLog.html?dwz_callback=biz.projectList.projectLogInfo&projectListId='+ProjectId+'&InstanceGuid='+InstanceGuid})
     },

	//  项目追踪 删除子表元素
	removeUnitBox(target, delId) {
		const $target = $(target),
			$scrollBox = $target.parentsUnitBox('scroll-content'),
			$form = $target.parentsByTag('form');

		$target.parentsUnitBox().remove();
		$scrollBox.scrollTo({
			y: 'end',
			duration: 800
		});

		if($form.size() && delId) {
			const delItem = $form.data('delItem') || [];
			delItem.push(delId);
			$form.data('delItem', delItem);
		}
	},
	// 页面获取操作按钮
	OperationButtonOut( id, insNodeId, Version) {
		$.ajax({
			type: 'POST',
			url: biz.server.getUrl(biz.server.projectList.Btn),
			dataType: 'json',
			data: {
				InstanceNodeGuid: insNodeId
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
				
					$.actionSheet.open({
						title: '操作按钮',
						buttons: btns
					}, function(ret) {
					  
						biz.projectList[btns[ret.buttonIndex - 1].Id](btns[ret.buttonIndex - 1].txt, id);
					})
				} else {
					$.alert.open({
						msg: "按钮加载失败!"
					});
				}

			},
			error: biz.ajaxError
		});
	},
	// 提交
	SubmitButton(text, id) {
		var fromEl = $("form[name=" + id + "]");
		let disabledEl = fromEl.find("input:disabled,select:disabled");
		disabledEl.removeAttr("disabled");
		let formSeriv = fromEl.serialize();
		let projectId = fromEl.find("#ProjectId").val();
		let version = fromEl.find("#Version").val();
		let InstanceNodeName = fromEl.find("#InstanceNodeName").val();
		let InstanceNodeGuid = fromEl.find("#InstanceNodeGuid").val();
		let SalerInChargeValue = fromEl.find("#SalerInCharge").val();
		let submitRemarkValue = fromEl.find("#Remark").val();
		disabledEl.attr("disabled", "disabled");
		let errors = [];
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

		if(text == "同意" && InstanceNodeName == "项目区域分总审批") {
			if(SalerInChargeValue == "") {
				$.alert.toast("请选择对接销售员!");
				return false;
			}
		}
		if(text == "拒绝" && submitRemarkValue == "") {
			$.alert.toast("请输入拒绝理由!");
			return false;
		}
		$.ajax({
			type: 'POST',
			url: biz.server.getUrl(biz.server.projectList.SubmitWorkflow),
			dataType: 'json',
			data: {
				instanceNodeId: InstanceNodeGuid,
				submitResult: text,
				projectId: projectId,
				form: formSeriv,
				nextUser: "",
				submitRemark: submitRemarkValue,
				forceExec: false
			},
			cache: false,
			global: false,
			success: (json) => {
				if($.isAjaxStatusOk(json)) {
					if(json.Message == "项目冲突<br />") {
						$.alert.success(json.Message);
					} else if(json.Message == "邮件服务问题,请联系管理员！<br />") {
						$.alert.success(json.Message);
						$.alert.open({
							msg: "项目冲突，邮件未发送成功，请联系管理员！"
						})
					} else if(json.Message.indexOf("涉及跨区") != -1) {

						if(InstanceNodeName == '' || InstanceNodeName == '项目录入') {
							fromEl.find("#Ratio").val("50%");
						}

						var errorArr = json.Message.split("▲");
						$("#Version").val(errorArr[0]);
						$.alert.confirm({
							msg: errorArr[2] + "<br /><br />确定要启动跨区流程吗？"
						}, function(ret) {
							if(ret.buttonIndex == "1") {
								biz.projectList.ExecStartUnStandard(id, InstanceNodeGuid, projectId, formSeriv, errorArr[1]);
							}
						})
					} else {
						if(InstanceNodeName == '' || InstanceNodeName == '项目录入') {
							fromEl.find("#Ratio").val("100%");
							$.ajax({
								type: 'POST',
								url: biz.server.getUrl(biz.server.projectList.UpdateProjectInfoParam),
								dataType: 'json',
								data: {
									projectId: projectId,
									version: version,
									paramcode: "Ratio",
									paramvalue: "100%"
								},
								cache: false,
								global: false,
								success: (json) => {
									if($.isAjaxStatusOk(json)) {
										$.alert.success(json.Message);
										$.navView.close();
									} else {
										$.alert.error(json.Message);
									}
								}
							})
						} else {
							$.alert.success(json.Message);
							$.navView.close();
						}
					}
				} else {
					if(json.Message == "项目冲突<br />") {
						$.alert.error(json.Message);
					} else if(json.Message == "邮件服务问题,请联系管理员！<br />") {
						$.alert.open({
							msg: "项目冲突，邮件未发送成功，请联系管理员！"
						})
					} else {
						$.alert.error(json.Message);
					}
				}
			}
		})

	},
	//跨区提交
	ExecStartUnStandard(id, instanceNodeId, projectId, form, submitResult) {
		$.ajax({
			type: 'POST',
			url: biz.server.getUrl(biz.server.projectList.SubmitWorkflow),
			dataType: 'json',
			data: {
				instanceNodeId: instanceNodeId,
				submitResult: submitResult,
				projectId: projectId,
				form: form,
				nextUser: "",
				submitRemark: "",
				forceExec: true
			},
			cache: false,
			global: false,
			success: (json) => {
				if($.isAjaxStatusOk(json)) {
					$.alert.success(json.Message, function() {
						$.navView.close();
					});

				} else {
					$.alert.error(json.Message);
				}
			}
		})
	},
	// 保存
	saveButton(text, id) {
		var fromEl = $("form[name=" + id + "]")
		let disabledEl = fromEl.find("input:disabled,select:disabled");
		console.log(fromEl)
		disabledEl.removeAttr("disabled");
		let formSeriv = fromEl.serialize();
		disabledEl.attr("disabled", "disabled");
		$.ajax({
			type: 'POST',
			url: biz.server.getUrl(biz.server.projectList.SaveProject_Mobile),
			dataType: 'json',
			data: formSeriv,
			cache: false,
			global: false,
			success: (json) => {
				if($.isAjaxStatusOk(json)) {
					$.alert.success(json.Message);
					$.navView.close();
				} else {
					$.alert.error(json.Message);
				}
			}
		})

	},

	//  项目追踪保存 url地址不同
	saveButton1(id) {
		var arr = []
		let obj = {};

		let collapselength = $("#na").find(".dwz-collapse").length
		console.log($("#na").find(".dwz-collapse").length)
		//  获取多少项目 在for 
		if(collapselength > 0) {
			for(let i = 0; i < collapselength; i++) {
				$(".dwz-collapse input").each(function(index, item) {
					obj[item.name] = item.value
					arr[i] = obj
				})
			}
		} else {
			alert("没有提交数据")
		}
		$.ajax({
			type: 'POST',
			url: biz.server.getUrl(biz.server.projectList.SaveProjectLog),
			dataType: 'json',
			data: {
				ProjectId: id,
				activeJson: JSON.stringify(arr)
			},
			cache: false,
			global: false,
			success: (json) => {
				if($.isAjaxStatusOk(json)) {
					$.alert.success(json.Message);
				} else {
					$.alert.error(json.Message);
				}
			}
		})

	},

	// 新建项目
	EditQuotation1(event) {
		//此处拿到的数据是agent.json
		let urls = 'tpl/widget/project/Edit.html?dwz_callback=biz.projectList.formRander&projectListId=0&instanceNodeGuid=null&projectType=新建项目&pageName=projectEdit';
		
		$.navView.open({
			boxId: 'projectEdit',
			url: urls
		})
	},
	// 关闭
	closeButton() {
		$.navView.close();
	}

};