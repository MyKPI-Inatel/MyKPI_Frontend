import { Label } from "@radix-ui/react-label";
import { useQueryClient } from "@tanstack/react-query";
import { env } from "../../../lib/env";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { useContext, useState } from "react";
import { DataContext } from "../../../context/data-context";
import { Organizations } from "../columns";


export const CreateDepartment = () => {
  const { organizations } = useContext(DataContext);
  const [organization, setOrganization] = useState<Organizations | null>(null);
  const queryClient = useQueryClient();

  async function handleCreation(formData: FormData) {
    const name = formData.get("name");
    const id = formData.get("id");

    if (!name || !id || !organization) {
      return;
    }

    await fetch(`${env.VITE_API_URL}/v1/departments/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        name,
        orgid: organization.id,
      }),
    });

    queryClient.invalidateQueries({
      queryKey: ["departments"],
    });
  }

  return (
    <Dialog>
      <DialogTrigger className="px-5 py-2 bg-blue-500 rounded-md text-white">
        Adicionar
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar um novo departamento</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreation(new FormData(e.currentTarget));
          }}
          className="flex flex-col items-end gap-4 pt-4"
        >
          <div className="flex flex-col w-full gap-4">
            <Label htmlFor="id" className="text-left">
              Identificador
            </Label>
            <Input
              type="text"
              id="id"
              name="id"
              placeholder="Identificador da Organização"
            />
            <Label htmlFor="department" className="text-left">
              Nome do departamento
            </Label>
            <Input
              type="text"
              id="department"
              name="name"
              placeholder="Nome da Departamento"
            />
            <Label htmlFor="organization" className="text-left">
              Organização
            </Label>
            <Select onValueChange={(value) => {
              const selectedOrg = organizations.find(org => org.id === Number(value));
              if (selectedOrg) {
                setOrganization(selectedOrg);
              }
            }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                {organizations.length && organizations.map((org) => {
                  return (
                    <SelectItem key={org.id} value={org.id.toString()}>
                      {org.name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

          </div>
          <DialogClose type="submit" className="px-5 py-2 bg-blue-500 rounded-md text-white">
            Salvar
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
}