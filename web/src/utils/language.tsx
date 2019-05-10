import React, { Context } from "react";

type Dictionary = {
  [msg: string]: {
    [lang: string]: string;
  };
};

export let dictionary: Dictionary = {
  home: { PT: "Início", EN: "Home" },
  shop: { PT: "Loja", EN: "Shop" },
  search: { PT: "Busca", EN: "Search" },
  new: { PT: "Novo", EN: "New" },
  profile: { PT: "Perfil", EN: "Profile" },
  conferences: { PT: "Conferências", EN: "Conferences" }
};

export const LanguageContext: Context<string> = React.createContext<string>(
  "EN"
);
