// import { Rol } from './rol';
export class Usuario {
    id: number;
    username: string;
    password: string;
    enabled: number;
    nombre: string;
    apellido: string;
    email: string;
    cia: string;
    roles: string[] = [];
}