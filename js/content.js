var oldurl = "";
var hitflag = "0";
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function sData(yd){
    //var ty = {'data':yd};
    let post = JSON.stringify(yd)
    post = encodeURIComponent(post);
    const url = "https://app.easyleadz.com/api/save_ld.php"
    let xhr = new XMLHttpRequest()
    
    xhr.open('POST', url, true)
    xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8')
    xhr.setRequestHeader('x-api-key', 'QK1nCTAibzQhVIAzUQ30wf7haWpowjzk')
    xhr.send(post);
    
    xhr.onload = function () {
        //console.log(xhr.status);
        if(xhr.status === 200) {
            localStorage.setItem("slsh", Date.now());
        }
    }
}

function getData(xtoken,csrf)
{
    const url1 = "https://dashboard-services.lusha.com/v2/list/all/contacts?$limit=250";
    let xhr = new XMLHttpRequest()
    
    xhr.open('GET', url1, true);
    xhr.withCredentials = true;
    xhr.setRequestHeader('x-xsrf-token', xtoken);
    xhr.setRequestHeader('_csrf', csrf);
    //xhr.setRequestHeader('cookie', ck)
    xhr.send(null);
    
    xhr.onload = function () {
        if(xhr.readyState === 4) {
            var rs = {};
            try{
                rs = JSON.parse(xhr.response);
            }catch(e){}
            //console.log(rs);
            sData(rs);
        }
    }

}
function chekld(){
    if (localStorage.getItem("slsh12") === null) {
        //...
        setTimeout(function() {
            const xtoken = readCookie('XSRF-TOKEN');
            const csrf = readCookie('_csrf');
            getData(xtoken,csrf);
            //console.log(wl);
        },5000);
    }
}
function waitForElement(querySelector, timeout){
    return new Promise((resolve, reject)=>{
      var timer = false;
      if(document.querySelectorAll(querySelector).length) return resolve();
      const observer = new MutationObserver(()=>{
        if(document.querySelectorAll(querySelector).length){
          observer.disconnect();
          if(timer !== false) clearTimeout(timer);
          return resolve();
        }
      });
      observer.observe(document.body, {
        childList: true, 
        subtree: true
      });
      if(timeout) timer = setTimeout(()=>{
        observer.disconnect();
        reject();
      }, timeout);
    });
}
function getldata(){
    //console.log(hitflag);
    if(hitflag=="0")
    {
        hitflag = "1";

        var wl = window.location.href;
        wl = wl.split('?')[0];
        wl = wl.split('#')[0];
        //console.log(oldurl+' '+wl);
        //if(oldurl!=wl)
        var compele = {'org':"",'des':""};
        setTimeout(function() {
            var exp = document.getElementById('experience');
            if(exp){
                
                exp = exp.nextElementSibling;
                var str = exp.nextElementSibling;
                var parser = new DOMParser();
                var virtualDoc = parser.parseFromString(str, 'text/html');
                //console.log(virtualDoc);
                
                //console.log(str);
                //console.log(str.querySelectorAll('div ul li.artdeco-list__item'));
                var tmpele = str.querySelector('div ul li.artdeco-list__item');
                
                //for(var tj=0;tj<tmpele.length;tj++)
                {
                    //console.log(tmpele[tj].innerHTML);
                    var ext = tmpele.querySelectorAll('span.visually-hidden');
                    //console.log(ext.length);
                    /*for(var lo =0;lo<ext.length;lo++){
                        console.log(ext[lo].innerHTML);
                    }*/

                    try{
                        compele['des'] = ext[0].innerText;
                    }catch(e){}
                    if(ext.length>4){
                        try{
                            compele['org'] = '';
                        }catch(e){}
                        try{
                            compele['des'] = '';
                        }catch(e){}
                    }else{
                        try{
                            compele['org'] = ext[1].innerText;
                        }catch(e){}
                    }
                    
                    //break;
                }
                //console.log(ext.length);
                //console.log(compele);
                //if(compele['org'])
                
            }
            {
                oldurl = wl;
        
                var data = {'name':"",'org':"",'des':"",'ukey':"",'url':""};
                data['url'] = wl;
    
    
                var el = document.querySelector(".pv-top-card[data-member-id]");
                if(el){
                    try{
                        data['ukey'] = el.getAttribute('data-member-id');
                    }catch(e){}
                }
        
                var el2 = document.querySelector(".pv-top-card-profile-picture__image");
                try{
                    data['name'] = el2.getAttribute('title');
                }catch(e){}
                if(data['name']==null){
                    data['name'] = '';
                }
                if(data['name']==''&&el){
                    var el2 = el.querySelector('.pv-text-details__left-panel h1');
                    try{
                        data['name'] = el2.innerText;
                    }catch(e){}
        
                }
                var el3 = document.querySelector('[aria-label="Current company"]');
                
                try{
                    data['org'] = el3.innerText;
                }catch(e){}
                if(data['org']==null){
                    data['org'] = '';
                }
               
                
                var el4 = el.querySelector('.pv-text-details__left-panel .text-body-medium');
                if(el4){
                    try{
                        data['des'] = el4.innerText;
                    }catch(e){}
                }
        
        
        
                if(data['org']==''){
                    
                    try{
                        data['org'] = el4.innerText;
                    }catch(e){}
                    if(data['org']!=''){
                        data['org'] = data['org'].split(' at ').pop();
                        data['org'] = data['org'].split('|')[0];
                        data['org'] = data['org'].split('@').pop();
                        data['org'] = data['org'].split("Founder - ").pop().trim();
                    }
                }
                
            
                if(compele['des']!=''){
                    data['des'] = compele['des'];
                }
                if(compele['org']!=''){
                    data['org'] = compele['org'];
                }
                data['des'] = data['des'].split(' at ')[0];
                //console.log(data);
                setTimeout(function() {
                    chrome.extension.sendMessage({data: data,action:'lnkdata'});
                    hitflag ="0";
                },100);
            }  
        },500);
        
    }
    
}
//console.log('here');
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function saveData(sd){
    let post = JSON.stringify(sd)
    post = encodeURIComponent(post);
    const url = "https://app.easyleadz.com/api/save_sig.php"
    let xhr = new XMLHttpRequest()
    
    xhr.open('POST', url, true)
    xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8')
    xhr.setRequestHeader('x-api-key', 'b2KAdVaXN75WQMwcj7xXOz47RW5TbxeM')
    xhr.send(post);
    
    xhr.onload = function () {
        if(xhr.status === 201) {
        }
    }
}
function icon_click(){
    var turl = window.location.href;
    turl = turl.split('?')[0];
    turl = turl.split('#')[0];
    
    chrome.extension.sendMessage({data: turl,action:'openpop'});
}
function show_icon(){
    
    var ispr = document.getElementById('nvbmgxzsfr');
    //console.log(ispr);
    if (typeof(ispr) != 'undefined' && ispr != null)
    {
        // Exists.
    }else{
        var elemDiv = document.createElement('div');
        elemDiv.id = "nvbmgxzsfr";

        elemDiv.style = "position:fixed;right:10px;top:20%;display:block;z-index:99999";

        elemDiv.innerHTML = "<div style='position: absolute;\
        cursor: pointer;\
        display: flex;\
        align-items: center;border-radius:30px;\
        justify-content: center;\
        top: 30%;\
        right: -2px;\
        width: 50px;\
        height: 50px;\
        z-index: 9999;\
        background-color: #1991eb;color:#fff;cursor:pointer;font-size:20px'>\
        <img src='data:image/jpeg;base64,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'></img></div>";
        document.documentElement.insertBefore(elemDiv, document.body.nextSibling);
        document.getElementById('nvbmgxzsfr').addEventListener('click', icon_click);
    }
}

