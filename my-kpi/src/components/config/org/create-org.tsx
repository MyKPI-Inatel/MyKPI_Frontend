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
import { Label } from "../../ui/label";

export const CreateOrganization = () => {
  const queryClient = useQueryClient();
  
  async function handleCreation(formData: FormData) {
    const name = formData.get("name");
    const id = formData.get("id");

    if (!name || !id) {
      return;
    }

    await fetch(`${env.VITE_API_URL}/v1/organizations/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        name,
      }),
    });

    queryClient.invalidateQueries({
      queryKey: ["organizations"],
    });
  }

  return (
    <Dialog>
      <DialogTrigger className="px-5 py-2 bg-blue-500 rounded-md text-white">
        Adicionar
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar uma nova organização</DialogTitle>
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
            <Label htmlFor="organization" className="text-left">
              Nome da Organização
            </Label>
            <Input
              type="text"
              id="organization"
              name="name"
              placeholder="Nome da Organização"
            />
          </div>
          <DialogClose type="submit" className="px-5 py-2 bg-blue-500 rounded-md text-white">
            Salvar
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
};
