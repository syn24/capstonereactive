/**
 * returns true if string
 * is letters only
 * @param {*} name
 * @returns boolean
 */
function validateName(name) {
  return /^[a-zA-Z]+$/.test(name.trim());
}

export default validateName;