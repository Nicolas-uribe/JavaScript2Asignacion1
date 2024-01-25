/*
utilizando fetch y asycn/await realizar las siguientes peticiones simples a la api de pokemon https://pokeapi.co/docs/v2
a. obtener detalles de un pokemon por nombre
b. obtener habilidades de un pokemon especifico
c. obtener informacion sobre un tipo especifico de pokemmon (por ejemplo, agua)
d. obtener una lista de los pimeros 50 pokemon
a. Obtener el nombre y el tipo de un Pokémon, así como el nombre
   y el tipo de su evolución
*/

//Esta función hace la solicitud a la url que definamos 
async function hacerSolicitudApi(url) {
    try {
      const respuesta = await fetch(url);
      const datos = await respuesta.json();
      return datos;
    } catch (error) {
      console.error('Error en la solicitud a la base de datos:', error);
      throw error;
    }
  }

 


//AREA DE MOSTRAR LA LISTA DE LOS PRIMEROS 50 POKEMONES

async function listaPokemones() {
    const url = 'https://pokeapi.co/api/v2/pokemon?limit=50';
    const listaPokemon = await hacerSolicitudApi(url);
  
    // Obtener la información completa de cada uno de los primeros 50 Pokemon
     const detallesPokemon = await Promise.all(
      listaPokemon.results.map(async (pokemon) => {
        const detalle = await hacerSolicitudApi(pokemon.url);
        return {
          nombre: detalle.name,
          imagen: detalle.sprites.front_default,
        };
      })
    );
 
    mostrarResultados(detallesPokemon);
  }

function mostrarResultados(detallesPokemon) {

    //Limpiar el contenedor de las tarjetas 
    const listaPokemonElemento = document.getElementById('listaPokemon');
    listaPokemonElemento.innerHTML = ''; 
  

    //Carga los nombres y las imagenes de cada pokemon de la lista
    detallesPokemon.forEach((pokemon) => {
        //carga el nombre
      const listItem = document.createElement('li');
      listItem.textContent = ` ${pokemon.nombre}`;
        //carga la imagen
      const imagen = document.createElement('img');
      imagen.src = pokemon.imagen;
      imagen.style.width = '150px';
      imagen.style.height = '150px';
      listItem.appendChild(imagen);
  
      listaPokemonElemento.appendChild(listItem);
    });
  }
  async function irAListaPokemon() {
    window.location.href = 'lista.html';
  }

// FIN AREA DE MOSTRAR LA LISTA DE LOS PRIMEROS 50 POKEMONES.

// AREA DE DETALLES Y HABILIDADES DE UN POKEMON POR NOMBRE

async function obtenerDetallesPorNombre(nombrePokemon) {
    const url = `https://pokeapi.co/api/v2/pokemon/${nombrePokemon.toLowerCase()}`;
    try {
      const detallesRespuesta = await hacerSolicitudApi(url);
  
      // Obtener imagen, habilidades y tipo del resultado
      const imagen = detallesRespuesta.sprites.front_default;
      const habilidades = detallesRespuesta.abilities.map(ability => ability.ability.name);
      const tipos = detallesRespuesta.types.map(type => type.type.name);
  
      return {
        nombre: nombrePokemon,
        imagen,
        habilidades: habilidades.join(', '),
        tipo: tipos.join(', ')
      };
    } catch (error) {
      console.error('Error al obtener detalles del Pokémon:', error);
      return null;
    }
  }
  
  async function obtenerDetallesPokemon() {
    const nombrePokemon = document.getElementById('pokemonNameInput').value;
    const detallesPokemon = await obtenerDetallesPorNombre(nombrePokemon);
    const infoContainer = document.getElementById('pokemonCard');
  
    if (detallesPokemon) {
        infoContainer.innerHTML = `
        
        <img id="pokemonImage" src="${detallesPokemon.imagen}" alt="Pokemon Image">
        <p id="pokemonName">Nombre: ${detallesPokemon.nombre}</p>
        <p id="pokemonAbilities">Habilidades: ${detallesPokemon.habilidades}</p>
        <p id="pokemonType">Tipo: ${detallesPokemon.tipo}</p>
    `;
    } else {
      alert('No se encontraron detalles para el Pokémon ingresado.');
    }
  }
  // FIN DE AREA DE DETALLES Y HABILIDADES DE UN POKEMON POR NOMBRE

  // AREA INFORMACIÓN POR TIPO DE POKEMON

  async function obtenerPokemonPorTipo(tipo) {
    const url = `https://pokeapi.co/api/v2/type/${tipo}/`;
    const infoTipo = await hacerSolicitudApi(url);

    // Obtener el contenedor de la lista
    const pokemonListContainer = document.getElementById('pokemonList');
    pokemonListContainer.innerHTML = ''; 

    // Mostrar cada Pokémon en la lista
    infoTipo.pokemon.forEach(async (pokemon) => {
      const detallesPokemon = await obtenerDetallesPorNombre(pokemon.pokemon.name);
      const listItem = document.createElement('li');

      // Crear la imagen
      const imagenPokemon = document.createElement('img');
      imagenPokemon.src = detallesPokemon.imagen;
      imagenPokemon.alt = detallesPokemon.nombre;
      imagenPokemon.style.width = '150px'; 
      listItem.appendChild(imagenPokemon);

      // Crear el nombre del Pokémon
      const nombrePokemon = document.createElement('p');
      nombrePokemon.textContent = detallesPokemon.nombre;
      listItem.appendChild(nombrePokemon);

      // Agregar el Pokémon a la lista
      pokemonListContainer.appendChild(listItem);
    });
  }

