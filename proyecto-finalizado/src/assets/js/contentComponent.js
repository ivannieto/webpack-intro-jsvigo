require('../fonts/font-mfizz.css');

export default () => {
  const contentComponent = document.createElement('content');
  const divComponent = document.createElement('div');
  const pComponent = document.createElement('p');
  pComponent.innerHTML = 'Hola <i class="icon-javascript"></i>Vigo!';
  divComponent.appendChild(pComponent);

  divComponent.onclick = () => {
    import('./lazyComponent')
    .then((lazyComponent) => {
      divComponent.innerHTML = lazyComponent.default;
    })
    .catch((err) => {
      console.error(err);
    });
  };

  contentComponent.appendChild(divComponent);
  return contentComponent;
};
