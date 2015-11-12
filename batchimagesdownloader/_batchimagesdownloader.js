//配置sites 说明：
//1.仅需要修改Format: batchimagesdownloader.sites = {};大括号之间的部分
//2.其中的每个site，类似'moko' 作为一个属性，该属性定义一个对象(json)
//3.每个site的json内容，属性和方法说明如下：（任意方法内都可以其中可以调用batchimagesdownloader对象提供的api方法)
//debug:bool类型，用于开启调试模式，设置为true时，会分别显示Paginations SubAlbumUrls ImageUrlsInSubAlbum信息，用于检查配置是否正确
//save2file:bool类型，用于当用ff直接下载慢可能占用ff时，设置为true时，会解析完成保存在UChrm目录下为迅雷下载list文件（以逗号分隔的下载地址合集）
//startReg:正则对象，必须，用于正则判断起始页url;
//main:无参函数,可选，用于自定义批量下载，特别说明：当定义该函数，下面所有属性都可以不必定义;
//getImgNameRule:数组类型，可选，最后一级页面内的选择器，捕获最终保存文件名的指针数组[selector,filter,ext] css3选择器，正则捕获，扩展名
//getImgNameRule注意:,应该与最后一级要下载的img的个数一致，避免命名错乱
//getPaginations:以起始页document对象为参数的函数，可选，用于返回所有分页的url数组，空时，表示，仅处理当前一个页面，不处理任何分页;
//getSubAlbumUrlRule: 从任意分页获取sub album的url的规则，其内容是[css3的selector的形式，属性名],与下面方法务必出现其一;
//getSubAlbumUrls: 参数为document对象函数，用于从任意分页获取sub album的url，优先于上一属性;
//getImageUrlInSubAlbumRule:从任意sub album页面获取要下载的img的url的规则，其内容是[css3的selector的形式，属性名],与下面方法务必出现其一;
//getImageUrlsInSubAlbum: 参数为document对象函数，用于从任意sub album页面获取要下载的img的url，优先于上一属性;
//fileNamefilter: 参数为解析出来的url中原文件名部分，用于过滤需要跳过的下载文件，返回true则不下载，返回false则留下作为下载;
//4.当配置文件没有按照上述说明编写，将出现意外错误，请重新检查再重试
//函数拓展支持：
batchimagesdownloader.sites = {
//sites = {
	'moko': {
		startReg: /^http:\/\/www\.moko\.cc\/post\/[a-zA-Z0-9]+\/new\/1\.html$/i,
		getPaginations: function(doc) { //起始页默认就是当前标签页
			var href = doc.location.href,paginations = [];
			if (doc.querySelector('p.page > a') == null) {paginations.push(href);return paginations;} //only 1 page(current page);
			//过滤空内容
			var maxPageNum = doc.querySelector('p.page > a[class="b bC"]:nth-last-child(2)').innerHTML.replace(/(^\s*)|(\s*$)/g, "");
			for (var i = 1; i <= maxPageNum; i++) paginations.push(href.replace(/\d+\.html$/g, i + ".html"));
			return paginations;
		},
		getSubAlbumUrlRule : ['a[class="coverBg wC"]', 'href'],
		getImageUrlInSubAlbumRule: ['p.picBox>img[src2]','src2']
	},
	'nemonphoto': {
		debug:true,
		startReg: /^http:\/\/www\.xingyun\.cn\/nemonphoto\/works\/$/i,
		getSubAlbumUrlRule : ['div.works_show_cover>a', 'href'],
		getImageUrlInSubAlbumRule: ['div.img > img','src']
	},
	/*'poco1': {//http://my.poco.cn/act-act_list-htx-user_id-54783374.shtml 个人摄影博客全集下载 目前只能将本页的全部分页下载，比如：下10页没有下载
		debug:true,
		startReg: /^http:\/\/my\.poco\.cn\/act-act_list-htx-user_id-\d+\.shtml$/i,
		getPaginations: function(doc) { //起始页默认就是当前标签页
			var href = doc.location.href,paginations = [];
			if (doc.querySelector('div[class="page clearfix mt15"] > a') == null) {paginations.push(href);return paginations;} //only 1 page(current page);
			//过滤空内容
			var maxPageNode = doc.querySelector('div[class="page clearfix mt15"] > a:nth-last-child(3)');
			var maxPageNum = maxPageNode.innerHTML.replace(/(^\s*)|(\s*$)/g, "");
			//http://my.poco.cn/act/act_list.htx&p=2&user_id=54783374&m=all&param=0&act_type_id=0&tag_name=&m_tag=&q=&gid=-1&is_vouch=&browse=
			for (var i = 1; i <= maxPageNum; i++) paginations.push(maxPageNode.href.replace(/&p=\d+&/g, "&p="+i+"&"));
			return paginations;
		},
		getSubAlbumUrlRule : ['.ul_act_list > ul > li > div[class="summary word_break"] > p:nth-child(1) > a', 'href'],
		getImageUrlInSubAlbumRule: ['#J_img_list > li > div.photo > a.img_box > img','src']
	},*///暂时无法支持，因为ajax获取的是dom对象，而subalbum的图片是延时通过js加载产生的
	/*'me2-sex_lofter': {//获取subAlbumUrl的时候，页面检查访问来源，因此被阻止获取图片地址
		debug: true,
		startReg: /^http:\/\/me2-sex\.lofter\.com\/tag\/.+\?page=\d*$/i,
		getPaginations: function(doc) { //起始页默认就是当前标签页
			var href = doc.location.href,paginations = [];
			if (doc.querySelector('#m-pager-idx > a') == null) {paginations.push(href);return paginations;} //only 1 page(current page);
			//过滤空内容
			var maxPageNum = doc.querySelector('#m-pager-idx > a:nth-last-child(2)').innerHTML.replace(/(^\s*)|(\s*$)/g, "");
			for (var i = 1; i <= maxPageNum; i++) paginations.push(href.replace(/page=\d*$/g, "page="+i));
			alert(doc.querySelectorAll('div.pic > a.img').length);
			return paginations;
		},
		getSubAlbumUrlRule : ['div.pic > a.img', 'href'],
		getImageUrlInSubAlbumRule: ['a[class="img imgclasstag"][bigimgsrc]','bigimgsrc']
	},*/
	/*'52mntp': {
		//http://www.52mntp.com/topics/album/mm-china
		//http://www.52mntp.com/
		//debug: true,
		startReg: /^http:\/\/www\.52mntp\.com\/(topics\/album\/.+)?$/i,
		getPaginations: function(doc) { //起始页默认就是当前标签页
			var href = doc.location.href,paginations = [];
			if (doc.querySelector('div#pagenavi a.page-numbers') == null) {paginations.push(href);return paginations;} //only 1 page(current page);
			//过滤空内容a.page-numbers:nth-child(5)
			var node = doc.querySelector('div#pagenavi a.page-numbers:nth-last-child(2)');
			var maxPageNum = node.innerHTML.replace(/(^\s*)|(\s*$)/g, "");
			var url_tmp = node.href;
			for (var i = 1; i <= maxPageNum; i++) paginations.push(url_tmp.replace(/page\/\d+$/g, "page/" + i));
			return paginations;
		},//#pin-867 > div:nth-child(1) > a:nth-child(1)
		getSubAlbumUrlRule : ['div#postlist > div[class="pin  stack"] > div.pin-coat >a[class="imageLink image"]', 'href'],
		getImageUrlInSubAlbumRule: ['.photo-opt > a:nth-child(2)','href']//最后一页还有分页，所以暂时无法实现批量下载
	},*/
	'kdslife': {// http://pic.kdslife.com/content_107357_4_list.html
		//debug: true,
		startReg: /^http:\/\/pic\.kdslife\.com\/content_\d+_\d+_list\.html$/i,
		getPaginations: function(doc) { //起始页默认就是当前标签页
			var href = doc.location.href,paginations = [];
			if (doc.querySelector('div.page a') == null) {paginations.push(href);return paginations;} //only 1 page(current page);
			//过滤空内容
			var maxPageNum = doc.querySelector('div.page a:nth-last-child(2)').innerHTML.replace(/(^\s*)|(\s*$)/g, "");
			for (var i = 1; i <= maxPageNum; i++) paginations.push(href.replace(/\d+_list\.html$/g, i + "_list.html"));
			return paginations;
		},
		getSubAlbumUrlRule : ['ul[class="imgList clearfix"] > li > a', 'href'],
		getImageUrlInSubAlbumRule: ['.photo-opt > a:nth-child(2)','href']
	},
	'chinaz': {
		//debug: true,
		//save2file:true,
		startReg: /^http:\/\/sc\.chinaz\.com\/[^\/]+\/([^\/]+\.html)?$/i,
		getSubAlbumUrls: function(doc){
			var chks = doc.getElementsByName('snaplinks_chk'),len = chks.length,urls = [],p,href;
			for(var i=0;i<len;i++){
				if(chks[i].checked == true) {
					//p = chks[i].parentNode;
					//urls.push(p.querySelector('a[alt]').href);
					urls.push(chks[i].getAttribute('ahref'));
				}
			}
			return urls;
		},
		//getSubAlbumUrlRule : ['div[class="box picblock col3 masonry-brick"]>p> a > input[checked="true"]', 'ahref'],//snaplinks_chk
		getImageUrlInSubAlbumRule: ['div.dian:nth-child(2)>a:last-child','href'],
		getImgNameRule: ['div.text_wrap > h2 > a','innerHTML']
	},
	'imooc': { //慕课网源代码批量下载
		//debug: true,
		//save2file:true,
		startReg: /^http:\/\/www\.imooc\.com\/video\/\d+$/i,
		getSubAlbumUrls: function(doc){
			return [doc.location.href];
		},
		getImageUrlInSubAlbumRule: ['.downlist > li > a.downcode','href'],
		getImgNameRule: ['.downlist > li > a.downcode','title']
	},
	'yituge': { //壹图阁展示图下载
		debug: true,
		//save2file:true,
		startReg: /^http:\/\/show\.yituge\.com\/list-\d+\.html$/i,
		getSubAlbumUrlRule : ['div.leftList5> ul > li > a', 'href'],
		getImageUrlInSubAlbumRule: ['p.view-remark > a > img.view_img','src'] //获取了图片的解析之前地址，默认是无法直接当成文件下载的，无后缀名
	},
	//http://show.yituge.com/list-14.html
	/*'wrshu': {//wrshu电子书下载 下载的文件地址url中含有中文，解析时存在乱码
		//debug: true,
		startReg: /^http:\/\/www\.wrshu\.com\/xiaoshuo\/special\/.+\.html$/i,
		getSubAlbumUrls: function(doc){
			var chks = doc.getElementsByName('snaplinks_chk'),len = chks.length,urls = [],p,href;
			for(var i=0;i<len;i++){
				if(chks[i].checked == true) {
					p = chks[i].parentNode;
					urls.push(p.querySelector('a').href);
				}
			}
			return urls;
		},
		//getSubAlbumUrlRule : ['div[class="box picblock col3 masonry-brick"]>p> a > input[checked="true"]', 'ahref'],//snaplinks_chk
		getImageUrlInSubAlbumRule: ['.downlist > dl > dd:nth-child(14) > a','href']//,
		//getImgNameRule: ['h2.h730:nth-child(1)','innerHTML']
	},*/
	/*'zei8': {//贼吧网，捕获的下载地址不是文件本身，需要由后台解析二次跳转，暂时不支持该种的批量下载
		//debug: true,
		startReg: /^http:\/\/www\.zei8\.com\/txt\/\d+\/list_\d+_\d+\.html$/i,
		getSubAlbumUrls: function(doc){
			var chks = doc.getElementsByName('snaplinks_chk'),len = chks.length,urls = [],p,href;
			for(var i=0;i<len;i++){
				if(chks[i].checked == true) {
					p = chks[i].parentNode;
					urls.push(p.querySelector('a.title').href);
				}
			}
			return urls;
		},
		getImageUrlInSubAlbumRule: ['.downurllist > strong:nth-child(2) > a','href']//,
		//getImgNameRule: ['.viewbox > div.title > h2','innerHTML']
	},*/
	'hkbici': {
        //debug:true,
		//save2file:true,//如果不是将下载地址保存到文件，那么应该注释掉 getPaginations 的定义，避免时间太长
		startReg: /^http:\/\/hkbici\.com\/forum.php\?mod=forumdisplay&fid=(18|398)&.*/i,
		/*getPaginations: function(doc) { //起始页默认就是当前标签页
			var href = doc.location.href,paginations = [];
			//if (doc.querySelector('p.page > a') == null) {paginations.push(href);return paginations;} //only 1 page(current page);
			//过滤空内容
			var maxPageNum = doc.querySelector('#fd_page_bottom > div.pg > a:nth-last-child(4)').innerHTML.replace(/(^\s*)|(\s*$)/g, "");
			for (var i = 1; i <= maxPageNum; i++) paginations.push(href.replace(/&page=\d+$/g, "&page=" + i));
			return paginations;
			
		},*/
		getSubAlbumUrls: function(doc){
			//alert(111);
			var chks = doc.getElementsByName('hkbici_chk'),len = chks.length,urls = [],li,href;
			//alert(len);
			for(var i=0;i<len;i++){
				if(chks[i].checked == true) {
					li = chks[i].parentNode;
					urls.push(li.querySelector('h3 > a').href);
				}
			}
			//alert(urls);
			return urls;
		},
		getImageUrlInSubAlbumRule: ['img[file]','file']
	},
	'yesky': {
		startReg: /^http:\/\/[a-zA-Z]+\.yesky\.com\/[a-zA-Z0-9]+\/[a-zA-Z0-9]+\/[a-zA-Z0-9]+all\.shtml$/i,
		main: function() {
			var doc = window.getBrowser().selectedBrowser.contentDocument;
			var as = doc.querySelectorAll('div.list > ul > li > span > a[href$=".jpg"]'); //html case non-sensive but xhtml and xml
			//alert(as.length);
			for (var i = 0; i < as.length; i++) batchimagesdownloader.imgurls.push(as[i].getAttribute('href'));
			batchimagesdownloader.batchImagesDownloadChained();
		} //支持自定义入口，只有一层直接解析当前页面实现批量下载
	},
	'caoliu':{
		startReg: /^http:\/\/dou\.lesile\.net\/htm_data\/\d+\/\d+\/\d+\.html$/i,
		main: function() {
			var doc = window.getBrowser().selectedBrowser.contentDocument;
			var as = doc.querySelectorAll('div.tpc_content input[type="image"]'); //html case non-sensive but xhtml and xml
			//alert(as.length);
			for (var i = 0; i < as.length; i++) batchimagesdownloader.imgurls.push(as[i].getAttribute('src'));
			batchimagesdownloader.batchImagesDownloadChained();
		} //支持自定义入口，只有一层直接解析当前页面实现批量下载
	},
	'voc': {
		startReg: /^http:\/\/bbs\.voc\.com\.cn\/forumdisplay.php\?fid\=50(&\w+\=\w+)*$/i,
		getSubAlbumUrlRule : ['td.tbfltd2>a.a1', 'href'],
		getImageUrlInSubAlbumRule: ['div[id^="message"] a img','src']
		//main: function() {
		//	var doc = window.getBrowser().selectedBrowser.contentDocument;
		//	alert(doc.location.href);
		//	var as = doc.querySelectorAll('div.list > ul > li > span > a[href$=".jpg"]'); //html case non-sensive but xhtml and xml
		//	alert(as.length);
		//	for (var i = 0; i < as.length; i++) batchimagesdownloader.imgurls.push(as[i].getAttribute('href'));
		//	batchimagesdownloader.batchImagesDownloadChained();
		//} //支持自定义入口，只有一层直接解析当前页面实现批量下载
	},
	'cssmoban': {
		debug: false,
		//save2file:true,
		startReg: /^http:\/\/www\.cssmoban\.com\/(tags.asp\?(.*&)?n\=.+)|(cssthemes\/houtaimoban\/.*)$/i, 
		getPaginations: function(doc) { //起始页默认就是当前标签页
			var href = doc.location.href,paginations = [];
			if (doc.querySelector('div.tagsPage > form > *:nth-last-child(3)') == null) {paginations.push(href);return paginations;} //only 1 page(current page);
			//过滤空内容
			var maxPageNum = doc.querySelector('div.tagsPage > form > a.num:nth-last-of-type(1)').href.replace(/(^\s*)|(\s*$)/g, "").replace(/[^0-9]*page=(\d+).*/i,"$1");
			if(href.indexOf("page=")<0) href +="&page=1";
			for (var i = 1; i <= maxPageNum; i++) paginations.push(href.replace(/page=(\d+)([^0-9]*)?/i, "page="+i+"$2"));
			return paginations;
		},
		//当配合snaplinks的GM脚本的时候，不能配合翻页共同使用，因为该脚本，必须要前台加载页面的时候才能使用，于是如果要想多页，则不能通过GM脚本过滤，如果要过滤，则只能当前页
		//getSubAlbumUrls: function(doc){
		//	var chks = doc.getElementsByName('snaplinks_chk'),len = chks.length,urls = [],p,href;
		//	for(var i=0;i<len;i++){
		//		if(chks[i].checked == true) {
		//			p = chks[i].parentNode;
		//			urls.push(p.querySelector('a').href);
		//		}
		//	}
		//	console.log(urls);
		//	return urls;
		//},
		getSubAlbumUrlRule : ['p.title1 > a', 'href'],//snaplinks_chk
		getImageUrlInSubAlbumRule: ['a.button[class="button btn-down"]','href'],
		getImgNameRule: ['.con-right > h1','innerHTML']
	}
};