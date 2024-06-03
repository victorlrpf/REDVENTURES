const urlGetBroths = 'https://api.tech.redventures.com.br/broths';
const urlGetProteins = 'https://api.tech.redventures.com.br/proteins';
const key = 'ZtVdh8XQ2U8pWI2gmZ7f796Vh8GllXoN7mr0djNf';

async function fetchBroths() {
    try {
        const response = await fetch(urlGetBroths, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': key
            }
        });
        if (!response.ok) {
            throw new Error('Erro ao buscar broths: ' + response.status);
        }
        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
    }
}

async function fetchProteins() {
    try {
        const response = await fetch(urlGetProteins, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': key
            }
        });
        if (!response.ok) {
            throw new Error('Erro ao buscar proteínas: ' + response.status);
        }
        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const broths = await fetchBroths();
    if (broths) {
        displayBroths(broths);
    }

    const proteins = await fetchProteins();
    if (proteins) {
        displayProteins(proteins);
    }
});

function toggleActive(element, activeImage, inactiveImage, ) {
    const img = element.querySelector('img');
    if (element.classList.contains('active')) {
        element.classList.remove('active');
        img.src = inactiveImage;
    } else {
        element.classList.add('active');
        img.src = activeImage;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const broths = await fetchBroths();
    if (broths) {
        const brothContainer = document.querySelector('.broths');
        broths.forEach(broth => {
            const brothElement = document.createElement('div');
            brothElement.classList.add('broth');
            brothElement.innerHTML = `
                <img src="${broth.imageInactive}" alt="${broth.name}" class="broth-image">
                <p>${broth.name}</p>
                <p>${broth.description}</p>
                <p class="price">US$ ${broth.price}</p>
            `;
            brothElement.addEventListener('click', () => toggleActive(brothElement, broth.imageActive, broth.imageInactive));
            brothContainer.appendChild(brothElement);
        });
    }

    const proteins = await fetchProteins();
    if (proteins) {
        const proteinContainer = document.querySelector('.meats');
        proteins.forEach(protein => {
            const proteinElement = document.createElement('div');
            proteinElement.classList.add('meat');
            proteinElement.innerHTML = `
                <img src="${protein.imageInactive}" alt="${protein.name}" class="meat-image">
                <p>${protein.name}</p>
                <p>${protein.description}</p>
                <p class='price'>US$ ${protein.price}</p>
            `;
            proteinElement.addEventListener('click', () => toggleActive(proteinElement, protein.imageActive, protein.imageInactive));
            proteinContainer.appendChild(proteinElement);
        });
    }
});
