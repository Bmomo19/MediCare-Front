import { ENDPOINTS } from "@/lib/constant"
import apiClient from "./apiClient"

export const getAllPatients = async () => {
    return await apiClient.get(ENDPOINTS.PATIENT);
}

export const getAllPatientsByMed = async () => {}

export const getPatientById = async (id : string | number) => {
    return apiClient.get(`${ENDPOINTS.PATIENT}/${id}`);
}

export const createPatient = async () => {
    return apiClient.post(ENDPOINTS.PATIENT);
}

export const updatePatient = async (id : string | number) => {
    return apiClient.put(`${ENDPOINTS.PATIENT}/${id}`);
}

