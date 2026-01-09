import { Box, Typography } from "@mui/material";
import { Navbar } from "../components/navbar";
import { MainCard } from "../components/MainCard";

export const FrontPage = () => {
    return (
        <Box>
            <Navbar />
            <Box>
                <Typography>Sobre mi</Typography>
                <Typography>
                    Hola. Mi nombre es Jefferson Lizarazu. Soy desarrollador full stack y he decidido crear un lugar donde pueda compartir con ustedes mis proyectos realizados y aquellos proyectos que me encuentro realizando actualmente.
                </Typography>
            </Box>

            <Box>
                <MainCard/>
                <Typography>
                    Proyectos
                </Typography>
            </Box>


        </Box>
        

        
    )
}