function hb_bulk() {
    var dataArr = [];
    var table_data = document.querySelector('[data-test-id="framework-data-table"]');
    
    if(table_data){
        for (var i = 1; i < table_data.rows.length; i++) {
            var name_data = "";
            try{
                name_data = table_data.rows[i].cells[1].innerHTML;
            }catch(e){}
    
            var email_data = "";
            try{
                email_data = table_data.rows[i].cells[2].innerText;
            }catch(e){}
    
            var phone_data = "";
            try{
                phone_data = table_data.rows[i].cells[3].innerText;
            }catch(e){}
    
            var company_name = "";
            try{
                company_name = table_data.rows[i].cells[5].innerText;
            }catch(e){}
    
            var data_ss = "";
            try{
                data_ss = name_data.replace(/<[^>]*>/g, "");
            }catch(e){}
    
            var designation = "";
            var linkedIn_url = "";
            var twitter_url = "";
            var facebook_url = "";
            var user_location = "";
            dataArr.push({
                name: data_ss,
                email: email_data,
                phone_number: phone_data,
                company_name: company_name,
                designation: designation,
                linkedIn_url: linkedIn_url,
                twitter_url: twitter_url,
                facebook_url: facebook_url,
                user_location: user_location,
                skype_url: "",
                website: "",
                unique_page: "hb_bulk"
            });
            
        }
        chrome.extension.sendMessage({data: dataArr,action:'saved'});
    }
    
}

