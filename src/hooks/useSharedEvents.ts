import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { SharedEvent, SharedExpense, CreateSharedEventRequest } from '@/types/expense';
import { useToast } from '@/hooks/use-toast';

export const useSharedEvents = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: events = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['shared-events'],
    queryFn: async () => {
      const response = await apiService.getSharedEvents();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data || [];
    },
  });

  const createEventMutation = useMutation({
    mutationFn: (event: CreateSharedEventRequest) => 
      apiService.createSharedEvent(event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shared-events'] });
      toast({
        title: 'Success',
        description: 'Event created successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    events,
    isLoading,
    error,
    createEvent: createEventMutation.mutate,
    isCreating: createEventMutation.isPending,
  };
};

export const useSharedEventByCode = (shareCode: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: eventDetails,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['shared-event', shareCode],
    queryFn: async () => {
      const response = await apiService.getSharedEventByCode(shareCode);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    enabled: !!shareCode,
  });

  const addExpenseMutation = useMutation({
    mutationFn: (expense: Omit<SharedExpense, 'id' | 'eventId' | 'createdAt'>) =>
      apiService.addSharedEventExpense(shareCode, expense),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shared-event', shareCode] });
      queryClient.invalidateQueries({ queryKey: ['shared-events'] });
      toast({
        title: 'Success',
        description: 'Expense added successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    eventDetails,
    isLoading,
    error,
    addExpense: addExpenseMutation.mutate,
    isAddingExpense: addExpenseMutation.isPending,
  };
}; 