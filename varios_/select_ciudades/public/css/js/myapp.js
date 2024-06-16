const comuniInput = document.getElementById('comuniInput');
        const comuniResults = document.getElementById('comuniResults');
        const provinciasInput = document.getElementById('provinciasInput');
        const provinciasResults = document.getElementById('provinciasResults');

        comuniInput.addEventListener('input', function() {
            const term = this.value.trim(); // Obtener el término de búsqueda y eliminar espacios en blanco
            search('/ruta-comuni', term, comuniResults);
        });

        provinciasInput.addEventListener('input', function() {
            const term = this.value.trim(); // Obtener el término de búsqueda y eliminar espacios en blanco
            search('/ruta-provincias', term, provinciasResults);
        });

        function search(route, term, resultsElement) {
            // Realizar una solicitud GET al servidor con el término de búsqueda
            fetch(`${route}?term=${term}`)
                .then(response => response.json())
                .then(data => {
                    // Limpiar resultados anteriores
                    resultsElement.innerHTML = '';

                    // Mostrar los nuevos resultados
                    data.forEach(result => {
                        const li = document.createElement('li');
                        li.textContent = result.nombre;
                        resultsElement.appendChild(li);
                    });
                })
                .catch(error => {
                    console.error('Error fetching search results:', error);
                });
        }