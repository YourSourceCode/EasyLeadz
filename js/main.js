var DATA = {},
DOMAIN = 'https://dashboard.easyleadz.com/extension/',
SITE = 'https://app.easyleadz.com/api/',
URL_ID = '',
SITE_TYPE=''
LNK_URL='',
URANDOM_CODE='',
CFLAG = 0,CURRENT_URL='',OURL='',dflag ="0",tmphostname='',RFLAG = 0,RCODE='',
dname="",din="",c_din=[],cinfo={'company_name':''},tmpurl="";
var LAST_URL = "",OLD_TYPE="";
var rldata = {};

//function disableF5(e) { if ((e.which || e.keyCode) == 116 || (e.which || e.keyCode) == 82) e.preventDefault(); };
//$(document).on("keydown", disableF5);

//$(/document).bind("contextmenu",function(e){return false;});
//console.log('here');
function get_token(){
    chrome.storage.local.get('utoken',function(result) {
        if ('utoken' in result){
            URANDOM_CODE = result['utoken'];
        }else{
            URANDOM_CODE = '';
        }
            
    });
}
function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    // Directly return the joined string
    return splitStr.join(' '); 
 }

get_token();

const fetchNameFromLinkedIn = (linkedinUrl) => {
    if (!linkedinUrl) return;
    const splitUrl = linkedinUrl.split('/');
    let linkedName;
    if (splitUrl.length > 0) {
      const indexOfIn = splitUrl.indexOf('in');
      linkedName = splitUrl[indexOfIn + 1];
    }
    return linkedName;
}

function show_content(){
    $('.reprt_message').hide();
    $('.report_contact').removeClass('loading');
    $('.report_contact').hide();
    $('.imp_free_credit_page_msg').hide();
    $('#loading').fadeOut('slow');
    $('#mrepover').show();    
};
function show_loader(){
    $('.imp_profile_visit_msg').hide();
    $('.imp_content').hide();
    $('#loading').show();
    $('#mrepover').hide(); 
    $('.show_verification_link').addClass('imp_hide_');
}

function show_lnk_info(){
    get_user_info(0);
}

function show_visit_profile_message(){
    show_content();
    $('.imp_profile_visit_msg').show();
    $('.imp_content').hide();
    $('.imp_comp_main').hide();
    $('.imp_main_error').hide();
    $('.imp_main_error').html('');
}

function show_login_message(){
    $('.imp_login_section').show();
    $('.imp_comp_main').hide();
    show_content();
    recheck_login();
}

function open_no_credit_page(){
    //$('#freecreditspe').trigger('click');
    window.open('https://dashboard.easyleadz.com/share','_blank');
}

function recheck_login(){
    //console.log(URL_ID);
    get_token();
    if(URANDOM_CODE==''){
        setTimeout(
            function() {
                recheck_login();
            }, 2000);
    }else{
        init_request({'data':{'type':SITE_TYPE,'content':URL_ID}})
    }
}
function removeCopyTxt(){
    const copied_label = $('.imp_copied_label');
    $(copied_label).html('');
    $(copied_label).hide();
}
function copydinText(text){
    const input = document.createElement('input');
	input.style.position = 'fixed';
	input.style.opacity = 0;
	input.value = text;
	document.body.appendChild(input);
	input.select();
	document.execCommand('Copy', false, null);
	document.body.removeChild(input);
    const copied_label = $('.imp_copied_label');
    $(copied_label).html(chrome.i18n.getMessage('_copy_txt'));
    $(copied_label).show();
    setTimeout(function(){ removeCopyTxt(); }, 1100);
}
function copyContect() {
	text = this.parentNode.textContent.replace(/(\.|\@)<wbr>/g, "$1");
	const input = document.createElement('input');
	input.style.position = 'fixed';
	input.style.opacity = 0;
	input.value = text;
	document.body.appendChild(input);
	input.select();
	document.execCommand('Copy', false, null);
	document.body.removeChild(input);
    const copied_label = $('.imp_copied_label');
    $(copied_label).html(chrome.i18n.getMessage('_copy_txt'));
    $(copied_label).show();
    setTimeout(function(){ removeCopyTxt(); }, 1100);
}

function show_error(ermsg){
    var imperror = $('.imp_main_error');
    imperror.html(ermsg);
    imperror.show();
}

function show_error_2(ermsg){
    $('.show_contact').after('<p class="emsg" >'+ermsg+'</p>');
    setTimeout(function(){ 
        $('.emsg').remove();
     }, 2000);
}

function parse_linfo(html){
    if(html.profile_location == 'Undefined'){
        html.profile_location = "";
    }
    var name_i = $('.imp_name');
    var avatar = $('.img_avatar');
    var specialty_i = $('.imp_specialty');
    var location_i = $('.imp_location');

    $(name_i).html(html.name);
    let initials = html.name.split(" ").map((n)=>n[0]).join(".");
    $(avatar).html(initials);
    $(specialty_i).html(html.headLine);
    $(location_i).html(html.profile_location);
    if(SITE_TYPE=="show_1" || SITE_TYPE == "2"){
        if(html.company_name!=''){
            get_c_info(html.company_name);
        }
    }        
    $('.imp_content').show();
    
}

