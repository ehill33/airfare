'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Fares } from '@/data/firestore';
import { Line, XAxis, YAxis } from 'recharts';
import { LineChart } from 'recharts';

export default function PriceChart({ fares }: { fares: Fares[] }) {
  const chartData = getChartData(fares);

  return (
    <Card className='mb-4'>
      <CardHeader>
        <CardTitle>Price History</CardTitle>
      </CardHeader>
      <CardContent className='p-2 md:p-6'>
        <ChartContainer config={{}}>
          <LineChart accessibilityLayer data={chartData}>
            <XAxis dataKey='date' tickLine={false} />
            <YAxis
              tickLine={false}
              tickCount={8}
              domain={[
                (dataMin: number) => Math.floor((dataMin - 100) / 100) * 100,
                (dataMax: number) => Math.ceil((dataMax + 100) / 100) * 100,
              ]}
            />
            <Line type='step' dataKey='price' strokeWidth={2} />

            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function getChartData(fares: Fares[]) {
  fares.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return fares.map((fare) => ({
    date: new Date(fare.createdAt).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
    }),
    price: fare.cheapest.price,
  }));
}
