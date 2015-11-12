var batchimagesdownloader = {
	debug: false,
	save2fileorNot:false,
	appendfld:'',
	pageUrls: [],
	imgurls: [],
	imgNames: [],
	subAlbumUrls: [],
	ajaxQueue: [],
	total: 0,
	existImgNum: 0,
	delay: 0,
	delayCnt: 0,
	site: null,
	sites: {},
	sitesFile: "Local\\_batchimagesdownloader.js",
	onClk: function(event,token) {//token 1,一键下载,2,强制中止,3,进入设置,4,重载配置,5,编辑配置
		if (JSON.stringify(this.sites) == "{}") {
			this.alert('The profile "_batchimagesdownloader.js" is not introduced properly, please check it out!');
			return;
		}
		switch(token){
			case 1: 
				if (this.getStatus() == "busy") {
					this.alert("batchimagesdownloader is busy, please wait or cancel first!");
					return false;
				}
				var cur = window.content.document.location.href;
				for (var key in this.sites) {
					var reg = this.sites[key].startReg;
					if (reg.test(cur)) {
						this.site = key;
						break;
					}
				}
				if (this.site != null) {
					var targetDir = this.getDefaultSaveDirectory();
					if(targetDir == 0) {this.alert('Result: The target dir is read-only!');this.reset();return false;}
					document.getElementById("BID_mnuToolbar0").setAttribute("image", "chrome://batchimagesdownloader/content/downloading.gif");
					this.alert("Start-up: App is started, please wait for analyzin and have a cup of tea!");
					this.setStatus("busy");
					//if(this.sites[this.site].debug != undefined) this.debug = true;
					this.debug = this.sites[this.site].debug || false;
					this.save2fileorNot = this.sites[this.site].save2file || false;
					//test
					//if(this.sites[this.site].getImgNameRule != undefined) this.getImgNameRule = this.sites[this.site].getImgNameRule;
					if (this.sites[this.site].main == undefined) {
						try {
							if ((this.sites[this.site].getSubAlbumUrls == undefined && this.sites[this.site].getSubAlbumUrlRule == undefined) || (this.sites[this.site].getImageUrlsInSubAlbum == undefined && this.sites[this.site].getImageUrlInSubAlbumRule == undefined)) {
								setTimeout(function() {
									batchimagesdownloader.alert("profile error: \n the rule of site-" + this.site + " is not complete!");
									batchimagesdownloader.reset();
								}, 2000);
								return;
							}
						} catch (e) {}
						this.batchimagesdownloadExec();
					} else this.sites[this.site].main();
				} else {
					this.alert("don't support for this site yet: \n" + cur);
					return false;
				}
				break;
			case 2: 
				this.reset();
				this.alert("batchimagesdownloader is reset, try again please!");
				break;
			case 3: 
				event.stopPropagation;
				event.preventDefault();
				this.config();
				break;
			case 4: 
				event.stopPropagation;
				event.preventDefault();
				this.loadRule();
				return;
				break;
			case 5: 
				this.edit();
				return;
				break;
		}
		//if (token == 0) {
		//	if (event.altKey) {
		//		this.edit();
		//		return;
		//	}
		//	if (this.getStatus() == "busy") {
		//		this.alert("batchimagesdownloader is busy, please wait or cancel first!");
		//		return false;
		//	}
		//	var cur = window.content.document.location.href;
		//	for (var key in this.sites) {
		//		var reg = this.sites[key].startReg;
		//		if (reg.test(cur)) {
		//			this.site = key;
		//			break;
		//		}
		//	}
		//	if (this.site != null) {
		//		var targetDir = this.getDefaultSaveDirectory();
		//		if(targetDir == 0) {this.alert('Result: The target dir is read-only!');this.reset();return false;}
		//		document.getElementById("BID_mnuToolbar0").setAttribute("src", "chrome://batchimagesdownloader/content/downloading.gif");
		//		this.alert("Start-up: App is started, please wait for analyzin and have a cup of tea!");
		//		this.setStatus("busy");
		//		//if(this.sites[this.site].debug != undefined) this.debug = true;
		//		this.debug = this.sites[this.site].debug || false;
		//		this.save2fileorNot = this.sites[this.site].save2file || false;
		//		//test
		//		//if(this.sites[this.site].getImgNameRule != undefined) this.getImgNameRule = this.sites[this.site].getImgNameRule;
		//		if (this.sites[this.site].main == undefined) {
		//			try {
		//				if ((this.sites[this.site].getSubAlbumUrls == undefined && this.sites[this.site].getSubAlbumUrlRule == undefined) || (this.sites[this.site].getImageUrlsInSubAlbum == undefined && this.sites[this.site].getImageUrlInSubAlbumRule == undefined)) {
		//					setTimeout(function() {
		//						batchimagesdownloader.alert("profile error: \n the rule of site-" + this.site + " is not complete!");
		//						batchimagesdownloader.reset();
		//					}, 2000);
		//					return;
		//				}
		//			} catch (e) {}
		//			this.batchimagesdownloadExec();
		//		} else this.sites[this.site].main();
		//	} else {
		//		this.alert("don't support for this site yet: \n" + cur);
		//		return false;
		//	}
		//} else if (token == 1) {
		//	this.reset();
		//	this.alert("batchimagesdownloader is reset, try again please!");
		//} else {
		//	event.stopPropagation;
		//	event.preventDefault();
		//	if (event.altKey) {
		//		this.loadRule();
		//		return;
		//	}
		//	this.config();
		//}
	},
	init: function() {
		this.loadRule(false);
		this.reset();
		this.processed = 0;
	},
	reset: function() {
		this.setStatus("idle");
		this.appendfld = '';
		try {
			document.getElementById("batchdown_prog").setAttribute("hidden", "true");
			document.getElementById("BID_mnuToolbar0").setAttribute("image", "chrome://batchimagesdownloader/content/icon.png");
		} catch(e){}
		this.pageUrls = this.imgurls = this.subAlbumUrls = this.ajaxQueue = this.imgNames = [];
		this.total = this.existImgNum = this.delay = this.delayCnt = 0;
		this.site = null;this.debug = false;this.save2fileorNot = false;
	},
	edit: function() {
		let aFile = Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIDirectoryService).QueryInterface(Ci.nsIProperties).get('UChrm', Ci.nsILocalFile);
		aFile.appendRelativePath(this.sitesFile);
		if (!aFile || !aFile.exists() || !aFile.isFile()) return;
		var editor;
		try {
			editor = Services.prefs.getComplexValue("view_source.editor.path", Ci.nsILocalFile);
		} catch (e) {
			this.alert("set your editor path, first. \nview_source.editor.path");
			toOpenWindowByType('pref:pref', 'about:config?filter=view_source.editor.path');
			return;
		}
		var UI = Cc["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Ci.nsIScriptableUnicodeConverter);
		UI.charset = window.navigator.platform.toLowerCase().indexOf("win") >= 0 ? "gbk" : "UTF-8";
		var process = Cc['@mozilla.org/process/util;1'].createInstance(Ci.nsIProcess);
		try {
			var path = UI.ConvertFromUnicode(aFile.path);
			var args = [path];
			process.init(editor);
			process.run(false, args, args.length);
		} catch (e) {
			this.alert("there is something wrong with your editor!");
		}
	},
	loadRule: function(flag) {
		var aFile = Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIDirectoryService).QueryInterface(Ci.nsIProperties).get('UChrm', Ci.nsILocalFile);
		aFile.appendRelativePath(this.sitesFile);
		if (!aFile.exists() || !aFile.isFile()) {
			this.alert("Profile Error:\"_batchimagesdownloader.js\" can't be found!");
			return null;
		}
		var fstream = Cc["@mozilla.org/network/file-input-stream;1"].createInstance(Ci.nsIFileInputStream);
		var sstream = Cc["@mozilla.org/scriptableinputstream;1"].createInstance(Ci.nsIScriptableInputStream);
		fstream.init(aFile, -1, 0, 0);
		sstream.init(fstream);
		var data = sstream.read(sstream.available());
		try {
			data = decodeURIComponent(escape(data));
		} catch (e) {}
		sstream.close();
		fstream.close();
		if (!data) {
			this.alert("Profile Error:\"_batchimagesdownloader.js\" is empty or loaded incorrectly");
			return;
		}
		eval(data);
		if (flag != false) this.alert("Success: Profile is loaded successfully!");
	},
	save2File:function(filename, data) {
	    /*var file;
	    if(typeof filename == "string"){
	        file = Services.dirsvc.get('UChrm', Ci.nsILocalFile);
	        file.appendRelativePath(filename);//fileOrName
	    }else{
	        file = filename;//fileorName
	    }*/
	    var targetDir = this.getDefaultSaveDirectory(this.appendfld);
		var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
		file.initWithFile(targetDir);
		file.appendRelativePath(filename);
	    var suConverter = Cc["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Ci.nsIScriptableUnicodeConverter);
	    suConverter.charset = 'UTF-8';
	    data = suConverter.ConvertFromUnicode(data);

	    var foStream = Cc['@mozilla.org/network/file-output-stream;1'].createInstance(Ci.nsIFileOutputStream);
	    foStream.init(file, 0x02 | 0x08 | 0x20, 0664, 0);
	    foStream.write(data, data.length);
	    foStream.close();
	},
	config: function(event) {
		this.openWindow("batchimagesdownloader.mainWindow", "chrome://batchimagesdownloader/content/option.xul", "chrome=yes,centerscreen", {});
	},
	openWindow: function(windowName, url, flags, params) {
		var windowsMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
		var aWindow = windowsMediator.getMostRecentWindow(windowName);
		if (aWindow) aWindow.focus();
		else aWindow = window.openDialog(url, windowName, flags, params);
		return aWindow;
	},
	batchimagesdownloadExec: function() {
		//append folder
		this.appendfld = '';//initiallization
		if(this.getPref('ds_custom')=="true") {
			var sdir=prompt("Please enter sub folder's name","");
  			if (sdir!=null && sdir!="")	this.appendfld += this.appendFolder(sdir);
		}
		else {
			if(this.getPref('ds_host')=="true") this.appendfld +=this.appendFolder(this.getTabInfo('host'));
			if(this.getPref('ds_title')=="true") this.appendfld +=this.appendFolder(this.getTabInfo('title'));
			if(this.getPref('ds_date')=="true") { //append date to folder
				  var dir = '';
				  var today = new Date();
				  var day = this.addZeros(today.getDate(),2);
				  var month = this.addZeros(today.getMonth() + 1,2);
					var year = today.getFullYear();
					dir = year+'-'+month+'-'+day;
					if (this.getPref('ds_time')=="true") { //append time to folder
					  var mins = this.addZeros(today.getMinutes(),2);
						var hours = this.addZeros(today.getHours(),2);
						dir += ' '+hours+'-'+mins;
						var secs = this.addZeros(today.getSeconds(),2);
						dir += '-'+secs;
					}
					this.appendfld += this.appendFolder(dir);
			  }
		}//append fold END
		var startDoc = window.getBrowser().selectedBrowser.contentDocument,
			site = this.site;
		var startUrl = startDoc.location.href;
		this.pageUrls = startUrl;
		if (typeof this.sites[site].getPaginations == "function") this.pageUrls = this.sites[site].getPaginations(startDoc);
		this.alert("Starter-analyzed: Starting page has been annalyzed, you can go around without a doubt!");
		if(this.debug) alert("pageUrls:"+this.pageUrls);
		this.subAlbumUrlsQuery();
	},
	subAlbumUrlsQuery: function() {
		this.ajaxQueue = this.pageUrls;
		this.execSubAlbumUrlsQuery();
	},
	execSubAlbumUrlsQuery: function() {
		if (this.getStatus() == "idle") return;
		if (this.ajaxQueue instanceof Array) {
			var _this = this;
			this.getDomFromUrl(_this.ajaxQueue.shift(), function(d) {
				try {
					if (_this.sites[_this.site].getSubAlbumUrls == undefined) {
						var rule = _this.sites[_this.site].getSubAlbumUrlRule;
						_this.subAlbumUrls = _this.subAlbumUrls.concat(_this.getAttsFromDom(d, rule[0], rule[1]));
					} else {
						_this.subAlbumUrls = _this.subAlbumUrls.concat(_this.sites[_this.site].getSubAlbumUrls(d));
					}
				} catch (e) {}
				if (_this.ajaxQueue.length == 0) {
					if(_this.debug) alert("subAlbumUrls:"+_this.subAlbumUrls);
					_this.imagesUrlsQuery();
					return;
				} else _this.execSubAlbumUrlsQuery();
			});
		} else {
			var d = window.getBrowser().selectedBrowser.contentDocument;
			//this.subAlbumUrls = this.subAlbumUrls.concat(this.sites[this.site].getSubAlbumUrls(d));
			try {
				if (this.sites[this.site].getSubAlbumUrls == undefined) {
					var rule = this.sites[this.site].getSubAlbumUrlRule;
					this.subAlbumUrls = this.subAlbumUrls.concat(this.getAttsFromDom(d, rule[0], rule[1]));
				} else {
					this.subAlbumUrls = this.subAlbumUrls.concat(this.sites[this.site].getSubAlbumUrls(d));
				}
			} catch (e) {}
			if(this.debug) alert("subAlbumUrls:"+this.subAlbumUrls);
			this.imagesUrlsQuery();
			return;
		}
	},
	imagesUrlsQuery: function() {
		this.ajaxQueue = this.subAlbumUrls;
		this.execImagesQuery();
	},
	execImagesQuery: function() {
		if (this.getStatus() == "idle") return;
		var _this = this;
		this.getDomFromUrl(_this.ajaxQueue.shift(), function(d) {
			try {
				if (_this.sites[_this.site].getImageUrlsInSubAlbum == undefined) {
					var rule = _this.sites[_this.site].getImageUrlInSubAlbumRule;
					_this.imgurls = _this.imgurls.concat(_this.getAttsFromDom(d, rule[0], rule[1]));
				} else {
					_this.imgurls = _this.imgurls.concat(_this.sites[_this.site].getImageUrlsInSubAlbum(d));
				}
				//imgNames set
				if (_this.sites[_this.site].getImgNameRule != undefined) {
					var rule1 = _this.sites[_this.site].getImgNameRule;
					var attVs = _this.getAttsFromDom(d, rule1[0], rule1[1]);
					for(var k = 0;k<attVs.length;k++) attVs[k] = attVs[k].substring(attVs[k].lastIndexOf("/") + 1);
					_this.imgNames = _this.imgNames.concat(attVs);
				}
			} catch (e) {}
			////检查本次批量下载是否将要开始重复上次最后一个下载的url地址（一般是时间倒序才可以，未来考虑增加一个时间正序倒序的设置开关，也需要将这个控制重复的代码设置开关）
			//var lastmarkurl = null;
			//try{ lastmarkurl = localStorage.getItem(this.site);}catch(err){console.log('can\'t get the last image url as a mark.');}
			//if (_this.imgurls[_this.imgurls.length-1] == lastmarkurl || _this.ajaxQueue.length == 0) {
			//	if(_this.debug) {alert("imgurls:"+_this.imgurls);alert("imgNames:"+_this.imgNames);}
			//	if(_this.imgurls[_this.imgurls.length-1] == lastmarkurl) _this.imgurls.pop();//开始出现重复，那么删除重复项目，开始下载
			//	try{ localStorage.setItem(this.site,_this.imgurls[_this.imgurls.length-1]);}catch(err){console.log('can\'t save the last image url as a mark.');}//标记本次批量下载最后一个url
				_this.batchImagesDownloadChained();
				return;
			} else _this.execImagesQuery();
		});
	},
	batchImagesDownloadChained: function() {
		this.ajaxQueue = this.imgurls;
		this.total = this.imgurls.length;
		if (this.total == 0) {
			setTimeout(function() {
				batchimagesdownloader.alert('Result: no suitable pictures found!');
				batchimagesdownloader.reset();
			}, 2000);
			return;
		}
		//save2file
		if(this.save2fileorNot){
			var today = new Date();
			var day = this.addZeros(today.getDate(),2);
			var month = this.addZeros(today.getMonth() + 1,2);
			var year = today.getFullYear();
			var mins = this.addZeros(today.getMinutes(),2);
			var hours = this.addZeros(today.getHours(),2);
			var secs = this.addZeros(today.getSeconds(),2);
			var filename = year+'-'+month+'-'+day+'_'+hours+'-'+mins+'-'+secs+'.downlist';
			var data = this.imgurls.join('\r\n');//不同系统换行符不同，迅雷下载地址 以回车作为分隔符
			this.save2File(filename, data);
			setTimeout(function() {
				batchimagesdownloader.alert("Result: Finally,All the urls have been saved into \""+filename+"\" in default directory!");
				batchimagesdownloader.reset();
			}, 1000);
			//this.alert("Result: Finally,All the urls have been saved into \""+filename+"\" in UChrm directory!");
			return;
		}
		var quickdown_pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("batchimagesdownloader.");
		var autorename = quickdown_pref.getCharPref("autorename");
		var progressmeter = document.getElementById("batchdown_prog");
		progressmeter.value = 0;
		progressmeter.setAttribute("hidden", "false");
		this.delayCnt = 0;
		this.delay = 0;
		this.execBatchImagesDownload(autorename,this.appendfld);
	},
	execBatchImagesDownload: function(autorename,appendfld) {
		appendfld = appendfld || '';
		if (this.getStatus() == "idle") return;
		var _this = this;
		var progressmeter = document.getElementById("batchdown_prog");
		var step = Math.ceil(100 / this.total);
		if (step < 4) {
			step = 4;
			this.delay = Math.ceil(this.total / 25);
		}
		this.downloadSingleImage(_this.ajaxQueue.shift(), autorename, function(fileExist) {
			_this.existImgNum += fileExist;
			if (_this.ajaxQueue.length == 0) {
				if (_this.getStatus() != "idle") setTimeout(function() {
					_this.alert('Result: Finally,' + _this.total + ' files have been founnd and downloaded! (' + _this.existImgNum + (autorename == "true" ? ' renamed)' : ' skipped)'));
					_this.reset();
				}, 2000);
				else _this.reset();
				return;
			} else {
				_this.processed +=1;
				_this.delayCnt += 1;
				if (_this.delayCnt >= _this.delay) {
					var value = parseInt(progressmeter.value);
					progressmeter.value = value + step;
					_this.delayCnt = 0;
				}
				_this.execBatchImagesDownload(autorename,appendfld);
			}
		}, appendfld);
	},
	alert: function(aString, delay_ms, aTitle) {
		aTitle = aTitle || "batchimagesdownloader";
		Cc['@mozilla.org/alerts-service;1'].getService(Ci.nsIAlertsService).showAlertNotification("", aTitle || "Redirector", aString, false, "", null);
	},
	downloadSingleImage: function(uri, autorename, callback, appendfld) {
		appendfld = appendfld || '';
		var targetDir = this.getDefaultSaveDirectory(appendfld);
		var ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
		var imageURI = ios.newURI(uri, null, null);
		var imageFileName = uri.substring(uri.lastIndexOf("/") + 1);
		if(this.debug) this.alert('Current File: URI('+uri+'),FileName('+imageFileName+')');
		var channel = ios.newChannelFromURI(imageURI);
		var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
		file.initWithFile(targetDir);
		file.appendRelativePath(imageFileName);
		var imageFileNameFinal = imageFileName;
		if(this.imgNames.length > 0) {
			file.initWithFile(targetDir);
			imageFileNameFinal = imageFileName.replace(/^(.+)\.([^\.]+)$/, this.imgNames.shift() + ".$2");
			file.appendRelativePath(imageFileNameFinal);
		}
		var fileExist = 0;
		if (file.exists()) {
			fileExist = 1;
			if (autorename == "true") {
				var i = 1;
				while (file.exists()) {
					file.initWithFile(targetDir);
					imageFileNameFinal = imageFileName.replace(/\.([^\.]+)$/, "_[" + i + "].$1");
					file.appendRelativePath(imageFileNameFinal);
					i++;
				}
			} else {
				callback(fileExist);
				return;
			}
		}
		var observer = {
			onStreamComplete: function(loader, context, status, length, result) {
				var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
				file.initWithFile(targetDir);
				file.appendRelativePath(imageFileNameFinal);
				var stream = Components.classes["@mozilla.org/network/safe-file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
				stream.init(file, -1, -1, 0);
				var bstream = Components.classes["@mozilla.org/binaryoutputstream;1"].createInstance(Components.interfaces.nsIBinaryOutputStream);
				bstream.setOutputStream(stream);
				bstream.writeByteArray(result, length);
				if (stream instanceof Components.interfaces.nsISafeOutputStream) {
					stream.finish();
				} else {
					stream.close();
				}
				if (typeof callback == "function") {
					callback(fileExist);
				}
			}
		};
		var streamLoader = Components.classes["@mozilla.org/network/stream-loader;1"].createInstance(Components.interfaces.nsIStreamLoader);
		streamLoader.init(observer);
		channel.asyncOpen(streamLoader, streamLoader);
		return;
	},
	addZeros: function(incNum,len) {
	  var S = String(incNum);
	  while (S.length < len)
	    S = '0'+S;
	  return S;
	},
	getTabInfo: function(key) {
		var Doc = window.getBrowser().selectedBrowser.contentDocument,t='';
		if(key == 'title') t = Doc.title;
		if(key == 'host') t = Doc.domain;
		t = t.replace(/[\/\\^:*?\"<>|]+/ig, '_');
		return t;
	},
	createBIDFolder: function(folder) {
		try {
			var appInfo = Cc['@mozilla.org/xre/app-info;1'].getService(Ci.nsIXULAppInfo);
			var versionChecker = Cc['@mozilla.org/xpcom/version-comparator;1'].getService(Ci.nsIVersionComparator);
	  		if (appInfo && versionChecker) {
		  		var FFv14plus = versionChecker.compare(appInfo.version, '14') >= 0; //gecko 14
	 		}
			if (FFv14plus)
				var dir = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsIFile);
			else
				var dir = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsILocalFile);
			dir.initWithPath(folder); // no ~ so just create in saveFolder
			if (!dir.exists() || !dir.isDirectory()) {   // if it doesn't exist, create it
				dir.create(Ci.nsIFile.DIRECTORY_TYPE, 0x1FF); //0x1FF=0777 needed for Linux permissions
			}
			return (dir.isWritable())? dir : 0;
	  	} catch(e){
		  	if(this.debug) alert(e);
	  		return 0;
	  	}
	},
	appendFolder: function(fld) { //special treatment for slash "\\" and '/'
		if (fld) {
			fld = fld.replace(/(^\s*)|(\s*$)/g,"");//trim
			fld = (navigator.appVersion.indexOf('Win') != -1)? '\\'+fld : '/'+fld;//system is windows or not
		}
		return fld;
	},
	getPref: function(name){
		var quickdown_pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("batchimagesdownloader."),value;
		try {
			value = decodeURI(quickdown_pref.getCharPref(name));
		} catch (e) {value = null;};
		return value;
	},
	getDefaultSaveDirectory: function(fld) {
		var pref_path = this.getPref("path");
		if (pref_path==null||!pref_path) {
			var dirService = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties);
			var homeDirFile = dirService.get("Desk", Components.interfaces.nsIFile);
			return homeDirFile;
		}
		var dir =(fld==undefined||fld.replace(/(^\s*)|(\s*$)/g,"")=='')?pref_path:pref_path+fld;
		return this.createBIDFolder(dir);
	},
	getAttsFromDom: function(dom, selector, att, isUrl) {
		isUrl = isUrl || true;
		var atts = [],
			slinks = dom.querySelectorAll(selector);
		if (slinks.length == 0) return atts;
		var host = window.content.document.location.host;
		for (var i = 0; i < slinks.length; i++) {
			var attValue = att == 'innerHTML'?slinks[i].innerHTML:slinks[i].getAttribute(att);
			attValue = attValue.replace(/(^\s*)|(\s*$)/g,"");
			if (isUrl && (attValue.indexOf('://') < 0 || attValue.indexOf('chrome://browser/') > 0)) attValue = attValue.replace(/^(chrome:\/\/browser\/|\/)?/i, 'http://' + host + '/');
			atts.push(attValue);
		}
		return atts;
	},
	getDomFromUrl: function(url, callback) {
		var xmlHttp = {};
		url = unescape(url);
		if (window.XMLHttpRequest) xmlHttp = new XMLHttpRequest();
		else xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
		xmlHttp.onreadystatechange = function() {
			if (xmlHttp.readyState == 4 && (xmlHttp.status == 200 || xmlHttp.status == 0)) {
				var parser = new DOMParser();
				var doc = parser.parseFromString(xmlHttp.responseText, "text/html");
				callback(doc);
				delete(xmlHttp);
			}
		}
		xmlHttp.open("GET", url, true);
		xmlHttp.send(null);
	},
	getStatus: function() {
		var quickdown_pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("batchimagesdownloader."),status;
		try {
			status = quickdown_pref.getCharPref("status");
		} catch (e) {
			status = "idle"
		};
		return status;
	},
	setStatus: function(status) {
		this.quickdown_pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("batchimagesdownloader.");
		this.quickdown_pref.setCharPref("status", status);
	}
};
batchimagesdownloader.init();
//setTimeout(function() {
//	document.getElementById("BID_mnuToolbar0").setAttribute("tooltiptext", "左键：自动下载\n中键：中止重设\n右键：进行配置\nAlt+左键：编辑配置\nAlt+右键：重载配置");
//}, 1000);