function handleErrors(response) {
    
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

function get_linfo(){
    const pflnk = fetchNameFromLinkedIn(URL_ID);
    let profile_name = pflnk;
    
    profile_name = profile_name.split('-');
    if(profile_name.length>1){
        profile_name.splice(-1);
        profile_name = profile_name.join(' ');
    }else if(profile_name.length==1){
        profile_name = profile_name[0];
    }
    profile_name = profile_name.toLowerCase().replace(/\b[a-z]/g, function(letter) {
        return letter.toUpperCase();
    });
    let firstName = '';
    let lastName = '';
    var tn = "";
    try{
        tn = rldata['name'];
    }catch(e){}
    if(tn==undefined){
        tn = '';
    }
    if (tn!=''){
        profile_name = tn;
    }
    let res = {
        href: URL_ID,
        name: profile_name,
        company_name: '',
        headLine: '',
        linkedinUrl: 'https://www.linkedin.com/in/'+pflnk,
        urnMemeber: '',
        profile_location: '',
        profile_follower: '',
        profile_connect:'',
        is_first: '',
        firstName: firstName,
        lastName: lastName
    };
    //console.log(res);
    parse_linfo(res);
}

function get_c_info(torg){
    var encryption = new Encryption();
    var readableString = encodeURIComponent(URANDOM_CODE);
    var encrypted = encryption.encrypt(readableString, nonceValue);
    fetch(SITE+'v3/get_c_info.php', {
		method: 'post',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
            'User-Token':encrypted
		},
		body: JSON.stringify({'org':encodeURIComponent(torg)})
	}).then(async response => {
        const data = await response.json();
        if(data.status=="1"){
            if(data.data.cdata.hasOwnProperty('name')){
                if(data.data.cdata.name!=''){
                    document.getElementById('mr_e_com_name').innerHTML = data.data.cdata.name;
                    document.getElementById('mr_e_com_web').innerHTML = data.data.cdata.website;
                    document.getElementById('mr_e_com_csize').innerHTML = data.data.cdata.csize;
                    document.getElementById('mr_e_com_industry').innerHTML = data.data.cdata.industry;
                    document.getElementById('mr_e_com_founed').innerHTML = data.data.cdata.founded;
                    $('.imp_comp_main').show();
                }
            }
        }
    }).catch(() => {
        console.log('error')
    });
}

function show_contact_first(contacts,t){
    var vflag = "0";
    if(contacts['viewed'] == "1"){
        vflag = "1";
    }
    var encryption = new Encryption();
    var j = "0";
    var contactlist = $('.imp_contacts');
    $(contactlist).html('');

    for (var key in contacts) {

        var readableString = contacts[key];
        var decrypted = '';
        try{
            decrypted = encryption.decrypt(readableString, nonceValue);
        }catch(e){}
         
        if(decrypted!='')
        {
            var clname = 'tel';
            if(key=='pem'){
                clname= 'mail';               
            }
            let li = document.createElement('li');
            li.className = clname;
            li.innerHTML =decrypted.replace(/(\.|@)/g, "$1<wbr>");
            $(contactlist).append(li);
            if(vflag=="1"){
                let span = document.createElement('span');
                span.className = 'imp_copy';
                span.addEventListener("click", copyContect);
                li.insertBefore(span, li.firstChild);
            }
            j = "1";
        }

	}

    if(j=="1"){
	    $(contactlist).show();
    }else{
        if(t==2){
            $('.imp_info').html(chrome.i18n.getMessage('_no_contact_txt'));
            $('.imp_info').show();
        }
        
    }
    var showcontact = $('.show_contact');
    if(vflag=="0"){
        $(showcontact).removeClass('imp_hide_');
    }else{
        $(showcontact).addClass('imp_hide_');
    }
}

function get_crun_data(){
    show_loader();
    $.ajax({
        url: URL_ID  
    })
    .done(function(cbody) {
        var matchingElements = $(cbody).find('a');
        var uname = $(cbody).find('.profile-name').text();
        var lnkhref = '';
        matchingElements.map(function(index, element) {
            var h = $(element).attr('href');
            try{
                if(h.includes('linkedin.com/in')){
                    lnkhref =  h;
                    //break;
                }
            }catch(e){

            }
            
        });
        if(lnkhref!=''){
            CURRENT_URL = URL_ID;
            const pflnk = fetchNameFromLinkedIn(lnkhref);
            URL_ID = pflnk;
            SITE_TYPE = 'show_1';
            get_user_info(2);
        }
    })
    .fail(function(){
        show_error('Something went wrong');
        show_content();
    });
}
function get_inst_dir_data(){
    var t = URL_ID.split('/director/')
    try{
        t = t[1];
    }catch(e){
        t = '';
    }
    t = t.split('/');

    try{
        dname = t[0];
    }catch(e){}
    try{
        din = t[1];
    }catch(e){}
    dflag = "0";
    c_din = [];
    dname = dname.replace(/-/g, ' ');
    din = din.split('?')[0];
    din = din.split('/')[0];
    check_din_data();
}
function get_zaub_data(){
    var t = URL_ID.split('/director/')
    try{
        t = t[1];
    }catch(e){
        t = '';
    }
    t = t.split('/');
    try{
        dname = t[0].toLowerCase();
    }catch(e){}
    try{
        din = t[1];
    }catch(e){}
    dflag = "0";
    c_din = [];
    dname = dname.replace(/-/g, ' ');
    din = din.split('?')[0];
    din = din.split('/')[0];
    check_din_data();
}

function  get_tof_data(){
    var t = URL_ID.split('/director/')
    try{
        din = t[1];
    }catch(e){}
    t = t[0].split('in/');
    try{
        dname = t[1].toLowerCase();
    }catch(e){}
    dflag = "0";
    c_din = [];
    dname = dname.replace(/-/g, ' ');
    din = din.split('?')[0];
    din = din.split('/')[0];
    check_din_data();
}

