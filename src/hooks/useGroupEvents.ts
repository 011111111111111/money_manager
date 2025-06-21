import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { GroupEvent, GroupExpense, CreateGroupEventRequest } from '@/types/expense';
import { useToast } from '@/hooks/use-toast';

export const useGroupEvents = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: events = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['group-events'],
    queryFn: async () => {
      const response = await apiService.getGroupEvents();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data || [];
    },
  });

  const createEventMutation = useMutation({
    mutationFn: (event: CreateGroupEventRequest) => 
      apiService.createGroupEvent(event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-events'] });
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

  const joinEventMutation = useMutation({
    mutationFn: ({ shareCode, memberId }: { shareCode: string; memberId: string }) =>
      apiService.joinGroupEvent(shareCode, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-events'] });
      toast({
        title: 'Success',
        description: 'Successfully joined event',
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
    joinEvent: joinEventMutation.mutate,
    isCreating: createEventMutation.isPending,
    isJoining: joinEventMutation.isPending,
  };
};

export const useGroupEventDetails = (eventId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: eventDetails,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['group-event', eventId],
    queryFn: async () => {
      const response = await apiService.getGroupEventDetails(eventId);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    enabled: !!eventId,
  });

  const addExpenseMutation = useMutation({
    mutationFn: (expense: Omit<GroupExpense, 'id'>) =>
      apiService.createGroupEventExpense(eventId, expense),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-event', eventId] });
      queryClient.invalidateQueries({ queryKey: ['group-events'] });
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