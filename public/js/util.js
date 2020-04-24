const darkModeBtn = document.getElementById('dark-mode-btn');

darkModeBtn.addEventListener('click', () => {
  console.log('clicked');
  document.body.classList.toggle('dark-mode');
});

export function capitaliseFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function loader(parent) {
  const childDiv = document.createElement('div');
  childDiv.classList.add('loader');
  parent.appendChild(childDiv);
}

export const icons = {
  0: 'fa-users',
  1: 'fa-user-friends',
  2: 'fa-procedures',
  3: 'fa-ambulance',
  4: 'fa-heart',
  5: 'fa-heartbeat',
  6: 'fa-notes-medical',
  7: 'fa-vial',
  8: 'fa-globe-europe',
};

export const mainColors = {
  lightGreen: '#80b796',
  orange: 'lightsalmon',
  lightBlue: '#9bbce3',
  darkGreen: '#00afaa',
  darkRed: '#d72525',
  lightRed: '#ea8c8c',
  lightPurple: 'rgba(57, 0, 102, 0.43)',
};

// format numbers to friendly format
export const formatter = new Intl.NumberFormat('en');