function  get_zaub_cdata(){
    show_loader();
    c_din = [];
    cinfo = {};
    $.ajax({
        url: URL_ID  
    })
    .done(function(cbody) {
        var el1 = $(cbody).find("h4:contains('Company Details')" ).parent().children('table');

        $(el1).find('tr').each(function() {
        if ($(this).find("td").length > 0) {
            var v1 = $(this).find("td")[0].innerHTML;
            var v2 = $(this).find("td")[1].innerHTML;
            v1 = $(v1).text();
            v2 = $(v2).text();
            if(v1=='CIN' || v1=='LLP Identification Number'){
            cinfo['cin'] = v2.trim()
            }else if(v1=='Company Name'){
            cinfo['company_name'] = v2.trim()
            }else if(v1=='Date of Incorporation'){
            cinfo['inc_date'] = v2
            }else if(v1=='Activity'){
            v2 = v2.split(/\r?\n/)[0]; 
            cinfo['activity'] = v2; 
            }
        }
        })

        var el1 = $(cbody).find("h4:contains('Share Capital & Number of Employees')" ).parent().children('table')

        $(el1).find('tr').each(function() {
            if ($(this).find("td").length > 0) {
                var v1 = $(this).find("td")[0].innerHTML;
                var v2 = $(this).find("td")[1].innerHTML;
                v1 = $(v1).text();
                v2 = $(v2).text();
                if(v1=='Authorised Capital'){
                    cinfo['auth_capital'] = v2.trim();
                }else if(v1=='Paid up capital'){
                    cinfo['paid_capital'] = v2.trim();
                }
            }
        });
        var el1 = $(cbody).find("h4:contains('Contact Details')" ).parent().children('div');

        var t = $(el1).children('div').find("p:contains('Email ID')").text();
        try{
            t = t.split(':')[1];
        }catch(e){
            t = ''
        }
        cinfo['email'] = t.trim();
        var t = $(el1).children('div').find("p:contains('Website')").text();
        try{
            t = t.split(':')[1];
        }catch(e){
            t = '';
        }
        cinfo['website'] = t.trim();
        if(cinfo['website']=="Click here   to add."){
            cinfo['website']="";
        }
        var t = $(el1).children('div').find("p:contains('Address')").next().text();

        cinfo['address'] = t.trim();
        var el1 = $(cbody).find("h4:contains('Director Details')" ).parent().children('table');

        $(el1).find('tr.main-row').each(function() {
            if ($(this).find("td").length > 0) {
                var v1 = $(this).find("td")[0].innerHTML;
                var v2 = $(this).find("td")[1].innerHTML;
                v1 = $(v1).text();
                v2 = $(v2).text();
                c_din.push({'din':v1,'name':v2.trim()});
            }
        });
        parse_cinfo();
    })
    .fail(function(){
        show_error('Something went wrong');
        show_content();
    });
    
}

