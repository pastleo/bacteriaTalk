var debug;
jQuery(function() {
    function scroll(){
        var control_dis = $(document).scrollTop() - $("#game").position().top;
        var window_height = $("#game").height() * 0.8;
        if(control_dis > 0 && control_dis < window_height)
            $("#control").addClass("menued");
        else
            $("#control").removeClass("menued");
    }
    $(window).scroll(scroll);

    function game_init(){
        var gamepad = jQuery("#gamepad");
        var bacteria = false;
        var allow_keydown = false;
        var objs, nexts;

        function remove(target, destroy) {
            target = jQuery(target).addClass('bounceOut').addClass("animated");
            setTimeout(function() {
                if (destroy) target.remove();
            }, 1000);
        }

        function jump(target) {
            allow_keydown = false;
            var next = jQuery(target);
            bacteria.attr("style", next.attr('style'));
            var complete_obj = objs.indexOf(target);
            if (complete_obj != -1) {
                remove(target);
                objs.splice(complete_obj, 1);
            }
            if (!objs.length){ // game ok
                jQuery("#game_man").text(jQuery("#game_man").attr('data-done'));
                jQuery("#success_msg").show();
                remove(bacteria, true);
                bacteria = false;
                console.log("Complete!");
                return;
            }
            if (next.attr('data-pass-to')) jump(next.attr('data-pass-to'));
            nexts = [next.attr('data-u'), next.attr('data-d'), next.attr('data-l'), next.attr('data-r')];
            setTimeout(function() {
                allow_keydown = true;
            }, 750);
        }
        jQuery("#bacterias .option").click(function() {
            var self = jQuery(this);
            if (bacteria){
                remove(bacteria, true);
                bacteria = false;
            }
            var bounceOuted = gamepad.find(".bounceOut.animated:not(#bacteria)");
            bounceOuted.removeClass("bounceOut").addClass("bounceIn").removeClass("animated").addClass("animated");
            setTimeout(function() {
                bounceOuted.removeClass("animated").removeClass("bounceIn");
            }, 1000);
            bacteria = self.find('img').clone().attr('id', 'bacteria').addClass("obj").addClass("bounceIn").addClass("animated");
            gamepad.append(bacteria);
            objs = self.attr('data-objs').split(",");
            jQuery('.presented').removeClass('presented');
            jQuery(self.attr('data-doc')).addClass("presented");
            jQuery("#game_man").text(jQuery("#game_man").attr('data-man'))
            jQuery("#success_msg").hide();
            jump(objs[0]);
            return false;
        });
        function keydown(e){
            // console.log(e.which);
            if (allow_keydown) {
                switch (e.which) {
                    case 37: // left
                        if (nexts[2]) jump(nexts[2]);
                        break;
                    case 39: // right
                        if (nexts[3]) jump(nexts[3]);
                        break;
                    case 38: // up
                        if (nexts[0]) jump(nexts[0]);
                        break;
                    case 40: // down
                        if (nexts[1]) jump(nexts[1]);
                        break;
                }
            }
            e.preventDefault();
            return false;
        }
        jQuery('body').keydown(keydown);
        jQuery('#control .key').click(function(e){
            e.which = parseInt(jQuery(this).attr('data-key'));
            keydown(e);
        });
    }

    var completed = 0;

    JT2html({
     body:'@{}',
     "":'<div class="option column" data-objs="@{objs}" data-doc="@{doc}"><div class="ui card"><a class="image" href="#"><img src="@{img}"></a><div class="content"><a class="header">@{name}</a><div class="meta"><a>點我開始遊戲</a></div></div></div></div>'
    }).fromGS('https://spreadsheets.google.com/feeds/list/1OMg92dDapfNY1GyipvbMdIhHvja0pZRySkl3u3XBO-I/1/public/values?alt=json',function(html){
        jQuery("#bacterias").append(html);
        completed++
        if(completed == 3) game_init();
    });

    JT2html({
     body:'@{node}@{img}',
     node:'<div data-u="@{upto}" data-d="@{downto}" data-l="@{leftto}" data-r="@{rightto}" id="@{id}" class="obj" style="top:@{top}%; left:@{left}%;"></div>',
     img:'<img data-u="@{upto}" data-d="@{downto}" data-l="@{leftto}" data-r="@{rightto}" id="@{id}" class="obj" style="top:@{top}%; left:@{left}%;" src="@{src}">'
    }).fromGS('https://spreadsheets.google.com/feeds/list/1OMg92dDapfNY1GyipvbMdIhHvja0pZRySkl3u3XBO-I/2/public/values?alt=json',function(html){
        jQuery("#gamepad").append(html);
        completed++
        if(completed == 3) game_init();
    });

    JT2html({
     body:'@{}',
     "":'<div id="@{id}" class="ui @{color} document segment"><div class="ui header">@{text}</div>@{p}</div>',
     p:"<p>@{text}</p>"
    }).fromGS('https://spreadsheets.google.com/feeds/list/1OMg92dDapfNY1GyipvbMdIhHvja0pZRySkl3u3XBO-I/3/public/values?alt=json',function(html){
        jQuery("#doc_list").append(html);
        completed++
        if(completed == 3) game_init();
    });

});