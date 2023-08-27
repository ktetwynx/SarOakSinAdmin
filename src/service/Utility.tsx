export const reverseDataArray = (data: []) => {
  return data.map((value: any, index: any) => {
    return data[data.length - 1 - index];
  });
};
