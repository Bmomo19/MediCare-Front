import { Gender, MaritalStatus } from "@/lib/enum";

export interface Patient {
    patientId: number,
    medicalId: string,
    fullname: string,
    gender: Gender,
    birthdate: ?string,
    maritalStatus: MaritalStatus,
    email: ?string,
    address: string,
    city: ?string,
    contact: string,
    bloodType: ?string,
    emergencyContact: ?string,
    emergencyContactName: ?string,
    isactif: boolean,
    created_by: ?string,
    updated_by: ?string,
}
