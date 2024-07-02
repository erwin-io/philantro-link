export const convertNotationToObject = (notation: string, nestedValue):any => {
    let object = {}
    let pointer = object;
    notation.split('.').map( (key, index, arr) => {
      pointer = (pointer[key] = (index == arr.length - 1? nestedValue: {}))
    });
    return object;
}


export const getAge = (birthDate: Date) => {
  const timeDiff = Math.abs(Date.now() - birthDate.getTime());
  return Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
};
