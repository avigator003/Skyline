document.addEventListener('DOMContentLoaded', function(){
    var allAs = document.getElementsByTagName('a');
    for(var i = 0; i< allAs.length; i++ ){
        document.getElementsByTagName('a')[i].addEventListener('click',function(event){
            event.preventDefault(); 
            var comp = {};
            comp.id = this.getAttribute('data-comp-id');
            comp.name = this.getAttribute('data-comp-name');
            getDivision(comp);
        })
    }
    var element =  document.getElementById('uninput');
    if (typeof(element) != 'undefined' && element != null){
        document.getElementById('uninput').addEventListener('keydown', function(e){
            if(e.keyCode == 13){
                e.preventDefault();
                document.getElementById('passinpput').focus();
            }
            return true

        })
    }
    
    document.getElementsByTagName('a')[0].focus();
})
// end of DOMcontentLoaded

function getDivision(comp){
    fetch('userright/getdivision?compid=' + comp.id, {
        method : "GET",
        mode:'cors',
        headers:{
            "Content-Type": "application/json"
        }
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        if(data.success == true){
            var rows = data.divisions;
            console.log(rows);
            var outhtml = '';
            for(var i=0; i < rows.length; i++){
                outhtml += '<tr>';
                    for(var j = 0; j < 1 ; j++){
                        outhtml +=  '<td>' + rows[i].compname + '</td>';
                        outhtml +=  '<td>' + rows[i].compcode + '</td>';
                        outhtml +=  '<td> <a href="' + rows[i].link + '" > Enter </a></td>';
                    }
                outhtml += '</tr>';
            }
            // document.getElementById('company').style.display = 'none';
            document.getElementById('division').getElementsByTagName('tbody')[0].innerHTML = outhtml;
            document.getElementById('division').style.display = 'block';
            document.getElementById('division').getElementsByTagName('a')[0].focus();
            // document.getElementById('panelHeading').innerHTML = 'Select Divison';
        }
    });
}