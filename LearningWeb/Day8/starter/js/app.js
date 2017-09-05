/**
 * 模型 - Model
 */

var Note = Backbone.Model.extend({
    defaults:{
        title:'',
        author:'',
        created_at:new Date()
    },

    initialize: function () {
        console.log('New note: ' + this.get('title'));

        this.on('change',function (model, options) {
            console.log('Changed');
        })

        this.on('change:title', function (model,options) {
            console.log('title changed');
        })

        this.on('invalid',function (model, error) {
            console.log(error);
        })
    },

    validate: function (attributes, options) {
      if (attributes.title.length < 3){
          return 'note title is too short'
      }
    }
});

/**
* View
*/
var NoteView = Backbone.View.extend({
    tagName:'li',
    className: 'item',
    attributes: {
        'data-role': 'list'
    },

    template: _.template(jQuery('#list-template').html()),

    render: function () {
        this.$el.html(this.template(this.model.attributes));
        return this;
    }
});

var note = new Note({
    title: 'Hello'
});

var noteView = new NoteView({
    model:note
});

var NoteCollectionView  = Backbone.View.extend({
    tagName: 'ul',

    initialize:function () {
        //add event listener for method add.
        this.collection.on('add',this.addOne, this);
        this.render();
    },

    render: function () {
        //call addOne method to set note for each note
        this.collection.each(this.addOne, this);
        return this;
    },

    addOne: function (note) {
        //Set note view for each note
        var noteView = new NoteView({model: note});
        //append the children el to parent el
        this.$el.append(noteView.render().el);
    }
})

/**
* Collection
 */

var NoteCollection =  Backbone.Collection.extend({
    
    initialize: function () {
      this.on({
        'add': function (model, collection, options) {
            console.log('Item '+model.id+ 'has been added ');
        },
        
        'remove': function (model, collection, options) {
            console.log('Item '+model.id+ 'has been moved');
        },
          
        'change': function (model) {
            console.log('model changed');
        }  
          
      }); 
    },

    model: Note
});

var note1  = new Note({
    id:1, title: 'hello1'
});

var note2  = new Note({
    id:2, title: 'hello2'
});

var note3  = new Note({
    id:3, title: 'hello3'
});

var noteCollection =  new NoteCollection([note1,note2,note3]);
var noteCollectionView = new NoteCollectionView({collection: noteCollection});

/**
 * Router
 * */

var NoteRouter =  Backbone.Router.extend({
   routes: {
       'notes(/page/:page)': 'index',
       'notes/:id' : 'show',
       'login(/from/*from)': 'login'
   },

   login:function (from) {
     console.log('Please login');
   },


    show:function (id) {

       this.navigate('login/from/notes/'+id,{trigger:true});

        console.log('Single note '+id);
        var note = noteCollection.get(id);
        var noteView = new NoteView({model: note});
        jQuery('#note_list').html(noteView.render().el);
    },

   index: function (page) {
       var page = page || 1;
       jQuery('#note_list').html(noteCollectionView.el);
       console.log('Note list NO. '+page);
   }

});

var noteRoute = new NoteRouter;
Backbone.history.start();

