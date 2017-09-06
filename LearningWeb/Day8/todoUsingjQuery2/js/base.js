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
        ;

    init();

    $task_detail_mask.on('click',hide_task_detail);

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
        $task_details.on('click',function () {
            var $this = $(this);
            var $item = $this.parent().parent();
            var index = $item.data('index');
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

        task_list[index] = data;

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
            '<div class="remind">' +
            '<input name="remind_date" type="date" value="'+item.remind_date+'">' +
            '</div>'+
            '<div><button type="submit">Update</button></div>'+
            '</form>';

            $task_detail.html(null);
            $task_detail.html(task_detail);
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
                console.log(data);
                update_task(index, data);
                hide_task_detail();
        });


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

    };

    function delete_task(index) {
        if (index === undefined || !task_list[index]) return;
        delete task_list[index];
        refresh_task_list();
    }

    function refresh_task_list(){
        store.set('task_list', task_list);
        console.log('Refreshed')
        render_task_list();
    }

    function init(){
        task_list = store.get('task_list') || [];
        console.log('TASK_LIST :',task_list);
        if(task_list.length){
            render_task_list();
        }
    };

    function render_task_list() {
        var $task_list = $('.task-list');
        $task_list.html('');
        for (var i = 0; i < task_list.length; i++){
            var $task = render_task_tpl(task_list[i], i);
            $task_list.prepend($task);
        }
        $delete_task = $('.action.delete');
        $task_details = $('.action.details');
        listen_task_delete();
        listen_task_detail();
    };

    function render_task_tpl(data, index) {
        if (!data) return;

        var list_item_tpl  =
            '<div class="task-item" data-index="'+index+'">'+
            '<span><input type="checkbox"></span>'+
            '<span class="task-content">'+data.content+'</span>'+
            '<span class="fr">'+
            '<span class="action delete"> delete</span>' +
            '<span class="action details"> details</span>' +
            '</span>'+
            '</div>';
        return $(list_item_tpl);
    }

})();