import { useState, lazy, Suspense } from "react";
import { Plus, Eye, Code, Settings, Sparkles, BarChart3, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { ToursList } from "@/components/ToursList";
import { TourEditor } from "@/components/TourEditor";
import { TourPreview } from "@/components/TourPreview";
import { IntegrationCode } from "@/components/IntegrationCode";
import { Auth } from "@/components/Auth";
import { useAuth } from "@/contexts/AuthContext";
import { useTours, useCreateTour, useDeleteTour } from "@/integrations/supabase/hooks/useTours";

const TourAnalytics = lazy(() => import("@/components/TourAnalytics").then(m => ({ default: m.TourAnalytics })));

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
  const { user, loading: authLoading, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { data: tours = [], isLoading } = useTours();
  const createTourMutation = useCreateTour();
  const deleteTourMutation = useDeleteTour();
  
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [view, setView] = useState<"list" | "editor" | "preview" | "code" | "analytics">("list");

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  const createNewTour = () => {
    const newTour: Omit<Tour, "id" | "createdAt"> = {
      name: "Novo Tour",
      steps: [],
      isActive: false,
    };
    createTourMutation.mutate(newTour, {
      onSuccess: (data: any) => {
        setSelectedTour({
          id: data.id,
          name: data.name,
          steps: [],
          isActive: data.is_active,
          createdAt: new Date(data.created_at),
        });
        setView("editor");
      },
    });
  };

  const updateTour = (updatedTour: Tour) => {
    setSelectedTour(updatedTour);
  };

  const deleteTour = (tourId: string) => {
    deleteTourMutation.mutate(tourId);
    if (selectedTour?.id === tourId) {
      setSelectedTour(null);
      setView("list");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-foreground rounded-md flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-background" />
              </div>
              <h1 className="text-lg font-semibold text-foreground tracking-tight">TourFlow</h1>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                {user.email}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                title={theme === "dark" ? "Modo Claro" : "Modo Escuro"}
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
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
                  <Button
                    variant={view === "analytics" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setView("analytics")}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {view === "list" && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-semibold text-foreground mb-2 tracking-tight">Tours</h2>
                <p className="text-muted-foreground text-sm">Crie e gerencie tours interativos</p>
              </div>
              <Button onClick={createNewTour} size="lg">
                <Plus className="w-4 h-4 mr-2" />
                New Tour
              </Button>
            </div>
            <ToursList
              tours={tours}
              isLoading={isLoading}
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

        {view === "analytics" && selectedTour && (
          <div className="animate-fade-in">
            <Suspense fallback={<div className="flex items-center justify-center h-64"><p className="text-muted-foreground">Carregando...</p></div>}>
              <TourAnalytics tourId={selectedTour.id} />
            </Suspense>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
