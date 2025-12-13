import { supabase } from "~/postgres/supaclient";

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

// before rendering Home react component
export async function loader() {
  const { data } = await supabase().from("destat-test").select("*");
  // console.log(data);
}

export default function Home() {
  return <div>Hello destat world</div>;
}
