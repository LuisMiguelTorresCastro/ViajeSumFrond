export interface Register {
    nombreUsuario: string;
    apellidoUsuario: string;
    telefonoUsuario: string;
    correoElectronico: string;
    contraseñaUsuario: string;
    direccionUsuario: string;
    ciudad: string;
    estado: string;
    codigoPostal: string;
    rolUsuario?: 'cliente' | 'admin'; 
    provider?: string; 
    provider_id?: string | null; 
    token?: string; 
  }