function  get_tof_cdata(){
    show_loader();
    c_din = [];
    cinfo = {};
    $.ajax({
        url: URL_ID  
    })
    .done(function(cbody) {
        var el1 = $(cbody).find('#register-details-table')
        $(el1).find('tr').each(function(){
        
            if ($(this).find("td").length > 0) {
                var v1 = $(this).find("td")[0].innerHTML;
                var v2 = $(this).find("td")[1].innerHTML;
                if(v1=='CIN' || v1=='LLPIN'){
                    cinfo['cin'] = v2.trim();
                }else if(v1=='Incorporation Date / Age'){
                    cinfo['inc_date'] = v2.split('/')[0].trim();
                }else if(v1=='Date of Incorporation'){
                    cinfo['inc_date'] = v2;
                }else if(v1=='Authorized Capital'){
                    cinfo['auth_capital'] = v2.trim();
                }else if(v1=='Paid up capital'){
                    cinfo['paid_capital'] = v2.trim();
                }else if(v1=='industry*'){
                    cinfo['activity'] = v2;
                }else if(v1=='Email Address'){
                    cinfo['email'] = v2;
                }else if(v1=='Website'){
                    cinfo['website'] = v2;
                }
            }
        });

        if(el1.length==0){
            var el1 = $(cbody).find("h2:contains('REGISTERED DETAILS')").parent();
            $(el1).find('.row').each(function(){
                $(this).find('.col').each(function(){
                    var v1 = $(this).find('h5').html();
                    var v2 = $(this).find('p').html();
                    if(v1=='LLPIN'){
                        cinfo['cin'] = v2;
                    }else if(v1=='INCORPORATION DATE / AGE'){
                        cinfo['inc_date'] = v2.split('/')[0].trim()
                    }else if(v1=='Date of Incorporation'){
                        cinfo['inc_date'] = v2;
                    }else if(v1=='Capital Contribution'){
                        cinfo['auth_capital'] = v2;
                    }else if(v1=='Paid up capital'){
                        cinfo['paid_capital'] = v2;
                    }else if(v1=='INDUSTRY*'){
                        cinfo['activity'] = v2;
                    }else if(v1.includes('EMAIL ADDRESS')){
                        if(v2.includes('Login for email')){
                            v2 = '';
                        }
                        cinfo['email'] = v2;
                    }else if(v1=='Website'){
                        cinfo['website'] = v2;
                    }else if(v1=='Registered Address'){
                        v2 = v2.replace(/(\r\n|\n|\r)/gm, "");
                        v2 = v2.trim();
                        v2 = '<p>'+v2+'</p>';
                        v2 = v2.replace(/<br\s*\/?>/gi,'; ');
                        v2 = v2.trim();
                        cinfo['address'] = $('<p>'+v2+'</p>').text();
                    }
                })
                
            })
        }
        var el1 = $(cbody).find('.page-headers h1').text().trim();
        cinfo['company_name'] = el1;
        var el1 = $(cbody).find('#director_overview_table');
        $(el1).find('tr').each(function() {
            if ($(this).find("td.card-subtitle").length > 0) {
                var v1 = '';var v2='';
                //console.log($(this).find('a').contains('director'));
                try{
                    v1 = $(this).find('a').attr('href');
                }catch(e){
                    v1='';
                }
                if(v1){
                    if(v1.includes('/director/')){
                        var tlp = v1;
                        v1 = v1.split('/').pop();
                        tlp = tlp.split('/');
                        try{
                            v2 = tlp[1];
                        }catch(e){
                            v2 = '';
                        }
                        v2 = v2.replace(/-/g, ' ');
                        if(v1!=''&&v2!=''){
                            c_din.push({'din':v1,'name':v2.trim()});
                        }
                    }
                }                
            }
        });
        
        if(el1.length==0){
            var el1 = $(cbody).find("h2:contains('Partners')").parent().children('table');
            $(el1).find('tr').each(function() {
                if ($(this).find("td").length > 0) {
                    var v1 = $(this).find("td")[0].innerHTML;
                    v1 = $(v1).attr('href');
                    v1 =  v1.split('/').pop();
                    var v2 = $(this).find("td")[0].innerHTML;
                    v2 = $(v2).text();
                    c_din.push({'din':v1,'name':v2.trim()});
                }
            });
        }
        parse_cinfo();
            
    })
    .fail(function(){
        show_error('Something went wrong');
        show_content();
    });
}
function get_insta_c(cmp){

    $.ajax({
        url: "https://www.instafinancials.com/company/master-index.aspx/PopulateCompanyData",
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        cache:false,
        data: JSON.stringify({ "CompanyID": cmp,"InstaUserID":"0" })
      })
      .done(function(data) {

        var ht = [];
        var ct = {};
        try{
            ht = data['d'][13];
        }catch(e){

        }
        try{
            ct = data['d'][0];
        }catch(e){

        }
        try{
            cinfo['company_name'] = ct['CompanyName'];
        }catch(e){}
            
        try{
            cinfo['cin'] = ct['CompanyCIN'];
        }catch(e){}
        try{
            cinfo['paid_capital'] = ct['PaidUpCapital'];
        }catch(e){}
        try{
            cinfo['auth_capital'] = ct['AuthorizedCapital'];
        }catch(e){}
        try{
            cinfo['inc_date'] = ct['DateOfIncorporation'];
        }catch(e){cinfo['inc_date'] ='';}
        try{
            cinfo['email'] = ct['EMailID'];
        }catch(e){}
        try{
            cinfo['activity'] = ct['CompanyName'];
        }catch(e){}
        try{
            cinfo['website'] = ct['CompanySite'];
        }catch(e){
            cinfo['website'] = '';
        }
        try{
            cinfo['address'] = ct['Address'];
        }catch(e){}
        if(cinfo['website']=='Not Available'){
            cinfo['website'] = '';
        }
        if(cinfo['inc_date'] !=''){
           
            var thenum = cinfo['inc_date'].replace( /^\D+/g, ''); 
            thenum = thenum.replace('(','');
            thenum = thenum.replace('/','');
            thenum = thenum.replace(')','');
            thenum = thenum.trim();
            var thj = parseInt(thenum);
            var d = new Date(thj);
            var dateString = (d.getDate())+'-'+(d.getMonth()+1)+'-'+(d.getFullYear());
            cinfo['inc_date'] = dateString;
        }
        var parser = new DOMParser();
        var doc = parser.parseFromString(ht, "text/html");
        var paragraphs = doc.querySelectorAll('.dirbox-title');

        for(i = 0;i<paragraphs.length;i++){
            
            var j = paragraphs[i].querySelector('a').href;
            j = j.replace('https://www.instafinancials.com/director/','');
            j = j.split('/');
            var v1 = j[0];
            v1 = v1.replace(/-/g, ' ');
            var v2 = j[1];
            c_din.push({'din':v2.trim(),'name':v1.trim()});
        }
        parse_cinfo();
      })
      .fail(function(){
        show_error('Unable to get information. Please refresh the page and try again.');
        show_content();
      });
}
function get_inst_cdata(){
    show_loader();
    c_din = [];
    cinfo = {};
    $.ajax({
        url: URL_ID  
    })
    .done(function(cbody) {
        var cmp = $(cbody).find('#companyContentHolder_hdnCID').val();
        get_insta_c(cmp);
    })
    .fail(function(){
        show_error('Something went wrong');
        show_content();
    });
}
function get_people_from_web(tmphostname){
    show_loader();
    let encryption = new Encryption();
    var readableString = encodeURIComponent(URANDOM_CODE);
    var encrypted = encryption.encrypt(readableString, nonceValue);
    $('#gbackpeople').hide();
    $.ajax({
    url: SITE+"v3/p_get_people.php",
        beforeSend: function( xhr ) {
            xhr.setRequestHeader( "User-Token",encrypted );
        },
        cache:false,
        method: "POST",
        data:"uinfo="+Math.random()+'&tmphostname='+encodeURIComponent(tmphostname)+'&url='+encodeURIComponent(URL_ID)

    })
    .done(function(data) {
        data = JSON.parse(data);
        if(data.status=="0"){
            $('#mr_e_middle_content').html("<p class='t-20 t-black t-normal invalidpage'>"+data.message+"</p>"); 
        }else{
            dflag = '1';
            var w_people = data.pdata;
            if(w_people.length==0){
                $('#mr_e_middle_content').html("<h3 class='t-20 t-black t-normal' style='margin-top:3em;'>Sorry we could not find any users for this website.</h3>")
            }else{
            
                var uleft = data.uleft;
                $('.imp_credit').html(chrome.i18n.getMessage('_credits')+' : <span id="mre_cleft">'+uleft+'</span>');
                var ht1 = '<div class="media-body" style="display:inline-block;width:100%;margin-top:-1em;">\
                            <h3 style="text-align:center;width:100%;" id="peopleCount">List of People ('+w_people.length+' found) in '+tmphostname+'</h3>';
                ht1 =  ht1+'<input class="form-control" id="myInput" type="text" style="width: 96%;margin-bottom: 5px;padding: 5px;" placeholder="Search by name or designation"/><div id="myDiv">';

                for(var q=0;q<w_people.length;q++){
                    ht1 = ht1+ '<div class="d_list_info ulist_info"> <label style="text-transform: capitalize;min-width: 72%;display: inline-table;max-width: 72%;overflow-wrap: break-word;">'+w_people[q]['firstName'].toLowerCase()+' '+w_people[q]['lastName'].toLowerCase()+'<br/><small>'+w_people[q]['designation']+'</small></label> <span>&nbsp;&nbsp;<a class="hpaybtn view_wpeople" data-attr="'+w_people[q]['url']+'" data-code="'+w_people[q]['token']+'" style="vertical-align:-webkit-baseline-middle">View</a></span></div>';
                }
                var ht1 = ht1+ '</div></div></div>';
                $('#mr_e_middle_content').html(ht1);
            }
        }
        $('#mr_e_middle_content').show();
        $('.imp_content').show();
        $('.imp_profile').hide();
        show_content();

    })
    .fail(function(){
        show_error_2('Unable to get information. Please refresh the page and try again.');
        show_content();
    });
}
function parse_cinfo(){
    //console.log(c_din);
    show_loader();
    var encryption = new Encryption();
    var readableString = encodeURIComponent(URANDOM_CODE);
    var encrypted = encryption.encrypt(readableString, nonceValue);
    $.ajax({
        url: SITE+"v3/p_get_din_viewed_status.php",
          beforeSend: function( xhr ) {
              xhr.setRequestHeader( "User-Token",encrypted );
          },
          cache:false,
          method: "POST",
          data:"dins="+encodeURIComponent(JSON.stringify(c_din))
    }).done(function(data) {
        data = JSON.parse(data)
        var ht1 = '<div class="media" style="display:inline-block;width:100%;">\
            <div class="media-body" style="display:inline-block;width:100%">\
            <p style="text-align:left;color:#333;font-size:20px;margin-top:2px;">'+cinfo['company_name']+'</p>\
            </div>\
            <div class="media-body" style="display:inline-block;width:100%"><hr/>\
            <h3 style="text-align:left;width:100%;color:grey">List of Directors</h3>';
        if(data.hasOwnProperty('data')){
            for(var q=0;q<data.data.length;q++){
                var decrypted = '';
                var dvied = '0';
                try{
                    dvied = data['data'][q]['viewed_flag'];
                }catch(e){}
                var readableString = data['data'][q]['ph1'];
                try{
                    decrypted = encryption.decrypt(readableString, nonceValue);
                }catch(e){}
                ht1 = ht1+ '<div class="d_list_info"> <label style="text-transform: capitalize;min-width: 72%;display: inline-table;max-width: 72%;overflow-wrap: break-word;">'+data['data'][q]['name'].toLowerCase()+'<br/>'+decrypted+'</label> <span>&nbsp;&nbsp;';
                if(dvied=="1"){
                    ht1 = ht1+ '<a class="hpaybtn vdirectorcpy" data-attr="'+decrypted+'" style="vertical-align:-webkit-baseline-middle;float: right;background: no-repeat;border: none;margin-left: 0;margin-right: 33px"><span class="imp_copy" style="border:none;position:inherit;margin-left:0px;"></span></a>';
                }else{
                    ht1 = ht1+ '<a class="hpaybtn vdirector" data-attr="'+q+'" style="vertical-align:-webkit-baseline-middle">View</a>';
                }
                    
                ht1 = ht1+ '</span></div>';
            }
        }
        
        var ht1 = ht1+ '</div></div>';
        $('#mr_e_middle_content').html(ht1);
        $('#mr_e_middle_content').show();
        $('.imp_content').show();
        $('.imp_profile').hide();
        show_content();
    })
    .fail(function(){
        show_error('Unable to get information. Please refresh the page and try again.');
        show_content();
    });;
    
}
function check_din_data(){
    show_loader();
    var encryption = new Encryption();
    var readableString = encodeURIComponent(URANDOM_CODE);
    var encrypted = encryption.encrypt(readableString, nonceValue);
    $.ajax({
        url: SITE+"v3/p_get_cpeople.php",
          beforeSend: function( xhr ) {
              xhr.setRequestHeader( "User-Token",encrypted );
          },
          cache:false,
          method: "POST",
          data:"dname="+encodeURIComponent(dname)+'&din='+encodeURIComponent(din)
    })
    .done(function(data) {
        data = JSON.parse(data)
        if(data.status=="0"){
            $('#mr_e_middle_content').html("<p class='t-20 t-black t-normal invalidpage'>"+data.message+"</p>");       
        }else{
            if(dflag == "1"){
                $('#gbacktrv').show();
            }else{
                $('#gbacktrv').hide();
            }
            
            $('.imp_credit').html(chrome.i18n.getMessage('_credits')+' : <span id="mre_cleft">'+data.left+'</span>');
            $('.imp_info').html('<p>'+data.user_notification+'</p>');
            
            let res = {
                href: URL_ID,
                name: titleCase(dname),
                company_name: cinfo['company_name'],
                headLine: '',
                linkedinUrl: '',
                urnMemeber: '',
                profile_location: '',
                profile_follower: '',
                profile_connect: '',
                is_first: '',
                firstName: '',
                lastName: ''
            };
            parse_linfo(res);
            $('#mr_e_middle_content').html('');
            show_contact_first(data.contactInfo,1);
            $('.imp_profile').show();
            $('.imp_info').show();
        }
        $('.imp_content').show();
        $('#mr_e_middle_content').show();
        show_content();
    })
    .fail(function(){
        show_error('Unable to get information. Please refresh the page and try again.');
        show_content();
    });
}
function getnotification(){
    var encryption = new Encryption();
    var readableString = encodeURIComponent(URANDOM_CODE);
    var encrypted = encryption.encrypt(readableString, nonceValue);
    
    $.ajax({
        url: SITE+"v2/get_notification.php",
          beforeSend: function( xhr ) {
              xhr.setRequestHeader( "User-Token",encrypted );
          },
          cache:false,
          method: "POST",
          data:"code="+Math.random()
      })
      .done(function(data) {
          //console.log(data);
        data = JSON.parse(data);
        //console.log(data);
        if(data.status=="0"){
            
        }else{
            if(data.message){
                $('#Unotify').html('<div class="blink_me">'+data.message+'</div>');
                $('#Unotify').show();
            }
        }
      })
      .fail(function(){
       
      });
}

