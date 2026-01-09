import { Box, Button, FormControl, FormGroup, Input, TextField, Typography } from "@mui/material"

export const ContactForm = () => {

    return (
        <Box>
            <FormControl>
                <Typography>Formulario de Contacto</Typography>
                <FormGroup>
                    <Input>Nombres</Input>
                    <Input>Apellidos</Input>
                    <Input>Número de Contacto</Input>
                    <Input>Correo Electrónico</Input>
                    <TextField>Descripción o solicitud</TextField>
                </FormGroup>
            </FormControl>
            <Box>
                <Button>
                    Enviar
                </Button>
            </Box>

        </Box>
    )
}