import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Eye, CheckCircle, XCircle, TrendingUp } from "lucide-react";

interface TourAnalyticsProps {
  tourId: string;
}

export const TourAnalytics = ({ tourId }: TourAnalyticsProps) => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['tour-analytics', tourId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tour_analytics')
        .select('*')
        .eq('tour_id', tourId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Carregando analytics...</p>
      </div>
    );
  }

  const totalViews = analytics?.filter(a => a.event_type === 'view').length || 0;
  const totalCompletes = analytics?.filter(a => a.event_type === 'complete').length || 0;
  const totalSkips = analytics?.filter(a => a.event_type === 'skip').length || 0;
  const completionRate = totalViews > 0 ? ((totalCompletes / totalViews) * 100).toFixed(1) : '0';

  // Aggregate step views
  const stepViews = analytics
    ?.filter(a => a.event_type === 'step_view')
    .reduce((acc, curr) => {
      const step = curr.step_index ?? 0;
      acc[step] = (acc[step] || 0) + 1;
      return acc;
    }, {} as Record<number, number>) || {};

  const stepData = Object.entries(stepViews).map(([step, count]) => ({
    step: `Step ${parseInt(step) + 1}`,
    views: count
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
            <Eye className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews}</div>
            <p className="text-xs text-muted-foreground">Total de visualizações do tour</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completados</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompletes}</div>
            <p className="text-xs text-muted-foreground">Tours completados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pulados</CardTitle>
            <XCircle className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSkips}</div>
            <p className="text-xs text-muted-foreground">Tours abandonados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <p className="text-xs text-muted-foreground">Usuários que completaram</p>
          </CardContent>
        </Card>
      </div>

      {stepData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Visualizações por Step</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stepData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="step" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                />
                <Bar dataKey="views" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {analytics && analytics.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Nenhum dado de analytics disponível ainda</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
