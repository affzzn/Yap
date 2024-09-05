import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useFollow = () => {
  const queryClient = useQueryClient();

  const { mutate: follow, isPending } = useMutation({
    mutationFn: async (userId) => {
      const res = await fetch(
        `http://localhost:8000/api/users/follow/${userId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      const data = await res.json();
      //   console.log(data);
      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      return data;
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
      ]);
    },
  });

  return { follow, isPending };
};

export default useFollow;
