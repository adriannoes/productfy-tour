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
        <Card className="p-12 inline-block">
          <h3 className="text-base font-medium text-foreground mb-2">Tour Preview</h3>
          <p className="text-muted-foreground text-sm mb-4">
            {tour.steps.length === 0
              ? "Add steps to preview your tour"
              : "Click to start preview"}
          </p>
          {tour.steps.length > 0 && (
            <Button onClick={() => setIsActive(true)} size="sm">Start Preview</Button>
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
        <h2 className="text-xl font-semibold mb-4 tracking-tight">Demo Page</h2>
        <p className="text-muted-foreground text-sm mb-8">
          This is a demo page. In production, the tour will appear on your actual site.
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
        <div className="fixed inset-0 bg-black/80 z-40 animate-fade-in" />

        {/* Tour Tooltip */}
        <Card
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md animate-fade-in"
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-muted-foreground font-medium">
                    {currentStep + 1} of {tour.steps.length}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{step.title}</h3>
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

            <p className="text-muted-foreground text-sm mb-6">{step.content}</p>

            <div className="flex items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep(currentStep - 1)}
                disabled={isFirst}
              >
                <ChevronLeft className="w-3 h-3 mr-1" />
                Back
              </Button>

              <div className="flex gap-1.5">
                {tour.steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      index === currentStep ? "bg-foreground" : "bg-muted"
                    }`}
                  />
                ))}
              </div>

              <Button
                size="sm"
                onClick={() => (isLast ? setIsActive(false) : setCurrentStep(currentStep + 1))}
              >
                {isLast ? "Done" : "Next"}
                {!isLast && <ChevronRight className="w-3 h-3 ml-1" />}
              </Button>
            </div>

            <div className="mt-5 pt-5 border-t border-border">
              <p className="text-xs text-muted-foreground">
                <code className="bg-muted px-2 py-1 rounded text-xs">{step.target}</code>
              </p>
            </div>
          </div>
        </Card>
      </Card>
    </div>
  );
};
