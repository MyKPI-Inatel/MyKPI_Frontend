import { ColumnDef } from "@tanstack/react-table"
import { Trash } from "lucide-react"
import { env } from "../../lib/env"
import { useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"

export type Organizations = {
  id: number
  name: string
}

const useDeleteOrganization = () => {
  const queryClient = useQueryClient();

  return useCallback(async (organization: Organizations) => {
    await fetch(`${env.VITE_API_URL}/v1/organizations/${organization.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    queryClient.invalidateQueries({
      queryKey: ["organizations"],
    });
  }, [queryClient]);
};

export const columns: ColumnDef<Organizations>[] = [
  {
    accessorKey: "id",
    header: "Identificador",
  },
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    header: "Ações",
    cell: ({ row }) => {
      const deleteOrganization = useDeleteOrganization();
      return (
        <button
          className="text-white bg-slate-400 hover:bg-red-400 p-2 rounded-md"
          onClick={() => deleteOrganization(row.original)}
        >
          <Trash size={16} />
        </button>
      )
    }
  }
]
