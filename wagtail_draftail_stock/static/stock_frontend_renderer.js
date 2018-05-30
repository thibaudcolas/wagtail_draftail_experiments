(() => {
  'use strict';

  /**
   * For all data-stock elements, render a link to finance.yahoo.com as well as a little SVG sparkline.
   */
  [].slice.call(document.querySelectorAll('[data-stock]')).forEach((elt) => {
    const link = document.createElement('a');
    link.href = `https://finance.yahoo.com/quote/${elt.dataset.stock}`;
    link.innerHTML = `${elt.innerHTML}<svg width="50" height="20" stroke-width="2" stroke="blue" fill="rgba(0, 0, 255, .2)"><path d="M4 14.19 L 4 14.19 L 13.2 14.21 L 22.4 13.77 L 31.59 13.99 L 40.8 13.46 L 50 11.68 L 59.19 11.35 L 68.39 10.68 L 77.6 7.11 L 86.8 7.85 L 96 4" fill="none"></path><path d="M4 14.19 L 4 14.19 L 13.2 14.21 L 22.4 13.77 L 31.59 13.99 L 40.8 13.46 L 50 11.68 L 59.19 11.35 L 68.39 10.68 L 77.6 7.11 L 86.8 7.85 L 96 4 V 20 L 4 20 Z" stroke="none"></path></svg>`;

    elt.innerHTML = '';
    elt.appendChild(link);
  });
})();
