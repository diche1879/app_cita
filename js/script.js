fetch("../data/turistas.json")
.then(resp => resp.json())
.then(data => console.log(data))
