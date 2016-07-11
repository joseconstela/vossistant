Template.registerHelper('editableItem', (u) => {
  return u === Meteor.userId()
})

Template.registerHelper('intentEnabled', (id) => {
  return false
})


Template.afArrayField_simpleArray.rendered = function(){
  $('.textcomplete').textcomplete([{
    match: /(^|\s)@(\w*)$/,
    search: function (term, callback) {
      Meteor.call("entitiesSearch", term, function(error, results){
        if(error){
          console.log("error", error);
        }
        if(results){
          callback($.map(results, function (result) {
            return result.user.profile.name + ':' + result.t;
          }));
        }
      });

    },
    replace: function (word) {
      return ' @' + word + '@';
    }
  }]);
}
