;(function () {
    'use strict';

    var $form_add_task = $('.add-task'),
        $delete_task,
        $task_details,
        $task_detail = $('.task-detail'),
        $task_detail_mask = $('.task-detail-mask'),
        task_list = []
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
        console.log('new_task', new_task);
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
            console.log('index',index);
            show_task_detail(index);
        })
    }

    function show_task_detail(index) {
        render_task_detail(index);
        $task_detail.show();
        $task_detail_mask.show();
    }

    function render_task_detail(index) {
        if(index===undefined || !task_list[index]) return;

        var item = task_list[index];
        var task_detail ='<div>'+
            '<div class="content">' +
            item.content +
            '</div>' +
            '<div>' +
            '<div class="description">' +
            '<textarea value="" id=""></textarea>' +
            '</div>' +
            '</div>' +
            '<div class="remind">' +
            '<input type="date">' +
            '</div>'
            '</div>';
        $task_detail.html(null);
        $task_detail.html(task_detail);

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
        if (index == undefined || !task_list[index]) return;
        delete task_list[index];
        refresh_task_list();
    }

    function refresh_task_list(){
        store.set('task_list', task_list);
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
            $task_list.append($task);
        }
        $delete_task = $('.action.delete');
        $task_details = $('.action.details');
        listen_task_delete();
        listen_task_detail();
    };

    function render_task_tpl(data, index) {
        if (!data || !index) return;
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