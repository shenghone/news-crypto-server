import dayjs from "dayjs";

export const calcDuration = (past, today) => {
  switch (past) {
    case "1d":
      return dayjs(today)
        .subtract(1, "day")
        .format("YYYY-MM-DD");
      break;
    case "7d":
      return dayjs(today)
        .subtract(7, "day")
        .format("YYYY-MM-DD");
      break;
    case "1m":
      return dayjs(today)
        .subtract(1, "month")
        .format("YYYY-MM-DD");
      break;
    case "1y":
      return dayjs(today)
        .subtract(1, "year")
        .format("YYYY-MM-DD");
      break;
    case "5y":
      return dayjs(today)
        .subtract(5, "year")
        .format("YYYY-MM-DD");
      break;
    default:
      return;
  }
};

export const getInterval = period => {
  switch (period) {
    case "1d":
      return "45m";

    case "7d":
      return "3h";
    case "1m":
      return "1d";
    case "1y":
      return "1d";
    default:
      return "7d";
  }
};
