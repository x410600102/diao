
biz.Expandbutton = {
	configs:{zIndexP:"", element:"",title:"", config:[]},
	open(options){
		$.extend(biz.Expandbutton.configs, options)
		$(".ExpandbuttonBG").remove();
		
		let index = $(biz.Expandbutton.configs.zIndexP).css("z-index") * 1 + 1;
		let TOPH = $(biz.Expandbutton.configs.element).offset();
		let elH = $(biz.Expandbutton.configs.element).height();
		let elW = $(biz.Expandbutton.configs.element).width();
		let DoH = $(biz.Expandbutton.configs.zIndexP).height();
		let DoW = $(biz.Expandbutton.configs.zIndexP).width();
		
		
		let html = "<div class=\"ExpandbuttonBG\">";
		html+="<div class=\"Expandbutton\">";
		for(let i = 0;i<biz.Expandbutton.configs.config.length;i++){
			html+="<div class=\"Expandbutton "+biz.Expandbutton.configs.config[i].icon+"\" onclick=\"biz.Expandbutton.close(this,'"+i+"')\">"+biz.Expandbutton.configs.config[i].title+"</div>";
		}
		html+="</div>";
		html+="</div>";
		let $box = biz.Expandbutton.configs.$box = $(html).appendTo($('body'));
		let boxH = $box.height();
		let boxW = $box.width();
		
		let TOp = DoH - TOPH.height - boxH - TOPH.top;
		let boxTop = 0;
		if(TOp > 10){
			boxTop = TOPH.top + TOPH.height + "px";
		}else{
			boxTop = TOPH.top - boxH + "px";
		}
		
		$box.css({
			"top": boxTop,
	        "left": (DoW - boxW - 20) + "px",
	        "z-index": index
		}).show();
	},
	close(e,index){
		eval(biz.Expandbutton.configs.config[index].callback);
		biz.Expandbutton.configs.$box.remove();
	}
}
