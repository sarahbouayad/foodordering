var square = document.getElementsByClassName("squareBox");
var trash = document.getElementsByClassName("fa-trash-o");

Array.from(square).forEach(function(element) {
      element.addEventListener('click', function(){

        const squareIcon = this.dataset.square === "true"
        // debugger
        console.log(this.dataset)
        fetch('squareCheck', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'square': squareIcon
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        // const name = this.parentNode.parentNode.childNodes[1].innerText
        fetch('trashApi', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'name': name,
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
