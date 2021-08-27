

// Edit Element Page
$(document).on('click', '#editelementpage', function (e) {
    e.preventDefault();
    var id = $("#editelementid").val();
 alert(id)
    window.location.href = "/element/update/"+id;
})



  

// Delete Action element
$(document).on('click', '#deleteelement', function (e) {
  
  e.preventDefault();
  var id = $("#elementid").val();
  $.ajax({
    url: '/api/element/delete_element/' + id ,
    method: 'POST',
    dataType: 'json',
   
    success: function (dat) {

        if (dat.status == true) {
           
            swal({
                title: "Element",
                text: "Element Deleted",
                icon: "success",
                timer: 2000,
                buttons: false

            })
            window.location.href = "/api/element/element_list";
        } else {
            swal({
                title: "Element",
                text: "Element Delete Failed",
                icon: "error",
                timer: 4000,
                buttons: false
            })
        }
    }
})
 
})



// Delete Action Package
$(document).on('click', '#deletepackage', function (e) {
  
    e.preventDefault();
    var id = $("#packageid").val();
    console.log(id,"id")
    $.ajax({
      url: '/api/package/delete_package/' + id ,
      method: 'POST',
      dataType: 'json',
     
      success: function (dat) {
  
          if (dat.status == true) {
             
              swal({
                  title: "Package",
                  text: "Package Deleted",
                  icon: "success",
                  timer: 2000,
                  buttons: false
  
              })
              window.location.href = "/api/package/package_list";
          } else {
              swal({
                  title: "Package",
                  text: "Package Delete Failed",
                  icon: "error",
                  timer: 4000,
                  buttons: false
              })
          }
      }
  })
   
  })

function handler() {
  
    return {
      Element: [],
      addNewField() {
          this.Element.push({
              element:'',
              validity: '',
              quantity:'',
              period:'',
              remarks:''
           });
        },
        removeField(index) {
           this.Element.splice(index, 1);
         }
      }
 }

 
function packageupdatehandler(package) {
    console.log("package",package)
            return {
                Element: package.Element,
                addNewField() {
                    this.Element.push({
                        element:'',
                        validity: '',
                        quantity:'',
                        period:'',
                        remarks:''
                     });
                  },
                  removeField(index) {
                     this.Element.splice(index, 1);
                   }
                }

            }

        function vocuherhandler(package) {
            console.log("pack",package)
            var array=[];
            for(var k=0;k<package.length;k++)
            {
             var arr=package[k].package?.Element
             var j=0; 
             var quantity=0;
             var tenure=0;
             var validity=0;
             for(var i=0;i<arr?.length;i++)
             {
                 arr[i].element=package[k].elementConsumed[j].element;
                 j=j+package[k].package.Element[i].quantity
             }
             if(arr!==undefined)
              array.push(arr)
            }
             
                 
            console.log("arr",array)
                    return {
                        Element: array,
                        addNewField(index) {
                            
                            console.log("ind",index)
                            this.Element[index]?.push({
                                element:'',
                                validity: '',
                                quantity:'',
                                period:'',
                                remarks:''
                             });
                          },
                           removeField(ElementIndex,index) {
                             this.Element[ElementIndex].splice(index, 1);
                           }
                        }
        
   
 }

 
 
function termshandler(terms) {
     var arr=[]
     if(terms!=undefined)
       arr=terms
    return {
        Terms: arr,
        addNewField() {
            this.Terms.push({
                terms:'',
             });
          },
          removeField(index) {
             this.Terms.splice(index, 1);
           }
        }

    }


    
function carouselhandler(slider) {

    var arr=[]
  
    if(slider!==undefined)
    arr=slider
   
    console.log("arr",arr)

    return {
        Slider: arr,
        addNewField() {
            this.Slider.push({
                filename:''
             });
          },
          removeField(index) {
             this.Slider.splice(index, 1);
           }
        }

    }