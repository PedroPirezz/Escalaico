function getNextWeekDates() {
  const today = new Date();
  const dayOfWeek = today.getDay();

  // Calculate the difference to get to the start of the next week (Monday)
  const daysUntilNextWeek = (8 - dayOfWeek) % 7;
  
  // Calculate the dates for next week's Tuesday, Thursday, and Sunday
  const nextTuesday = new Date(today);
  nextTuesday.setDate(today.getDate() + daysUntilNextWeek + 1); // Tuesday is the 2nd day of the week (0=Sunday, 1=Monday, 2=Tuesday)

  const nextThursday = new Date(today);
  nextThursday.setDate(today.getDate() + daysUntilNextWeek + 3); // Thursday is the 4th day of the week

  const nextSunday = new Date(today);
  nextSunday.setDate(today.getDate() + daysUntilNextWeek + 6); // Sunday is the 7th day of the week

  const formatDate = (date) => {
      const dd = String(date.getDate()).padStart(2, '0');
      const mm = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
      const yyyy = date.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
  };

  return {
      nextTuesday: formatDate(nextTuesday),
      nextThursday: formatDate(nextThursday),
      nextSunday: formatDate(nextSunday)
  };
}

// Export the function
module.exports = getNextWeekDates;