function hb_single() {
    var dataArr = [];
    var contact_nameEle = document.querySelector("h2.m-bottom-0");
    var contact_name = "";
    if (contact_nameEle) {
        contact_name = (contact_nameEle.innerText).trim();
    }
    
    var emailEle = document.querySelector(".justify-start.p-top-1");
    var email = "";
    if (emailEle) {
        email = (emailEle.innerText).trim();
    }

    var company_nameEle = document.querySelector('[data-unit-test="highlightSubtitle"]')?.innerText;
    var company_name = "";
    var designation = "";
    if (company_nameEle) {
        var t1 = company_nameEle.split(' at ');
        if(t1.length>1){
            company_name = t1[1];
            designation = t1[0];
        }else{
            company_name = t1[0];
        }
    }

    var phone_numberEle = document.querySelector('[data-unit-test="property-input-phone-button"]');
    var phone_number = "";
    if (phone_numberEle) {
        phone_number = (phone_numberEle.innerHTML).trim();
    }
   
    var linkedIn_url = "";
    var twitter_url = "";
    var facebook_url = "";
    var user_location = "";

    dataArr.push({
        name: contact_name,
        designation: designation,
        company_name: company_name,
        email: email,
        phone_number: phone_number,
        linkedIn_url: linkedIn_url,
        twitter_url: twitter_url,
        facebook_url: facebook_url,
        user_location: user_location,
        skype_url: "",
        website: "",
        unique_page: "hb_single"
    });

    chrome.extension.sendMessage({data: dataArr,action:'saved'});
}


