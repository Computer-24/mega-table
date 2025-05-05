const themeToggle = document.getElementById('theme-toggle');
const spinner = document.getElementById('spinner');
const tableData = document.getElementById('data-table');
const tableBody = document.getElementById('table-body');
const pagination = document.getElementById('pagination');
const pageNumber = document.getElementById('page-number');
const prevButton = document.getElementById('prev-btn');
const nextButton = document.getElementById('next-btn');
let data = [];
let sortedData = [];
let sortDirection = {}
let currentPage = 1;
const rowsPerPage = 10;

async function fetchData() {
    spinner.style.display = 'flex';
    try {
        const response = await fetch('https://randomuser.me/api/?results=50');
        const json = await response.json();
        data = json.results;
        sortedData = [...data];
        displayTable(sortedData);
        updateButtons();
    } catch (error) {
        console.error(error);
    } finally {
        spinner.style.display = 'none';
        tableData.style.display = 'table';
        pagination.style.display = 'block';
    }
}

fetchData();

function displayTable(dataToDisplay) {
    tableBody.innerText = '';
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedItems = dataToDisplay.slice(start, end);

    paginatedItems.forEach(user => {
        const row = `
              <tr>
                    <td data-label="Name">${user.name.first} ${user.name.last}</td>
                    <td data-label="Email">${user.email}</td>
                    <td data-label="Username">${user.login.username}</td>
                    <td data-label="Country">${user.location.country}</td>
                </tr>
            `
        tableBody.insertAdjacentHTML('beforeend', row);
    })
}

const body = document.body
const isDarkMode = localStorage.getItem('darkMode') === 'true';
if (isDarkMode) {
    body.classList.add('dark-mode');
    themeToggle.innerText = '🌞';
}

themeToggle.addEventListener('click', () => {
    body.style.transition = 'background-color 0.3s, color 0.3s';

    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'false');
        themeToggle.innerText = '🌚';
    } else {
        body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'true');
        themeToggle.innerText = '🌞';
    }
})

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayTable(sortedData);
        updateButtons();
    }
}

function nextPage() {
    if (currentPage * rowsPerPage < sortedData.length) {
        currentPage++;
        displayTable(sortedData);
        updateButtons();
    }
}

function updateButtons() {
    pageNumber.innerText = currentPage;
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage * rowsPerPage >= sortedData.length;
}

function sortTable(columnIndex) {
    if (!sortDirection[columnIndex]) {
        sortDirection[columnIndex] = 'asc';
    }
    sortedData = [...data].sort((a, b) => {
        let valA, valB;
        switch (columnIndex) {
            case 0: valA = `${a.name.first} ${a.name.last}`; valB = `${b.name.first} ${b.name.last}`; break;
            case 1: valA = a.email; valB = b.email; break;
            case 2: valA = a.login.username; valB = b.login.username; break;
            case 3: valA = a.location.country; valB = b.location.country; break;
            default: valA = ''; valB = ''; break;
        }
        return sortDirection[columnIndex] === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

    sortDirection[columnIndex] = sortDirection[columnIndex] === 'asc' ? 'desc' : 'asc';
    displayTable(sortedData);
    updateButtons();
    updateSortIcon(columnIndex, sortDirection[columnIndex]);
}
function updateSortIcon(columnIndex, direction) {
    clearSortIcons();
    const icon = document.getElementById(`icon-${columnIndex}`);
    icon.className = direction === 'asc' ? 'fas fa-sort-down' : 'fas fa-sort-up';
}

function clearSortIcons() {
    for (let i = 0; i < 4; i++) {
        const icon = document.getElementById(`icon-${i}`);
        icon.className = 'fas fa-sort';
    }
}