function get_user_info(z){
    $('.show_verification_link').addClass('imp_hide_');
    var encryption = new Encryption();
    var readableString = encodeURIComponent(URANDOM_CODE);
    var encrypted = encryption.encrypt(readableString, nonceValue);
    if(SITE_TYPE=='show_1')
        URL_ID = fetchNameFromLinkedIn(URL_ID);
    CFLAG = 0;
    RFLAG = 0;
    RCODE= '';
    dflag = '0';
    if(z==1){
        dflag = '1';
        $('#gbackpeople').show();
    }else{
        CURRENT_URL = '';
        $('#gbackpeople').hide();
    }    
    $('#gbacktrv').hide();
    $('footer').hide();
    $('.imp_comp_main').hide();
    $('.imp_info').html('');
    $('.imp_info').show();
    $('.imp_comp_main').hide();
    $('.imp_contacts').hide();
    $('.show_contact').text(chrome.i18n.getMessage('_showcontact'));
    $('.show_contact').removeClass('loading');
    $('.imp_main_error').hide();
    show_loader();
    const ms = Date.now();
    fetch(SITE+'v3/get_info.php?code='+ms, {
		method: 'post',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'User-Token':encrypted
		},
		body: JSON.stringify({
			"url": encodeURIComponent(URL_ID),
			"date": new Date(),
			"userAgent": window.navigator.userAgent,
			"EXT_version": chrome.runtime.getManifest().version,
            "SITE_TYPE": SITE_TYPE
		})
	})
    .then(handleErrors)
    .then(async response => {
        
        const data = await response.json();
        // check for error response
        //console.log(response);
        if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
        }
        //console.log(data);
        if(data.status=='0'){
            show_content();
            show_error(data.message);
            $('.imp_content').hide();
        }else{
            $('footer').show();
            $('.imp_credit').html(chrome.i18n.getMessage('_credits')+' : <span id="mre_cleft">'+data.data.left+'</span>');
            var notification_i = $('.imp_notify');
            if(data.data.user_notification==''){
                $(notification_i).hide();
            }else{
                $(notification_i).html(data.data.user_notification);
                $(notification_i).show();
            }
            
            
            var z3 = data.data.uname;
            var z1 = "";
            var z2 = "";
            try{
                z1 = data.data.uemail;
            }catch(e){}
            try{
                z2 = data.data.pemail;
            }catch(e){}
            if(z1!=''){
                $('#uemail').html('Login id ('+z1+')');
            }else{
                $('#uemail').html('');
            }
            if(z2!=''){
               $('#pemail').html('<br/>Team of ('+z2+')');
            }else{
                $('#pemail').html('');
            }
            var show_report = "";
            try{
                show_report = data.data.show_report;
            }catch(e){}
            try{
                RCODE = data.data.view_code;
            }catch(e){
                RCODE = '';
                show_report='';
            }
            $('#uname').html(z3);
            $('#Uinfo').show();
            if(SITE_TYPE=='show_1'){
                $('#mr_e_middle_content').html('');
                $('.imp_profile').show();
                show_contact_first(data.data.contactInfo,1);
                
                if(data.data.get_info=="1"){     
                    get_linfo();
                }else{
                    let res = {
                        href: LNK_URL,
                        name: data.data.uinfo['name'],
                        company_name: data.data.uinfo['org'],
                        headLine: data.data.uinfo['designation'],
                        linkedinUrl: LNK_URL,
                        urnMemeber: '',
                        profile_location: data.data.uinfo['loc'],
                        profile_follower: '',
                        profile_connect: '',
                        is_first: '',
                        firstName: '',
                        lastName: ''
                    };
                    parse_linfo(res);
                }
                show_content(); 
            }else if(SITE_TYPE == 'show_3' || SITE_TYPE =='show_2' || SITE_TYPE == 'show_5'){
                $('.imp_profile').hide();
                if(URL_ID.includes('crunchbase.com/person/')){
                    get_crun_data();
                }else if(URL_ID.includes('instafinancials.com/director/')){
                    get_inst_dir_data();
                }else if(URL_ID.includes('zaubacorp.com/director/')){
                    get_zaub_data();
                }else if(URL_ID.includes('tofler.in') && URL_ID.includes('/director')){
                    get_tof_data();
                }else if(URL_ID.includes('zaubacorp.com/company/')){
                    get_zaub_cdata();
                }else if(URL_ID.includes('tofler.in')&&URL_ID.includes('company/')){
                    get_tof_cdata();
                }else if(URL_ID.includes('instafinancials.com/company')){
                    get_inst_cdata();
                }else if(SITE_TYPE=='show_5'){
                    var tmpurl  = document.createElement ('a');   tmpurl.href   =URL_ID;
                    tmphostname = tmpurl.hostname;
                    if(tmphostname.includes('instafinancials.com')||tmphostname.includes('tofler.in')||tmphostname.includes('zaubacorp.com') || tmphostname.includes('linkedin.com') || tmphostname.includes('crunchbase.com'))
                    {
                        show_visit_profile_message();
                    }else{
                        get_people_from_web(tmphostname);
                    }
                }
            }  
            getnotification();  
            if(SITE_TYPE=='show_1'){
                if(show_report=="1"){
                    $('.report_contact').css('display',"table");
                }else{
                    $('.report_contact').hide();
                }
            }
        }
    }).catch(() => {
        show_error('Unable to get information. Please refresh the page and try again.');
        show_content();
    });
}
function show_free_credit_page_message(){
    show_content();
    $('.imp_free_credit_page_msg').show();
    $('.imp_profile_visit_msg').hide();
    $('.imp_content').hide();
    $('.imp_comp_main').hide();
}

