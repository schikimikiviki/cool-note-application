let regex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{7,15}$/;

let password = 'Password123!';

let result = regex.test(password);
console.log('REGEX is: ', result);
