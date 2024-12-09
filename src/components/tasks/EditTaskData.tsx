import { getTaskById } from "@/api/TaskAPI"
import { useQuery } from "@tanstack/react-query"
import { Navigate, useLocation, useParams } from "react-router-dom"
import EditTaskModal from "./EditTaskModal"


export default function EditTaskData() {
    const params = useParams()
    const projectId = params.projectId!

    const location = useLocation() //Se usa useLocation para obtener los datos de la url
    const queryParams = new URLSearchParams(location.search)//Se busca los querystring de la url
    const taskId = queryParams.get('editTask')!//Y se hace la busqueda de editTask

    const {data, isError} = useQuery({
        queryKey: ['task', taskId],
        queryFn: () => getTaskById({projectId, taskId}),
        enabled: !!taskId //enabled permite dictar en que momento hacer la consulta hacía la API, solo permite true o false, mientras que !! retorna true o false, si una variable contiene algo o no 
    })

    if(isError) return <Navigate to={'/404'}/>

    if(data) return <EditTaskModal data={data} taskId={taskId}/>

}
