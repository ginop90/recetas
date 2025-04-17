// Datos de recetas
const recipes = [
    {
        id: 'desayuno-avena',
        title: 'Avena con frutas y nueces',
        type: 'desayuno',
        image: 'img/desayuno-avena.jpg',
        calories: 350,
        protein: 12,
        carbs: 45
    },
    {
        id: 'desayuno-tostadas',
        title: 'Tostadas de aguacate y huevo',
        type: 'desayuno',
        image: 'img/desayuno-tostadas.jpg',
        calories: 320,
        protein: 15,
        carbs: 28
    },
    {
        id: 'almuerzo-pollo',
        title: 'Ensalada de pollo con quinoa',
        type: 'almuerzo',
        image: 'img/almuerzo-pollo.jpg',
        calories: 450,
        protein: 35,
        carbs: 40
    },
    {
        id: 'almuerzo-pasta',
        title: 'Pasta integral con vegetales',
        type: 'almuerzo',
        image: 'img/almuerzo-pasta.jpg',
        calories: 420,
        protein: 16,
        carbs: 65
    },
    {
        id: 'colacion-smoothie',
        title: 'Smoothie verde de espinacas',
        type: 'colacion',
        image: 'img/colacion-smoothie.jpg',
        calories: 180,
        protein: 6,
        carbs: 25
    },
    {
        id: 'colacion-yogurt',
        title: 'Yogurt con frutos secos',
        type: 'colacion',
        image: 'img/colacion-yogurt.jpg',
        calories: 220,
        protein: 10,
        carbs: 20
    },
    {
        id: 'cena-salmon',
        title: 'Salmón al horno con verduras',
        type: 'cena',
        image: 'img/cena-salmon.jpg',
        calories: 380,
        protein: 32,
        carbs: 15
    },
    {
        id: 'cena-sopa',
        title: 'Sopa de lentejas con vegetales',
        type: 'cena',
        image: 'img/cena-sopa.jpg',
        calories: 290,
        protein: 18,
        carbs: 38
    }
];

// Mapeo de tipos de recetas a etiquetas en español
const typeLabels = {
    'desayuno': 'Desayuno',
    'almuerzo': 'Almuerzo',
    'colacion': 'Colación',
    'cena': 'Cena'
};

// Cargar recetas cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si estamos en la página de inicio
    if (document.getElementById('recipes-container')) {
        loadRecipes('todos');
        setupFilters();
        setupSearch();
        setupFavorites();
        setupThemeToggle();
    }
    
    // Verificar si estamos en una página de receta
    if (document.querySelector('.recipe-container')) {
        setupRecipePage();
    }
});

// Cargar recetas en la página principal
function loadRecipes(filter) {
    const container = document.getElementById('recipes-container');
    container.innerHTML = '';
    
    // Obtener favoritos del localStorage
    const favorites = getFavorites();
    
    // Filtrar recetas según el criterio
    let filteredRecipes = recipes;
    
    if (filter !== 'todos') {
        filteredRecipes = recipes.filter(recipe => recipe.type === filter);
    }
    
    // Crear tarjetas de recetas
    filteredRecipes.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        
        const isFavorite = favorites.includes(recipe.id);
        const favoriteClass = isFavorite ? 'active' : '';
        
        card.innerHTML = `
            <a href="recetas/${recipe.id}.html">
                <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image">
                <span class="recipe-tag">${typeLabels[recipe.type]}</span>
                <div class="recipe-info">
                    <h3 class="recipe-title">${recipe.title}</h3>
                    <div class="recipe-meta">
                        <span>${recipe.calories} kcal</span>
                        <button class="favorite-btn ${favoriteClass}" data-id="${recipe.id}">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
            </a>
        `;
        
        container.appendChild(card);
    });
    
    // Actualizar botones de favoritos
    setupFavoriteButtons();
}

// Configurar filtros de categorías
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Quitar clase activa de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Agregar clase activa al botón clickeado
            this.classList.add('active');
            
            // Filtrar recetas
            loadRecipes(this.dataset.filter);
        });
    });
}

