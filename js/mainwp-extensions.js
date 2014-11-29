jQuery(document).on('click', '#mainwp-extensions-expand', function ()
{
    jQuery(this).addClass('mainwp_action_down');
    jQuery('#mainwp-extensions-collapse').removeClass('mainwp_action_down');
    var extensionImgs = jQuery('.mainwp-extensions-img');
    extensionImgs.addClass('large');
    extensionImgs.removeClass('small');
    jQuery('.mainwp-extensions-extra').show();
    jQuery('.mainwp-extensions-childHolder').removeClass('collapsed');
    mainwp_setCookie('mwp_ext_collapsed', '');
    return false;
});

jQuery(document).on('click', '#mainwp-extensions-collapse', function ()
{
    jQuery(this).addClass('mainwp_action_down');
    jQuery('#mainwp-extensions-expand').removeClass('mainwp_action_down');
    var extensionImgs = jQuery('.mainwp-extensions-img');
    extensionImgs.removeClass('large');
    extensionImgs.addClass('small');
    jQuery('.mainwp-extensions-extra').hide();
    jQuery('.mainwp-extensions-childHolder').addClass('collapsed');
    mainwp_setCookie('mwp_ext_collapsed', 'yes');
    return false;
});

jQuery(document).ready(function () {
    if (mainwp_getCookie('mwp_ext_collapsed') == 'yes')  
        jQuery('#mainwp-extensions-collapse').click();
    else
        jQuery('#mainwp-extensions-expand').click();
})

jQuery(document).on('click', '.mainwp-extensions-enable-all', function ()
{
    var extensionHolders = jQuery('.mainwp-extensions-childHolder');

    var allExtensionSlugs = [];
    for (var i = 0; i < extensionHolders.length; i++)
    {
        var extensionEnableButton = jQuery(extensionHolders[i]).find('.mainwp-extensions-enable');
        if (extensionEnableButton && extensionEnableButton.is(":disabled")) continue;

        allExtensionSlugs.push(jQuery(extensionHolders[i]).attr('extension_slug'));
    }
    var data = {
        action:'mainwp_extension_enable_all',
        slugs:allExtensionSlugs
    };

    jQuery.post(ajaxurl, data, function (response)
    {
        if (response.result == 'SUCCESS') location.reload();
    }, 'json');

    return false;
});

jQuery(document).on('click', '.mainwp-extensions-disable-all', function ()
{
    var data = {
        action:'mainwp_extension_disable_all'
    };

    jQuery.post(ajaxurl, data, function (response)
    {
        if (response.result == 'SUCCESS') location.reload();
    }, 'json');

    return false;
});

jQuery(document).on('click', '.mainwp-extensions-enable', function ()
{
    var extensionSlug = jQuery(this).parents('.mainwp-extensions-childHolder').attr('extension_slug');
    var data = {
        action:'mainwp_extension_enable',
        slug:extensionSlug
    };

    jQuery.post(ajaxurl, data, function (response)
    {
        if (response.result == 'SUCCESS') location.reload();
        else if (response.error)
        {
            alert(response.error);
        }
    }, 'json');

    return false;
});

jQuery(document).on('click', '.mainwp-extensions-disable', function ()
{
    var extensionSlug = jQuery(this).parents('.mainwp-extensions-childHolder').attr('extension_slug');
    var data = {
        action:'mainwp_extension_disable',
        slug:extensionSlug
    };

    jQuery.post(ajaxurl, data, function (response)
    {
        if (response.result == 'SUCCESS') location.reload();
    }, 'json');

    return false;
});

jQuery(document).on('click', '.mainwp-extensions-activate', function ()
{    
    var api_row = jQuery(this).closest("tr.mainwp-extensions-api-row");
    var statusEl = api_row.find(".activate-api-status");
    
    var extensionSlug = jQuery(this).parents('.mainwp-extensions-childHolder').attr('extension_slug');
    var data = {
        action:'mainwp_extension_activate',
        slug:extensionSlug,
        key: api_row.find('input.api_key:text').val(),
        email: api_row.find('input.api_email:text').val()
    };
   
    var loadingEl = api_row.find(".mainwp_loading");
    statusEl.hide();
    loadingEl.show();
    
    if (jQuery(this).attr('license-status') == 'activated') {
        loadingEl.hide();
        statusEl.css('color', '#0074a2');
        statusEl.html(__("Extension activated already.")).fadeIn();       
        return;
    } 
        
    jQuery.post(ajaxurl, data, function (response)
    {
        loadingEl.hide();
        if (response) {
            if (response.result == 'SUCCESS') {
                statusEl.css('color', '#0074a2');
                statusEl.html(__("Extension successfully activated.")).fadeIn(); 
            } else if (response.error) {
                statusEl.css('color', 'red');
                statusEl.html(response.error).fadeIn(); 
            } else {
                statusEl.css('color', 'red');
                statusEl.html("Undefined error.").fadeIn(); 
            }    
        } else {
            statusEl.css('color', 'red');
            statusEl.html("Undefined error.").fadeIn(); 
        }
        
        setTimeout(function ()
        {
          location.href = 'admin.php?page=Extensions';        
        }, 1000);   
        
    }, 'json');

    return false;
});


