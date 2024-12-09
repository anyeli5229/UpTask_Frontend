import { Link, useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { useMutation } from "@tanstack/react-query";
import ProjectForm from "@/components/projects/ProjectForm";
import { ProjectFormData } from "@/types/index";
import { createProject } from "@/api/ProjectAPI";
import { toast } from 'react-toastify';


export default function CreateProjectView() {

  const navigate = useNavigate()
  
  const initialValues : ProjectFormData = {
    projectName: '',
    clientName: '',
    description: ''
  }

  const {register, handleSubmit, formState: {errors}} = useForm({defaultValues: initialValues})

  //Se aplica destructuring en mutate (mutation.mutate)
  const {mutate} = useMutation({//useMutation se utiliza para post,,put,delete...
    mutationFn: createProject, //Se manda a llamar la función cuando se haga una petición
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (data) => { //Cuando la petición sea exitosa se pasa al toast con los datos que manda ProjectCotroller en el backend
      toast.success(data)
      navigate('/')//Y se redirecciona a la página de inicio
    }
  })

  const handleForm = (formData : ProjectFormData) => mutate(formData) //Se le pasan los datos del formulario a la función mutate y no en la función de createproject

  return (
    <>
        <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-black">Crear Proyecto</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">Llena el siguiente formulario para crear un proyecto</p>

        <nav className="my-5">
            <Link className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors" to='/'>
            Volver a Proyectos</Link>
        </nav>

        <form className="mt-10  bg-white shadow-lg p-10 rounded-lg" onSubmit={handleSubmit(handleForm)} noValidate>
          <ProjectForm
            register={register}
            errors={errors}
          />
          <input type="submit" value='Crear Proyecto' className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold transition-colors" />
        </form>
        </div>
    </>
  )
}


