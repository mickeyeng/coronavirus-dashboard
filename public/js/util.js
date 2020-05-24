export function capitaliseFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const selectObjKeys = (obj, keys) =>
  Object.entries(obj).filter(([key]) => keys.includes(key));

export const getObjValues = obj => Object.values(obj);

// format numbers to friendly format
export const formatter = new Intl.NumberFormat("en");

export const capitaliseFirstLetterAndAddSpace = str => {
  return (
    str.charAt(0).toUpperCase() +
    str
      .slice(1)
      .replace(/([A-Z]+)/g, " $1")
      .replace(/^ /, "")
  );
};

export const appendNodeWithClass = (
  elName,
  className,
  parentDiv,
  idName = "",
  text = ""
) => {
  const el = document.createElement(elName);
  el.id = idName;
  el.textContent = text;
  parentDiv.appendChild(el).classList.add(className);
  return el;
};
