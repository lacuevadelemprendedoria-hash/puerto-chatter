import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MousePointerClick, Loader2 } from "lucide-react";

interface AnalyticsData {
  totalOpens: number;
  totalInteractions: number;
}

export function AnalyticsCard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data: dailyData, error } = await supabase
          .from("analytics_daily")
          .select("opens_count, questions_count");

        if (error) throw error;

        const totals = dailyData?.reduce(
          (acc, row) => ({
            totalOpens: acc.totalOpens + (row.opens_count || 0),
            totalInteractions: acc.totalInteractions + (row.questions_count || 0),
          }),
          { totalOpens: 0, totalInteractions: 0 }
        ) || { totalOpens: 0, totalInteractions: 0 };

        setData(totals);
      } catch (error) {
        console.error("Error fetching analytics:", error);
        setData({ totalOpens: 0, totalInteractions: 0 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">App Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="p-2 rounded-full bg-primary/10">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{data?.totalOpens || 0}</p>
              <p className="text-xs text-muted-foreground">Aperturas</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="p-2 rounded-full bg-primary/10">
              <MousePointerClick className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{data?.totalInteractions || 0}</p>
              <p className="text-xs text-muted-foreground">Interacciones</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