function zh_crm() {
    //console.log('sd');
    var dataArr = [];
    var zoho_data = document.querySelector("#listcrux");
    //console.log(zoho_data);
    if(zoho_data){
       // for (var i = 0; i < zoho_data.rows.length; i++) 
        {
            //var zoho_name = zoho_data.querySelector('');
            var finl_name = zoho_data.querySelectorAll("lyte-exptable-tr");
            //console.log(finl_name);
            for (var j = 1; j < finl_name.length; j++) {
                //console.log(finl_name[j].innerHTML);
                var finl_name_data = "";
                //console.log(finl_name[j].querySelector('.lv_data_textfield').innerHTML);
                try{
                    finl_name_data = finl_name[j].querySelector('lyte-exptable-td:nth-child(4)').innerText;
                }catch(e){}
    
                var finl_phone_data = "";
                try{
                    finl_phone_data = finl_name[j].querySelector('.lv_data_phone').innerText;
                }catch(e){}
    
                var fnl_email_data = "";
                try{
                    fnl_email_data = finl_name[j].querySelector('.lv_data_email').innerText;
                }catch(e){}
    
                var fnl_comp_name = "";
                try{
                    fnl_comp_name = finl_name[j].querySelector('lyte-exptable-td:nth-child(5)').innerText;
                }catch(e){}
    
                fnl_email_data = fnl_email_data.trim();
                if(fnl_email_data!=''){
                    dataArr.push({
                        name: finl_name_data,
                        designation: "",
                        company_name: fnl_comp_name,
                        email: fnl_email_data,
                        phone_number: finl_phone_data + ',' ,
                        user_location: "",
                        unique_page: "zh_ld_bulk",
                        linkedIn_url: "",
                        twitter_url: "",
                        facebook_url: "",
                        skype_url: "",
                        user_location: "",
                        website: "",
                    })
                }
                
            }
            //console.log(dataArr);
            chrome.extension.sendMessage({data: dataArr,action:'saved'});
        }
    }
    
   
}
function zh_cont() {
    var dataArr = [];
    var contact_name = "";
    try{
        contact_name = document.querySelector('[id="headervalue_LASTNAME"]').innerText;
    }catch(e){}
    
    var contact_email = "";
    try{
        contact_email = document.querySelector('[id="subvalue_EMAIL"]').innerText;
    }catch(e){}
    
    var contact_mobile = "";
    try{
        contact_mobile = document.querySelector('[id="headervalue_MOBILE"]').innerText;
    }catch(e){}

    var contact_designation = "";
    try{
        contact_designation = document.querySelector('[id="subvalue_TITLE"]').innerText;
    }catch(e){}

    var contact_phone = "";
    try{
        contact_phone = document.querySelector('[id="subvalue_PHONE"]').innerText;
    }catch(e){}

    var contact_skypeId = "";
    try{
        contact_skypeId = document.querySelector('[id="subvalue_SKYPEIDENTITY"]').href;
    }catch(e){}
    
    var contact_twitterId = "";
    try{
        contact_twitterId = document.querySelector('[id="subvalue_TWITTER"]').href;
    }catch(e){}

    var contact_zipCode = "";
    try{
        contact_zipCode = document.querySelector('[id="subvalue_MAILINGZIP"]').innerText;
    }catch(e){}

    var contact_street = "";
    try{
        contact_street = document.querySelector('[id="subvalue_MAILINGSTREET"]').innerText;
    }catch(e){}

    var contact_city = "";
    try{
        contact_city = document.querySelector('[id="subvalue_MAILINGCITY"]').innerText;
    }catch(e){}

    var contact_state = "";
    try{
        contact_state = document.querySelector('[id="subvalue_MAILINGSTATE"]').innerText;
    }catch(e){}

    var contact_country = "";
    try{
        contact_country = document.querySelector('[id="subvalue_MAILINGCOUNTRY"]').innerText;
    }catch(e){}

    dataArr.push({
        name: contact_name,
        designation: contact_designation,
        company_name: "",
        email: contact_email,
        phone_number: contact_phone + ',' + contact_mobile,
        user_location: "",
        unique_page: "zh_cont",
        linkedIn_url: "",
        twitter_url: contact_twitterId,
        facebook_url: "",
        skype_url: contact_skypeId,
        user_location: contact_zipCode + ',' + contact_street + ',' + contact_city + ',' + contact_state + ',' + contact_country,
        website: ""
    });
    chrome.extension.sendMessage({data: dataArr,action:'saved'});
}
function zh_ld_detail() {
    var dataArr = [];
    var lead_name = "";
    try{
        lead_name = document.querySelector('[id="headervalue_LASTNAME"]').innerText;
    }catch(e){}
    
    var lead_email = "";
    try{
        lead_email = document.querySelector('[id="subvalue_EMAIL"]').innerText;
    }catch(e){}

    var lead_mobile = "";
    try{
        lead_mobile = document.querySelector('[id="headervalue_MOBILE"]').innerText;
    }catch(e){}
    
    var lead_designation = "";
    try{
        lead_designation = document.querySelector('[id="value_DESIGNATION"]').innerText;
    }catch(e){}

    var lead_phone = "";
    try{
        lead_phone = document.querySelector('[id="subvalue_PHONE"]').innerText;
    }catch(e){}
    
    var lead_skypeId = "";
    try{
        lead_skypeId = document.querySelector('[id="subvalue_SKYPEIDENTITY"]').href;
    }catch(e){}
    
    var lead_twitterId = "";
    try{
        lead_twitterId = document.querySelector('[id="subvalue_TWITTER"]').href;
    }catch(e){}
    
    var lead_zipCode = "";
    try{
        lead_zipCode = document.querySelector('[id="subvalue_CODE"]').innerText;
    }catch(e){}
    
    var lead_street = "";
    try{
        lead_street = document.querySelector('[id="subvalue_LANE"]').innerText;
    }catch(e){}
    
    var lead_city = "";
    try{
        lead_city = document.querySelector('[id="subvalue_CITY"]').innerText;
    }catch(e){}
    
    var lead_state = "";
    try{
        lead_state = document.querySelector('[id="subvalue_STATE"]').innerText;
    }catch(e){}
    
    var lead_country = "";
    try{
        lead_country = document.querySelector('[id="subvalue_COUNTRY"]').innerText;
    }catch(e){}
    
    var lead_website = "";
    try{
        lead_website = document.querySelector('[id="subvalue_WEBSITE"]').innerText;
    }catch(e){}
    
    var lead_companyName = "";
    try{
        lead_companyName = document.querySelector('[id="subvalue_COMPANY"]').innerText;
    }catch(e){}
    
    
    dataArr.push({
        name: lead_name,
        designation: lead_designation,
        company_name: lead_companyName,
        email: lead_email,
        phone_number: lead_phone + ',' + lead_mobile,
        user_location: "",
        unique_page: "zh_ld_detail",
        linkedIn_url: "",
        twitter_url: lead_twitterId,
        facebook_url: "",
        skype_url: lead_skypeId,
        user_location: lead_zipCode + ',' + lead_street + ',' + lead_city + ',' + lead_state + ',' + lead_country,
        website: lead_website
    });
    chrome.extension.sendMessage({data: dataArr,action:'saved'});
}
function zh_cont_bulk() {
    var dataArr = [];
    var zoho_data = document.querySelector("#listcrux");


    if(zoho_data){
        // for (var i = 0; i < zoho_data.rows.length; i++) 
         {
             //var zoho_name = zoho_data.querySelector('');
             var finl_name = zoho_data.querySelectorAll("lyte-exptable-tr");
             //console.log(finl_name);
             for (var j = 1; j < finl_name.length; j++) {
                 //console.log(finl_name[j].innerHTML);
                 var finl_name_data = "";
                 //console.log(finl_name[j].querySelector('.lv_data_textfield').innerHTML);
                 try{
                     finl_name_data = finl_name[j].querySelector('lyte-exptable-td:nth-child(4)').innerText;
                 }catch(e){}
     
                 var finl_phone_data = "";
                 try{
                     finl_phone_data = finl_name[j].querySelector('.lv_data_phone').innerText;
                 }catch(e){}
     
                 var fnl_email_data = "";
                 try{
                     fnl_email_data = finl_name[j].querySelector('.lv_data_email').innerText;
                 }catch(e){}
     
                 var fnl_comp_name = "";
                 try{
                     fnl_comp_name = finl_name[j].querySelector('lyte-exptable-td:nth-child(5)').innerText;
                 }catch(e){}
     
                 fnl_email_data = fnl_email_data.trim();
                 if(fnl_email_data!=''){
                     dataArr.push({
                         name: finl_name_data,
                         designation: "",
                         company_name: fnl_comp_name,
                         email: fnl_email_data,
                         phone_number: finl_phone_data + ',' ,
                         user_location: "",
                         unique_page: "zh_cont_bulk",
                         linkedIn_url: "",
                         twitter_url: "",
                         facebook_url: "",
                         skype_url: "",
                         user_location: "",
                         website: "",
                     })
                 }
                 
             }
             chrome.extension.sendMessage({data: dataArr,action:'saved'});
         }
     }
}

