export const useLocalstorage = () => {
  const getValue = (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  return { getValue };
};
