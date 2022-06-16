export const addMinutesToCurrentDate = minutesToAdd => {
  const currentDate = new Date();
  currentDate.setMinutes(minutesToAdd + currentDate.getMinutes());

  return currentDate;
};
