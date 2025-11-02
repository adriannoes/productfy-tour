import { useState, useEffect } from "react";
import { Tour, TourStep } from "@/pages/Index";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, GripVertical, Save } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useUpdateTour } from "@/integrations/supabase/hooks/useTours";

type TourEditorProps = {
  tour: Tour;
  onUpdateTour: (tour: Tour) => void;
};

export const TourEditor = ({ tour, onUpdateTour }: TourEditorProps) => {
  const [editedTour, setEditedTour] = useState<Tour>(tour);
  const updateTourMutation = useUpdateTour();

  useEffect(() => {
    setEditedTour(tour);
  }, [tour]);

  const addStep = () => {
    const newStep: TourStep = {
      id: Date.now().toString(),
      title: "Nova Etapa",
      content: "Descreva o que o usuário deve fazer aqui",
      target: ".elemento-alvo",
      placement: "bottom",
    };
    setEditedTour({
      ...editedTour,
      steps: [...editedTour.steps, newStep],
    });
  };

  const updateStep = (stepId: string, updates: Partial<TourStep>) => {
    setEditedTour({
      ...editedTour,
      steps: editedTour.steps.map((step) =>
        step.id === stepId ? { ...step, ...updates } : step
      ),
    });
  };

  const deleteStep = (stepId: string) => {
    setEditedTour({
      ...editedTour,
      steps: editedTour.steps.filter((step) => step.id !== stepId),
    });
  };

  const saveTour = () => {
    updateTourMutation.mutate(editedTour, {
      onSuccess: () => {
        onUpdateTour(editedTour);
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Tour Settings */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground tracking-tight">Settings</h2>
          <Button onClick={saveTour}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="tour-name">Nome do Tour</Label>
            <Input
              id="tour-name"
              value={editedTour.name}
              onChange={(e) => setEditedTour({ ...editedTour, name: e.target.value })}
              placeholder="Ex: Onboarding Inicial"
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="tour-active" className="cursor-pointer">
              Tour Ativo
            </Label>
            <Switch
              id="tour-active"
              checked={editedTour.isActive}
              onCheckedChange={(checked) =>
                setEditedTour({ ...editedTour, isActive: checked })
              }
            />
          </div>
        </div>
      </Card>

      {/* Steps Editor */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground tracking-tight">Steps</h3>
          <Button onClick={addStep} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Step
          </Button>
        </div>

        <div className="space-y-3">
          {editedTour.steps.map((step, index) => (
            <Card key={step.id} className="p-5">
              <div className="flex items-start gap-4">
                <div className="flex items-center gap-3 pt-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                  <div className="w-6 h-6 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-foreground">{index + 1}</span>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Título</Label>
                      <Input
                        value={step.title}
                        onChange={(e) => updateStep(step.id, { title: e.target.value })}
                        placeholder="Ex: Bem-vindo!"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Seletor CSS</Label>
                      <Input
                        value={step.target}
                        onChange={(e) => updateStep(step.id, { target: e.target.value })}
                        placeholder="Ex: #header-button"
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Conteúdo</Label>
                    <Textarea
                      value={step.content}
                      onChange={(e) => updateStep(step.id, { content: e.target.value })}
                      placeholder="Explique o que o usuário deve fazer..."
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="space-y-2 flex-1">
                      <Label>Posição</Label>
                      <Select
                        value={step.placement}
                        onValueChange={(value: any) =>
                          updateStep(step.id, { placement: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top">Acima</SelectItem>
                          <SelectItem value="bottom">Abaixo</SelectItem>
                          <SelectItem value="left">Esquerda</SelectItem>
                          <SelectItem value="right">Direita</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteStep(step.id)}
                      className="hover:text-destructive mt-7"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {editedTour.steps.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground text-sm">
                No steps yet. Add your first step to get started.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