jQuery(document).on('click', '.mainwp-extensions-deactivate', function ()
{    
    var api_row = jQuery(this).closest("tr.mainwp-extensions-api-row");
    var statusEl = api_row.find(".activate-api-status");
    
    if (!api_row.find('.mainwp-extensions-deactivate-chkbox').is(':checked')) 
        return false;
    
    var extensionSlug = jQuery(this).parents('.mainwp-extensions-childHolder').attr('extension_slug');
    var data = {
        action:'mainwp_extension_deactivate',
        slug:extensionSlug    
    };
   
    var loadingEl = api_row.find(".mainwp_loading");
    statusEl.hide();
    loadingEl.show();
    jQuery.post(ajaxurl, data, function (response)
    {
        loadingEl.hide();
        if (response) {
            if (response.result == 'SUCCESS') {
                statusEl.css('color', '#0074a2');
                var msg = __('Extension deactivated.');
//                if (response.activations_remaining)
//                    msg += ' ' + response.activations_remaining;
                statusEl.html(msg).fadeIn();              
            } else if (response.error) {
                statusEl.css('color', 'red');
                statusEl.html(response.error).fadeIn(); 
            } else {
                statusEl.css('color', 'red');
                statusEl.html("Undefined error.").fadeIn(); 
            }        
        } else {
            statusEl.css('color', 'red');
            statusEl.html("Undefined error.").fadeIn(); 
        }
        
        setTimeout(function ()
        {
          location.href = 'admin.php?page=Extensions';        
        }, 1000);        
        
    }, 'json');

    return false;
});


jQuery(document).on('click', '.mainwp-extensions-trash', function ()
{
    var extensionSlug = jQuery(this).parents('.mainwp-extensions-childHolder').attr('extension_slug');
    var data = {
        action:'mainwp_extension_trash',
        slug:extensionSlug
    };

    jQuery.post(ajaxurl, data, function (response)
    {
        if (response.result == 'SUCCESS') location.reload();
    }, 'json');

    return false;
});

jQuery(document).on('click', '.mainwp-extension-widget-switch-list', function() {
    jQuery('#mainwp-extensions-widget-list').show();
    jQuery('#mainwp-extensions-widget-grid').hide();
    jQuery('.mainwp-extension-widget-switch-list').hide();
    jQuery('.mainwp-extension-widget-switch-grid').show();

    var data = mainwp_secure_data({
        action:'mainwp_extension_change_view',
        view: 'list'
    });
    jQuery.post(ajaxurl, data, function(response) {});

    return false;
});

jQuery(document).on('click', '.mainwp-extension-widget-switch-grid', function() {
    jQuery('#mainwp-extensions-widget-list').hide();
    jQuery('#mainwp-extensions-widget-grid').show();
    jQuery('.mainwp-extension-widget-switch-grid').hide();
    jQuery('.mainwp-extension-widget-switch-list').show();

    var data = mainwp_secure_data({
        action:'mainwp_extension_change_view',
        view: 'grid'
    });
    jQuery.post(ajaxurl, data, function(response) {});

    return false;
});

var maxActivateThreads = 8;
var totalActivateThreads = 0;
var currentActivateThreads = 0;
var finishedActivateThreads = 0;
var countSuccessActivation = 0;

jQuery(document).on('click', '#mainwp-extensions-grabkeys', function ()
{
    var grabingEl = jQuery(".api-grabbing-fields");
    var username = grabingEl.find('input.username:text').val();
    var pwd = grabingEl.find('input.passwd:password').val();
    
    var statusEl = grabingEl.find('span.status');                 
    var loadingEl = grabingEl.find(".mainwp_loading");    
    
    var data = {
        action:'mainwp_extension_testextensionapilogin',
        username: username,
        password: pwd,
        saveLogin: jQuery('#extensions_api_savemylogin_chk').is(':checked') ? '1' : '0'
    };
    
    statusEl.hide();
    loadingEl.show();
    jQuery.post(ajaxurl, data, function (response)
    {
        loadingEl.hide();        
        var undefError = false;        
        if (response) {
            if (response.saved) {
                statusEl.css('color', '#0074a2');
                statusEl.html('Login saved.').fadeIn();              
            } else if (response.result == 'SUCCESS') {
                statusEl.css('color', '#0074a2');
                statusEl.html('Test login success.').fadeIn();  
                setTimeout(function ()
                {
                  statusEl.fadeOut();
                }, 3000);                
                totalActivateThreads = jQuery('#mainwp-extensions-list .mainwp-extensions-childHolder[status="queue"]').length;
                if (totalActivateThreads > 0)
                    extensions_loop_next(); 
            } else if (response.error) {
                statusEl.css('color', 'red');
                statusEl.html(response.error).fadeIn(); 
            } else {
                undefError = true; 
            }        
        } else {
            undefError = true; 
        }
        
        if (undefError) {
            statusEl.css('color', 'red');
            statusEl.html("Undefined error.").fadeIn(); 
        }                
    }, 'json');     
    return false;
});

