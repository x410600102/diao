/**
 * @author 张慧华 <350863780@qq.com>
 */
 biz.quotationList = {
 	$form:"",
    //报价查询列表
    listRender(tpl, params) {
        let html = template.render(tpl.html, { UserInfo: UserInfo });
        this.html(html).initUI();

        let $form = this.find('form.dwz-list-form'),
            $listBox = $form.find('ul.dwz-list-box');
            biz.quotationList.$form = $form;
		
        $form.requestList = (loadMore) => {
            let data = $form.serializeArray();
            console.log(JSON.stringify(data));
            $.ajax({
                type: 'GET',
                url: biz.server.getUrl(biz.server.quotation.list),
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
    // 报价待办列表
    todolistRender(tpl, params) {
        let html = template.render(tpl.html, { UserInfo: UserInfo });
        this.html(html).initUI();

        let $form = this.find('form.dwz-list-form'),
            $listBox = $form.find('ul.dwz-list-box');

        $form.requestList = (loadMore) => {
            let data = $form.serializeArray();
            $.ajax({
                type: 'GET',
                url: biz.server.getUrl(biz.server.quotation.todolist),
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
    // 报价价格对比
    quotationpriceReader(tpl, params) {
        let html = template.render(tpl.html, { UserInfo: UserInfo ,vo:params});
        this.html(html).initUI();

        let $form = this.find('form.dwz-list-form');
        $form.requestList = (loadMore) => {
            let data = $form.serializeArray();
            //规格信息
            $.ajax({
                type: 'POST',
                url: biz.server.getUrl(biz.server.quotation.quotationprice),
                dataType: 'json',
                data: data,
                cache: false,
                global: false,
                success: (json) => {
                    if ($.isAjaxStatusOk(json)) {
                    let datas = json.Entity;
                    let arr = [], arr1 = [], arr2 = [];
                    for (let i = 0; i < datas.length; i++) {
                        if (!$.inArray(datas[i].ElevatorNo, arr)) {
                            arr.push(datas[i].ElevatorNo);
                        }
                        if (datas[i].SubVersion == params.curSubVersion) {
                            arr1.push(datas[i]);
                        }
                        if (datas[i].SubVersion == params.oldSubVersion) {
                            arr2.push(datas[i]);
                        }
                    }

                    var html = "<table class=\"table\">";
                    html += "<tr class=\"title\">";
                    html += "<th colspan=\"2\">设备号</th>";
                    for (let i = 0; i < arr.length; i++) {
                        html += "<th colspan=\"2\">" + arr[i]+"</th>";
                    }
                    html += "</tr>";
                    html += "<tr class=\"title\">";
                    html += "<th colspan=\"2\">类型</th>";
                    for (let i = 0; i < arr.length; i++) {
                        html += "<th class=\"banLeft\">版本" + params.curSubVersion + "</th>";
                        html += "<th class=\"banright\">版本" + params.oldSubVersion + "</th>";
                    }
                    html += "</tr>";
                    html += "<tr>";
                    html += "<td rowspan=\"14\">设备</td>";
                    html += "<td>梯号</td>";
                    for (let i = 0; i < arr.length; i++) {
                        for (let j = 0; j < arr1.length; j++) {
                            if (arr1[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr1[j].ElevatorNo+"</td>";
                            }
                        }
                        for (let j = 0; j < arr2.length; j++) {
                            if (arr2[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr2[j].ElevatorNo +"</td>";
                            }
                        }
                    }

                    html += "</tr>";
                    html += "<tr>";
                    html += "<td>产品名称</td>";
                    for (let i = 0; i < arr.length; i++) {
                        for (let j = 0; j < arr1.length; j++) {
                            if (arr1[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr1[j].ElevatorType + "</td>";
                            }
                        }
                        for (let j = 0; j < arr2.length; j++) {
                            if (arr2[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr2[j].ElevatorType + "</td>";
                            }
                        }
                    }
                    html += "</tr>";
                    html += "<tr>";
                    html += "<td>数量</td>";
                    for (let i = 0; i < arr.length; i++) {
                        for (let j = 0; j < arr1.length; j++) {
                            if (arr1[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr1[j].NE + "</td>";
                            }
                        }
                        for (let j = 0; j < arr2.length; j++) {
                            if (arr2[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr2[j].NE + "</td>";
                            }
                        }
                    }
                    html += "</tr>";
                    html += "<tr>";
                    html += "<td>标准单价</td>";
                    for (let i = 0; i < arr.length; i++) {
                        for (let j = 0; j < arr1.length; j++) {
                            if (arr1[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr1[j].EquipmentPrice + "</td>";
                            }
                        }
                        for (let j = 0; j < arr2.length; j++) {
                            if (arr2[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr2[j].EquipmentPrice + "</td>";
                            }
                        }
                    }
                    html += "</tr>";
                    html += "<tr>";
                    html += "<td>折后价</td>";
                    for (let i = 0; i < arr.length; i++) {
                        for (let j = 0; j < arr1.length; j++) {
                            if (arr1[j].ElevatorNo == arr[i]) {
                                html += "<td>" + Math.ceil(arr1[j].EquipmentPrice / 2) + "</td>";
                            }
                        }
                        for (let j = 0; j < arr2.length; j++) {
                            if (arr2[j].ElevatorNo == arr[i]) {
                                html += "<td>" + Math.ceil(arr2[j].EquipmentPrice / 2) + "</td>";
                            }
                        }
                    }
                    html += "</tr>";
                    html += "<tr>";
                    html += "<td>优惠减价</td>";
                    for (let i = 0; i < arr.length; i++) {
                        for (let j = 0; j < arr1.length; j++) {
                            if (arr1[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr1[j].EquipmentSpecialPrice + "</td>";
                            }
                        }
                        for (let j = 0; j < arr2.length; j++) {
                            if (arr2[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr2[j].EquipmentSpecialPrice + "</td>";
                            }
                        }
                    }
                    html += "</tr>";
                    html += "<tr>";
                    html += "<td>非标费</td>";
                    for (let i = 0; i < arr.length; i++) {
                        for (let j = 0; j < arr1.length; j++) {
                            if (arr1[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr1[j].EquipmentDeviationPrice + "</td>";
                            }
                        }
                        for (let j = 0; j < arr2.length; j++) {
                            if (arr2[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr2[j].EquipmentDeviationPrice + "</td>";
                            }
                        }
                    }
                    html += "</tr>";
                    html += "<tr>";
                    html += "<td>预留费</td>";
                    for (let i = 0; i < arr.length; i++) {
                        for (let j = 0; j < arr1.length; j++) {
                            if (arr1[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr1[j].PriceEquipYL + "</td>";
                            }
                        }
                        for (let j = 0; j < arr2.length; j++) {
                            if (arr2[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr2[j].PriceEquipYL + "</td>";
                            }
                        }
                    }
                    html += "</tr>";
                    html += "<tr>";
                    html += "<td>运输费</td>";
                    for (let i = 0; i < arr.length; i++) {
                        for (let j = 0; j < arr1.length; j++) {
                            if (arr1[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr1[j].TransportationPrice + "</td>";
                            }
                        }
                        for (let j = 0; j < arr2.length; j++) {
                            if (arr2[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr2[j].TransportationPrice + "</td>";
                            }
                        }
                    }
                    html += "</tr>";
                    html += "<tr>";
                    html += "<td>设备结算价(单价)</td>";
                    for (let i = 0; i < arr.length; i++) {
                        for (let j = 0; j < arr1.length; j++) {
                            if (arr1[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr1[j].ActualUnitEquipmentPrice + "</td>";
                            }
                        }
                        for (let j = 0; j < arr2.length; j++) {
                            if (arr2[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr2[j].ActualUnitEquipmentPrice + "</td>";
                            }
                        }
                    }
                    html += "</tr>";
                    html += "<tr>";
                    html += "<td>设备结算价(总价)</td>";
                    for (let i = 0; i < arr.length; i++) {
                        for (let j = 0; j < arr1.length; j++) {
                            if (arr1[j].ElevatorNo == arr[i]) {
                                html += "<td>" + (arr1[j].ActualUnitEquipmentPrice * arr1[j].NE) + "</td>";
                            }
                        }
                        for (let j = 0; j < arr2.length; j++) {
                            if (arr2[j].ElevatorNo == arr[i]) {
                                html += "<td>" + (arr2[j].ActualUnitEquipmentPrice * arr2[j].NE) + "</td>";
                            }
                        }
                    }
                    html += "</tr>";
                    html += "<tr>";
                    html += "<td>合同价</td>";
                    for (let i = 0; i < arr.length; i++) {
                        for (let j = 0; j < arr1.length; j++) {
                            if (arr1[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr1[j].EquipContractPrice + "</td>";
                            }
                        }
                        for (let j = 0; j < arr2.length; j++) {
                            if (arr2[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr2[j].EquipContractPrice + "</td>";
                            }
                        }
                    }
                    html += "</tr>";
                    html += "<tr>";
                    html += "<td>服务费</td>";
                    for (let i = 0; i < arr.length; i++) {
                        for (let j = 0; j < arr1.length; j++) {
                            if (arr1[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr1[j].EquipServicePrice + "</td>";
                            }
                        }
                        for (let j = 0; j < arr2.length; j++) {
                            if (arr2[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr2[j].EquipServicePrice + "</td>";
                            }
                        }
                    }
                    html += "</tr>";
                    html += "<tr>";
                    html += "<td>最终折扣率</td>";
                    for (let i = 0; i < arr.length; i++) {
                        for (let j = 0; j < arr1.length; j++) {
                            if (arr1[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr1[j].UnitCiscount * 100 + "%</td>";
                            }
                        }
                        for (let j = 0; j < arr2.length; j++) {
                            if (arr2[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr2[j].UnitCiscount * 100 + "%</td>";
                            }
                        }
                    }
                    html += "</tr>";
                    html += "<tr>";
                    html += "<td rowspan=\"13\">安装</td>";
                    html += "<td>梯号</td>";
                    for (let i = 0; i < arr.length; i++) {
                        for (let j = 0; j < arr1.length; j++) {
                            if (arr1[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr1[j].ElevatorNo + "</td>";
                            }
                        }
                        for (let j = 0; j < arr2.length; j++) {
                            if (arr2[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr2[j].ElevatorNo + "</td>";
                            }
                        }
                    }
                    html += "</tr>";
                    html += "<tr>";
                    html += "<td>产品名称</td>";
                    for (let i = 0; i < arr.length; i++) {
                        for (let j = 0; j < arr1.length; j++) {
                            if (arr1[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr1[j].ElevatorType + "</td>";
                            }
                        }
                        for (let j = 0; j < arr2.length; j++) {
                            if (arr2[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr2[j].ElevatorType + "</td>";
                            }
                        }
                    }
                    html += "</tr>";
                    html += "<tr>";
                    html += "<td>数量</td>";
                    for (let i = 0; i < arr.length; i++) {
                        for (let j = 0; j < arr1.length; j++) {
                            if (arr1[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr1[j].NE + "</td>";
                            }
                        }
                        for (let j = 0; j < arr2.length; j++) {
                            if (arr2[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr2[j].NE + "</td>";
                            }
                        }
                    }
                    html += "</tr>";
                    html += "<tr>";
                    html += "<td>标准折后价</td>";
                    for (let i = 0; i < arr.length; i++) {
                        for (let j = 0; j < arr1.length; j++) {
                            if (arr1[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr1[j].InstallationPrice + "</td>";
                            }
                        }
                        for (let j = 0; j < arr2.length; j++) {
                            if (arr2[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr2[j].InstallationPrice + "</td>";
                            }
                        }
                    }
                    html += "</tr>";
                    html += "<tr>";
                    html += "<td>优惠减价</td>";
                    for (let i = 0; i < arr.length; i++) {
                        for (let j = 0; j < arr1.length; j++) {
                            if (arr1[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr1[j].InstallSpecialPrice + "</td>";
                            }
                        }
                        for (let j = 0; j < arr2.length; j++) {
                            if (arr2[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr2[j].InstallSpecialPrice + "</td>";
                            }
                        }
                    }
                    html += "</tr>";
                    html += "<tr>";
                    html += "<td>验收费</td>";
                    for (let i = 0; i < arr.length; i++) {
                        for (let j = 0; j < arr1.length; j++) {
                            if (arr1[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr1[j].UnitCheckPrice + "</td>";
                            }
                        }
                        for (let j = 0; j < arr2.length; j++) {
                            if (arr2[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr2[j].UnitCheckPrice + "</td>";
                            }
                        }
                    }
                    html += "</tr>";
                    html += "<tr>";
                    html += "<td>其他费</td>";
                    for (let i = 0; i < arr.length; i++) {
                        for (let j = 0; j < arr1.length; j++) {
                            if (arr1[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr1[j].InstallationUnitOtherPrice + "</td>";
                            }
                        }
                        for (let j = 0; j < arr2.length; j++) {
                            if (arr2[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr2[j].InstallationUnitOtherPrice + "</td>";
                            }
                        }
                    }
                    html += "</tr>";
                    html += "<tr>";
                    html += "<td>免保费</td>";
                    for (let i = 0; i < arr.length; i++) {
                        for (let j = 0; j < arr1.length; j++) {
                            if (arr1[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr1[j].PremiumFree + "</td>";
                            }
                        }
                        for (let j = 0; j < arr2.length; j++) {
                            if (arr2[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr2[j].PremiumFree + "</td>";
                            }
                        }
                    }
                    html += "</tr>";
                    html += "<tr>";
                    html += "<td>安装结算价(单价)</td>";
                    for (let i = 0; i < arr.length; i++) {
                        for (let j = 0; j < arr1.length; j++) {
                            if (arr1[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr1[j].ActualUnitInstallPrice + "</td>";
                            }
                        }
                        for (let j = 0; j < arr2.length; j++) {
                            if (arr2[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr2[j].ActualUnitInstallPrice + "</td>";
                            }
                        }
                    }
                    html += "</tr>";
                    html += "<tr>";
                    html += "<td>安装结算价(总价)</td>";
                    for (let i = 0; i < arr.length; i++) {
                        for (let j = 0; j < arr1.length; j++) {
                            if (arr1[j].ElevatorNo == arr[i]) {
                                html += "<td>" + (arr1[j].ActualUnitInstallPrice * arr1[j].NE) + "</td>";
                            }
                        }
                        for (let j = 0; j < arr2.length; j++) {
                            if (arr2[j].ElevatorNo == arr[i]) {
                                html += "<td>" + (arr2[j].ActualUnitInstallPrice * arr2[j].NE) + "</td>";
                            }
                        }
                    }
                    html += "</tr>";
                    html += "<tr>";
                    html += "<td>合同价</td>";
                    for (let i = 0; i < arr.length; i++) {
                        for (let j = 0; j < arr1.length; j++) {
                            if (arr1[j].ElevatorNo == arr[i]) {
                                html += "<td>" + (arr1[j].InstallContractPrice * arr1[j].NE) + "</td>";
                            }
                        }
                        for (let j = 0; j < arr2.length; j++) {
                            if (arr2[j].ElevatorNo == arr[i]) {
                                html += "<td>" + (arr2[j].InstallContractPrice * arr2[j].NE) + "</td>";
                            }
                        }
                    }
                    html += "</tr>";
                    html += "<tr>";
                    html += "<td>服务费</td>";
                    for (let i = 0; i < arr.length; i++) {
                        for (let j = 0; j < arr1.length; j++) {
                            if (arr1[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr1[j].InstallServicePrice + "</td>";
                            }
                        }
                        for (let j = 0; j < arr2.length; j++) {
                            if (arr2[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr2[j].InstallServicePrice + "</td>";
                            }
                        }
                    }
                    html += "</tr>";
                    html += "<tr>";
                    html += "<td>最终折扣率</td>";
                    for (let i = 0; i < arr.length; i++) {
                        for (let j = 0; j < arr1.length; j++) {
                            if (arr1[j].ElevatorNo == arr[i]) {
                                html += "<td>" + (arr1[j].UnitInstallCiscount) * 100 + "%</td>";
                            }
                        }
                        for (let j = 0; j < arr2.length; j++) {
                            if (arr2[j].ElevatorNo == arr[i]) {
                                html += "<td>" + arr2[j].UnitInstallCiscount * 100 + "%</td>";
                            }
                        }
                    }
                    html += "</tr>";
                    html += "</table>";
                    $form.find("#PriceTable").append(html);
                }
                },
                error: biz.ajaxError
            });
            //项目信息
            $.ajax({
                type: 'POST',
                url: biz.server.getUrl(biz.server.quotation.quotationpriceTwo),
                dataType: 'json',
                data: data,
                cache: false,
                global: false,
                success: (json) => {
                    
                    if ($.isAjaxStatusOk(json)) {
                    	let html1 = "", html2="" ,html3="";
                     
                    	//项目
                    	$.each(json.Entity.lCurPROJECTINFOes, function(index,item) {
                            
                    		html1+="<div class=\"form-item\">";
							html1+="<div class=\"item-content\">";
							html1+="<label>" + item.ParamName+"：</label>";
							html1+="<input disabled=\"disabled\" type=\"text\" id=\"\" value=\""+item.ParamValue+"\" class=\"dwz-clipboard\">";
							html1+="<input disabled=\"disabled\" type=\"text\" id=\"\" value=\""+json.Entity.lOldPROJECTINFOes[index].ParamValue+"\" class=\"dwz-clipboard\">";
							html1+="</div>";
							html1+="</div>";
                    	});
                    	$form.find("#PROJECTINFO").append(html1);
                    	//设备
                    	$.each(json.Entity.lCurEQUIPMENTCONTRACTINFOes, function(index,item) {
                    		html2+="<div class=\"form-item\">";
							html2+="<div class=\"item-content\">";
							html2+="<label>" + item.ParamName+"：</label>";
							html2+="<input disabled=\"disabled\" type=\"text\" id=\"\" value=\""+item.ParamValue+"\" class=\"dwz-clipboard\">";
							html2+="<input disabled=\"disabled\" type=\"text\" id=\"\" value=\""+json.Entity.lCurEQUIPMENTCONTRACTINFOes[index].ParamValue+"\" class=\"dwz-clipboard\">";
							html2+="</div>";
							html2+="</div>";
                    	});
                    	$form.find("#EQUIPMENTCONTRACTINFO").append(html2);
                    	//安装
                    	$.each(json.Entity.lCurINSTALLCONTRACTINFOes, function(index,item) {
                    		html3+="<div class=\"form-item\">";
							html3+="<div class=\"item-content\">";
							html3+="<label>" + item.ParamName+"：</label>";
							html3+="<input disabled=\"disabled\" type=\"text\" id=\"\" value=\""+item.ParamValue+"\" class=\"dwz-clipboard\">";
							html3+="<input disabled=\"disabled\" type=\"text\" id=\"\" value=\""+json.Entity.lOldINSTALLCONTRACTINFOes[index].ParamValue+"\" class=\"dwz-clipboard\">";
							html3+="</div>";
							html3+="</div>";
                    	});
                    	$form.find("#INSTALLCONTRACTINFO").append(html3);
                    }
                },
                error: biz.ajaxError
            });
        };

        $.listForm($form);
    },
    //报价编辑
    formRander(tpl, params){
 
		let html = template.render(tpl.html, { UserInfo: UserInfo,vo:params});
        this.html(html).initUI();
        let $form = this.find('form.dwz-list-form');
        
        $form.requestList = (loadMore) => {
            let data = $form.serializeArray();
            $.ajax({
                type: 'POST',
                url: biz.server.getUrl(biz.server.quotation.Edit),
				dataType: 'json',
				data: {
					quotationId: (params.QuotationId?params.QuotationId:""),
					seatIdStr: "PROJECTINFO,EQUIPMENTCONTRACTINFO,INSTALLCONTRACTINFO,INSTALLRESPONS,BIDDINGINFO,REPLACEPROJECTINFO,QUOTATIONHIDDEN",
					projectType: (params.projectType?params.projectType:"")
				},
                cache: false,
                global: false,
                success: (json) => {
                	for(let item in json.Entity){
                		console.log(item)
                		if($("#"+item).length > 0){
                				let HTML = "";
                				let data = json.Entity[item];
                				for(let j = 0;j<data.length;j++){
                					
                					let isDisabled = (data[j].ParamDefine.IsEnable?"":"disabled=\"disabled\"");
                					
									if(data[j].ParamDefine.ElementType == "SELECT"){
                						let options = data[j].ParamOptionList;
                						HTML +="<div class=\"form-item\">";
                                    	HTML +="<div class=\"item-content\">";
                                        HTML +="<label class=\"required\">"+data[j].ParamDefine.ParamName+"：</label>";
                                        HTML +="<select "+isDisabled+" name=\""+data[j].ParamDefine.ParamCode+"\" Element-type=\""+data[j].ParamDefine.ElementType+"\" id=\""+data[j].ParamDefine.ParamCode+"\" class=\"required\">";
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
                					else if(data[j].ParamDefine.ElementType == "INPUT" || data[j].ParamDefine.ElementType == "ADDRESSPICKER"){
                						HTML +="<div class=\"form-item\">";
                                    	HTML +="<div class=\"item-content\">";
                                        HTML +="<label>"+data[j].ParamDefine.ParamName+"：</label>";
                                        HTML +="<input "+isDisabled+" type=\"text\" name=\""+data[j].ParamDefine.ParamCode+"\" Element-type=\""+data[j].ParamDefine.ElementType+"\" id=\""+data[j].ParamDefine.ParamCode+"\" value=\""+data[j].ParamValue+"\" class=\"dwz-clipboard\">";
                                    	HTML +="</div>";
                                		HTML +="</div>";
                					}
                					else if(data[j].ParamDefine.ElementType == "CHILDINPUT"){
                						HTML +="<div class=\"form-item\">";
                                    	HTML +="<div class=\"item-content\">";
                                        HTML +="<label>"+data[j].ParamDefine.ParamName+"：</label>";                                        //HTML += "<div class=\"bar search-bar bar-reset\"><label class=\"item-input filter-keywords\"><input type=\"search\" class=\"dwz-disable-autofocus\" name=\"keywords\" value=\"\" placeholder=\"\" readonly=\"readonly\" onclick=\"biz.quotationList.OpenProjectList(this);\" ><i class=\"dwz-icon-search\"></i></label></div>";
                                        HTML +="<div style=\"border: 1px solid rgba(200, 200, 200, 0.6);border-radius: 5px;position: relative;webkit-box-flex: 1;flex: 1;display: flex;align-items: center\"><input type=\"text\" style=\"border:none\" name=\""+data[j].ParamDefine.ParamCode+"\" Element-type=\""+data[j].ParamDefine.ElementType+"\" id=\""+data[j].ParamDefine.ParamCode+"\" readonly=\"readonly\" value=\""+data[j].ParamValue+"\" class=\"dwz-clipboard\" onclick=\"biz.quotationList.OpenProjectList(this);\"><i style=\"margin-right: 5px;\" class=\"dwz-icon-search\"></i></div>";
                                    	HTML +="</div>";
                                		HTML +="</div>";
                						
                					}
                				}
                				$("#"+item).append(HTML);
                		}
                	}
                	biz.quotationList.elementChange($form,params);
                },
                error: biz.ajaxError
            });
        };
		
        $.listForm($form);
    },
    //价格审批表数据
    PriceFormCheckformRander(tpl, params){
    	let html = template.render(tpl.html, { UserInfo: UserInfo,vo:params});
        this.html(html).initUI();
        let $form = this.find('form.dwz-list-form');
        //项目信息
        $form.requestList = (loadMore) => {
            let data = $form.serializeArray();
            $.ajax({
                type: 'POST',
                url: biz.server.getUrl(biz.server.quotation.Edit),
				dataType: 'json',
				data: {
					quotationId: (params.QuotationId?params.QuotationId:""),
					projectType: (params.projectType?params.projectType:"")
				},
                cache: false,
                global: false,
                success: (json) => {
                },
                error: biz.ajaxError
            });
            
        //报备流程信息
//      $.ajax({
//			type: params.Method || 'GET',
//			url: params.GetUrl,
//			dataType: 'json',
//			data: params.sendData,
//			success: (res) => {
//				if(res.IsSuccess){
//					let json = res.Entity;
//					let _html = "";
//					for(let i = 0;i<json.length;i++){
//						_html += "<div class=\"dwz-panel dwz-collapse margin-h box-round no-line\">";
//						_html += "<div class=\"panel-header\">";
//						_html += "<label class=\"panel-title blockquote\">"+json[i].workList.InstanceNodeName+"</label>";
//						_html += "<a class=\"item-right\"><i class=\"dwz-icon-arrow-up is-collapse\"></i></a>";
//						_html += "</div>";
//						_html += "<div class=\"panel-content\" style=\"display: none;\">";
//						
//						_html+="<div class=\"flex-wrap grid-col-2\">";
//		        		_html+="<p class=\"item item-tinfo1\">办理人</p>";
//		        		_html+="<p class=\"item item-tinfo2\">"+json[i].userName+"</p>";
//		        		_html+="</div>";
//		        		
//		        		_html+="<div class=\"flex-wrap grid-col-2\">";
//		        		_html+="<p class=\"item item-tinfo1\">办理状态</p>";
//		        		_html+="<p class=\"item item-tinfo2\">"+json[i].workList.InstanceNodeStatusCN+"</p>";
//		        		_html+="</div>";
//		        		
//		        		_html+="<div class=\"flex-wrap grid-col-2\">";
//		        		_html+="<p class=\"item item-tinfo1\">提交结果</p>";
//		        		_html+="<p class=\"item item-tinfo2\">"+json[i].workList.SubmitResult+"</p>";
//		        		_html+="</div>";
//		        		
//		        		_html+="<div class=\"flex-wrap grid-col-2\">";
//		        		_html+="<p class=\"item item-tinfo1\">提交日期</p>";
//		        		_html+="<p class=\"item item-tinfo2\">"+json[i].workList.InstanceNodeComplateDate+"</p>";
//		        		_html+="</div>";
//		        		
//		        		_html+="<div class=\"flex-wrap grid-col-1\">";
//		        		_html+="<p class=\"item item-tinfo1\">备注</p>";
//		        		_html+="<p class=\"item item-tinfo2\">"+(json[i].workList.Remark?json[i].workList.Remark:"")+"</p>";
//		        		_html+="</div>";
//		        					
//						_html += "</div>";
//						_html += "</div>";
//					}
//					let $items = $(_html);
//					
//					if (loadMore) {
//						items.appendTo($listBox).hoverClass();
//					} else {
//						$listBox.html($items).initUI();
//					}
//					$form.find("button[type=config]").on("click",function(event){
//						$.technological.close();
//					})
//					
//				}else{
//					$.alert.open({msg:"未启动流程!"});
//					$.technological.close();
//				}
//				
//					
//			},
//			error: biz.ajaxError
//		});
        
            
       };
        $.listForm($form);
    },
    //底部操作按钮
    OperationButtonOut(id,insNodeId){
    	
    	//获取按钮
        $.ajax({
			type:'POST',
			url: "/app_proxy/Quotation/OperationButtonOut_API",
			dataType: 'json',
			data: {
				quotationId: id,
				instanceNodeGuid: insNodeId
			},
			success: (res) => {
				if(res.IsSuccess){
					let json = res.Entity;
					let btns = [];
					for(let i = 0;i<json.OperationButtonLeft.length;i++){
						let obj = {
							txt:json.OperationButtonLeft[i].ViewText,
							Id:json.OperationButtonLeft[i].Id
						}
						btns.push(obj);
					}
					for(let i = 0;i<json.OperationButtonRight.length;i++){
						let obj = {
							txt:json.OperationButtonRight[i].ViewText,
							Id:json.OperationButtonRight[i].Id
						}
						btns.push(obj);
					}
					$.actionSheet.open({
						title:'操作按钮',
						buttons: btns
					}, function(ret){
						biz.quotationList[btns[ret.buttonIndex - 1].Id](btns[ret.buttonIndex].txt);
					})
				}else{
					$.alert.open({msg:"按钮加载失败!"});
				}
				
					
			},
			error: biz.ajaxError
		});
    },
    saveProceedsButtonOut(text){
    	console.log(text)
    },
    //打开选择项目侧边框
    OpenProjectList(e){
    	let _this = $(e);
    	let form = _this.parentsByTag('form').get(0);
    	$.ajax({
            type: 'POST',
            url: biz.server.getUrl(biz.server.quotation.projectIsChange),
            dataType: 'json',
            data: {quotationId: form.QuotationId.value,projectId: _this.val()},
            cache: false,
            global: false,
            success: (json) => {
            	if ($.isAjaxStatusOk(json)) {
            		biz.quotationList.changeProjectInfo(_this,false);
            	}else if(json.Entity == "1"){
            		$.alert.confirm({
						msg: '报价单中已生成土建图，修改项目会清空所有土建图，且不可恢复，需要重新申请，确定要修改项目吗?'
					}, function(ret) {
						if(ret.buttonIndex == "1"){
							biz.quotationList.changeProjectInfo(_this,true);
						}
					})
            	}
            },
            error: biz.ajaxError
        });
   },
   //去顶修改项目
   changeProjectInfo(e,ClearLayoutId){
    	let form = $(e).parentsByTag('form').get(0);
   	$.ajax({
        type: 'POST',
        url: biz.server.getUrl(biz.server.quotation.getProject),
        dataType: 'json',
        data: {},
        cache: false,
        global: false,
        success: (json) => {
        	
            $.daiolPanel.open({
				url: 'tpl/widget/template/daiolpanel.html?dwz_callback=biz.helper.DaiolPanelRender',
				data: {
					target: e,
					searchTitle: '项目列表',
					searchField: 'keywords',
					searchMethod: 'POST',
					isOne: true,
					searchUrl: biz.server.getUrl(biz.server.quotation.getProject),
					seatchType:true,
					filterItems: [
						{
							label: '项目编号',
							name: 'ProjectId',
							search:true
						},
						{
							label: '项目名称',
							name: 'ProjectName',
							search:true
						},
						{
							label: '客户名称',
							name: 'CustomName',
							search:true
						},
						{
							label: '地址',
							name: 'Address',
							search:false
						}
					],
					buttonLists:[
						{viewText:"搜索",btnType:"search"},
						{viewText:"确定",btnType:"config"}
					],
					callback: function(data) {
						if(data.length > 0){
							var info = data[0];
							$.ajax({
					            type: 'POST',
					            url: biz.server.getUrl(biz.server.projectList.getInfo),
					            dataType: 'json',
					            data: {projectId: info.ProjectId},
					            cache: false,
					            global: false,
					            success: (datas) => {
					            	let result = datas;
					            		form.ProjectId.value = result.ProjectId?result.ProjectId:"";//项目编号
						                form.ProjectName.value = result.ProjectName?result.ProjectName:"";//项目名称
						                form.ProjectTypeInfo.value = result.ProjectTypeInfo?result.ProjectTypeInfo:"";//项目类型
						               	form.CustomName.value = result.CustomName?result.CustomName:"";//客户名称
						                //form.KHID.value = result.KHID;//客户编号
						                form.CustomCate.value = result.CustomCate?result.CustomCate:"";//客户类型
						                form.CreatorName.value = result.CreatorName?result.CreatorName:"";//销售地销售员
						                //form.Creator.value = result.Creator;//销售地销售员编号
						                form.BelongBranchCompany.value = result.BelongBranchCompany?result.BelongBranchCompany:"";//销售地分公司
						                form.ProjectBranchCompany.value = result.ProjectBranchCompany?result.ProjectBranchCompany:"";      //项目地分公司
						                form.ProjectCountry.value = result.ProjectCountry?result.ProjectCountry:"";//项目所在国家
						                form.ProvCityDist.value = result.ProvCityDist;//项目所在地
			//			                province(form.ProjectCountry').val());
						                //form.Street.value = result.Street;
						                form.Address.value = result.Address?result.Address:"";//项目地址
						                form.Ratio.value = result.Ratio?result.Ratio:"";//销售地台量占比(%)
					            },
					            error: biz.ajaxError
					        });
							
							
							
						}
					}
				}
			})
        },
        error: biz.ajaxError
    });
   },
    // 报价删除
    dellquotaion(quotationId,version){
        $.alert.confirm({
            msg: '确认要删除吗？'
        }, function(ret) {
        	if(ret.buttonIndex == "1"){
        		$.ajax({
					type: 'POST',
					url: biz.server.getUrl(biz.server.quotation.Del),
					dataType: 'json',
					data: {  quotationId: quotationId, version: version, nextIndex: 0},
					cache: false,
					global: false,
					success: (json) => {
						$.alert.toast('删除成功')
					},
					error: biz.ajaxError
				});
	        }
        })
    },
    //前往编辑
    EditQuotation(event,item){
    	let urls = 'tpl/widget/quotation/new.html?dwz_callback=biz.quotationList.formRander&projectType=新梯项目';
    	if(item){
    		let info = JSON.parse(item);
    		let title = info.QuotationId;
    		if(info.InstanceNodeName.indexOf('ApprovalNodeName') > -1){
    			title = "价格审批表_"+title;
    			urls = 'tpl/widget/quotation/PriceFormCheck.html?dwz_callback=biz.quotationList.PriceFormCheckformRander&QuotationId='+info.QuotationId+'&InstanceNodeGuid='+info.InstanceNodeGuid+'&projectType=新梯项目';
    		}else{
    			urls = 'tpl/widget/quotation/new.html?dwz_callback=biz.quotationList.formRander&QuotationId='+info.QuotationId+'&InstanceNodeGuid='+info.InstanceNodeGuid+'&projectType=新梯项目';
    		}
    		if($(event.target).attr("class") && $(event.target).attr("class").indexOf("Expandbutton")  == -1  &&  $(event.target).attr("class").indexOf("ExpandbuttonBG") == -1){
			  	$.navView.open({
		            page_title: title,
		            url:urls
		        })
			}
    	}else{
    		if($(event.target).attr("class") && $(event.target).attr("class").indexOf("Expandbutton")  == -1  &&  $(event.target).attr("class").indexOf("ExpandbuttonBG") == -1){
			  	$.navView.open({
		            page_title: '报价单录入',
		            url:urls
		        })
			}
    	}
    	
    },
    //绑定下拉按钮
    Selectbutton(event,e,item){
    	let quoId = JSON.parse(item).QuotationId;
    	let InsNodeId = JSON.parse(item).InstanceNodeGuid;
    	let InsId = JSON.parse(item).InstanceGuid;
    	let InsNodeName = JSON.parse(item).InstanceNodeName;
    	let version = JSON.parse(item).Version;
    	if($(event.target).attr("class") && $(event.target).attr("class").indexOf("Expandbutton")  > -1  ||  $(event.target).attr("class").indexOf("ExpandbuttonBG") > -1){
		  	biz.Expandbutton.open({
				zIndexP:"#nav-view-widget",
				element:e,
				config:[
					{title:"复制",callback:"biz.quotationList.CopyItem('"+quoId+"','"+version+"')",icon:"copyIcon"},
					{title:"删除",callback:"biz.quotationList.dellquotaion('"+quoId+"','"+version+"')",icon:"deleteIcon"},
					{title:"查看流程",callback:"biz.quotationList.technological('"+quoId+"','"+InsNodeId+"')",icon:"deleteIcon"},
					{title:"查看报价单",callback:"biz.quotationList.dellquotaion('"+quoId+"','"+InsNodeId+"')",icon:"deleteIcon"},
					{title:"生成规格表",callback:"biz.quotationList.CreateSpec('"+quoId+"','"+InsNodeId+"')",icon:"deleteIcon"},
					{title:"变更查看",callback:"biz.quotationList.ChangeContrast('"+quoId+"','"+version+"')",icon:"deleteIcon"},
					{title:"撤销流程",callback:"biz.quotationList.Rollback('"+quoId+"','"+InsId+"','"+InsNodeId+"','"+InsNodeName+"','"+version+"')",icon:"deleteIcon"},
					{title:"下载报价书",callback:"biz.quotationList.ExportBaoJiaShu('"+quoId+"','"+version+"')",icon:"deleteIcon"}
				]
			})
		}else{
			$(".ExpandbuttonBG").remove();
		}
    },
    //变更查看
    ChangeContrast(id,version){
    	$.daiolPanel.open({
				url: 'tpl/widget/template/daiolpanel.html?dwz_callback=biz.helper.DaiolPanelRender',
				data: {
					target: null,
					searchTitle: '变更查看',
					searchMethod: 'POST',
					isOne: false,
					checkedNum:2,//限制多选
					searchUrl: "/app_proxy/Quotation/GetSubVersionListByQuotationIdAndVersion",
					seatchType:false,
					sendData:[{name:'quotationId',value:id},{name:'version',value:version}],
					filterItems: [
						{
							label: '报价单编号',
							name: 'QuotationId'
						},
						{
							label: '版本',
							name: 'SubVersion'
						}
					],
					buttonLists:[
						{viewText:"价格对比",btnType:"config"},
						{viewText:"关闭",btnType:"close"},
					],
					callback: function(data) {
						if(data.length > 0){
							var info = data[0];
							$.navView.open({
					            page_title: "价格对比",
					            url: "tpl/widget/quotation/quotationprice.html?dwz_callback=biz.quotationList.quotationpriceReader&quotationId="+id+"&version="+version+"&curSubVersion="+data[0].SubVersion+"&oldSubVersion="+data[1].SubVersion+""
					        })
						}
					}
				}
			})
    	$.ajax({
			type: 'POST',
			url: "",
			dataType: 'json',
			data: { quotationId: id,version: version},
			cache: false,
			global: false,
			success: (ret) => {
				if (ret.IsSuccess) {
					window.location.href= "/app_proxy/ChildWindows/DownLoadBaoJiaShu?quotationId=" + id + "&version=" + version;
            	}else{
            		$.alert.toast(ret.Message);
            	}
			},
			error: (biz.ajaxError)
		});
    },
    //下载报价书
    ExportBaoJiaShu(id,version){
    	$.ajax({
			type: 'POST',
			url: "/app_proxy/ChildWindows/ExportBaoJiaShu",
			dataType: 'json',
			data: { quotationId: id,version: version},
			cache: false,
			global: false,
			success: (ret) => {
				if (ret.IsSuccess) {
					window.location.href= "/app_proxy/ChildWindows/DownLoadBaoJiaShu?quotationId=" + id + "&version=" + version;
            	}else{
            		$.alert.toast(ret.Message);
            	}
			},
			error: (biz.ajaxError)
		});
    },
    
    //生成规格表
    CreateSpec(id){
    	$.ajax({
			type: 'POST',
			url: "/app_proxy/Quotation/ExportSpec",
			dataType: 'json',
			data: { quotationId: id},
			cache: false,
			global: false,
			success: (ret) => {
				if (ret.IsSuccess) {
					var link = document.createElement('a');
					link.setAttribute("download", "");
					link.href = "/Quotation/QuotationSpecAllDownLoadAFile?quotationId=" + id;
					link.click();
            	}else{
            		$.alert.toast(ret.Message);
            	}
			},
			error: (biz.ajaxError)
		});
    },
    //复制报价单
    CopyItem(id,version){
   let form = biz.quotationList.$form;
        $.daiolPanel.open({
			url: 'tpl/widget/template/daiolpanel.html?dwz_callback=biz.helper.DaiolPanelRender',
			data: {
				target: null,
				searchTitle: '项目列表',
				searchField: 'keywords',
				searchMethod: 'POST',
				isOne: true,
				searchUrl: biz.server.getUrl(biz.server.quotation.getProject),
				filterItems: [
					{
						label: '项目编号',
						name: 'ProjectId',
						search:true
					},
					{
						label: '项目名称',
						name: 'ProjectName',
						search:true
					},
					{
						label: '客户名称',
						name: 'CustomName',
						search:true
					},
					{
						label: '地址',
						name: 'Address',
						search:false
					}
				],
				callback: function(data) {
					if(data.length > 0){
						var info = data[0];
						
						$.alert.confirm({
							msg: '确定要复制并创建新的报价单吗？'
						}, function(ret) {
							if(ret.buttonIndex == "1"){
								$.ajax({
									type: 'POST',
									url: "/app_proxy/Quotation/CopyQuotation",
									dataType: 'json',
									data: { quotationId: id, projectId: info.ProjectId, version: version},
									cache: false,
									global: false,
									success: (ret) => {
										if (ret.IsSuccess) {
											$.alert.toast("复制成功！");
											biz.quotationList.$form.requestList();
					                	}else{
					                		$.alert.toast(ret.Message);
					                	}
									},
									error: (biz.ajaxError)
								});
							}
						})
					}
				}
			}
		})

    },
    //查看流程弹窗
    technological(id,InstanceNodeGuid){
    	$.technological.open({
			data: {
				Title: '流程列表',
				Method: 'POST',
				sendData:{quotationId:id,InstanceNodeGuid:InstanceNodeGuid,flg: 3},
				GetUrl: biz.server.getUrl(biz.server.quotation.getTechnological),
			}
		})
    },
    //撤销流程
    Rollback(QuotationId,InstanceGuid,InstanceNodeGuid,InstanceNodeName,Version){
    	$.ajax({
				type: 'POST',
				url: "/app_proxy/ChildWindows/BaseInstanceNodeIsRead",
				dataType: 'json',
				data: { instanceNodeGuid: InstanceNodeGuid},
				cache: false,
				global: false,
				success: (result) => {
					if (result.IsSuccess) {
						$.alert.confirm({
							msg: '确定要撤销该报价单审批流程吗？'
						}, function(ret) {
							if(ret.buttonIndex == "1"){
								$.ajax({
									type: 'POST',
									url: "/app_proxy/Quotation/RollbackQuotation",
									dataType: 'json',
									data: { quotationId: QuotationId, instanceGuid: InstanceGuid, isDeleteLayoutId: false},
									cache: false,
									global: false,
									success: (ret) => {
										if (ret.IsSuccess) {
											$.alert.toast("撤销报价单审批流程：" + QuotationId + "成功！");
											biz.quotationList.$form.requestList();
					                	}else{
					                		$.alert.toast(ret.Message);
					                	}
									},
									error: (biz.ajaxError)
								});
							}
						})
                	}else{
                		$.alert.toast(result.Message);
                	}
				},
				error: biz.ajaxError
			});
    },
    //页面加载后的控制
    elementChange($form,params){
    	$form.find(".header-title").text((params.QuotationId?params.QuotationId:"报价单录入"));
//      $form.find(".price").hide();
        
        //设备类型
        $form.on("change", "#EquipmentType", function () {
                if ($("#EquipmentType").val() == "直销") {
//                  getTitleAutoSelect($("#OEM"), "无代理商");
//                  $("input[name=View_ParamValue_OEM]").attr("disabled", true);
                    $("#InstallType option").each(function (i, op) {
                            $(op).prop("disabled",false);
                        if ($(op).val() != "直销") {
                            $(op).prop("disabled",true);
                        }
                    })
                    $("#InstallType").val("直销");
                    $("#PackageType").val("专业分包");
                    $("#SFYFWF").val("否").prop("disabled",true);
               }

                if ($("#EquipmentType").val() == "经销") {

                $("#InstallType option").each(function (i, op) {
                        $(op).prop("disabled",false);
                    if ($(op).val() == "直销") {
                        $(op).prop("disabled",true);
                    }
                })
                    $("#InstallType").val("无");
//                  getTitleAutoSelect($("#OEM");
//                  window.localStorage.getItem("@ViewData["QuotationCode"]"));
//                  $("input[name=View_ParamValue_OEM]").attr("disabled", false);

//              $("input[name=View_ParamValue_InstallCompany]").attr("disabled", false);

                //安装税点
                    $("#InstallTaxpoint").val("无");
                $("#InstallTaxpoint").prop("disabled", true)

                //是否含免保
                $("#HasFreeMaintenance").val("无");
                $("#HasFreeMaintenance").prop("disabled", true)
                //免保期
                $("#MBQ").val("无");
                $("#MBQ").prop("disabled", true)

                    $("#SFYFWF").val("否").prop("disabled", false);
            }
            if ($("#EquipmentType").val() == "代销") {
                    $("#InstallType option").each(function (i, op) {
                        $(op).prop("disabled",false);
                    if ($(op).val() == "直销") {
                        $(op).prop("disabled",true);
                    }
                })
                $("#InstallType").val("代销");
//              getTitleAutoSelect($("#OEM");
//              window.localStorage.getItem("@ViewData["QuotationCode"]"));
//              $("input[name=View_ParamValue_OEM]").prop("disabled", false);

//              getTitleAutoSelect($("#InstallCompany"), "无代理商");
//              $("input[name=View_ParamValue_InstallCompany]").prop("disabled", true);

                //安装税点
                $("#InstallTaxpoint option[value='无']").prop("disabled",true);
                $("#InstallTaxpoint").prop("disabled", false);
                //是否含免保
                $("#HasFreeMaintenance option[value='无']").prop("disabled",true);
                $("#HasFreeMaintenance").prop("disabled", false);
                //免保期
                $("#MBQ option[value='无']").prop("disabled",true);;
                $("#MBQ").prop("disabled", false);

                $("#SFYFWF").val("是").prop("disabled", false);
            }
//              $("#InstallType").change();
        });
        
        
        
    },
    //规格头部操作=---未完成
    addConfigList(event,e){
    	event.stopPropagation();
    	$.alert.confirm({ msg: '确认切换到“我的”页面吗？' }, function(ret) {
			if (ret.buttonIndex == 1) {
				$.navTab.open({url:'tpl/my/index.html?dwz_callback=biz.my.render', tabid:'my'});
			}
		});
		
    },
    //规格列表中-操作
    EditQuoBtn(event,e,item){
//  	if(item){
    		$.actionSheet.open({
				title:'actionSheet组件示例',
				buttons: ['查看', '撤销', {txt:'删除', style:'color:red'}]
			}, function(ret){
				$.alert.toast('buttonIndex: ' + ret.buttonIndex)
			})
//  	}
    	
    }
};