import { makeNav } from './modules/nav.js';
import navItemsObject from './modules/navitems.js';

const root = document.querySelector('.site-wrap');
const nytapi = 'I1v92ZQoxXVhltaR4Di8ZiNndFaWe16C';
// const nytUrl = `https://api.nytimes.com/svc/topstories/v2/travel.json?api-key=${nytapi}`;

makeNav();

const categories = navItemsObject.map((item) => item);
const navItems = document.querySelectorAll("li[class^='navitem-']");

for (let i = 0; i < navItems.length; i++) {
    navItems[i].addEventListener('click', () => {
        fetchArticles(categories[i]);
    });
}

function fetchArticles(navItem) {
    const section = navItem.section;
    if (!localStorage.getItem(section)) {
        console.log('section not in local storage, fetching');
        fetch(
            `https://api.nytimes.com/svc/topstories/v2/${section}.json?api-key=${nytapi}`,
        )
            .then((response) => response.json())
            .then((data) => {
                data.results = data.results.filter((item) =>
                    filterSection(item, section),
                );
                setLocalStorage(section, data);
            })
            .catch((error) => {
                console.warn(error);
            });
    } else {
        console.log('section in local storage');
        renderStories(navItem);
    }
}

function filterSection(item, section) {
    return item.section.includes(section);
}

function setLocalStorage(section, myJson) {
    localStorage.setItem(section, JSON.stringify(myJson));
    renderStories(section);
}

function setActiveTab(navItem) {
    const activeTab = document.querySelector('a.active');
    if (activeTab) {
        activeTab.classList.remove('active');
    }
    const tab = document.querySelector(`nav li a[href="${navItem.link}"]`);
    tab.classList.add('active');
}

function renderStories(navItem) {
    const section = navItem.section;
    setActiveTab(navItem);
    root.replaceChildren(...[]);
    let data = JSON.parse(localStorage.getItem(section));
    if (data) {
        const sorted = urlSortAscending()
            ? data.results.sort(sortAscending)
            : data.results.sort(sortDescending);
        sorted.map((story) => {
            var storyEl = document.createElement('div');
            storyEl.className = 'entry';
            storyEl.innerHTML = `
        <img src="${story.multimedia ? story.multimedia[0].url : ''}" alt="${
                story.title
            }" />
        <div>
          <h3><a target="_blank" href="${story.url}">${story.title}</a></h3>
          <p>${story.abstract}</p>
          <p>${story.section}</p>
        </div>
        `;
            root.append(storyEl);
        });
    } else {
        console.log('data not ready yet');
    }
    // var sortEl = document.createElement('div');
    // sortEl.innerHTML = `
    // <a href="?sort=asc#${section}">ASC</a>
    // <a href="?sort=desc#${section}">DESC</a>
    // `;
    // root.prepend(sortEl);
}

function sortAscending(a, b) {
    return a.title.localeCompare(b.title);
}

function sortDescending(a, b) {
    return b.title.localeCompare(a.title);
}

function urlSortAscending() {
    const urlParam = new URLSearchParams(window.location.search);
    const mode = urlParam.get('sort');
    return mode === 'asc';
}
