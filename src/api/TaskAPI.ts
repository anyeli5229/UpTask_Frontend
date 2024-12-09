import api from "@/lib/axios";
import {  Project, Task, TaskFormData, taskSchema } from "../types";
import { isAxiosError } from "axios";


type TaskAPI = {
    formData: TaskFormData
    projectId: Project['_id']
    taskId: Task['_id']
    status: Task['status']
}

export async function createTask({formData, projectId} : Pick<TaskAPI, 'formData' | 'projectId'>) {//Toma los datos del formulario
    try {
        const url = `/projects/${projectId}/tasks`
        const {data} = await api.post<string>(url, formData)
        //data es una variable que rotorna axios en su respuesta, se especifica el metodo post, hacía la url con los datos en los campos del formualario
        //La respuesta se genera en el archivo de ProjectController delbackend cuando se crea un nuevo proyecto de manera correcta
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response) { //Se verifica que hay una respuesta en error(que si exista un error)
            throw new Error(error.response.data.error)
        }
    }
}

export async function getTaskById({projectId, taskId} : Pick<TaskAPI, 'projectId' | 'taskId'>) {
    try {
        const url = `/projects/${projectId}/tasks/${taskId}`
        const {data} = await api(url)
        const response = taskSchema.safeParse(data)
        console.log(response)
        if(response.success) {
            return response.data
        }
        
    } catch (error) {
        if(isAxiosError(error) && error.response) { //Se verifica que hay una respuesta en error(que si exista un error)
            throw new Error(error.response.data.error)
        }
    }
}

export async function updateTask({projectId, taskId, formData} : Pick<TaskAPI, 'projectId' | 'taskId' | 'formData'>) {
    try {
        const url = `/projects/${projectId}/tasks/${taskId}`
        const {data} = await api.put<string>(url, formData)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response) { //Se verifica que hay una respuesta en error(que si exista un error)
            throw new Error(error.response.data.error)
        }
    }
}

export async function deleteTask({projectId, taskId} : Pick<TaskAPI, 'projectId' | 'taskId'>) {
    try {
        const url = `/projects/${projectId}/tasks/${taskId}`
        const {data} = await api.delete<string>(url)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response) { //Se verifica que hay una respuesta en error(que si exista un error)
            throw new Error(error.response.data.error)
        }
    }
}

export async function updateStatus({projectId, taskId, status} : Pick<TaskAPI, 'projectId' | 'taskId' | 'status'>) {
    try {
        const url = `/projects/${projectId}/tasks/${taskId}/status`
        const {data} = await api.post<string>(url, {status}) //Se pasa status como objeto
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response) { //Se verifica que hay una respuesta en error(que si exista un error)
            throw new Error(error.response.data.error)
        }
    }
}