extensions_loop_next = function()
{
    while((extToActivate = jQuery('#mainwp-extensions-list .mainwp-extensions-childHolder[status="queue"]:first')) && (extToActivate.length > 0) && (currentActivateThreads < maxActivateThreads))
    {
        extensions_activate_next(extToActivate);
    }
    
    if ((finishedActivateThreads == totalActivateThreads) && (countSuccessActivation == totalActivateThreads)) {        
        setTimeout(function ()
        {
          location.href = 'admin.php?page=Extensions';        
        }, 3000);
    }
};

extensions_activate_next = function(pObj)
{
        var grabingEl = jQuery(".api-grabbing-fields");
        var username = grabingEl.find('input.username:text').val();
        var pwd = grabingEl.find('input.passwd:password').val();
  
  
        var api_row = jQuery(pObj).find("tr.mainwp-extensions-api-row");            
        var statusEl = api_row.find(".activate-api-status");                
        var loadingEl = api_row.find(".mainwp_loading");
        jQuery(pObj).attr("status", "running");
        var extensionSlug = jQuery(pObj).attr('extension_slug');
        var data = {
            action:'mainwp_extension_grabapikey',
            username: username,
            password: pwd,
            slug:extensionSlug            
        };
        currentActivateThreads++;
        statusEl.hide();                
        loadingEl.show();        
        if (jQuery(pObj).attr('license-status') == 'activated') {
            loadingEl.hide();
            finishedActivateThreads++;
            currentActivateThreads--;
            statusEl.css('color', '#0074a2');
            statusEl.html(__("Extension activated already.")).fadeIn(); 
            countSuccessActivation++;
            extensions_loop_next();
            return;
        } 
        api_row.find('.api-row-div').show();
        jQuery.post(ajaxurl, data, function (response)
        {
            loadingEl.hide();
            finishedActivateThreads++;
            currentActivateThreads--;
            if (response) {                
                if (response.result == 'SUCCESS') {
                    countSuccessActivation++;
                    if (response.api_key)
                        api_row.find('input.api_key:text').val(response.api_key);
                    if (response.activation_email)
                        api_row.find('input.api_email:text').val(response.activation_email);                            
                    statusEl.css('color', '#0074a2');
                    statusEl.html(__("Extension successfully activated.")).fadeIn(); 
                    api_row.find('.mainwp-extensions-deactivate-chkbox').attr('checked', false);  
                    var acts = jQuery(pObj).find("td.mainwp-extensions-childActions");   
                    acts.find('a.api-status').text(__('Activated'));
                    acts.find('a.api-status').removeClass('deactivated').addClass('activated');  
                    acts.find('img.image-api-status').attr("src", mainwpParams['image_url'] + 'extensions/unlock.png');
                    acts.find('img.image-api-status').attr("title", __('Activated'));
                } else if (response.error) {
                    statusEl.css('color', 'red');
                    statusEl.html(response.error).fadeIn(); 
                } else {
                    statusEl.css('color', 'red');
                    statusEl.html("Undefined error.").fadeIn(); 
                }  
            } else {
                statusEl.css('color', 'red');
                statusEl.html("Undefined error.").fadeIn(); 
            }
            extensions_loop_next();
        }, 'json');
};

jQuery(document).on('click', '#mainwp-extensions-bulkinstall', function () {    
    var grabingEl = jQuery(this).closest(".api-grabbing-fields");
    var username = grabingEl.find('input.username:text').val();
    var pwd = grabingEl.find('input.passwd:password').val();
    
    var statusEl = grabingEl.find('span.status');                 
    var loadingEl = grabingEl.find(".mainwp_loading");    
    
    var data = {
        action:'mainwp_extension_getpurchased',
        username: username,
        password: pwd,
        saveLogin: jQuery('#extensions_api_savemylogin_chk').is(':checked') ? '1' : '0'
    };    
    statusEl.hide();
    loadingEl.show();
    jQuery.post(ajaxurl, data, function (response)
    {
        loadingEl.hide();        
        var undefError = false; 
        if (response) {
            if (response.saved) {
                statusEl.css('color', '#0074a2');
                statusEl.html('Login saved.').fadeIn();              
            } else if (response.result == 'SUCCESS') {
                var msg = 'Login success.';
                if (response.message) {
                    msg += ' ' + response.message;                    
                } 
                statusEl.css('color', '#0074a2');
                statusEl.html(msg).fadeIn();    
                if (response.count > 0) {                   
                    jQuery('#mainwp-extensions-wrap').html(response.data);
                    setTimeout(function ()
                    {
                      statusEl.fadeOut();
                    }, 3000);
                }
            } else if (response.error) {
                statusEl.css('color', 'red');
                statusEl.html(response.error).fadeIn(); 
            } else {
                undefError = true; 
            }        
        } else {
            undefError = true; 
        }
        
        if (undefError) {
            statusEl.css('color', 'red');
            statusEl.html("Undefined error.").fadeIn(); 
        }                
    }, 'json');     
    return false;
})

