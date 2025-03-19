import dayjs from "dayjs";
import ProgressBar from "./ProgressBar";
import dayOfYear from "dayjs/plugin/dayOfYear";
import isLeapYear from "dayjs/plugin/isLeapYear";

dayjs.extend(dayOfYear);
dayjs.extend(isLeapYear);

const YearProgessBar = () => {
  const dayOfYear = dayjs().dayOfYear();
  const totalDays = dayjs().isLeapYear() ? 366 : 365;
  const percent = (dayOfYear / totalDays) * 100;

  return (
    <ProgressBar
      progress={{ percent }}
      color="#78b1b8"
      label={
        <>
          <b>{dayjs().year()}</b> is <b>{percent.toFixed(2)}%</b> complete
        </>
      }
    />
  );
};

export default YearProgessBar;
