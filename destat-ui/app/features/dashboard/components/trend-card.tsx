import { TrendingUpIcon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardAction,
  CardFooter,
} from "~/components/ui/card";

export default function TrendCard({
  title,
  value,
  trendValue,
  trendMessage,
  periodMessage,
}: {
  title: string;
  value: string;
  trendValue: string;
  trendMessage: string;
  periodMessage: string;
}) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {value}
        </CardTitle>
        <CardAction>
          <TrendingUpIcon />
          {trendValue}
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {trendMessage} <TrendingUpIcon className="size-4" />
        </div>
        <div className="text-muted-foreground">{periodMessage}</div>
      </CardFooter>
    </Card>
  );
}
