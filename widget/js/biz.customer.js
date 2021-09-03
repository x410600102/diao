/**
 * @author 张慧华 <350863780@qq.com>
 */
 biz.customer = {
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
    EditRender(tpl, params) {
        
        $form.requestList = (loadMore) => {
            let data = $form.serializeArray();
            console.log(JSON.stringify(data));
            $.ajax({
                type: 'GET',
                url: biz.server.getUrl(biz.server.customerList.list),
                dataType: 'json',
                data: data,
                cache: false,
                global: false,
                success: (json) => {
                    
                    let html = template.render(tpl.html, { UserInfo: UserInfo, vo: json.data });
                    this.html(html).initUI();
                    
                },
                error: biz.ajaxError
            });
        };

        $.listForm($form);
    },
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
                url: biz.server.getUrl(biz.server.customerList.list),
                dataType: 'json',
                data: data,
                cache: false,
                global: false,
                success: (json) => {
                    if ($.isAjaxStatusOk(json)) {
                        $form.listTotal(json.data.total, json.data.list);
                        if ($form.total) {
                            $form.find('.empty_box').hide();
                        }

                        let _html = template.render(tpl.tpl_list, json.data);

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
    
    Edit_API(tpl, params) {
         
		$.ajax({
			type: 'POST',
			url: biz.server.getUrl(biz.server.customerEdit.list),
			dataType: 'json',
			data: decodeURI(params.page_title || ''),
			cache: false,
			global: false,
			success: (json) => {
                if ($.isAjaxStatusOk(json)) {
                    console.log(json);
                    let html = template.render(tpl.html, { UserInfo: UserInfo,vo: json.data });
                    this.html(html).initUI();
                    let $form = this.find('form.dwz-list-form');
                    $form.listTotal(json.data.total, json.data.list);
                    if ($form.total) {
                        $form.find('.empty_box').hide();
                        console.log($form.find('.empty_box'));
                    } else {
                        $form.find('#ladderTypeSet').hide();
                    }
                    
                }
			},
			error: biz.ajaxError
		});
        
       
	},
    
    // 修改客户
    Edit(tpl,params){
        $.alert.success("成功");
        // const $itemDetailBox = this.find('.dwz-item-detail-box');
        // this.find('.dwz-item-detail-btn').click(() => {
        // 	$(tpl.tpl_item_detail).appendTo($itemDetailBox).initUI();
        // 	$itemDetailBox.parentsUnitBox('scroll-content').scrollTo({ y: 'end', duration: 800 });
        // });
    },

    // 删除客户
    DelCustomer(callback){
        let message = '不给删除';
        callback && callback({message})
    }
};