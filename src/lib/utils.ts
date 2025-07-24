import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Gender, MaritalStatus } from "./enum";
import { Patient } from "@/types/patient";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalize(s : string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}


function generateFakePatient(id: number): Patient {
  const genders = [Gender.MALE, Gender.FEMALE, Gender.OTHER];
  const maritalStatuses = [MaritalStatus.CELIBATAIRE, MaritalStatus.DIVORCE, MaritalStatus.MARIE, MaritalStatus.VEUF];
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const randomGender = genders[Math.floor(Math.random() * genders.length)];
  const randomMaritalStatus = maritalStatuses[Math.floor(Math.random() * maritalStatuses.length)];
  const randomBloodType = bloodTypes[Math.floor(Math.random() * bloodTypes.length)];

  const firstName = randomGender === Gender.MALE ? `Jean${id}` : (randomGender === Gender.FEMALE ? `Marie${id}` : `Alex${id}`);
  const lastName = `Dupont${Math.floor(Math.random() * 100)}`;
  const email = Math.random() > 0.3 ? `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com` : null; // Optionnel
  const city = Math.random() > 0.2 ? `Ville${Math.floor(Math.random() * 5)}` : null; // Optionnel

  return {
    patientId: id,
    medicalId: `MED-${1000 + id}`,
    firstname: firstName,
    lastname: lastName,
    fullname: `${firstName} ${lastName}`,
    gender: randomGender,
    birthdate: `19${Math.floor(Math.random() * 80 + 20)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    maritalStatus: randomMaritalStatus,
    email: email,
    address: `${Math.floor(Math.random() * 100 + 1)} Rue des Lilas`,
    city: city,
    contact: `+336${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
    bloodType: Math.random() > 0.1 ? randomBloodType : null, // Optionnel
    emergencyContact: Math.random() > 0.4 ? `+336${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}` : null, // Optionnel
    emergencyContactName: Math.random() > 0.4 ? `Famille ${lastName}` : null, // Optionnel
    isactif: Math.random() > 0.1, // Majoritairement actif
    created_by: `Admin${Math.floor(Math.random() * 3) + 1}`,
    updated_by: Math.random() > 0.3 ? `Admin${Math.floor(Math.random() * 3) + 1}` : null, // Optionnel
  };
}

// Générer 15 faux patients
export const fakePatients: Patient[] = Array.from({ length: 15 }, (_, i) => generateFakePatient(i + 1));
