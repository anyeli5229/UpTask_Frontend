import { getProjectById } from "@/api/ProjectAPI"
import EditProjectForm from "@/components/projects/EditProjectForm"
import { useQuery } from "@tanstack/react-query"
import { Navigate, useParams } from "react-router-dom"


export default function EditProjectView() {
  const params = useParams()
  const projectId = params.projectId! //Se obtiene el id de la url(mismo nombre que se le da en router *importante* ) y el ! es para decirle a typescript que esun valor que nunca será undefined

  const {data, isLoading, isError} = useQuery({
    queryKey: ['editProject', projectId], //Se le pasa el segundo parametro para que identifique el key como un valor distintoy muetre los datos distintos en cada consulta correspondientes al id del projecto
    queryFn: () => getProjectById(projectId), //Para poderle pasar el id en la función se utiliza un callback,
    retry: false //retry es el numero de veces que Query hace una consulta para verificar que un elemento exista
  })

  if(isLoading) return 'Cargando...'
  if(isError) return <Navigate to='/404'/>
  if(data) return <EditProjectForm data={data} projectId={projectId}/>
}