function init_request(request){
    
    //console.log(request);
    SITE_TYPE = request.data.type;
    URL_ID = request.data.content;
    OURL = URL_ID;    
    if(OLD_TYPE!=SITE_TYPE){
        OURL = "";
    }
    OLD_TYPE = SITE_TYPE;
    //console.log(OURL);
    if(OURL.includes('chrome-extension:')){
        if(LAST_URL='')
            return false;
        else
            URL_ID = LAST_URL;
    }

    //console.log(OURL+' '+SITE_TYPE);
    if(OURL.includes('linkedin.com/in')&&SITE_TYPE==''){
        SITE_TYPE = "show_1";
    }
    //console.log(LAST_URL+' '+OURL);
    
    if(LAST_URL==OURL && SITE_TYPE!='show_4' && SITE_TYPE!='show_1' &&LAST_URL.includes('linkedin.com/')){
        return false;
    }else{
        if(!OURL.includes('chrome-extension:'))
            LAST_URL = OURL;
    }
    get_token();
    if(URANDOM_CODE == ''){
        show_login_message();
    }else{
        if(SITE_TYPE=='show_4'){
            const tabStorageUrl = new URL(URL_ID);
            const tabStorageDomain = $(tabStorageUrl).attr('hostname');
            if(tabStorageDomain.includes('linkedin.com')){
                $('.frefresh').hide();
                $('#fsite').html('');
            }else{
                $('#fsite').html(tabStorageDomain);
                $('.frefresh').show();
            }
            
        }else{
            $('.frefresh').hide();
            $('#fsite').html('');
        }
        $('.imp_login_section').hide();
        /*
        if(request.data.type=='show_loading'){
            if(URL_ID.includes('zaubacorp.com/director/')){
                SITE_TYPE='show_2';
            }else if(URL_ID.includes('tofler.in') && URL_ID.includes('/director')){
                SITE_TYPE='show_2';
            }else if(URL_ID.includes('instafinancials.com/director')){
                SITE_TYPE='show_3';
            }else if(URL_ID.includes('zaubacorp.com/company/')){
                SITE_TYPE='show_3';
            }else if(URL_ID.includes('tofler.in')&&URL_ID.includes('company/')){
                SITE_TYPE='show_3';
            }else if(URL_ID.includes('instafinancials.com/company')){
                SITE_TYPE='show_3';
            }else if(URL_ID.includes('crunchbase.com/person') ||URL_ID.includes('crunchbase.com/organization')  ){
                SITE_TYPE='show_2';
            }
        }
        */
       console.log(SITE_TYPE);
        if(SITE_TYPE=='show_loading'){
            show_loader();
        }else if(SITE_TYPE=='dontshow'){
            show_visit_profile_message();
            
        }else{
            if(URL_ID.includes('view-source:')){
                show_visit_profile_message();
            }else if(SITE_TYPE == 'show_4' && URL_ID.includes('linkedin.com/in/')){
                
                SITE_TYPE = "show_1";
                show_lnk_info();
            }else if(SITE_TYPE == 'show_4' && URL_ID.includes('linkedin.com')){
                show_visit_profile_message();
            }else if(SITE_TYPE == 'show_4' && (URL_ID.includes('chrome://') || URL_ID.includes('chrome-extension')) ){
                show_visit_profile_message();
            }else if(SITE_TYPE == 'show_1' || SITE_TYPE == 'show_3' || SITE_TYPE == 'show_2' || SITE_TYPE == 'show_5'){
                show_lnk_info();
            }else{
                if(SITE_TYPE!='dontshow'&&SITE_TYPE!='msgfree'){
                    show_content();
                }else if(SITE_TYPE=='msgfree'){
                    show_free_credit_page_message();
                }else{
                    show_visit_profile_message();
                }
            }
        }
    }
}
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        rldata = {};
        if(request.hasOwnProperty('data')){
            if(request.data.hasOwnProperty('rldata')){
                rldata = request.data.rldata;
            }
        }
        if (request.msg === "popup_loaded") {
            //  To do something
            //console.log('here');
            init_request(request);
        }
    }
);
function get_lnk_contact(){    
    $('.imp_info').html('');
    $('.imp_info').show();
    $('.reprt_message').hide();
    var url = 'https://www.linkedin.com/in/'+URL_ID;
    var lnkhref = URL_ID;
    var encryption = new Encryption();
    var readableString = encodeURIComponent(URANDOM_CODE);
    var encrypted = encryption.encrypt(readableString, nonceValue);
    var trldata = JSON.stringify(rldata);
    $.ajax({
        url: SITE+"v3/get_lnk_ndata.php",
          beforeSend: function( xhr ) {
              xhr.setRequestHeader( "User-Token",encrypted );
          },
          cache:false,
          method: "POST",
          data:"url="+encodeURIComponent(url)+'&l='+encodeURIComponent(lnkhref)+'&trldata='+encodeURIComponent(trldata)
  
      })
      .done(function(data) {
         
        data = JSON.parse(data);
        if(data.status=="0"){
            show_error_2(data.message);
            left_flag = "0";
            try{
                left_flag = data.left_flag;
            }catch(e){

            }
            if(left_flag=="1"){
                open_no_credit_page();
            }
        }else{
            uleft = data.left;
            $('.imp_credit').html(chrome.i18n.getMessage('_credits')+' : <span id="mre_cleft">'+uleft+'</span>');
            show_contact_first(data.contactInfo,2);
            var show_report = "";
            try{
                show_report = data.show_report;
            }catch(e){}
            try{
                RCODE = data.view_code;
            }catch(e){
                RCODE = '';
                show_report='';
            }
            RFLAG = 0;
            $('.report_contact').removeClass('loading');
            if(show_report=="1"){
                $('.report_contact').css('display',"table");
            }else{
                $('.report_contact').hide();
            }
            //console.log(show_report);
        }
        if(data.n_verify=="2"){
            $('.show_verification_link').removeClass('imp_hide_');
            window.open('https://dashboard.easyleadz.com/verifyaccount','_blank');
        }
        CFLAG = 0;
        $('.show_contact').text('Click to get contact');
        $('.show_contact').removeClass('loading');
      })
      .fail(function(){
        show_error_2('Something went wrong. Please try again');
        CFLAG = 0;
        $('.show_contact').text('Click to get contact');
        $('.show_contact').removeClass('loading');
      });
}
function get_din_contact(){
    let encryption = new Encryption();
    var readableString = encodeURIComponent(URANDOM_CODE);
    var encrypted = encryption.encrypt(readableString, nonceValue);
    var em = '';
    $.ajax({
      url: SITE+"v3/p_get_din_data.php",
        beforeSend: function( xhr ) {
            xhr.setRequestHeader( "User-Token",encrypted );
        },
        cache:false,
        method: "POST",
        data:"dname="+encodeURIComponent(dname)+'&din='+encodeURIComponent(din)+'&url='+encodeURIComponent(URL_ID)
    })
    .done(function(data) {
      
      if(data!=''){
        var data1 = {};
        try{
          data1 = JSON.parse(data)
        }catch(e){
          data1 = data
        }
        data = data1;
        if(data.status=="0"){
            show_error_2(data.message);
        }else{
          uleft = data.left;

          $('.imp_credit').html(chrome.i18n.getMessage('_credits')+' : <span id="mre_cleft">'+uleft+'</span>');
          show_contact_first(data.contactInfo,2);
          CFLAG = 0;
          $('.show_contact').text(chrome.i18n.getMessage('_showcontact'));
          $('.show_contact').removeClass('loading');  
        }
        
      }else{
        show_error_2("Sorry we are unable to find contact information of this person. Our team will add this number soon and you will be notified over email & whatsapp.");
        CFLAG = 0;
        $('.show_contact').text(chrome.i18n.getMessage('_showcontact'));
        $('.show_contact').removeClass('loading');
      }
    })
    .fail(function(xhr) {
        show_error_2('Something went wrong. Please try again');
        CFLAG = 0;
        $('.show_contact').text(chrome.i18n.getMessage('_showcontact'));
        $('.show_contact').removeClass('loading');
    });
}
function get_web_person(un,thlnk){
    CURRENT_URL = URL_ID;
    let encryption = new Encryption();
    const pflnk = fetchNameFromLinkedIn(thlnk);
    URL_ID = pflnk;
    SITE_TYPE = 'show_1';
    get_user_info(1);
}
function report_data(){
    $('.reprt_message').hide();
    var lnkhref = 'https://www.linkedin.com/in/'+URL_ID;
    var encryption = new Encryption();
    var readableString = encodeURIComponent(URANDOM_CODE);
    var encrypted = encryption.encrypt(readableString, nonceValue);
    var q =  JSON.stringify({'l':encodeURIComponent(lnkhref),'rcode':RCODE});

    $.ajax({
        url: SITE+"v3/report_num.php",
          beforeSend: function( xhr ) {
              xhr.setRequestHeader( "User-Token",encrypted );
          },
          cache:false,
          method: "POST",
          data:q
  
      })
      .done(function(data) {
         
        //data = JSON.parse(data);
        if(data.status=="0"){
            show_error_2(data.message);
        }else{
            $('.report_contact').hide();
            $('.reprt_message').show();
            setTimeout(function(){ 
                $('.reprt_message').hide();
             }, 2000);
        }
       
        RFLAG = 0;
        show_report ='';
        $('.report_contact').removeClass('loading');
      })
      .fail(function(){
        show_error_2('Something went wrong. Please try again');
        RFLAG = 0;
        $('.report_contact').removeClass('loading');
      });
}

