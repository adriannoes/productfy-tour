import { useState, useEffect, useRef } from "react";
import { Tour } from "@/pages/Index";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, X, AlertCircle } from "lucide-react";

type TourPreviewProps = {
  tour: Tour;
};

export const TourPreview = ({ tour }: TourPreviewProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [elementNotFound, setElementNotFound] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || tour.steps.length === 0) return;

    const step = tour.steps[currentStep];
    const element = document.querySelector(step.target) as HTMLElement;

    if (!element) {
      setElementNotFound(true);
      setTargetElement(null);
      return;
    }

    setElementNotFound(false);
    setTargetElement(element);

    // Scroll to element
    setTimeout(() => {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Calculate tooltip position after scroll
      setTimeout(() => {
        if (tooltipRef.current) {
          const elementRect = element.getBoundingClientRect();
          const tooltipRect = tooltipRef.current.getBoundingClientRect();
          const position = calculateTooltipPosition(elementRect, tooltipRect, step.placement || 'auto');
          setTooltipPosition(position);
        }
      }, 300);
    }, 100);
  }, [currentStep, isActive, tour.steps]);

  const calculateTooltipPosition = (
    elementRect: DOMRect,
    tooltipRect: DOMRect,
    placement: string
  ) => {
    const gap = 20;
    let top = 0;
    let left = 0;

    switch (placement) {
      case 'top':
        top = elementRect.top - tooltipRect.height - gap;
        left = elementRect.left + (elementRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'bottom':
        top = elementRect.bottom + gap;
        left = elementRect.left + (elementRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'left':
        top = elementRect.top + (elementRect.height / 2) - (tooltipRect.height / 2);
        left = elementRect.left - tooltipRect.width - gap;
        break;
      case 'right':
        top = elementRect.top + (elementRect.height / 2) - (tooltipRect.height / 2);
        left = elementRect.right + gap;
        break;
      default:
        // Auto - choose best position
        if (elementRect.bottom + tooltipRect.height + gap < window.innerHeight) {
          return calculateTooltipPosition(elementRect, tooltipRect, 'bottom');
        } else if (elementRect.top - tooltipRect.height - gap > 0) {
          return calculateTooltipPosition(elementRect, tooltipRect, 'top');
        } else {
          // Center fallback
          return {
            top: window.innerHeight / 2 - tooltipRect.height / 2,
            left: window.innerWidth / 2 - tooltipRect.width / 2,
          };
        }
    }

    // Adjust if outside viewport
    if (left < 10) left = 10;
    if (left + tooltipRect.width > window.innerWidth - 10) {
      left = window.innerWidth - tooltipRect.width - 10;
    }
    if (top < 10) top = 10;

    return { top, left };
  };

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
    <div className="relative min-h-screen bg-background">
      {/* Demo Page */}
      <div className="min-h-screen">
        {/* Header */}
        <header id="demo-header" className="border-b bg-card p-4 sticky top-0 z-10">
          <div className="container mx-auto flex items-center justify-between">
            <div id="demo-logo" className="text-xl font-bold">DemoApp</div>
            <nav className="flex gap-4">
              <Button id="demo-nav-home" variant="ghost" size="sm">Home</Button>
              <Button id="demo-nav-products" variant="ghost" size="sm">Products</Button>
              <Button id="demo-nav-about" variant="ghost" size="sm">About</Button>
            </nav>
            <Button id="demo-cta-signup" size="sm">Sign Up</Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto p-6 grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside id="demo-sidebar" className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-3 text-sm">Menu</h3>
              <div className="space-y-2">
                <Button id="demo-menu-dashboard" variant="ghost" className="w-full justify-start" size="sm">
                  Dashboard
                </Button>
                <Button id="demo-menu-settings" variant="ghost" className="w-full justify-start" size="sm">
                  Settings
                </Button>
                <Button id="demo-menu-profile" variant="ghost" className="w-full justify-start" size="sm">
                  Profile
                </Button>
              </div>
            </Card>
          </aside>

          {/* Content */}
          <main className="md:col-span-3 space-y-6">
            <Card id="demo-welcome-card" className="p-6">
              <h2 className="text-2xl font-bold mb-2">Welcome to DemoApp!</h2>
              <p className="text-muted-foreground">
                This is a demo page to preview your tour. The tour will highlight elements based on your CSS selectors.
              </p>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card id="demo-feature-card-1" className="p-6">
                <h3 className="font-semibold mb-2">Feature 1</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Description of feature 1
                </p>
                <Button id="demo-feature-btn-1" size="sm">Learn More</Button>
              </Card>

              <Card id="demo-feature-card-2" className="p-6">
                <h3 className="font-semibold mb-2">Feature 2</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Description of feature 2
                </p>
                <Button id="demo-feature-btn-2" size="sm">Learn More</Button>
              </Card>
            </div>

            {/* Form Example */}
            <Card id="demo-form" className="p-6">
              <h3 className="font-semibold mb-4">Contact Form</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="demo-input-name">Name</Label>
                  <Input id="demo-input-name" placeholder="Your name" />
                </div>
                <div>
                  <Label htmlFor="demo-input-email">Email</Label>
                  <Input id="demo-input-email" type="email" placeholder="your@email.com" />
                </div>
                <Button id="demo-form-submit">Submit</Button>
              </div>
            </Card>
          </main>
        </div>

        {/* Footer */}
        <footer id="demo-footer" className="border-t bg-card p-6 mt-12">
          <div className="container mx-auto text-center text-sm text-muted-foreground">
            © 2024 DemoApp. All rights reserved.
          </div>
        </footer>
      </div>

      {/* Tour Overlay */}
      {isActive && <div className="fixed inset-0 bg-black/70 z-40 animate-fade-in" />}

      {/* Spotlight for target element */}
      {isActive && targetElement && (
        <div
          className="fixed pointer-events-none z-[45] transition-all duration-300 border-2 border-primary rounded-lg"
          style={{
            top: `${targetElement.getBoundingClientRect().top - 8}px`,
            left: `${targetElement.getBoundingClientRect().left - 8}px`,
            width: `${targetElement.getBoundingClientRect().width + 16}px`,
            height: `${targetElement.getBoundingClientRect().height + 16}px`,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
          }}
        />
      )}

      {/* Element Not Found Warning */}
      {isActive && elementNotFound && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in max-w-sm">
          <Card className="p-4 border-destructive bg-destructive/10">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm text-destructive mb-1">
                  Element not found
                </h4>
                <p className="text-xs text-muted-foreground">
                  The selector <code className="bg-muted px-1 rounded text-xs">{tour.steps[currentStep].target}</code> was not found on this page.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tour Tooltip */}
      {isActive && (
        <Card
          ref={tooltipRef}
          className="fixed z-50 w-full max-w-md animate-scale-in shadow-lg"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
          }}
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
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentStep ? "bg-primary w-6" : "bg-muted w-1.5"
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
                Target: <code className="bg-muted px-2 py-1 rounded text-xs">{step.target}</code>
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
