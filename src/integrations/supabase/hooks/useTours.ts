import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tour, TourStep } from "@/pages/Index";
import { toast } from "sonner";

// Hook para buscar todos os tours do usuário
export const useTours = () => {
  return useQuery({
    queryKey: ["tours"],
    queryFn: async () => {
      const { data: tours, error } = await supabase
        .from("tours")
        .select(`
          id,
          name,
          is_active,
          created_at,
          updated_at,
          tour_steps (
            id,
            title,
            content,
            target,
            placement,
            step_order
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transformar dados do Supabase para o formato da aplicação
      return tours.map((tour) => ({
        id: tour.id,
        name: tour.name,
        isActive: tour.is_active,
        createdAt: new Date(tour.created_at),
        steps: (tour.tour_steps || [])
          .sort((a: any, b: any) => a.step_order - b.step_order)
          .map((step: any) => ({
            id: step.id,
            title: step.title,
            content: step.content,
            target: step.target,
            placement: step.placement as "top" | "bottom" | "left" | "right",
          })),
      })) as Tour[];
    },
  });
};

// Hook para criar um novo tour
export const useCreateTour = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tour: Omit<Tour, "id" | "createdAt">) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Inserir o tour
      const { data: newTour, error: tourError } = await supabase
        .from("tours")
        .insert({
          name: tour.name,
          is_active: tour.isActive,
          user_id: user.id,
        })
        .select()
        .single();

      if (tourError) throw tourError;

      // Inserir os steps se houver
      if (tour.steps.length > 0) {
        const { error: stepsError } = await supabase
          .from("tour_steps")
          .insert(
            tour.steps.map((step, index) => ({
              tour_id: newTour.id,
              title: step.title,
              content: step.content,
              target: step.target,
              placement: step.placement,
              step_order: index,
            }))
          );

        if (stepsError) throw stepsError;
      }

      return newTour;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tours"] });
      toast.success("Tour criado com sucesso!");
    },
    onError: (error: any) => {
      console.error("Error creating tour:", error);
      toast.error("Erro ao criar tour");
    },
  });
};

// Hook para atualizar um tour existente
export const useUpdateTour = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tour: Tour) => {
      // Atualizar o tour
      const { error: tourError } = await supabase
        .from("tours")
        .update({
          name: tour.name,
          is_active: tour.isActive,
        })
        .eq("id", tour.id);

      if (tourError) throw tourError;

      // Deletar steps antigos
      const { error: deleteError } = await supabase
        .from("tour_steps")
        .delete()
        .eq("tour_id", tour.id);

      if (deleteError) throw deleteError;

      // Inserir novos steps
      if (tour.steps.length > 0) {
        const { error: stepsError } = await supabase
          .from("tour_steps")
          .insert(
            tour.steps.map((step, index) => ({
              tour_id: tour.id,
              title: step.title,
              content: step.content,
              target: step.target,
              placement: step.placement,
              step_order: index,
            }))
          );

        if (stepsError) throw stepsError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tours"] });
      toast.success("Tour atualizado com sucesso!");
    },
    onError: (error: any) => {
      console.error("Error updating tour:", error);
      toast.error("Erro ao atualizar tour");
    },
  });
};

// Hook para deletar um tour
export const useDeleteTour = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tourId: string) => {
      const { error } = await supabase
        .from("tours")
        .delete()
        .eq("id", tourId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tours"] });
      toast.success("Tour deletado com sucesso!");
    },
    onError: (error: any) => {
      console.error("Error deleting tour:", error);
      toast.error("Erro ao deletar tour");
    },
  });
};
