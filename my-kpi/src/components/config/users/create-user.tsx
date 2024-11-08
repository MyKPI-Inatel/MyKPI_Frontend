import { Label } from '@radix-ui/react-label';
import { useQueryClient } from '@tanstack/react-query';
import { env } from '../../../lib/env';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { useContext, useState } from 'react';
import { DataContext } from '../../../context/data-context';
import swal from 'sweetalert';
import { Departments } from '../department/columns';

export const CreateUser = () => {
  const { departments } = useContext(DataContext);
  const [department, setDepartment] = useState<Departments | null>(null);
  const queryClient = useQueryClient();

  async function handleCreation(formData: FormData) {
    const name = formData.get('name');
    const email = formData.get('email');

    if (!name || !email || !department) {
      swal('Erro', 'Todos os campos são obrigatórios', 'error');
      return;
    }

    try {
      const response = await fetch(`${env.VITE_API_URL}/v1/employee`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          deptid: department.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      queryClient.invalidateQueries({
        queryKey: ['users'],
      });

      swal('Sucesso', 'Funcionário criado com sucesso', 'success');
    } catch (error) {
      swal('Erro', 'Erro ao criar funcionário', 'error');
      console.error(error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger className="px-5 py-2 bg-blue-500 rounded-md text-white">Adicionar</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar um novo funcionário</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreation(new FormData(e.currentTarget));
          }}
          className="flex flex-col items-end gap-4 pt-4"
        >
          <div className="flex flex-col w-full gap-4">
            <Label htmlFor="name" className="text-left">
              Nome do funcionário
            </Label>
            <Input type="text" id="name" name="name" placeholder="Nome do Funcionário" />
            <Label htmlFor="email" className="text-left">
              Email
            </Label>
            <Input type="email" id="email" name="email" placeholder="Email do Funcionário" />
            <Label htmlFor="department" className="text-left">
              Departamento
            </Label>
            <Select
              onValueChange={(value) => {
                const selectedOrg = departments.find((dpt) => dpt.id === Number(value));
                if (selectedOrg) {
                  setDepartment(selectedOrg);
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                {departments.length > 0 &&
                  departments.map((dpt) => (
                    <SelectItem key={dpt.id} value={dpt.id.toString()}>
                      {dpt.name}
                    </SelectItem>
                  ))}
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
};
