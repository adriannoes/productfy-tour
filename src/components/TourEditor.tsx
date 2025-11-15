import { useState, useEffect } from "react";
import { Tour, TourStep } from "@/pages/Index";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, GripVertical, Save, Copy } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useUpdateTour } from "@/integrations/supabase/hooks/useTours";
import { useToast } from "@/hooks/use-toast";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type TourEditorProps = {
  tour: Tour;
  onUpdateTour: (tour: Tour) => void;
};

interface SortableStepProps {
  step: TourStep;
  index: number;
  onUpdate: (stepId: string, updates: Partial<TourStep>) => void;
  onDelete: (stepId: string) => void;
  onDuplicate: (stepId: string) => void;
}

function SortableStep({ step, index, onUpdate, onDelete, onDuplicate }: SortableStepProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card ref={setNodeRef} style={style} className="p-5">
      <div className="flex items-start gap-4">
        <div className="flex items-center gap-3 pt-2">
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </div>
          <span className="text-sm font-semibold text-foreground bg-accent px-2 py-1 rounded">
            {index + 1}
          </span>
        </div>

        <div className="flex-1 grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Título</Label>
            <Input
              value={step.title}
              onChange={(e) => onUpdate(step.id, { title: e.target.value })}
              placeholder="Ex: Bem-vindo ao Dashboard"
            />
          </div>

          <div className="space-y-2">
            <Label>Seletor CSS</Label>
            <Input
              value={step.target}
              onChange={(e) => onUpdate(step.id, { target: e.target.value })}
              placeholder="Ex: #meu-botao ou .minha-classe"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Conteúdo</Label>
            <Textarea
              value={step.content}
              onChange={(e) => onUpdate(step.id, { content: e.target.value })}
              placeholder="Descreva o que o usuário deve fazer aqui"
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Posição</Label>
            <Select
              value={step.placement}
              onValueChange={(value: any) => onUpdate(step.id, { placement: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top">Topo</SelectItem>
                <SelectItem value="bottom">Baixo</SelectItem>
                <SelectItem value="left">Esquerda</SelectItem>
                <SelectItem value="right">Direita</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDuplicate(step.id)}
            title="Duplicar step"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDelete(step.id)}
            className="text-destructive hover:text-destructive"
            title="Deletar step"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

export const TourEditor = ({ tour, onUpdateTour }: TourEditorProps) => {
  const [editedTour, setEditedTour] = useState<Tour>(tour);
  const updateTourMutation = useUpdateTour();
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const duplicateStep = (stepId: string) => {
    const stepToDuplicate = editedTour.steps.find(s => s.id === stepId);
    if (!stepToDuplicate) return;

    const newStep: TourStep = {
      ...stepToDuplicate,
      id: Date.now().toString(),
      title: `${stepToDuplicate.title} (Cópia)`,
    };

    const stepIndex = editedTour.steps.findIndex(s => s.id === stepId);
    const newSteps = [...editedTour.steps];
    newSteps.splice(stepIndex + 1, 0, newStep);

    setEditedTour({
      ...editedTour,
      steps: newSteps,
    });

    toast({
      title: "Step duplicado",
      description: "O step foi duplicado com sucesso.",
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = editedTour.steps.findIndex((step) => step.id === active.id);
      const newIndex = editedTour.steps.findIndex((step) => step.id === over.id);

      const newSteps = arrayMove(editedTour.steps, oldIndex, newIndex);
      setEditedTour({
        ...editedTour,
        steps: newSteps,
      });

      toast({
        title: "Ordem atualizada",
        description: "A ordem dos steps foi atualizada.",
      });
    }
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

        {editedTour.steps.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">
              Nenhum step adicionado ainda. Clique em "Add Step" para começar.
            </p>
          </Card>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={editedTour.steps.map(s => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {editedTour.steps.map((step, index) => (
                  <SortableStep
                    key={step.id}
                    step={step}
                    index={index}
                    onUpdate={updateStep}
                    onDelete={deleteStep}
                    onDuplicate={duplicateStep}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
};
