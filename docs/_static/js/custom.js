//Hotjar Tracking Code as follows
(function(h,o,t,j,a,r){
	h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:2184213,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');


$(document).ready(function(){
	try{
		
	$('a[href*="cypresssemiconductorco"]').each(function(){ 
		var oldUrl = $(this).attr("href"); 
		var sampleText = $(this).text().replace("cypresssemiconductorco", "Infineon");
		console.log(sampleText);
		$(this).text(sampleText);
		var newUrl = oldUrl.replace("cypresssemiconductorco", "Infineon"); 
		$(this).attr("href", newUrl); 
	});
	
		
	
	$('.rst-content').find(".wy-breadcrumbs").find("a").each(function(){
		if($(this).text()=='Docs')
		{
			$(this).addClass("icon icon-home");
			$(this).text("");
		}
	});	
	
	//display hr line after heading which is replaced in xml with conf.pf code block
    	var isToolguid=false;
	$( ".section > h1" ).each(function(){
		//console.log('li text :: '+$(this).text());
		//console.log('is contains Tool Guide :: '+($(this).text().indexOf('Tool Guide')));

		if($(this).text().indexOf('Tool Guide')>-1 || $(this).text().indexOf('ModusToolbox')>-1 || $(this).text().indexOf('Secure Boot SDK User Guide')>-1 || $(this).text().indexOf('Secure Policy Configurator Guide')>-1 || $(this).text().indexOf('CapSense Configurator Guide')>-1 || $(this).text().indexOf('CapSense Tuner Guide')>-1 || ($(this).text().indexOf('PSoC 6 MCU CapSense')>-1 && $(this).text().indexOf('Design Guide')>-1) || ($(this).text().indexOf('Feature Guides')>-1 && ($(this).text().indexOf('Bluetooth Low Energy')>-1 || $(this).text().indexOf('Low-Power')>-1 )))
			isToolguid = true;
	});
	
	//console.log('isToolguid :: '+isToolguid);
	if(!isToolguid)
	{
		$(".section p").each(function(){
			var paraText = $(this).text().trim();
			var isOnlyHeading=true;
			$(this).children().each(function(){
				var tagName = $(this).prop("tagName");
				var pclassname = $(this).parent().attr('class');
				if(pclassname == undefined)
					pclassname = '';

				if(tagName.toLowerCase()=='em' && $(this).text().trim() == paraText && $(this).text().trim()=="Values:" && pclassname.indexOf('nocss')== -1)
				{
					if($(this).parents("li").length==0)
					{
						$(this).after('<hr/>');
					    $(this).css("display", "none");
					}
				}
				else if (tagName.toLowerCase()=='em' && $(this).text().trim() == paraText && pclassname.indexOf('nocss')== -1)
				{
					if($(this).parents("li").length==0)
					{
						$(this).after('<hr/>');
						$(this).addClass("headingclass");
					}
				}
				else if (tagName.toLowerCase()=='img' )
					$(this).before("<br>")
			});
			
		});
		
		if($( ".section li > p > em" ).next().is( "hr" ))
		{
			$( ".section li > p > em" ).next().remove();
			$( ".section li > p > em" ).removeClass( "headingclass" );
		}

		if( $( ".section td > p > em" ).next().is( "hr" ) )
		{
			$( ".section td > p > em" ).next().remove();
			$( ".section td > p > em" ).removeClass( "headingclass" );
		}

	}
	
	$('.highlight-default .highlight pre').each(function (e) {
        var spans = Array.prototype.slice.call(this.getElementsByTagName('span'));
        var startCmts = [], endCmts = [], startMethod = [];
        $.each(spans, function (index, value) {
            if ($(value).html() === '/*') {
                startCmts.push(index);
            }
            if ($(value).html() === '*/') {
                endCmts.push(index + 1);
            }
            if ($(value).html() === '(') {
                startMethod.push(index - 1);
            }
        });
        $.each(startCmts, function (index, value) {
            var sliced = spans.slice(startCmts[index], endCmts[index]);
            $.each(sliced, function (i, v) {
                v.removeAttribute("class");
                v.classList.add("comment");
            });
        });
        $.each(startMethod, function (index, value) {
            spans[value].removeAttribute("class");
            spans[value].classList.add("variableclass");
        });
    });
	}catch(err){console.log('err :: '+err);}
	
	//This is used to auto enable the toctree after 4 depth menu elements
	setTimeout(toctreeSettingFunction, 50);

});

function toctreeSettingFunction()
{
	$("a.current").parents("li[class^='toctree-']").each(function(){
		if(!($(this).hasClass("current" )))
		{
			$(this).addClass("current");
		}
	});
}

