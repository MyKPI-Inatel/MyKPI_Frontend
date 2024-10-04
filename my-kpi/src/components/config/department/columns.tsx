import { ColumnDef } from "@tanstack/react-table"
import { Organizations } from "../columns"
import { Trash } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"
import { env } from "../../../lib/env"

export type Departments = {
  id: number
  name: string
  orgid: number
  organization?: Organizations
}

const useDeleteDepartment = () => {
  const queryClient = useQueryClient();

  return useCallback(async (department: Departments) => {
    console.log(department)
    await fetch(`${env.VITE_API_URL}/v1/departments/org/${department.orgid}/${department.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    queryClient.invalidateQueries({
      queryKey: ["departments", department.orgid],
    });
  }, [queryClient]);
};

export const columns: ColumnDef<Departments>[] = [
  {
    accessorKey: "id",
    header: "Identificador",
  },
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "orgid",
    header: "Organização",
  },
  {
    header: "Ações",
    cell: ({ row }) => {
      const deleteDepartment = useDeleteDepartment();
      return (
        <button
          className="text-white bg-slate-400 hover:bg-red-400 p-2 rounded-md"
          onClick={() => deleteDepartment(row.original)}
        >
          <Trash size={16} />
        </button>
      )
    }
  }
]
