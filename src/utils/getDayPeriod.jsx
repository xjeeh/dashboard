const getPeriod = () => {
  const hour = new Date().getHours();
  if (hour > 0 && hour < 12) return "morning";
  else if (hour < 18) return "afternoon";
  else return "night";
};

export default getPeriod;