//POKEVOLUCIONES 
async function obtenerInformacion() {
      const pokemonName = document.getElementById('pokemonName').value;

      // Obtener información del Pokémon por nombre
      const pokemonInfo = await obtenerDetallesPokemonEvolucion(pokemonName);

      if (pokemonInfo) {
        // Obtener información de la evolución del Pokémon
        const evolucionInfo = await obtenerDetallesEvolucion(pokemonInfo.evolucion);

        // Mostrar la información en el contenedor
        const infoContainer = document.getElementById('infoContainer');
        infoContainer.innerHTML = `
          <div style="display: flex; align-items: center;">
            <div style="margin-right: 20px;">
              <p><strong>Pokémon:</strong> ${pokemonInfo.nombre}</p>
              <p><strong>Tipo:</strong> ${pokemonInfo.tipo}</p>
              <img src="${pokemonInfo.imagen}" alt="${pokemonInfo.nombre}" style="max-width: 150px;">
            </div>
            <div>
              <p><strong>Evolución:</strong> ${evolucionInfo.nombre}</p>
              <p>  </p>
              <img src="${evolucionInfo.imagen}" alt="${evolucionInfo.nombre}" style="max-width: 150px;">
            </div>
          </div>
        `;
      } else {
        alert('No se encontró información para el Pokémon ingresado.');
      }
    }
    // obtener detalles de un Pokémon por nombre
    async function obtenerDetallesPokemonEvolucion(nombrePokemon) {
      const url = `https://pokeapi.co/api/v2/pokemon/${nombrePokemon}/`;
      try {
        const respuesta = await fetch(url);
        const detallesPokemon = await respuesta.json();

        // Obtener el tipo del Pokémon
        const tipoPokemon = detallesPokemon.types.map((type) => type.type.name).join(', ');

        return {
          nombre: detallesPokemon.name,
          tipo: tipoPokemon,
          evolucion: detallesPokemon.species.url,
          imagen: detallesPokemon.sprites.front_default,
        };
      } catch (error) {
        console.error('Error al obtener detalles del Pokémon:', error);
        return null;
      }
    }

    //detalles de la evolución de un Pokémon
    async function obtenerDetallesEvolucion(urlEvolucion) {
      try {
        const respuesta = await fetch(urlEvolucion);
        const detallesEvolucion = await respuesta.json();
        const nombreEvolucion = detallesEvolucion.evolves_from_species
          ? await obtenerNombreEvolucion(detallesEvolucion.evolves_from_species.url)
          : 'N/A';
        return {
       
          nombre: nombreEvolucion.name,
          tipo: 'N/A', 
          imagen: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${nombreEvolucion.id}.png`, 
        };
      } catch (error) {
        console.error('Error al obtener detalles de la evolución:', error);
        return null;
      }
    }
    async function obtenerNombreEvolucion(urlEvolucion) {
      const respuesta = await fetch(urlEvolucion);
      const detallesEvolucion = await respuesta.json();
      return detallesEvolucion;
     
    }

 //FIN POKEVOLUCIONES    

async function irAPagina(hoja) {
  window.location.href = `${hoja}`;
}
async function irAPokevolucion() {
  window.location.href = 'pokevolucion.html';
}
async function irADetallesYHabilidadesPokemon() {
  window.location.href = 'detalles&habilidades.html';
}
async function irAListaTipoPokemon() {
  window.location.href = 'tipo.html';
}
  
 
