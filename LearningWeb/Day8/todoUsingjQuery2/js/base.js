;(function () {
    'use strict';

    var $form_add_task = $('.add-task')
        ,$delete_task
        ,$task_details
        ,$task_detail = $('.task-detail')
        ,$task_detail_mask = $('.task-detail-mask')
        ,task_list = []
        ,current_index
        ,$update_form
        ,$task_detail_content
        ,$task_detail_content_input
        ,$check_box_complete
        ,$msg = $('.message')
        ,$msg_content = $msg.find('.msg-content')
        ,$msg_confirm = $msg.find('button')
        ,$alert = $('.alert')
        ;

    init();

    $task_detail_mask.on('click',hide_task_detail);

    function  listen_msg_event() {
        $msg_confirm.on('click',function () {
            hide_msg();
        })

    }

    $form_add_task.on('submit',function (e) {
        var new_task = {}, $input;
        //Ban default act
        e.preventDefault();
        //Get new task value
        $input = $(this).find('input[name=content]');
        new_task.content = $input.val();
        //Return if the new task value is empty
        if(!new_task.content) return;
        if (add_task(new_task)){
            $input.val(null);
        }
    });
    
    function listen_task_delete() {
        $delete_task.on('click',function () {
            var $this = $(this);
            var $item = $this.parent().parent();
            var index = $item.data('index');
            var tmp = confirm('Delete?');
            return tmp ? delete_task(index) : null;
        })
    }

    function listen_task_detail() {
        var index;
        $('.task-item').on('dblclick',function () {
            index = $(this).data('index');
            show_task_detail(index);
        })

        $task_details.on('click',function () {
            var $this = $(this);
            var $item = $this.parent().parent();
            index = $item.data('index');
            show_task_detail(index);
        })
    }

    function show_task_detail(index) {
        render_task_detail(index);
        current_index = index;
        $task_detail.show();
        $task_detail_mask.show();
    }

    function update_task(index, data) {
        if ( !task_list[index]) return;

        task_list[index] = $.extend({},task_list[index],data);

        refresh_task_list();

    }

    function render_task_detail(index) {
        if(index===undefined || !task_list[index]) return;

        var item = task_list[index];
        if (item.description === undefined){
            item.description = '';
        }

        if(item.date === undefined){
            item.date = new Date();
        }

        var task_detail =
            '<form>'+
            '<div class="content">' +
            item.content +
            '</div>' +
            '<div>' +
            '<input style="display: none" type="text" name="content" value="'+(item.content||'')+'">'+
            '</div>'+
            '<div>' +
            '<div class="description">' +
            '<textarea name="description" id="">'+item.description+'</textarea>' +
            '</div>' +
            '</div>' +
            '<div class="remind input-item">' +
            '<label>Remind time</label>'+
            '<input class="datetime" name="remind_date" type="text" value="'+(item.remind_date||'')+'">' +
            '</div>'+
            '<div><button type="submit">Update</button></div>'+
            '</form>';

            $task_detail.html(null);
            $task_detail.html(task_detail);
            $('.datetime').datetimepicker();

            $update_form = $task_detail.find('form');
            $task_detail_content = $update_form.find('.content');
            $task_detail_content_input = $update_form.find('[name=content]');

        $task_detail_content.on('dblclick',function () {
            $task_detail_content_input.show();
            $task_detail_content.hide();
        });

            $update_form.on('submit', function (e) {
                e.preventDefault();
                var data = {};
                data.content = $(this).find('[name=content]').val();
                data.description = $(this).find('[name=description]').val();
                data.remind_date = $(this).find('[name=remind_date]').val();
                update_task(index, data);
                hide_task_detail();
        });


    }

    function get(index) {
        return store.get('task_list')[index];
    }

    //Listen if todo finished
    function listen_checkbox_complete() {
        $check_box_complete.on('click',function () {
            var $this  = $(this);
            var parent = $this.parent().parent();
            var index  = parent.data('index');

            var item = get(index);
            if (item.complete){
                update_task(index, {complete:false});
            }else{
                update_task(index, {complete:true});
            }
        })

    }

    function hide_task_detail() {
        $task_detail.hide();
        $task_detail_mask.hide();
    }

    function add_task(new_task) {
      //  push new task to task list
      task_list.push(new_task);
      refresh_task_list();
      return true;
    }

    function delete_task(index) {
        if (index === undefined || !task_list[index]) return;
        delete task_list[index];
        refresh_task_list();
    }

    function refresh_task_list(){
        store.set('task_list', task_list);
        render_task_list();
    }

    function init(){
        task_list = store.get('task_list') || [];
        if(task_list.length){
            render_task_list();
            task_remind_check();
            listen_msg_event();
            show_msg('hello');
        }
    }

    function  task_remind_check() {
        var current_timestamp;
        console.log(task_list);
        var itl = setInterval(function () {
            for (var i = 0; i<task_list.length;i++){
                var item  = get(i), task_timestamp;
                //console.log('log', item);
                if(!item.remind_date || item.informed ||!item){
                    continue;
                } else {
                    current_timestamp = (new Date()).getTime();
                    task_timestamp = (new Date(item.remind_date)).getTime();
                    if(current_timestamp - task_timestamp >= 1){
                        update_task(i, {informed: true});
                        show_msg(item.content);
                    }
                }


            }
        }, 1000);
    }

    function  show_msg(msg) {
        if (!msg) return;
        $msg_content.html(msg);
        $alert.get(0).play();
        $msg.show();
    }

    function  hide_msg() {
        $msg.hide();
        $alert.get(0).pause();
    }

    function render_task_list() {
        var $task_list = $('.task-list');
        $task_list.html('');
        var complete_items = [];
        for (var i = 0; i < task_list.length; i++){
            var item = task_list[i];
            if(item && item.complete){
                complete_items[i] = item;
            }else
                var $task = render_task_tpl(task_list[i], i);
            $task_list.prepend($task);
        }

        for (var j = 0; j <complete_items.length;j++){
            $task = render_task_tpl(complete_items[j], j);
            if(complete_items[j] === undefined){

            }else{
                $task.addClass('completed');
                $task_list.append($task);
            }
        }

        $delete_task = $('.action.delete');
        $task_details = $('.action.details');
        $check_box_complete = $('.task-list .complete[type=checkbox]');
        listen_task_delete();
        listen_task_detail();
        listen_checkbox_complete();
    };

    function render_task_tpl(data, index) {
        if (!data) return;

        var list_item_tpl  =
            '<div class="task-item" data-index="'+index+'">'+
            '<span><input class="complete" '+(data.complete ? 'checked':'')+' type="checkbox"></span>'+
            '<span class="task-content">'+data.content+'</span>'+
            '<span class="fr">'+
            '<span class="action delete"> delete</span>' +
            '<span class="action details"> details</span>' +
            '</span>'+
            '</div>';
        return $(list_item_tpl);
    }

})();