// Configurar buscador
function setupSearch() {
    const searchInput = document.getElementById('search');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        // Si el campo está vacío, mostrar todas las recetas
        if (searchTerm === '') {
            const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
            loadRecipes(activeFilter);
            return;
        }
        
        // Filtrar recetas por término de búsqueda
        const container = document.getElementById('recipes-container');
        container.innerHTML = '';
        
        // Obtener favoritos del localStorage
        const favorites = getFavorites();
        
        const filteredRecipes = recipes.filter(recipe => 
            recipe.title.toLowerCase().includes(searchTerm)
        );
        
        // Crear tarjetas de recetas filtradas
        filteredRecipes.forEach(recipe => {
            const card = document.createElement('div');
            card.className = 'recipe-card';
            
            const isFavorite = favorites.includes(recipe.id);
            const favoriteClass = isFavorite ? 'active' : '';
            
            card.innerHTML = `
                <a href="recetas/${recipe.id}.html">
                    <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image">
                    <span class="recipe-tag">${typeLabels[recipe.type]}</span>
                    <div class="recipe-info">
                        <h3 class="recipe-title">${recipe.title}</h3>
                        <div class="recipe-meta">
                            <span>${recipe.calories} kcal</span>
                            <button class="favorite-btn ${favoriteClass}" data-id="${recipe.id}">
                                <i class="fas fa-heart"></i>
                            </button>
                        </div>
                    </div>
                </a>
            `;
            
            container.appendChild(card);
        });
        
        // Actualizar botones de favoritos
        setupFavoriteButtons();
    });
}

// Configurar favoritos
function setupFavorites() {
    // Verificar si existe un botón de filtro de favoritos
    const favoritesButton = document.querySelector('.filter-btn[data-filter="favoritos"]');
    
    if (favoritesButton) {
        favoritesButton.addEventListener('click', function() {
            const favorites = getFavorites();
            const container = document.getElementById('recipes-container');
            container.innerHTML = '';
            
            // Filtrar recetas favoritas
            const favoritedRecipes = recipes.filter(recipe => favorites.includes(recipe.id));
            
            // Crear tarjetas de recetas favoritas
            favoritedRecipes.forEach(recipe => {
                const card = document.createElement('div');
                card.className = 'recipe-card';
                
                card.innerHTML = `
                    <a href="recetas/${recipe.id}.html">
                        <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image">
                        <span class="recipe-tag">${typeLabels[recipe.type]}</span>
                        <div class="recipe-info">
                            <h3 class="recipe-title">${recipe.title}</h3>
                            <div class="recipe-meta">
                                <span>${recipe.calories} kcal</span>
                                <button class="favorite-btn active" data-id="${recipe.id}">
                                    <i class="fas fa-heart"></i>
                                </button>
                            </div>
                        </div>
                    </a>
                `;
                
                container.appendChild(card);
            });
            
            // Actualizar botones de favoritos
            setupFavoriteButtons();
        });
    }
}

// Configurar botones de favoritos
function setupFavoriteButtons() {
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    
    favoriteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const recipeId = this.dataset.id;
            const favorites = getFavorites();
            
            // Verificar si la receta ya es favorita
            const index = favorites.indexOf(recipeId);
            
            if (index === -1) {
                // Agregar a favoritos
                favorites.push(recipeId);
                this.classList.add('active');
            } else {
                // Quitar de favoritos
                favorites.splice(index, 1);
                this.classList.remove('active');
            }
            
            // Guardar favoritos en localStorage
            localStorage.setItem('favorites', JSON.stringify(favorites));
        });
    });
}

// Obtener favoritos del localStorage
function getFavorites() {
    const favoritesString = localStorage.getItem('favorites');
    return favoritesString ? JSON.parse(favoritesString) : [];
}

// Configurar la página de receta individual
function setupRecipePage() {
    // Aquí se podría poner lógica específica para la página de receta
    // Por ejemplo, calcular totales de nutrientes, etc.
}

// Configurar el toggle de tema claro/oscuro
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');
    
    // Verificar tema guardado
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    // Aplicar tema inicial
    if (isDarkMode) {
        document.body.classList.add('dark-theme');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
    
    // Configurar evento de clic
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        
        // Actualizar icono
        if (document.body.classList.contains('dark-theme')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('darkMode', 'true');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('darkMode', 'false');
        }
    });
}