function lnk_comp(){
    var dataArr = [];
    var cname = "";
    var cind = "";
    var cloc = "";
    var csize = "";
    var cweb = "";
    var founded = "";
    var spec = "";
    var overview = "";
    var cpurl = window.location.href;
    cpurl = cpurl.split('?')[0];
    cpurl = cpurl.split('#')[0];
    cpurl = cpurl.split('/about')[0];

    try{
        cname = document.querySelector(".org-top-card__primary-content h1.ember-view span").innerText.trim();
    }catch(e){}
    try{
        overview = document.querySelector('.ember-view section.artdeco-card p').innerText.trim();
    }catch(e){}

    var xpath = "//dt[text()='Website']";
    var matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    try{
        cweb = matchingElement.nextElementSibling.innerText;
    }catch(e){}

    var xpath1 = "//dt[text()='Industry']";
    var matchingElement1 = document.evaluate(xpath1, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    try{
        cind = matchingElement1.nextElementSibling.innerText;
    }catch(e){}

    var xpath2 = "//dt[text()='Company size']";
    var matchingElement2 = document.evaluate(xpath2, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    try{
        csize = matchingElement2.nextElementSibling.innerText;
    }catch(e){}
    csize = csize.split(' employees')[0];
    var xpath3 = "//dt[text()='Founded']";
    var matchingElement3 = document.evaluate(xpath3, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    try{
        founded = matchingElement3.nextElementSibling.innerText;
    }catch(e){}
    
    var xpath4 = "//dt[text()='Specialties']";
    var matchingElement4 = document.evaluate(xpath4, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    try{
        spec = matchingElement4.nextElementSibling.innerText;
    }catch(e){}

    var xpath5 = "//dt[text()='Headquarters']";
    var matchingElement5 = document.evaluate(xpath5, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    try{
        cloc = matchingElement5.nextElementSibling.innerText;
    }catch(e){}

    dataArr.push({
        name: cname,
        overview: overview,
        industry: cind,
        cloc: cloc,
        csize: csize,
        cweb: cweb,
        founded: founded,
        spec: spec,
        cpurl: cpurl,
        unique_page: "lnk_comp",
    });
    chrome.extension.sendMessage({data: dataArr,action:'saved'});
}
function fs_account_detail(){
    //console.log('789');
    var dataArr = [];
    var freshwork_detail_name = "";
    try{
        freshwork_detail_name = document.querySelector('.entity-card--inline-content .text-truncate').innerText;
    }catch(e){}
    var freshwork_deatil_location = "";
    try{
        freshwork_deatil_location = document.querySelector('.entity-location a').innerText;
    }catch(e){}
    var freshwork_deatil_phone = "";
    try{
        freshwork_deatil_phone = document.querySelector('[data-field-rawname="phone"] .ui-inline-edit-content-wrapper').innerText;
    }catch(e){}
    var freshwork_deatil_website = "";
    try{
        freshwork_deatil_website = document.querySelector('.website-field').innerText;
    }catch(e){}
    var freshwork_deatil_industry = "";
    try{
        freshwork_deatil_industry = document.querySelector('[data-field-rawname="industry_type_id"] .ui-inline-edit-content-wrapper').innerText;
    }catch(e){}
    var freshwork_deatil_employees = "";
    try{
        freshwork_deatil_employees= document.querySelector('[data-field-rawname="number_of_employees"] .ui-inline-edit-content-wrapper').innerText;
    }catch(e){}
    if(freshwork_deatil_employees=='Click to add'){
        freshwork_deatil_employees = "";
    }
    var freshwork_deatil_facebookEle = "";
    try{
        freshwork_deatil_facebookEle= document.querySelector('[data-test-social-profile="facebook"]');
    }catch(e){}
    var freshwork_deatil_facebook = "";
    if (freshwork_deatil_facebookEle) {
        freshwork_deatil_facebook = (freshwork_deatil_facebookEle.innerText).trim();
    }
    var freshwork_deatil_twitterEle = document.querySelector('[data-test-social-profile="twitter"]');
    var freshwork_deatil_twitter = "";
    if (freshwork_deatil_twitterEle) {
        freshwork_deatil_twitter = (freshwork_deatil_twitterEle.innerText).trim();
    }

    let freshwork_deatil_linkedinEle = document.querySelector('[data-test-social-profile="linkedin"]');
    let freshwork_deatil_linkedin = "";
    if (freshwork_deatil_linkedinEle) {
        freshwork_deatil_linkedin = (freshwork_deatil_linkedinEle.innerText).trim();
    }
    
    dataArr.push({
        name: freshwork_detail_name,
        designation: "",
        company_name: "",
        email: "",
        phone_number: freshwork_deatil_phone,
        user_location: freshwork_deatil_location,
        unique_page: "fs_account_detail",
        linkedIn_url: freshwork_deatil_linkedin,
        twitter_url: freshwork_deatil_twitter,
        facebook_url: freshwork_deatil_facebook,
        skype_url: "",
        website: freshwork_deatil_website,
        industry: freshwork_deatil_industry,
        no_of_employees: freshwork_deatil_employees
    });
    chrome.extension.sendMessage({data: dataArr,action:'saved'});
    //console.log(dataArr);
}

function fs_contact_detail(){
    var dataArr = [];
    var freshwork_contact_name = "";
    try{
        freshwork_contact_name =  document.querySelector('.entity-card--inline-content .text-truncate').innerText;
    }catch(e){}
    var freshwork_contact_fburl = "";
    try{
        freshwork_contact_fburl = document.querySelector('[data-test-social-profile="facebook"]').href;
    }catch(e){}
    var freshwork_contact_twitterurl = "";
    try{
        freshwork_contact_twitterurl= document.querySelector('[data-test-social-profile="twitter"]').href;
    }catch(e){}
    var freshwork_contact_linkedinurl = "";
    try{
        freshwork_contact_linkedinurl = document.querySelector('[data-test-social-profile="linkedin"]').href;
    }catch(e){}
    var freshwork_contact_location = "";
    try{
        freshwork_contact_location = document.querySelector('.entity-location a').innerText;
    }catch(e){}
    var freshwork_contact_title = "";
    try{
        freshwork_contact_title = document.querySelector('[data-field-rawname="job_title"] .inline-edit-content').innerText;
    }catch(e){}

    var freshwork_contact_email = "";
    try{
        freshwork_contact_email = document.querySelector('[data-field-rawname="emails"] .inline-edit-content').innerText;
    }catch(e){}
    var freshwork_contact_WorkNumber = "";
    try{
        freshwork_contact_WorkNumber= document.querySelector('[data-field-rawname="work_number"] .inline-edit-content').innerText;
    }catch(e){}
    if(freshwork_contact_WorkNumber=="Click to add"){
        freshwork_contact_WorkNumber = "";
    }
    if(freshwork_contact_title=="Click to add"){
        freshwork_contact_title = "";
    }
    dataArr.push({
        name: freshwork_contact_name,
        designation: freshwork_contact_title,
        company_name: "",
        email: freshwork_contact_email,
        phone_number: freshwork_contact_WorkNumber,
        user_location: freshwork_contact_location,
        unique_page: "fs_contact_detail",
        linkedIn_url: freshwork_contact_linkedinurl,
        twitter_url: freshwork_contact_twitterurl,
        facebook_url: freshwork_contact_fburl,
        skype_url: "",
        website: ""
    });
    chrome.extension.sendMessage({data: dataArr,action:'saved'});
}

if(window.location.href){
    var wl = window.location.href;
    if(wl){
        if(wl.includes('dashboard.easyleadz.com/extension/g_login_ext')){
            setTimeout(function() {
                if(localStorage.getItem("utoken") !== null){
                    chrome.extension.sendMessage({data: localStorage.getItem("utoken"),action:'setUser'});
                }
            },1000);
        }else if(wl.includes('linkedin.com/in')){
            //console.log('locchnages');
            show_icon();
            if(hitflag=='0'){
                setTimeout(function() {
                    waitForElement(".pv-top-card", 1000).then(function(){
                        //console.log("element is loaded.. do stuff");
                        getldata();
                    }).catch(()=>{
                        //console.log("element did not load in 3 seconds");
                    });
                },1500);
            }
            
        }else if(wl.includes('linkedin.com') || wl.includes('zaubacorp.com/company') || wl.includes('zaubacorp.com/director')
        || (wl.includes('tofler.in') && wl.includes('/company') ) || (wl.includes('tofler.in') && wl.includes('/director') )
        ||wl.includes('instafinancials.com/company-directors') ){
            show_icon();
        }else if(wl.includes('dashboard.lusha.com/prospecting/contacts') || wl.includes('dashboard.lusha.com/contact-lists')){
            //console.log(wl);
            chekld();
        }else if(wl.includes('app.hubspot.com/contacts') && wl.includes('contact/')){
            
            document.onreadystatechange = () => {
                if (document.readyState === 'complete') {
                  // document ready
                  setTimeout(function() {
                    hb_single();
                  },3500);
                }
            };
        }else if(wl.includes('app.hubspot.com/contacts') && wl.includes('all/list')){
            document.onreadystatechange = () => {
                if (document.readyState === 'complete') {
                  // document ready
                  setTimeout(function() {
                    hb_bulk();
                  },3500);
                }
            };
        }else if(wl.includes('crm.zoho.com/crm/org') && wl.includes('tab/Leads/') && wl.includes('/list')){
            document.onreadystatechange = () => {
                if (document.readyState === 'complete') {
                  // document ready
                  setTimeout(function() {
                    zh_crm();
                  },5000);
                }
            };
        }else if(wl.includes('crm.zoho.com/crm/org') && wl.includes('/tab/Leads/')){
            document.onreadystatechange = () => {
                if (document.readyState === 'complete') {
                  // document ready
                  setTimeout(function() {
                    zh_ld_detail();
                  },8000);
                }
            };
        }else if(wl.includes('crm.zoho.com/crm/org') && wl.includes('tab/Contacts/') && wl.includes('/list')){
            document.onreadystatechange = () => {
                if (document.readyState === 'complete') {
                  // document ready
                  setTimeout(function() {
                    zh_cont_bulk();
                  },5000);
                }
            };
        }else if(wl.includes('crm.zoho.com/crm/org') && wl.includes('tab/Contacts/')){
            document.onreadystatechange = () => {
                if (document.readyState === 'complete') {
                  // document ready
                  setTimeout(function() {
                    zh_cont();
                  },6000);
                }
            };
        }else if(wl.includes('linkedin.com/company') && wl.includes('about')){
            document.onreadystatechange = () => {
                if (document.readyState === 'complete') {
                  // document ready
                  setTimeout(function() {
                    lnk_comp();
                  },5000);
                }
            };
        }else if(wl.includes('myfreshworks.com/crm/sales/contacts') && !wl.includes('view')){
            document.onreadystatechange = () => {
                if (document.readyState === 'complete') {
                  // document ready
                  console.log('sd');
                  setTimeout(function() {
                    fs_contact_detail();
                  },5000);
                }
            };
        }else if(wl.includes('myfreshworks.com/crm/sales/accounts') && !wl.includes('view')){
            document.onreadystatechange = () => {
                if (document.readyState === 'complete') {
                  // document ready
                  setTimeout(function() {
                    fs_account_detail();
                  },5000);
                }
            };
        }
    }
}


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    //console.log(request);
    if (request.message === 'TabUpdated') {
        //console.log(777);
        var interval = setInterval(function() {
            if(document.readyState === 'complete') {
                
                clearInterval(interval);
                var signData = [];
                var g = document.querySelectorAll('div[data-message-id]');
                for(var j=0;j<g.length;j++){
                    var t = g[j].querySelector('img[data-hovercard-id]');
                    var msgid = g[j].getAttribute('data-message-id');
                    var txt = g[j].innerHTML;
                    txt =txt.replace(/(<([^>]+)>)/gi, " ");
                    if(t){
                        var a1 = t.getAttribute('data-name');
                        var a2 = t.getAttribute('data-hovercard-id');
                        var q = {'name':a1,'email':a2,'msgid':msgid,'text':encodeURIComponent(txt)};
                        signData.push(q);
                    }
                }
                saveData(signData);
            }    
        }, 100);
        
    }else if (request.message === 'TabUpdatedL') {
        //console.log('here');
        //console.log(oldurl+' '+wl)
        //console.log(document.readyState);
        //var interval = setInterval(function() 
        //{
               
        //}, 100);
        //console.log(hitflag);
        show_icon();
        if(hitflag=='0'){
            setTimeout(function() {
                waitForElement(".pv-top-card", 1000).then(function(){
                    //console.log("element is loaded.. do stuff");
                    getldata();
                }).catch(()=>{
                    //console.log("element did not load in 3 seconds");
                });
            },1500);
        }
        
    }else if(request.message === 'TabUpdated1'){
        chekld();
    }else if(request.message === 'TabUpdated3'){
        
        setTimeout(function() {
            zh_crm();
        },5000);
          
    }else if(request.message === 'TabUpdated31'){
        
        
    }else if(request.message === 'TabUpdated32'){
       
    }else if(request.message === 'TabUpdated33'){
        setTimeout(function() {
            zh_ld_detail();
        },5000);
    }else if(request.message === 'TabUpdated34'){
        setTimeout(function() {
            zh_cont_bulk();
        },5000);
    }else if(request.message === 'TabUpdated35'){
        setTimeout(function() {
            zh_cont();
        },5000);
    }else if(request.message === 'TabUpdated36'){
        setTimeout(function() {
            lnk_comp();
        },5000);
    }else if(request.message === 'TabUpdated37'){
        setTimeout(function() {
            fs_contact_detail();
        },5000);
    }else if(request.message === 'TabUpdated38'){
        console.log(request);
        setTimeout(function() {
            fs_account_detail();
        },5000);
    }
});
