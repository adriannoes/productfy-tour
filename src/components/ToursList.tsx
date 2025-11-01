import { Tour } from "@/pages/Index";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

type ToursListProps = {
  tours: Tour[];
  onSelectTour: (tour: Tour) => void;
  onDeleteTour: (tourId: string) => void;
};

export const ToursList = ({ tours, onSelectTour, onDeleteTour }: ToursListProps) => {
  if (tours.length === 0) {
    return (
      <Card className="p-12 text-center border-dashed">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Eye className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum tour criado ainda</h3>
        <p className="text-muted-foreground">
          Comece criando seu primeiro product tour para guiar seus usuários
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tours.map((tour) => (
        <Card
          key={tour.id}
          className="p-6 hover:border-primary cursor-pointer transition-all duration-300 group"
          onClick={() => onSelectTour(tour)}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                {tour.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {tour.steps.length} {tour.steps.length === 1 ? "etapa" : "etapas"}
              </p>
            </div>
            <Badge variant={tour.isActive ? "default" : "secondary"}>
              {tour.isActive ? "Ativo" : "Inativo"}
            </Badge>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
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
