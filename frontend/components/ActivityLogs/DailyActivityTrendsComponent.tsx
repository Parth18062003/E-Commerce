"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchDailyActivityTrends } from "@/store/activityLogSlice";

export const description = "Daily Activity Trends";

export function DailyActivityTrendsComponent() {
  const dispatch: AppDispatch = useDispatch();
  const { activityTrends, loading, error } = useSelector((state: RootState) => state.activityLog);

  useEffect(() => {
    dispatch(fetchDailyActivityTrends("LOGIN_SUCCESS") as any); // Replace with the actual activity type
  }, [dispatch]);

  const chartData = Object.entries(activityTrends).map(([date, count]) => ({
    date,
    count,
  }));

  const chartConfig = {
    activity: {
      label: "Daily Activities",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Activity Trends</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(5)} // Adjust as needed for date format
              />
              <Tooltip content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="count" fill="var(--color-desktop)" radius={8} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing activity trends for the last month
        </div>
      </CardFooter>
    </Card>
  );
}
