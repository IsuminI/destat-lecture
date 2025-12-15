import { supabase } from "~/postgres/supaclient";

export const getNumberData = async (
  lastStart: string,
  thisStart: string,
  End: string,
  scope: "total" | "live" | "archive"
) => {
  if (scope == "total") {
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
      const lastWeekCount = lastWeek.reduce(
        (sum, value) => sum + value.count,
        0
      );
      const thisWeekCount = thisWeek.reduce(
        (sum, value) => sum + value.count,
        0
      );
      return {
        value: thisWeekCount.toString(),
        trendValue: ((thisWeekCount / (lastWeekCount || 1)) * 100).toString(),
        upAndDown: thisWeekCount > lastWeekCount,
      };
    } else {
      return { value: "0", trendValue: "0", upAndDown: false };
    }
  }

  const finish = scope === "archive";
  const { data: lastWeek } = await supabase
    .from("survey")
    .select("view")
    .eq("finish", finish)
    .lt("created_at", thisStart)
    .gte("created_at", lastStart);
  const { data: thisWeek } = await supabase
    .from("survey")
    .select("view")
    .eq("finish", finish)
    .lt("created_at", End)
    .gte("created_at", thisStart);

  if (lastWeek && thisWeek) {
    const lastWeekCount = (lastWeek ?? []).reduce(
      (sum, value) => sum + (value.view ?? 0),
      0
    );
    const thisWeekCount = (thisWeek ?? []).reduce(
      (sum, value) => sum + (value.view ?? 0),
      0
    );

    return {
      value: thisWeekCount.toString(),
      trendValue: ((thisWeekCount / (lastWeekCount || 1)) * 100).toString(),
      upAndDown: thisWeekCount > lastWeekCount,
    };
  } else {
    return { value: "0", trendValue: "0", upAndDown: false };
  }
};
