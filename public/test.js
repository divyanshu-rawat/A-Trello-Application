
$(document).ready(() =>{

    var board_name_array = {};

    $(".oauth").on('click',() =>{

      $('.loader').show();

        Trello.authorize({
          type: 'popup',
          name: 'Getting Started Application',
          scope: {
            read: 'true',
            write: 'true' },
          expiration: 'never',
          success: () => { 
            var token = Trello.token();
            console.log(token);
            $('.loader').hide();
          },
          error: () => { console.log('Failed authentication')}
        }, (argument) => {
            console.log(argument);
        });
    });

      $('.card-info').on('click', () => {
        $('.loader').show();
         // Get all of the information about the boards you have access to

              $('.boards-info').empty();
              $('.list-info').empty();
              $('.boards-info').append("<ul class='list-group col-lg-4'></ul>");

                var success = (successMsg) => {

                  // console.log(JSON.stringify(successMsg,null,4));
                
                  $('.loader').hide();

                    for(let x of successMsg){
                        board_name_array[x.name] = x.id;
                        $('.list-group').append("<li class='list-group-item'><a href = "+x.url+" >"+x.name+"</a></li>");
                        // console.log(x);
                    }

                   $('.list-info').append("<h3 class = 'col-lg-12'>Get information about the Lists you have access to.</h3>");

                   $('.list-info').append("<div class='form-group col-lg-3'>" +
                      "<label for=''>Select Board:</label>" +
                      "<select class='form-control myDropdown'>"+
                      "<option value= 'select Board'>Select Board</option>"+
                      "</select>"+
                    "</div>");

                   for(let x of successMsg)
                   {
                        $('.myDropdown').append( 
                            "<option value="+x.id+">"+x.name+"</option>"
                            );
                   }


                   $(".myDropdown").on("change",function() {
                        get_list($(".myDropdown").val())
                    });

                   


                };

                var error = (errorMsg) =>{
                  console.log(JSON.stringify(errorMsg,null,4));
                };

                Trello.get('/member/me/boards', success, error);
            });

            

        function get_list(id){ 

                $('.loader').show();
                $('.list-info-two').empty();
                $('.list-info-two').append("<ul class='list-group second-list col-lg-4'></ul>");
                var success = (successMsg) =>{

                    console.log(JSON.stringify(successMsg,null,4));
                  
                    $('.loader').hide();

                    for(let x of successMsg){
                        $('.second-list').append("<li class='list-group-item my_btn'><b>"+x.name+"</b></li>"+
                        "<button type='button' style = 'margin:5px 0;'class='btn btn-primary add-card' value = "+x.id+" >Create Card</button>");                
                    }

                    $(".add-card").on('click', function(){
                       create_card($(this).attr('value'));

                   })

                };
                var error = (errorMsg) => {};
                Trello.get('/boards/'+id+'/lists', success, error);
         }

        function create_card (listID) {
            
            // Set the destination list for the new card
            $('.loader').show();
             var my_id = listID;
             $('#card-name').val('');
             $('#card-description').val('');

            $('.modal').on('show.bs.modal', function (event) {
                 
                 $('#create-card').off('click').on('click', function() {
                        
                        var destinationList = listID;
                        var success = function(successMsg) {
                          console.log(successMsg);
                          $('.loader').hide();
                        };

                        var error = function(errorMsg) {
                          console.log(errorMsg);
                        };

                        var newCard = 
                          {

                              name: $('#card-name').val(), 
                              desc: $('#card-description').val(),
                              pos: "top", 
                              due: null,
                              idList: destinationList

                          };

                        Trello.post('/cards/', newCard, success, error);

                console.log('clicked');
               

                $('#myModal').modal('hide');


            })
            }).modal('show');            
         }

});

