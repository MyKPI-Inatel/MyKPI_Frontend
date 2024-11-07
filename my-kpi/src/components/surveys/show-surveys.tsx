import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Label } from '../ui/label';

type Survey = {
  id: number;
  title: string;
}

interface ShowSurveysProps {
  surveys: Survey[];
}

export const ShowSurveys = ({ surveys }: ShowSurveysProps) => {
  return (
    <Dialog>
      <DialogTrigger className="px-5 py-2 bg-blue-500 rounded-md text-white">Visualizar</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-xl'>Responda uma pesquisa</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-5">
          {surveys.map((survey) => {
            return (
              <div key={survey.id} className="flex flex-col space-y-2">
                <Label className='text-lg'>{survey.title}</Label>
                <a href={`/surveys/${survey.id}`} className='bg-blue-500 p-2 rounded-lg text-white justify-center items-center flex hover:bg-blue-600'>Responder</a>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
