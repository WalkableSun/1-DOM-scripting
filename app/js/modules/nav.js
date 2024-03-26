import navItemsObject from './navitems.js';

export function makeNav() {
    const nav = document.querySelector('.main-menu');
    const markup = `
        <ul>
        ${navItemsObject
            .map(
                (item, index) =>
                    // `<li class="navitem-${index}">${item.label}<a href="${item.link}">↑</a><a href="${item.linkD}">↓</a></li>`,
                    `<li class="navitem-${index}"><a href="${item.link}">${item.label}</a></li>`,
            )
            .join('')}
        </ul>
        `;
    nav.querySelector('#main-nav').innerHTML = markup;
}
