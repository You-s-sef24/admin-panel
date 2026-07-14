import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateUser } from "@/api/users";
import { useAuthStore } from "@/store/authStore";

export function useUpdateProfile() {
    const queryClient = useQueryClient();
    const setUser = useAuthStore((s) => s.setUser);

    return useMutation({
        mutationFn: updateUser,
        onSuccess: (updatedUser) => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            setUser(updatedUser);
            toast.success("Profile updated successfully");
        },
        onError: () => toast.error("Failed to update profile"),
    });
}