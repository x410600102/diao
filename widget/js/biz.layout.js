/**
 * @author 张慧华 <350863780@qq.com>
 */
 biz.layout = {
    removeItem({ id = null }, event) {
        if (event) {
            event.stopPropagation();
        }
        $.ajax({
            type: 'POST',
            url: biz.server.getUrl(biz.server.message.del),
            dataType: 'json',
            data: { id: id },
            cache: false,
            global: false,
            success: (json) => {
                if ($.isAjaxStatusOk(json)) {
                    $(event.target)
                        .parentsUnitBox()
                        .find('ul.list li[data-id="' + id + '"]')
                        .remove();
                }
            },
            error: biz.ajaxError
        });
    },
    //土建图查询列表
    listRender(tpl, params) {
        let html = template.render(tpl.html, { UserInfo: UserInfo });
        this.html(html).initUI();

        let $form = this.find('form.dwz-list-form'),
            $listBox = $form.find('ul.dwz-list-box');

        $form.requestList = (loadMore) => {
            let data = $form.serializeArray();
            console.log(JSON.stringify(data));
            $.ajax({
                type: 'GET',
                url: biz.server.getUrl(biz.server.layout.list),
                dataType: 'json',
                data: data,
                cache: false,
                global: false,
                success: (json) => {
                    if ($.isAjaxStatusOk(json)) {
                        $form.listTotal(10, json.Entity);
                        if ($form.total) {
                            $form.find('.empty_box').hide();
                        }

                        let _html = template.render(tpl.tpl_list, json.Entity);

                        if (loadMore) {
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
    // 土建待办列表
    todolistRender(tpl, params) {
        let html = template.render(tpl.html, { UserInfo: UserInfo });
        this.html(html).initUI();

        let $form = this.find('form.dwz-list-form'),
            $listBox = $form.find('ul.dwz-list-box');

        $form.requestList = (loadMore) => {
            let data = $form.serializeArray();
            console.log(JSON.stringify(data));
            $.ajax({
                type: 'GET',
                url: biz.server.getUrl(biz.server.layout.todolist),
                dataType: 'json',
                data: data,
                cache: false,
                global: false,
                success: (json) => {
                    if ($.isAjaxStatusOk(json)) {
                        $form.listTotal(10, json.Entity);
                        if ($form.total) {
                            $form.find('.empty_box').hide();
                        }

                        let _html = template.render(tpl.tpl_list, json.Entity);

                        if (loadMore) {
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
    layoutForm(tpl, params,that) {
    	let html = template.render(tpl.html, { UserInfo: UserInfo});
        if (that){
            that.html(html).initUI();
        } else {
            this.html(html).initUI();
        }
        
        let $form = (that == ""||that == undefined) ? this.find('form.dwz-list-form'): that.find('form.dwz-list-form');
        $form.requestList = (loadMore) => {
            let data = $form.serializeArray();
            $.ajax({
                type: 'POST',
                url: biz.server.getUrl(biz.server.layout.edit),
                dataType: 'json',
                data: {
                	layoutId: "T21035510A",
					InstanceNodeGuid: "00000000-0000-0000-0000-000000000000",
					seatIdStr: "BASICINFO|1,BASICINFOG|1,BEAM|1,CARSPECIAL|1,CONTROLTYPEG|1,DOORINFO|1,ELEROOMINFO|1,FLOORINFO|1,HOISTWAYLAYOUT|1,LAYOUTHIDDEN|1,LAYOUTINFO|1,LAYOUTINFOGHIDDEN|1,LAYOUTUNSTD|1,MACHINEROOM|1,PROJECTINFO|1,TechnicalParameters|1,Technical-Proposal1|1"
                },
                cache: false,
                global: false,
                success: (json) => {
                	for(let item in json.Entity){
                		console.log(item)
                		if($("#"+item).length > 0){
                			console.log(json.Entity[item])
                			if(item == "PROJECTINFO" || item == "LAYOUTINFOG"){
                				let data = json.Entity[item];
                				for(let j = 0;j<data.length;j++){
                					if($("#"+data[j].ParamDefine.ParamCode).length > 0){
                						$("#"+data[j].ParamDefine.ParamCode).val(data[j].ParamValue);
                					}
                				}
                			}else{
                				let HTML = "";
                				let data = json.Entity[item];
                				for(let j = 0;j<data.length;j++){
//              					if(data[j].ParamDefine.ElementType == "SELECT"){
//              						let options = data[j].ParamOptionList;
//              						data[j].ParamDefine.ScriptCode = data[j].ParamDefine.ScriptCode.replace(/\[0\]/ig, '')
//              						HTML +="<div class=\"form-item\">";
//                                  	HTML +="<div class=\"item-content\">";
//                                      HTML +="<label class=\"required\">"+data[j].ParamDefine.ParamName+"：</label>";
//                                      HTML +="<select name=\""+data[j].ParamDefine.ParamCode+"\" Element-type=\""+data[j].ParamDefine.ElementType+"\" id=\""+data[j].ParamDefine.ParamCode+"\" class=\"required\" onchange=\""+data[j].ParamDefine.ScriptCode+"\">";
//                                      for(let t= 0;t<options.length;t++){
//                                      	if(options[t].Value == data[j].ParamValue){
//                                      		HTML +="<option selected value=\""+options[t].Value+"\">"+options[t].Text+"</option>";
//                                      	}else{
//                                      		HTML +="<option value=\""+options[t].Value+"\">"+options[t].Text+"</option>";
//                                      	}
//                                      }
//                                  	HTML +="</select>";
//                                  	HTML +="</div>";
//                              		HTML +="</div>";
//              					}
									if(data[j].ParamDefine.ElementType == "SELECT"){
                						let options = data[j].ParamOptionList;
                						data[j].ParamDefine.ScriptCode = data[j].ParamDefine.ScriptCode.replace(/\[0\]/ig, '')
                						HTML +="<div class=\"form-item\">";
                                    	HTML +="<div class=\"item-content\">";
                                        HTML +="<label class=\"required\">"+data[j].ParamDefine.ParamName+"：</label>";
                                        HTML +="<select name=\""+data[j].ParamDefine.ParamCode+"\" Element-type=\""+data[j].ParamDefine.ElementType+"\" id=\""+data[j].ParamDefine.ParamCode+"\" class=\"required\" onchange=\""+data[j].ParamDefine.ScriptCode+"\">";
                                        for(let t= 0;t<options.length;t++){
                                        	if(options[t].Value == data[j].ParamValue){
                                        		HTML +="<option selected value=\""+options[t].Value+"\">"+options[t].Text+"</option>";
                                        	}else{
                                        		HTML +="<option value=\""+options[t].Value+"\">"+options[t].Text+"</option>";
                                        	}
                                        }
                                    	HTML +="</select>";
                                    	HTML +="</div>";
                                		HTML +="</div>";
                					}
                					else if(data[j].ParamDefine.ElementType == "INPUT"){
                						HTML +="<div class=\"form-item\">";
                                    	HTML +="<div class=\"item-content\">";
                                        HTML +="<label>"+data[j].ParamDefine.ParamName+"：</label>";
                                        HTML +="<input type=\"text\" name=\""+data[j].ParamDefine.ParamCode+"\" Element-type=\""+data[j].ParamDefine.ElementType+"\" id=\""+data[j].ParamDefine.ParamCode+"\" value=\""+data[j].ParamValue+"\" onchange=\""+data[j].ParamDefine.ScriptCode+"\" class=\"dwz-clipboard\">";
                                    	HTML +="</div>";
                                		HTML +="</div>";
                					}
                				}
                				$("#"+item).append(HTML);
                			}
                		}
                	}
                },
                error: biz.ajaxError
            });
        };

        $.listForm($form);
    },
    // 主从表 新增子表元素 dwz_callback=biz.pageRender?dwz_helper=biz.helper.itemDetailHelper
	itemDetailHelper(tpl, params) {
		const $itemDetailBox = this.find('.dwz-item-detail-box');
		this.find('.dwz-item-detail-btn').click(() => {
			$(tpl.tpl_item_detail).prependTo($itemDetailBox).initUI();
			$itemDetailBox.parentsUnitBox('scroll-content').scrollTo({ y: 'end', duration: 800 });
		});
        
	},
    // 土建删除
    dellayout(layoutId){
        $.alert.confirm({
            msg: '确认要删除吗？'
        }, function(ret) {
            $.ajax({
				type: 'POST',
				url: biz.server.getUrl(biz.server.layout.del),
				dataType: 'json',
				data: { layoutId: layoutId},
				cache: false,
				global: false,
				success: (json) => {
					$.alert.toast('删除成功')
				},
				error: biz.ajaxError
			});
        })
    },
    // 土建变更对比
    changeContrast() {

    }
};