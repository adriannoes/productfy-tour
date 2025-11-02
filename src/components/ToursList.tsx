import { Tour } from "@/pages/Index";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

type ToursListProps = {
  tours: Tour[];
  isLoading: boolean;
  onSelectTour: (tour: Tour) => void;
  onDeleteTour: (tourId: string) => void;
};

export const ToursList = ({ tours, isLoading, onSelectTour, onDeleteTour }: ToursListProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-5">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-3 w-20 mb-4" />
            <Skeleton className="h-3 w-full" />
          </Card>
        ))}
      </div>
    );
  }

  if (tours.length === 0) {
    return (
      <Card className="p-16 text-center">
        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
          <Eye className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="text-base font-medium text-foreground mb-2">No tours yet</h3>
        <p className="text-muted-foreground text-sm">
          Create your first tour to get started
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {tours.map((tour) => (
        <Card
          key={tour.id}
          className="p-5 hover:border-foreground/20 cursor-pointer transition-all group"
          onClick={() => onSelectTour(tour)}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-foreground mb-1 group-hover:text-foreground/80 transition-colors">
                {tour.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {tour.steps.length} {tour.steps.length === 1 ? "step" : "steps"}
              </p>
            </div>
            <Badge variant={tour.isActive ? "default" : "outline"} className="text-xs">
              {tour.isActive ? "Active" : "Draft"}
            </Badge>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border mt-3">
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(tour.createdAt, {
                addSuffix: true,
                locale: ptBR,
              })}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteTour(tour.id);
              }}
              className="hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
