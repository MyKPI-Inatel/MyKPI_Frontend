import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../components/ui/chart";
import { env } from "../lib/env";
import { useParams } from "react-router-dom";
import { Layout } from "../components/layout";

const chartConfig = {
  average_score: {
    label: "Average Score",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function SurveyBarChart() {
  const { surveyId } = useParams<{ surveyId: string }>();
  
  const fetchSurveyData = async () => {
    const token = localStorage.getItem("access_token");
  
    if (!token) {
      throw new Error("Token not found");
    }
  
    const response = await fetch(`${env.VITE_API_URL}/v1/reports/${surveyId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  
    if (!response.ok) {
      throw new Error("Failed to fetch survey data");
    }
  
    return response.json();
  };

  const { data, isLoading, isError } = useQuery({ queryKey: ['responded-surveys'], queryFn: fetchSurveyData });

  if (isLoading) return <div>Loading chart...</div>;
  if (isError) return <div>Error loading chart</div>;

  const chartData = data.map((item: any) => ({
    question: item.question_title,
    average_score: parseFloat(item.average_score),
  }));

  return (
    <Layout className="flex w-full space-x-5 p-5">
      <ChartContainer config={chartConfig}>
        <BarChart
          accessibilityLayer
          data={chartData}
          margin={{
            top: 20,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="question"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 15) + "..."}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Bar
            dataKey="average_score"
            fill="var(--color-average_score)"
            radius={8}
          >
            <LabelList
              position="top"
              offset={12}
              className="fill-foreground"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </Layout>
  );
}
