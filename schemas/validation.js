const { z } = require('zod');

const MedicoSchema = z.object({
    dni: z.string({
        invalid_type_error: 'El DNI debe ser un número',
        required_error: 'El DNI es obligatorio'
    }).regex(/^\d+$/, { message: "El DNI debe ser un número" }),
    nombre: z.string().nonempty({ message: "El nombre es obligatorio" }),
    apellido: z.string().nonempty({ message: "El apellido es obligatorio" }),
    fechaNacimiento: z.date({
        invalid_type_error: 'La fecha de nacimiento debe ser un tipo date',
        required_error: 'La fecha de nacimiento es obligatoria'
    }).refine((date) => !isNaN(Date.parse(date)), {
        message: "Fecha de nacimiento inválida"
    }),
    email: z.string().email({ message: "Formato de email inválido" }),
    password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
    repeatPassword: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
    id_rol: z.string({
        invalid_type_error: 'El rol debe ser un número',
        required_error: 'El rol es obligatorio'
    }).regex(/^\d+$/, { message: "El rol debe ser un número" }),
    estado: z.string({
        invalid_type_error: 'El estado debe ser un número',
        required_error: 'El estado es obligatorio'
    }).regex(/^\d+$/, { message: "El estado debe ser un número" }),
    especialidades: z.string({
        invalid_type_error: 'La especialidad debe ser un número',
        required_error: 'La especialidad es obligatoria'
    }).regex(/^\d+$/, { message: "La especialidad debe ser un número" }),
    matricula: z.string({
        invalid_type_error: 'El DNI debe ser un número',
        required_error: 'El DNI es obligatorio'
    }).regex(/^\d+$/, { message: "El DNI debe ser un número" }),
    telefonos: z.string({
        invalid_type_error: 'El DNI debe ser un número',
        required_error: 'El DNI es obligatorio'
    }).regex(/^\d+$/, { message: "El DNI debe ser un número" }),
}).refine(data => data.password === data.repeatPassword, {
    message: "Las contraseñas no coinciden",
    path: ["repeatPassword"],
})

const validateMedicos = (input) => {
    const result = MedicoSchema.safeParse(input);
    if (!result.success) {
        return result;
    }

    // Transformar los datos validados a los tipos correctos
    const data = result.data;
    return {
        success: true,
        data: {
            dni: parseInt(data.dni, 10),
            nombre: data.nombre,
            apellido: data.apellido,
            fechaNacimiento: new Date(data.fechaNacimiento),
            email: data.email,
            password: data.password,
            repeatPassword: data.repeatPassword,
            id_rol: parseInt(data.id_rol, 10),
            estado: parseInt(data.estado, 10),
            especialidades: parseInt(data.especialidades, 10),
            matricula: parseInt(data.matricula, 10),
            telefonos: parseInt(data.telefonos, 10),
        }
    };
};

const MedicoValidationSchema = z.object({
    dni: z.number().int().positive().optional(),
    nombre: z.string().optional(),
    apellido: z.string().optional(),
    fechaNacimiento: z.date().optional(),
    email: z.string().email().optional(),
    password: z.string().optional(),
    repeatPassword: z.string().optional(),
    id_rol: z.number().int().optional(),
    estado: z.number().int().optional(),
    especialidades: z.number().int().optional(),
    matricula: z.number().int().optional(),
    telefonos: z.number().int().optional()
  });
  
  const validatePartialMedicos = (input) => {
    return MedicoValidationSchema.safeParse(input);
  };

module.exports = { validateMedicos, validatePartialMedicos };









