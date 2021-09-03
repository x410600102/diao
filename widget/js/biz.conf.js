/**
 * @author 张慧华 <350863780@qq.com>
 */
const biz = window.biz || {
    server: {
        ENV: 'TEST', // DEV,TEST,UAT,LIVE
        _flag() {
            return $.inArray(this.ENV, ['TEST', 'UAT', 'LIVE']) ? 'REMOTE' : this.ENV;
        },
        baseUrl: {
            DEV: '',
            TEST: '/app_proxy',
              UAT: 'https://mobile.jui.org',
            LIVE: 'http://180.100.208.181:8989/'
        },
        _verifyImg: {
            DEV: './doc/verify.png',
            REMOTE: '/Public/verify'
        },
        login: {
            DEV: './doc/json/login.json',
            REMOTE: '/Home/SubmitLogin'
        },
        loginSms: {
            DEV: './doc/json/login.json',
            REMOTE: '/login/verify'
        },

        register: {
            DEV: './doc/json/register.json',
            REMOTE: '/register'
        },
        forgetPwd: {
            DEV: './doc/json/ajaxDone.json',
            REMOTE: '/forget'
        },
        changePwd: {
            DEV: './doc/json/ajaxDone.json',
            REMOTE: '/user/password'
        },
        changeMobile: {
            DEV: './doc/json/ajaxDone.json',
            REMOTE: '/user/phone'
        },
        userProfile: {
            DEV: './doc/json/login.json',
            REMOTE: '/user'
        },
        sendSmsCode: {
            DEV: './doc/json/ajaxDone.json',
            REMOTE: '/code'
        },
        feedback: {
            DEV: './doc/json/ajaxDone.json',
            REMOTE: '/feedback'
        },
        // 公安实名验证
        userRealVerify: {
            DEV: './doc/json/login.json',
            REMOTE: '/user/realVerify'
        },

        // 首页-轮播图
        homeAd: {
            DEV: './doc/json/homeAd.json',
            REMOTE: './doc/json/homeAd.json'
        },
        // 组件列表
        widgetList: {
            DEV: './doc/json/widgetList.json',
            REMOTE: './doc/json/widgetList.json'
        },
        // 省、市、区
        regionList: {
            DEV: './doc/json/region/test_{code}.json',
            //DEV: './doc/json/region/provice.json',
            REMOTE: './doc/json/region/test_{code}.json'
        },
        // 人员列表
        persionList: {
            DEV: './doc/json/persionList.json',
            REMOTE: '/persion/list'
        },

        calendar: {
            dayDetail: {
                DEV: './doc/json/calendar/dayDetail.json',
                REMOTE: '/calendar/dayDetail'
            },
            weekStatistics: {
                DEV: './doc/json/calendar/weekStatistics.json',
                REMOTE: '/calendar/weekStatistics'
            }
        },
        announce: {
            // 通知列表-推荐
            recommend: {
                DEV: './doc/json/announce/list.json',
                REMOTE: '/announce/recommend'
            },
            // 通知列表
            list: {
                DEV: './doc/json/announce/list.json',
                REMOTE: '/announce/list'
            },
            // 通知详情
            detail: {
                DEV: './doc/json/announce/detail_{id}.json',
                REMOTE: '/announce/detail'
            }
        },

        transport: {
            // 运输单-任务
            task: {
                DEV: './doc/json/transport/task.json',
                REMOTE: '/transport'
            },

            // 运输单列表
            list: {
                DEV: './doc/json/transport/list.json',
                REMOTE: '/transport/list'
            },
            // 运输单详情
            detail: {
                DEV: './doc/json/transport/detail.json',
                REMOTE: '/transport/detail'
            },

            // 运输单开始运输
            start: {
                DEV: './doc/json/ajaxDone.json',
                REMOTE: '/transport/start'
            },
            // 运输单 完成
            finish: {
                DEV: './doc/json/ajaxDone.json',
                REMOTE: '/transport/finish'
            },

            // 运输单发货过磅
            first: {
                DEV: './doc/json/ajaxDone.json',
                REMOTE: '/transport/first'
            },
            // 运输单卸货过磅
            last: {
                DEV: './doc/json/ajaxDone.json',
                REMOTE: '/transport/last'
            },
            // 运输单过磅图图片上传，type: 1 发货过磅 2 卸货过磅 3 电子签名
            picUpload: {
                DEV: './doc/json/ajaxDone.json',
                REMOTE: '/transport/upload'
            },
            // 删除图片
            picDel: {
                DEV: './doc/json/ajaxDone.json',
                REMOTE: '/transport/picDel'
            },
            // 运输单位置上报
            gpsUpload: {
                DEV: './doc/json/ajaxDone.json',
                REMOTE: '/transport/point'
            }
        },

        message: {
            list: {
                DEV: './doc/json/messageList.json',
                REMOTE: '/notice'
            },
            del: {
                DEV: './doc/json/ajaxDone.json',
                REMOTE: '/notice/delete'
            }
        },
		agentList: {
			list: {
			    DEV: './doc/json/agent.json',
			    REMOTE: '/Agent/List_Mobile'
			},
            Edit:{
                DEV: './doc/json/agent.json',
			    REMOTE: '/Agent/Edit_Mobile'
            },
            Btn:{
                DEV: './doc/json/agent.json',
			    REMOTE: '/Agent/OperationButton_API_Mobile'
            },
            //   代理商流程列表
          
            GetAgentViewInstanceList_Mobile:{
                DEV: './doc/json/agent.json',
			    REMOTE: '/Agent/GetAgentViewInstanceList_Mobile'
            },
            // 代理商撤销
            RollbackAgent_Mobile:{
                DEV: './doc/json/agent.json',
			    REMOTE: '/Agent/RollbackAgent_Mobile'   
            },
            // 代理商提交
            SubmitAgent:{
                DEV: './doc/json/agent.json',
			    REMOTE: '/Agent/SubmitAgent_API_Mobile' 
            },
            del:{
                DEV: './doc/json/agent.json',
			    REMOTE: '/Agent/DeleteAgent_API_Mobile' 
            },
            // 保存
            SaveAgent_API_Mobile:{
                DEV: './doc/json/agent.json',
			    REMOTE: '/Agent/SaveAgent_API_Mobile' 
            }
		},
	//	项目
        projectList: {
            list: {
                DEV: './doc/json/projectList.json',
                REMOTE: '/Project/List_Mobile'
                // REMOTE: './doc/json/projectList.json'
            },
            Edit:{
            	DEV: '/Quotation/SelProjectQuotation',
                REMOTE: '/Project/Edit_Mobile'
            },
            del: {
                DEV: './doc/json/ajaxDone.json',
                REMOTE: '/Project/DeleteProject_Mobile'
            },
           
            // 查看流程
            getTechnological:{
        		DEV:"/Quotation/GetQuotationViewInstanceList",
        		REMOTE: "/Project/GetProjectViewInstanceList_Mobile"
        	},
            // 撤销流程
            RollbackProject:{
                DEV:"/Quotation/GetQuotationViewInstanceList",
        		REMOTE: "/Project/RollbackProject_Mobile"
            },
        
            // 获取按钮
            Btn:{
            	DEV: '/Quotation/SelProjectQuotation',
                REMOTE: '/Project/OperationButton_Mobile'
            },
                // 保存
    SaveProject_Mobile:{
                    DEV: '/Quotation/SelProjectQuotation',
                    REMOTE: '/Project/SaveProject_Mobile'
                },
                tracking:{
                     DEV: '/Quotation/SelProjectQuotation',
                    REMOTE: '/Project/ProjectLog_Mobile'

                },
                // 提交
                SubmitWorkflow:{
                    DEV: '/Quotation/SelProjectQuotation',
                    REMOTE: '/Project/SubmitWorkflow_Mobile'
                }

        },
        //土建
        layout: {
            list: {
                DEV: './doc/json/layoutList.json',
                REMOTE: './doc/json/layoutList.json'
            },
            todolist: {
                DEV: './doc/json/layoutList.json',
                REMOTE: './doc/json/layoutList.json'
            },
            edit: {
                DEV: './doc/json/layoutEdit.json',
                REMOTE: '/Layout/Edit_API'
            },
            del: {
                DEV: './doc/json/ajaxDone.json',
                REMOTE: '/notice/delete'
            }
        },
        //报价
        quotation:{
        	list:{
        		DEV:"./doc/json/quotationList.json",
        		REMOTE: './doc/json/quotationList.json'
        	},
        	Edit:{
        		DEV:"./doc/json/quotationList.json",
        		REMOTE: '/Quotation/Edit_API'
        	},
        	Del:{
        		DEV:"/Quotation/DeleteQuotation",
        		REMOTE: '/Quotation/DeleteQuotation'
        	},
        	Chk:{
        		DEV:"./doc/json/quotationList.json",
        		REMOTE: './doc/json/quotationList.json'
        	},
        	getProject:{
        		DEV:"/ChildWindows/GetProjectInfoByUserDistPro",
        		REMOTE: "/ChildWindows/GetProjectInfoByUserDistPro"
        	},
        	projectIsChange:{
        		DEV:"/ChildWindows/ProjectNameIsChange",
        		REMOTE: "/ChildWindows/ProjectNameIsChange"
        	},
        	getTechnological:{
        		DEV:"/Quotation/GetQuotationViewInstanceList",
        		REMOTE: "/Quotation/GetQuotationViewInstanceList"
        	},
        	quotationprice:{
        		DEV:"/Quotation/GetContractPriceByCompare",
        		REMOTE: "/Quotation/GetContractPriceByCompare"
        	},
        	quotationpriceTwo:{
        		DEV:"/Quotation/GetContractBusinessByCompare",
        		REMOTE: "/Quotation/GetContractBusinessByCompare"
        	},
        },
	//客户
        customerList: {
            list: {
                DEV: './doc/json/customerList.json',
                REMOTE: '/notice'
            },
            del: {
                DEV: './doc/json/ajaxDone.json',
                REMOTE: '/notice/delete'
            }
        },

        customerEdit: {
            list: {
                DEV: './doc/json/customerEdit.json',
                REMOTE: '/notice'
            },
            del: {
                DEV: './doc/json/ajaxDone.json',
                REMOTE: '/notice/delete'
            }
        },
        my: {
            initinfo: {
                DEV: './doc/json/ladderType.json',
                REMOTE: '/notice'
            },
            initinfoV: {
                DEV: './doc/json/ladderType.json',
                REMOTE: '/notice'
            },
            initinfoChange: {
                DEV: './doc/json/ladderTypeCopy.json',
                REMOTE: '/notice'
            },
            del: {
                DEV: './doc/json/ajaxDone.json',
                REMOTE: '/notice/delete'
            }
        },
        projectLog: {
            list: {
                DEV: './doc/json/projectLog.json',
                REMOTE: './doc/json/projectLog.json'
            },
            del: {
                DEV: './doc/json/ajaxDone.json',
                REMOTE: '/notice/delete'
            }
        },

        projecttodoList: {
            list: {
                DEV: './doc/json/projecttodoList.json',
                REMOTE: '/doc/json/projecttodoList.json'
            },
            del: {
                DEV: './doc/json/ajaxDone.json',
                REMOTE: '/notice/delete'
            }
        },

        projectEdit: {
            list: {
                DEV: './doc/json/projectEdit.json',
                REMOTE: './doc/json/projectEdit.json'
            },
            del: {
                DEV: './doc/json/ajaxDone.json',
                REMOTE: '/notice/delete'
            }
        },

        favorite: {
            list: {
                DEV: './doc/json/favoriteList.json',
                REMOTE: '/RestApi/favoriteList'
            },
            del: {
                DEV: './doc/json/ajaxDone.json',
                REMOTE: '/favorite/delete'
            }
        },

        uploadUserIcon: {
            DEV: './doc/json/ajaxDone.json',
            REMOTE: '/upload'
        },
        getUrl(type, params) {
            let _url = type[this._flag()].replace('{token}', UserInfo.token);
            if (params) {
                _url = _url.replaceTm(params);
            }

            if (_url.startsWith('./doc/')) {
                return _url;
            }
            return this.baseUrl[this.ENV] + _url;
        },
        getVerifyImgUrl() {
            return this.baseUrl[this.ENV] + this._verifyImg[this._flag()] + '?t=' + new Date().getTime();
        }
    }
};