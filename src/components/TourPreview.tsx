import { useState } from "react";
import { Tour } from "@/pages/Index";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type TourPreviewProps = {
  tour: Tour;
};

export const TourPreview = ({ tour }: TourPreviewProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(true);

  if (!isActive || tour.steps.length === 0) {
    return (
      <div className="text-center py-12">
        <Card className="p-12 border-dashed inline-block">
          <h3 className="text-lg font-semibold text-foreground mb-2">Preview do Tour</h3>
          <p className="text-muted-foreground mb-4">
            {tour.steps.length === 0
              ? "Adicione etapas ao tour para ver o preview"
              : "Clique em 'Iniciar Preview' para testar o tour"}
          </p>
          {tour.steps.length > 0 && (
            <Button onClick={() => setIsActive(true)}>Iniciar Preview</Button>
          )}
        </Card>
      </div>
    );
  }

  const step = tour.steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === tour.steps.length - 1;

  return (
    <div className="relative">
      {/* Demo Page */}
      <Card className="p-8 min-h-[500px] relative">
        <h2 className="text-2xl font-bold mb-6">Página de Demonstração</h2>
        <p className="text-muted-foreground mb-8">
          Esta é uma página de demonstração para testar o tour. Na implementação real, o tour será
          exibido sobre seu site.
        </p>

        <div className="space-y-4">
          <Button id="demo-button-1" variant="outline">
            Botão de Exemplo 1
          </Button>
          <Button id="demo-button-2" variant="outline">
            Botão de Exemplo 2
          </Button>
        </div>

        {/* Tour Overlay */}
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in" />

        {/* Tour Tooltip */}
        <Card
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md shadow-glow animate-fade-in"
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-primary">
                      {currentStep + 1}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {currentStep + 1} de {tour.steps.length}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsActive(false)}
                className="hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <p className="text-muted-foreground mb-6">{step.content}</p>

            <div className="flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep(currentStep - 1)}
                disabled={isFirst}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Anterior
              </Button>

              <div className="flex gap-1">
                {tour.steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentStep ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>

              <Button
                size="sm"
                onClick={() => (isLast ? setIsActive(false) : setCurrentStep(currentStep + 1))}
                className="bg-gradient-primary"
              >
                {isLast ? "Concluir" : "Próximo"}
                {!isLast && <ChevronRight className="w-4 h-4 ml-1" />}
              </Button>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold">Seletor CSS:</span>{" "}
                <code className="bg-muted px-1 py-0.5 rounded">{step.target}</code>
              </p>
            </div>
          </div>
        </Card>
      </Card>
    </div>
  );
};
