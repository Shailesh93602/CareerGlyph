'use client';

import { useMutation, useQuery, useQueryClient } from 'react-query';
import { api } from '@/lib/api';
import type { Profile } from '@/types/profile';
import toast from 'react-hot-toast';

export function useProfile(username: string) {
  return useQuery<Profile, Error>(
    ['profile', username],
    async () => {
      const res = await api.get<Profile>(`/profile/${username}`);
      return res.data;
    },
    {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 min
    }
  );
}

export function useEndorseSkill(username: string) {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ skillId, message }: { skillId: string; message?: string }) => {
      const res = await api.post(
        `/profile/${username}/skills/${skillId}/endorse`,
        { message }
      );
      return res.data;
    },
    {
      onMutate: async ({ skillId }) => {
        await queryClient.cancelQueries(['profile', username]);
        const prev = queryClient.getQueryData<Profile>(['profile', username]);

        // Optimistic update: bump endorsement count
        if (prev) {
          queryClient.setQueryData<Profile>(['profile', username], {
            ...prev,
            skills: prev.skills.map(s =>
              s.id === skillId
                ? { ...s, endorsementCount: s.endorsementCount + 1 }
                : s
            ),
          });
        }

        return { prev };
      },
      onError: (_err, _vars, ctx) => {
        if (ctx?.prev) {
          queryClient.setQueryData(['profile', username], ctx.prev);
        }
        toast.error('Could not endorse skill');
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['profile', username]);
        toast.success('Skill endorsed');
      },
    }
  );
}

export function useRemoveEndorsement(username: string) {
  const queryClient = useQueryClient();

  return useMutation(
    async (skillId: string) => {
      await api.delete(`/profile/${username}/skills/${skillId}/endorse`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['profile', username]);
        toast.success('Endorsement removed');
      },
      onError: () => {
        toast.error('Could not remove endorsement');
      },
    }
  );
}
