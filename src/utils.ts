export const hash = (str: string) => {
  let hash = 0;
  if (str.length > 0) {
    for (let i = 0; i < str.length; i++) {
      const character = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + character;
      hash &= hash;
    }
  }
  return hash + '';
}
