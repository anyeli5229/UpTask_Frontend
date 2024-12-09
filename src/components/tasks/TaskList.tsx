import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { Project, TaskProject, TaskStatus } from "@/types/index"
import TaskCard from "./TaskCard"
import { statusTranslations } from "@/locales/es"
import DropTask from "./DropTask"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateStatus } from '@/api/TaskAPI'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'

type TaskListProps = {
    tasks: TaskProject[]
    canEdit: boolean
}

type GroupedTasks = {
    [key: string]: TaskProject[]
}

const initialStatusGroups: GroupedTasks = {
    pending: [],
    onHold: [],
    inProgress: [],
    underReview: [],
    completed: [],
}

const statusStyles: { [key: string]: string } = {
    pending: 'border-t-slate-500',
    onHold: 'border-t-red-500',
    inProgress: 'border-t-blue-500',
    underReview: 'border-t-amber-500',
    completed: 'border-t-emerald-500',
}

export default function TaskList({ tasks, canEdit }: TaskListProps) {

    const params = useParams()
    const projectId = params.projectId!
    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: updateStatus,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({ queryKey: ['project', projectId] })
        }
    })

    const groupedTasks = tasks.reduce((acc, task) => {
        let currentGroup = acc[task.status] ? [...acc[task.status]] : [];
        currentGroup = [...currentGroup, task]
        return { ...acc, [task.status]: currentGroup };
    }, initialStatusGroups);

    const handleDragEnd = (e: DragEndEvent) => {
        const { over, active } = e

        if (over && over.id) {//Una vez que se suelte el elemento y que sea un elemento valido
            const taskId = active.id.toString()
            const status = over.id as TaskStatus//Se obtienen los elemntos como el taskid, y el status para poder hacer la petición con  mutate
            mutate({ projectId, taskId, status })

            //setQueryData permite agregar datos adicionales para actualizarlos sin esperar hasta que se invaliden los queries y que haya una respuesta en el servidor, toma dos valores, el querikey y una funcion para actualizar los datos que en este caso es el estado y los datos previos de la tarea prevData
            queryClient.setQueryData(['project', projectId], (prevData: Project) => {
                const updatedTasks = prevData.tasks.map((task) => {
                    if(task._id === taskId) { //Si el id de la tarea previa es igual al id de la tarea que se esta arrastrando
                        return {//Entonces se regresa una copia de los datos de la tarea
                            ...task,
                            status //Y se reescribe el valor del estado
                        }
                    }
                    return task //y si no se cumple con la condición entonces que retorna el valor de las tareas sin modificaciones(el resto de las tareas)
                })

                return {
                    ...prevData, //y finalmente se hace una copia de los datos previos de la tarea 
                    tasks: updatedTasks //Y el valor de la tarea ahora es el valor que retorna la funcion de updatedTasks
                }
            })
        }
    }

    return (
        <>
            <h2 className="text-5xl font-black my-10">Tareas</h2>

            <div className='flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32'>
                <DndContext onDragEnd={handleDragEnd} > {/*Context es para saber hacia donde se va a mover el elemento */}
                    {Object.entries(groupedTasks).map(([status, tasks]) => (
                        <div key={status} className='min-w-[300px] 2xl:min-w-0 2xl:w-1/5'>
                            <h3
                                className={`capitalize text-xl font-light border border-slate-300 bg-white p-3 border-t-8 ${statusStyles[status]} `}
                            >{statusTranslations[status]}</h3>

                            <DropTask status={status} />

                            <ul className='mt-5 space-y-5'>
                                {tasks.length === 0 ? (
                                    <li className="text-gray-500 text-center pt-3">No Hay tareas</li>
                                ) : (
                                    tasks.map(task => <TaskCard key={task._id} task={task} canEdit={canEdit} />)
                                )}
                            </ul>
                        </div>
                    ))}
                </DndContext>
            </div>
        </>
    )
}