function openNav(){
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("mrepover").style.marginLeft = "-250px";
}
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
   document.getElementById("mrepover").style.marginLeft = "0";
}
$( document ).ready(function() {
    $('.plogin').on('click',function(){
        if(URL_ID==''){
            URL_ID = 'https://www.linkedin.com/in/nitinbajaj1';
        }
        chrome.runtime.sendMessage({action:"refresh",data:URL_ID});
    });
    $('.imp_btn').on('click',function(){
        if(CFLAG==0){
            if(CURRENT_URL==''){
                CURRENT_URL = URL_ID;
            }
            var showcontact = $('.show_contact');
            $(showcontact).css({'opacity':"1"});
            $(showcontact).text(chrome.i18n.getMessage('_showcontact_loading'));
            $(showcontact).addClass('loading');
            CFLAG = 1;
            if(SITE_TYPE=='show_1'){
                get_lnk_contact();
            }else if(SITE_TYPE == 'show_3'){
                get_din_contact();
            }else if(SITE_TYPE == 'show_2'){
                get_din_contact();
            }
        }
    });
    $('#ulogout').on('click',function(){
        chrome.storage.local.clear(function() {
            var error = chrome.runtime.lastError;
            if (error) {
            }
            // do something more
        });
        chrome.storage.sync.clear(); 
        URANDOM_CODE = '';
        $('footer').hide();
        show_loader();
        init_request({data:{type:SITE_TYPE,content:OURL}});
    })

    $(document).on('click', '.vdirector' , function() {
        var un = $(this).attr('data-attr');
        dname = c_din[un]['name'];
        din = c_din[un]['din'];
        dflag = "1";
        check_din_data();
   });
   $(document).on('click','.view_wpeople',function(){
    var un = $(this).attr('data-code');
    var tlnkhref = $(this).attr('data-attr');
    get_web_person(un,tlnkhref);
   });
   $(document).on('click','.vdirectorcpy',function(){
    var un = $(this).attr('data-attr');
    copydinText(un);
    
   });
   $('#gbacktrv').on('click',function(){
    parse_cinfo();
   });

   $('#gbackpeople').on('click',function(){
        URL_ID = CURRENT_URL;
        SITE_TYPE = 'show_5';
        get_user_info(0);
   });
   $(document).on( 'keyup', '#myInput', function(){
        var value = $(this).val().toLowerCase();
        var tc = 0;
        $('#mr_e_middle_content').children('div').children('div#myDiv').children('div').filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
            if($(this).text().toLowerCase().indexOf(value) > -1){
            tc = tc + 1;
            }
        });
        $('#mr_e_middle_content').children('div').children('#peopleCount').html('List of People ('+tc+' found)');
    });
    $('.fricon').on('click',function(){
        init_request({data:{type:'show_5',content:URL_ID}});
        return false;
    });

    $('.report_contact').on('click',function(){
        if(RFLAG==0){
            $(this).addClass('loading');
            RFLAG = 1;
            report_data();
        }
        
    
    });
    $('#opnv').on('click',function(){
        openNav();
        return false;
    });
    $('.closebtn').on('click',function(){
        closeNav();
        return false;
    });
    //alert(3);
    if(SITE_TYPE==''&&LNK_URL==''){
        //init_request({'data':{'type':'show_d','content':'https://www.linkedin.com/in/nitinbajaj1/'}});
        //init_request({'data':{'type':'show_d','content':'https://www.linkedin.com/in/nitinbajaj1/'}});
        //show_visit_profile_message();
        if(URANDOM_CODE==''){
            show_login_message();
        }
    }
});