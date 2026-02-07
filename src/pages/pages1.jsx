import { Box, Typography } from "@mui/material";
import { Header, MainCard, ContactForm, Footer } from "../components";
import { useState } from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

export const FrontPage = () => {
  // const [repos, setRepos] = useState([]);
  const [data, setData] = useState([]);

  const getRepositories = async () => {
    try {
      const response =
        await fetch`https://api.github.com/users/jeffersonlizarazu07/repos`;

      const data = await response.json();
      return data;
    } catch {
      const error = new Error("Repositorio no encontrado", error);
    }
    getRepositories();
  };
  console.log(data);

  return (
    <Box>
      <Box>
        <Header />
      </Box>

      <Box>
        <Typography>Sobre mi</Typography>
        <Typography>
          Hola. Mi nombre es Jefferson Lizarazu. Soy desarrollador full stack y
          he decidido crear un lugar donde pueda compartir con ustedes mis
          proyectos realizados y aquellos proyectos que me encuentro realizando
          actualmente.
        </Typography>
      </Box>

      <Box>
        <MainCard />
        <Typography>Proyectos</Typography>
        {data.map((item) => {
          <Box key={data}>
            <Typography>{item.id}</Typography>
            <Typography>{item.name}</Typography>
            <Typography>{item.description}</Typography>
            <Typography>{item.programingLeguage}</Typography>
          </Box>;
        })}
      </Box>

      <Box>
        <ContactForm />
      </Box>

      <Box>
        <Footer />
      </Box>
    </Box>
  );
};
