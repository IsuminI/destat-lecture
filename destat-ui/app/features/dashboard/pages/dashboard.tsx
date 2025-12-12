// - navigation
//     - Dashboard
//     - Survey
//        - All surveys
//        - Create survey
//     - Archive
//        - Finished surveys
//     - Profile
//        - My surveys
//        - My responses

import { supabase } from "~/postgres/supaclient";
import TrendCard from "../components/trend-card";
import { TrendChart } from "../components/trend-chard";
import type { Route } from "./+types/dashboard";
import { DateTime } from "luxon";
import { getNumberData } from "../query";
// [Number]
// Visitors
// Live Surveys
// Archived Surveys

// [Graph]
// time x Live Surveys
// time x Archived Surveys

const data = [
  { date: "2025-10-01", data: 186 },
  { date: "2025-10-02", data: 190 },
  { date: "2025-10-03", data: 188 },
  { date: "2025-10-04", data: 192 },
  { date: "2025-10-05", data: 195 },
  { date: "2025-10-06", data: 193 },
  { date: "2025-10-07", data: 198 },
  { date: "2025-10-08", data: 200 },
  { date: "2025-10-09", data: 202 },
  { date: "2025-10-10", data: 199 },
  { date: "2025-10-11", data: 205 },
  { date: "2025-10-12", data: 207 },
  { date: "2025-10-13", data: 210 },
  { date: "2025-10-14", data: 208 },
];

export const loader = async ({ request }: Route.LoaderArgs) => {
  await supabase.rpc("increment_daily_visitor", {
    day: DateTime.now().startOf("day").toISO({ includeOffset: false }),
  });
  const thisWeekStart = DateTime.now()
    .startOf("week")
    .toISO({ includeOffset: false });
  const thisWeekEnd = DateTime.now().toISO({ includeOffset: false });
  const lastWeekStart = DateTime.now()
    .startOf("week")
    .toISO({ includeOffset: false });

  const { data: liveSurveyCount } = await supabase
    .from("daily_live_survey")
    .select("count, created_at")
    .order("created_at");
  let formedLivedSurveyCount = [{ date: "", data: 0 }];
  let formedArchivedSurveyCount = [{ date: "", data: 0 }];
  if (liveSurveyCount) {
    formedLivedSurveyCount = liveSurveyCount.map((c) => {
      return {
        date: c.created_at,
        data: c.count,
      };
    });
    formedArchivedSurveyCount = liveSurveyCount.map((c) => {
      return {
        date: c.created_at,
        data: c.count,
      };
    });
  }

  // const { data: archivedSurveyCount } = await supabase
  //   .from("daily_archived_survey")
  //   .select("count, created_at")
  //   .order("created_at");

  const totalVisitors = await getNumberData(
    lastWeekStart,
    thisWeekStart,
    thisWeekEnd
  );

  const liveVisitors = await getNumberData(
    lastWeekStart,
    thisWeekStart,
    thisWeekEnd
  );

  const archivedVisitors = await getNumberData(
    lastWeekStart,
    thisWeekStart,
    thisWeekEnd
  );
  return {
    ...totalVisitors,
    liveVisitors,
    archivedVisitors,
    formedLivedSurveyCount,
    formedArchivedSurveyCount,
  };
};

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="grid grid-cols-3 gap-5 mt-10 w-full">
        <TrendCard
          title={"Total Visitors"}
          value={loaderData.value}
          trendValue={loaderData.trendValue + "%"}
          trendMessage={loaderData.upAndDown ? "Trending Up" : "Tranding Down"}
          periodMessage={"last 7 days"}
        />
        <TrendCard
          title={"Live Visitors"}
          value={loaderData.liveVisitors.value}
          trendValue={loaderData.liveVisitors.trendValue + "%"}
          trendMessage={
            loaderData.liveVisitors.upAndDown ? "Trending Up" : "Tranding Down"
          }
          periodMessage={"last 7 days"}
        />
        <TrendCard
          title={"Archived Visitors"}
          value={loaderData.archivedVisitors.value}
          trendValue={loaderData.archivedVisitors.trendValue + "%"}
          trendMessage={
            loaderData.archivedVisitors.upAndDown
              ? "Trending Up"
              : "Tranding Down"
          }
          periodMessage={"last 7 days"}
        />
      </div>
      <div className="grid grid-cols-2 mt-5 gap-5 w-full">
        <TrendChart
          title={"Live Surveys"}
          description={"Daily live survey count"}
          trendMessage={""}
          periodMessage={""}
          chartData={loaderData.formedLivedSurveyCount}
        />
        <TrendChart
          title={"Archived Surveys"}
          description={"Daily archived survey count"}
          trendMessage={""}
          periodMessage={""}
          chartData={loaderData.formedArchivedSurveyCount}
        />
      </div>
    </div>
  );
}
