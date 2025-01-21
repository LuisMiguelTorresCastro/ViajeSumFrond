export interface Paquete {
  nombre: any;
  idPaquete: number;             // ID del paquete (opcional, numérico)
  nombrePaquete: string;         // Nombre del paquete (obligatorio)
  descripcion?: string;           // Descripción del paquete
  categoria?: string;             // Categoría del paquete
  costo: number;                 // Costo del paquete (obligatorio)
  estado?: 'activo' | 'inactivo'; // Estado del paquete (activo o inactivo)
  descuento?: number;             // Descuento aplicado
  valoracion?: number;            // Valoración del paquete
  tipo?: string;                  // Tipo de paquete
  imageUrl?: string;              // URL de la imagen
}