import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Growndona",
    short_name: "Growndona",
    description:
      "Seguimiento organizado de cultivos: parámetros, riegos, fotos y más.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/logo-ligth.png",
        sizes: "1254x1254",
        type: "image/png",
      },
      {
        src: "/logo-ligth.png",
        sizes: "1254x1254",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
