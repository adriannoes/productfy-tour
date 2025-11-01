import { useState } from "react";
import { Plus, Eye, Code, Settings, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToursList } from "@/components/ToursList";
import { TourEditor } from "@/components/TourEditor";
import { TourPreview } from "@/components/TourPreview";
import { IntegrationCode } from "@/components/IntegrationCode";

export type Tour = {
  id: string;
  name: string;
  steps: TourStep[];
  isActive: boolean;
  createdAt: Date;
};

export type TourStep = {
  id: string;
  title: string;
  content: string;
  target: string;
  placement: "top" | "bottom" | "left" | "right";
};

const Index = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [view, setView] = useState<"list" | "editor" | "preview" | "code">("list");

  const createNewTour = () => {
    const newTour: Tour = {
      id: Date.now().toString(),
      name: "Novo Tour",
      steps: [],
      isActive: false,
      createdAt: new Date(),
    };
    setTours([...tours, newTour]);
    setSelectedTour(newTour);
    setView("editor");
  };

  const updateTour = (updatedTour: Tour) => {
    setTours(tours.map((t) => (t.id === updatedTour.id ? updatedTour : t)));
    setSelectedTour(updatedTour);
  };

  const deleteTour = (tourId: string) => {
    setTours(tours.filter((t) => t.id !== tourId));
    if (selectedTour?.id === tourId) {
      setSelectedTour(null);
      setView("list");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-gradient-dark">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">TourFlow</h1>
                <p className="text-xs text-muted-foreground">Product Tour Builder</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={view === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setView("list")}
              >
                Tours
              </Button>
              {selectedTour && (
                <>
                  <Button
                    variant={view === "editor" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setView("editor")}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Editor
                  </Button>
                  <Button
                    variant={view === "preview" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setView("preview")}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    variant={view === "code" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setView("code")}
                  >
                    <Code className="w-4 h-4 mr-2" />
                    Código
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {view === "list" && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1">Seus Product Tours</h2>
                <p className="text-muted-foreground">Crie e gerencie tours interativos para guiar seus usuários</p>
              </div>
              <Button onClick={createNewTour} size="lg" className="bg-gradient-primary hover:opacity-90">
                <Plus className="w-5 h-5 mr-2" />
                Novo Tour
              </Button>
            </div>
            <ToursList
              tours={tours}
              onSelectTour={(tour) => {
                setSelectedTour(tour);
                setView("editor");
              }}
              onDeleteTour={deleteTour}
            />
          </div>
        )}

        {view === "editor" && selectedTour && (
          <div className="animate-fade-in">
            <TourEditor tour={selectedTour} onUpdateTour={updateTour} />
          </div>
        )}

        {view === "preview" && selectedTour && (
          <div className="animate-fade-in">
            <TourPreview tour={selectedTour} />
          </div>
        )}

        {view === "code" && selectedTour && (
          <div className="animate-fade-in">
            <IntegrationCode tour={selectedTour} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
