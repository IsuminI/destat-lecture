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

import TrendCard from "../components/trend-card";
import { TrendChart } from "../components/trend-chard";

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

export default function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="grid grid-cols-3 gap-5 mt-10 w-full">
        <TrendCard
          title={"Total Visitors"}
          value={"123,123,123"}
          trendValue={"200%"}
          trendMessage={"Trending up"}
          periodMessage={"last 6 months "}
        />
        <TrendCard
          title={"Live Visitors"}
          value={"123"}
          trendValue={"200%"}
          trendMessage={"Trending up"}
          periodMessage={"last 6 months "}
        />
        <TrendCard
          title={"Archived Visitors"}
          value={"123,123"}
          trendValue={"200%"}
          trendMessage={"Trending up"}
          periodMessage={"last 6 months "}
        />
      </div>
      <div className="grid grid-cols-2 mt-5 gap-5 w-full">
        <TrendChart
          title={"Live Surveys"}
          description={"Daily live survey count"}
          trendMessage={""}
          periodMessage={""}
          chartData={data}
        />
        <TrendChart
          title={"Archived Surveys"}
          description={"Daily archived survey count"}
          trendMessage={""}
          periodMessage={""}
          chartData={data}
        />
      </div>
    </div>
  );
}
