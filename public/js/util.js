const darkModeBtn = document.getElementById('dark-mode-btn');

darkModeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  darkModeBtn.classList.toggle('fa-moon');
  darkModeBtn.classList.toggle('fa-sun');
});

export function capitaliseFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function loader(parent) {
  const childDiv = document.createElement('div');
  childDiv.classList.add('loader');
  parent.appendChild(childDiv);
}

export const selectObjKeys = (obj, keys) =>
  Object.entries(obj).filter(([key]) => keys.includes(key));

export const getObjValues = (obj) => Object.values(obj);

// format numbers to friendly format
export const formatter = new Intl.NumberFormat('en');

export const appendNodeWithClass = (
  elName,
  className,
  parentDiv,
  idName = '',
  text = '' ,
) => {
  const el = document.createElement(elName);
  el.classList.add(className);
  el.id = idName;
  el.textContent = text;
  parentDiv.appendChild(el);
  return el
};
