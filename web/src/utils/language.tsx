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
  conferences: { PT: "Conferências", EN: "Conferences" },
  like_action: { PT: "Gostar", EN: "Like" },
  dislike_action: { PT: "Não gostar", EN: "Dislike" },
  comment_action: { PT: "Comentar", EN: "Comment" },
  share_action: { PT: "Partilhar", EN: "Share" },
  subscribe_action: { PT: "Subscrever", EN: "Subscribe" },
  unsubscribe_action: { PT: "Dessubscrever", EN: "Unsubscribe" },
  reply_action: { PT: "Responder", EN: "Reply" },
  edit_action: { PT: "Editar", EN: "Edit" },
  delete_action: { PT: "Apagar", EN: "Delete" },
  likes: { PT: "gostos", EN: "likes" },
  comments: { PT: "comentários", EN: "comments" },
  replies: { PT: "respostas", EN: "replies" },
  see_replies: { PT: "Ver", EN: "See" },
  insert_comment_placeholder: {
    PT: "Escreve aqui o teu comentário",
    EN: "Insert your comment here"
  },
  submit: { PT: "Submeter", EN: "Submit" },
  edit_comment: { PT: "Editar comentário", EN: "Edit comment" },
  delete_comment: { PT: "Apagar comentário", EN: "Delete comment" },
  save: { PT: "Gravar", EN: "Save" },
  cancel: { PT: "Cancelar", EN: "Cancel" },
  confirm_delete: {
    PT:
      "Tem a certeza que deseja apagar este comentário? Não será possível recuperá-lo.",
    EN:
      "Are you sure you want do delete this comment? It can't be retrieved later."
  },
  report_comment: { PT: "Reportar comentário", EN: "Report comment" },
  report_post: { PT: "Reportar publicação", EN: "Report post" },
  report_comment_issued: {
    PT: "Este comentário já foi reportado",
    EN: "Report already issued"
  },
  report_post_issued: {
    PT: "Esta publicação já foi reportada",
    EN: "Report already issued"
  },
  edit_post: { PT: "Editar publicação", EN: "Edit post" },
  delete_post: { PT: "Apagar publicação", EN: "Delete post" },
  yes: { PT: "Sim", EN: "Yes" }
};

export const LanguageContext: Context<string> = React.createContext<string>(
  "EN"
);
