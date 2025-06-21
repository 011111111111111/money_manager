import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { Member } from '@/types/expense';
import { useToast } from '@/hooks/use-toast';

export const useMembers = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: members = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const response = await apiService.getMembers();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data || [];
    },
  });

  const createMemberMutation = useMutation({
    mutationFn: (member: Omit<Member, 'id'>) => apiService.createMember(member),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast({
        title: 'Success',
        description: 'Member added successfully',
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
    members,
    isLoading,
    error,
    createMember: createMemberMutation.mutate,
    isCreating: createMemberMutation.isPending,
  };
}; 