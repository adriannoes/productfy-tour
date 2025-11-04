import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
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

  const stepViews = analytics
    ?.filter(a => a.event_type === 'step_view')
    .reduce((acc, curr) => {
      const step = curr.step_index ?? 0;
      acc[step] = (acc[step] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

  const stepData = Object.entries(stepViews || {})
    .map(([step, count]) => ({
      step: `Step ${parseInt(step) + 1}`,
      views: count
    }))
    .sort((a, b) => {
      const stepA = parseInt(a.step.replace('Step ', ''));
      const stepB = parseInt(b.step.replace('Step ', ''));
      return stepA - stepB;
    });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Eye className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Visualizações</p>
              <p className="text-2xl font-bold">{totalViews}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completados</p>
              <p className="text-2xl font-bold">{totalCompletes}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <XCircle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pulados</p>
              <p className="text-2xl font-bold">{totalSkips}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Taxa de Conclusão</p>
              <p className="text-2xl font-bold">{completionRate}%</p>
            </div>
          </div>
        </Card>
      </div>

      {stepData.length > 0 ? (
        <Card className="p-6">
          <h3 className="font-semibold mb-6 text-lg">Visualizações por Step</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stepData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="step" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="views" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      ) : (
        <Card className="p-12">
          <div className="text-center">
            <p className="text-muted-foreground">Nenhum dado de visualização de steps ainda.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Os dados aparecerão quando usuários interagirem com o tour.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};
