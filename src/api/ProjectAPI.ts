import api from "@/lib/axios";
import { dashboardProjectSchema, editProjectSchema, Project, ProjectFormData, projectSchema } from "../types";
import { isAxiosError } from "axios";

export async function createProject(formData: ProjectFormData) {//Toma los datos del formulario
    try {
        const {data} = await api.post('/projects', formData)
        //data es una variable que rotorna axios en su respuesta, se especifica el metodo post, hacía la url con los datos en los campos del formualario
        //La respuesta se genera en el archivo de ProjectController delbackend cuando se crea un nuevo proyecto de manera correcta
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response) { //Se verifica que hay una respuesta en error(que si exista un error)
            throw new Error(error.response.data.error)
        }
    }
}

export async function getProjects() {
    try {
        const {data} = await api('/projects')
        const response = dashboardProjectSchema.safeParse(data)//se le pasa el schema a los datos
        if(response.success) {//Si la reespuesta es correcta y tiene los datos de acuerdo al schema
            return response.data //Se retornan los datos de la respuesta
        }
    } catch (error) {
        if(isAxiosError(error) && error.response) { //Se verifica que hay una respuesta en error(que si exista un error)
            throw new Error(error.response.data.error)
        }
    }
}

export async function getProjectById(id: Project['_id']) {
    try {
        const {data} = await api(`/projects/${id}`)
        const response = editProjectSchema.safeParse(data)
        if(response.success) {
            return response.data
        }
    } catch (error) {
        if(isAxiosError(error) && error.response) { //Se verifica que hay una respuesta en error(que si exista un error)
            throw new Error(error.response.data.error)
        }
    }
}

export async function getFullProject(id: Project['_id']) {
    try {
        const { data } = await api(`/projects/${id}`)
        const response = projectSchema.safeParse(data)
        if(response.success) {
            return response.data
        }
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

type ProjectAPIType = {
    formData: ProjectFormData
    projectId: Project['_id']
}

export async function updateProject({formData, projectId} : ProjectAPIType ) {
    try {
        const { data } = await api.put<string>(`/projects/${projectId}`, formData)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function deleteProject(id: Project['_id']) {
    try {
        const {data} = await api.delete<string>(`/projects/${id}`)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response) { //Se verifica que hay una respuesta en error(que si exista un error)
            throw new Error(error.response.data.error)
        }
    }
}