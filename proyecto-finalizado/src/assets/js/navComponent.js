export default () => {
  const navComponent = document.createElement('header');
  const src = require('../images/augmented-reality.svg');

  navComponent.innerHTML = `
    <nav class="pure-menu pure-menu-horizontal">
      <ul class="pure-menu-list">
        <li class="pure-menu-item pure-menu-selected"><img class="companyLogo" src="${src}"></a></li>
        <li class="pure-menu-item"><a href="#" class="pure-menu-link"><i class="fa fa-bicycle fa-4" aria-hidden="true"></i> Normal</a></li>
        <li class="pure-menu-item pure-menu-disabled">Disabled</li>
      </ul>
    </nav>
  `;
  return navComponent;
};