bulkExtensionsMaxThreads = 3;
bulkExtensionsCurrentThreads = 0;
bulkExtensionsTotal = 0;
bulkExtensionsFinished = 0;
bulkExtensionsRunning = false;

mainwp_extension_bulk_install = function() {
    bulkExtensionsTotal = jQuery('.extension_to_install[status="queue"]').length;
    if (bulkExtensionsTotal > 0) {
       mainwp_extension_bulk_install_next();
    } else {
       mainwp_extension_bulk_install_done();
    }
}

mainwp_extension_bulk_install_done = function() {
    jQuery('.mainwp_extension_installing').append('<div class="mainwp_info-box">' + __("Install finished.") + '</div><p><a href="admin.php?page=Extensions" title="Extensions page">' + __("Return to Extensions page") + '</a></p>');
}

mainwp_extension_bulk_install_next = function() {
    while ((extToInstall = jQuery('.extension_to_install[status="queue"]:first')) && (extToInstall.length > 0)  && (bulkExtensionsCurrentThreads < bulkExtensionsMaxThreads))
    {
        mainwp_extension_bulk_install_specific(extToInstall);
    }    
    if ((bulkExtensionsTotal > 0) && (bulkExtensionsFinished == bulkExtensionsTotal)) {
        mainwp_extension_bulk_activate();        
    }
}

mainwp_extension_bulk_activate = function() {
    var plugins = [];
    jQuery('.extension_installed_success').each(function() {
        plugins.push(jQuery(this).attr('slug'));
    });
    
    if (plugins.length == 0) {
        mainwp_extension_bulk_install_done();    
        return;
    }
    
    var data = mainwp_secure_data({
        action:'mainwp_extension_bulk_activate',
        plugins: plugins
    });
    var loadingEl = jQuery('#extBulkActivate img');
    var statusEl = jQuery('#extBulkActivate .status');
    loadingEl.show();
    jQuery.post(ajaxurl, data,  function(response) {
            loadingEl.hide();
            if (response == 'SUCCESS') { 
                statusEl.css('color', '#21759B');
                statusEl.html('<p>Plugins activated successfully.</p>').show();  
            } 
            mainwp_extension_bulk_install_done();    
    });
}

mainwp_extension_bulk_install_specific = function(pExtToInstall) {
    pExtToInstall.attr('status', 'running');    
    bulkExtensionsCurrentThreads++;        
    var loadingEl = pExtToInstall.find('.ext_installing img');
    var statusEl = pExtToInstall.find('.ext_installing .status');
    loadingEl.show();    
    var data = mainwp_secure_data({
        action:'mainwp_extension_downloadandinstall',
        download_link: pExtToInstall.attr('download-link')        
    });
    jQuery.ajax({
        type: 'POST',
        url: ajaxurl,
        data: data,
        success: function() { return function (res_data) {
            bulkExtensionsCurrentThreads--;
            bulkExtensionsFinished++;
            loadingEl.hide();  
            var reg = new RegExp('<mainwp>(.*)</mainwp>');
            var matches = reg.exec(res_data);
            var response = '';
            if (matches) {
                response_json = matches[1];                
                response = jQuery.parseJSON(response_json );
            }            
            if (response != '') {
                if (response.result == 'SUCCESS') {
                    statusEl.css('color', '#21759B')
                    statusEl.html(response.output).show();
                    jQuery('.mainwp_extension_installing').append('<span class="extension_installed_success" slug="' + response.slug + '"></span>')
                } else if (response.error) {
                    statusEl.css('color', 'red');
                    statusEl.html('<p><strong>Error:</strong> ' + response.error + '</p>').show();
                } else {
                    statusEl.css('color', 'red');
                    statusEl.html('<p>Undefined error.</p>').show();
                }
            } else {
                statusEl.css('color', 'red');
                statusEl.html('<p>Undefined error.</p>').show();
            }
            mainwp_extension_bulk_install_next();
        } }()
    });
    return false;
}
