import { Box, Typography, Paper } from "@mui/material";

export const CodeImage = () => {
  const sym = "#89ddff"; // Color para símbolos (Azul/Gris)
  const key = "#82aaff"; // Color para propiedades
  const val = "#c3e88d"; // Color para valores (Strings)
  const kw = "#c792ea"; // Color para palabras reservadas

  return (
    <Box sx={{ position: "relative", display: { xs: "none", lg: "block" } }}>
      <Paper
        elevation={1}
        sx={{
          width: "34.375rem",
          p: 3,
          borderRadius: 2,
          bgcolor: "#242527",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          transition: "transform 0.5s",
          "&:hover": { transform: "scale(1.02)" },
        }}
      >
        {/* Cabecera Estilo Mac */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              bgcolor: "#ff5f56",
            }}
          />
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              bgcolor: "#ffbd2e",
            }}
          />
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              bgcolor: "#27c93f",
            }}
          />
          <Typography
            variant="caption"
            sx={{ ml: 2, color: "#ffffff99", fontFamily: "monospace" }}
          >
            ThemeConfig.ts
          </Typography>
        </Box>

        {/* Bloque de Código - Usamos etiquetas span nativas para mayor estabilidad */}
        <Box
          component="pre"
          sx={{
            fontFamily: '"Fira Code", monospace',
            fontSize: "0.85rem",
            lineHeight: 1.7,
            color: "#a6accd",
            margin: 0,
          }}
        >
          <span style={{ color: kw }}>export const</span>{" "}
          <span style={{ color: "#ffcb6b" }}>theme</span> ={" "}
          <span style={{ color: kw }}>createTheme</span>
          <span style={{ color: sym }}>{"({"}</span>
          {`
  `}
          <span style={{ color: key }}>palette</span>
          <span style={{ color: sym }}>: {"{"}</span>
          {`
    `}
          <span style={{ color: key }}>mode</span>
          <span style={{ color: sym }}>:</span>{" "}
          <span style={{ color: val }}>'dark'</span>
          <span style={{ color: sym }}>,</span>
          {`
    `}
          <span style={{ color: key }}>primary</span>
          <span style={{ color: sym }}>: {"{"}</span>
          {`
      `}
          <span style={{ color: key }}>main</span>
          <span style={{ color: sym }}>:</span>{" "}
          <span style={{ color: val }}>'#2196f3'</span>
          {`
    `}
          <span style={{ color: sym }}>{"},"}</span>
          {`
    `}
          <span style={{ color: key }}>background</span>
          <span style={{ color: sym }}>: {"{"}</span>
          {`
      `}
          <span style={{ color: key }}>default</span>
          <span style={{ color: sym }}>:</span>{" "}
          <span style={{ color: val }}>'#121212'</span>
          {`
    `}
          <span style={{ color: sym }}>{"}"}</span>
          {`
  `}
          <span style={{ color: sym }}>{"},"}</span>
          {`
  `}
          <span style={{ color: key }}>typography</span>
          <span style={{ color: sym }}>: {"{"}</span>
          {`
    `}
          <span style={{ color: key }}>fontFamily</span>
          <span style={{ color: sym }}>:</span>{" "}
          <span style={{ color: val }}>'Roboto'</span>
          {`
  `}
          <span style={{ color: sym }}>{"}"}</span>
          {`
`}
          <span style={{ color: sym }}>{"});"}</span>
        </Box>
      </Paper>
    </Box>
  );
};
