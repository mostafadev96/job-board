export const isStringHashed = (str: string) => {
    return (
      typeof str === 'string' &&
      str.length === 60 &&
      /^\$2[aby]\$\d{2}\$/.test(str)
    );
};
