import { supabase } from "~/postgres/supaclient";

export const getNumberData = async (
  lastStart: string,
  thisStart: string,
  End: string
) => {
  const { data: lastWeek } = await supabase
    .from("daily_visitor")
    .select("count")
    .lt("day_start", thisStart)
    .gte("day_start", lastStart);
  const { data: thisWeek } = await supabase
    .from("daily_visitor")
    .select("count")
    .lt("day_start", End)
    .gte("day_start", thisStart);
  if (lastWeek && thisWeek) {
    const lastWeekCount = lastWeek.reduce((sum, value) => sum + value.count, 0);
    const thisWeekCount = thisWeek.reduce((sum, value) => sum + value.count, 0);
    return {
      value: thisWeekCount.toString(),
      trendValue: ((thisWeekCount / (lastWeekCount || 1)) * 100).toString(),
      upAndDown: thisWeekCount > lastWeekCount,
    };
  } else {
    return { value: "0", trendValue: "0", upAndDown: false };
  }
};
