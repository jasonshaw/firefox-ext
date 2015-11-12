var file;

var batchimagesdownloaderconf = {   
    pickPath: function(){
	    const nsIFilePicker = Components.interfaces.nsIFilePicker;
	    var fp = Components.classes["@mozilla.org/filepicker;1"]
				       .createInstance(nsIFilePicker);
	    fp.init(window, "Choose directory", nsIFilePicker.modeGetFolder);

	    var rv = fp.show();
	    if (rv == nsIFilePicker.returnOK) {
	      file = fp.file;
	      document.getElementById("textbox_path").setAttribute("value", file.path);
	    }
    },
    onCheckbox: function(obj){
		var id = obj.getAttribute('id');
		switch(id)
		{
			case 'auto-rename':
			case 'auto-skip': 
				var id1 = (id=='auto-rename')?'auto-skip':'auto-rename';
				var checked = (obj.getAttribute('checked') == 'true')?'false':'true';
				document.getElementById(id1).setAttribute("checked", checked);
				break;
			case 'ds_time':
				if(obj.getAttribute('checked') == 'true') document.getElementById("ds_date").setAttribute("checked", "true");
			case 'ds_host':
			case 'ds_title':
			case 'ds_date': document.getElementById("ds_custom").setAttribute("checked", "false");break;
			case 'ds_custom':
				if(obj.getAttribute('checked') == 'true'){
					var keys = ['ds_host','ds_title','ds_date','ds_time'],i=0;
				    while(keys[i]){
					    document.getElementById(keys[i++]).setAttribute("checked", "false");
				    }
				}
				break;
		}
		//if(id=='auto-rename'||id=='auto-skip'){
		//	var id1 = (id=='auto-rename')?'auto-skip':'auto-rename';
		//	var checked = (obj.getAttribute('checked') == 'true')?'false':'true';
		//	document.getElementById(id1).setAttribute("checked", checked);
		//}
		//if(id=='ds_title'||id=='ds_date'||id=='ds_time'){
		//	if(id=='ds_time'&& obj.getAttribute('checked') == 'true') document.getElementById("ds_date").setAttribute("checked", "true");
		//	document.getElementById("ds_custom").setAttribute("checked", "false");
		//}
		//if(id=='ds_custom'&&obj.getAttribute('checked') == 'true'){
		//	var keys = ['ds_title','ds_date','ds_time'],i=0;
		//    while(keys[i]){
		//	    document.getElementById(keys[i++]).setAttribute("checked", "false");
		//    }
		//}
    },
    saveOptions: function(){
	    this.quickdown_pref = Components.classes["@mozilla.org/preferences-service;1"]
		    .getService(Components.interfaces.nsIPrefService).getBranch("batchimagesdownloader.");
	    this.quickdown_pref.setCharPref("path", encodeURI(document.getElementById("textbox_path").getAttribute("value")));// fixed chinese dir messy codes
	    this.quickdown_pref.setCharPref("autorename", document.getElementById('auto-rename').getAttribute('checked'));
	    var keys = ['ds_host','ds_title','ds_date','ds_time','ds_custom'],i=0;
	    while(keys[i]){
		    this.quickdown_pref.setCharPref(keys[i], document.getElementById(keys[i++]).getAttribute('checked'));
	    }
	    //this.quickdown_pref.setCharPref("ds_title", document.getElementById('ds_title').getAttribute('checked'));
	    //this.quickdown_pref.setCharPref("ds_date", document.getElementById('ds_date').getAttribute('checked'));
	    //this.quickdown_pref.setCharPref("ds_time", document.getElementById('ds_time').getAttribute('checked'));
	    //this.quickdown_pref.setCharPref("ds_custom", document.getElementById('ds_custom').getAttribute('checked'));
    },
    loadQuickDownPref: function(){
	    var quickdown_pref = Components.classes["@mozilla.org/preferences-service;1"]
		    .getService(Components.interfaces.nsIPrefService).getBranch("batchimagesdownloader.");
	    var pref_path = decodeURI(quickdown_pref.getCharPref("path"));// fixed chinese dir messy codes try-catch better
	    document.getElementById("textbox_path").setAttribute("value", pref_path);
	    var autoRename = quickdown_pref.getCharPref("autorename");
	    var autoSkip = (autoRename == 'true')?'false':'true';
	    document.getElementById('auto-rename').setAttribute("checked", autoRename);
	    document.getElementById('auto-skip').setAttribute("checked", autoSkip);
	    var keys = ['ds_host','ds_title','ds_date','ds_time','ds_custom'],i=0;
	    while(keys[i]){
		    document.getElementById(keys[i]).setAttribute("checked", quickdown_pref.getCharPref(keys[i++]));
	    }
	    //var ds_title = quickdown_pref.getCharPref("ds_title");
	    //var ds_date = quickdown_pref.getCharPref("ds_date");
	    //var ds_time = quickdown_pref.getCharPref("ds_time");
	    //var ds_custom = quickdown_pref.getCharPref("ds_custom");
	    //document.getElementById('ds_title').setAttribute("checked", ds_title);
	    //document.getElementById('ds_date').setAttribute("checked", ds_date);
	    //document.getElementById('ds_time').setAttribute("checked", ds_time);
	    //document.getElementById('ds_custom').setAttribute("checked", ds_custom);
    }
};
