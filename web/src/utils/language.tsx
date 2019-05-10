import React, { Context } from "react";

export const defaultLanguage = "EN";
export let preferedLanguage = localStorage.getItem("lang");

export function saveLanguage(lang: string) {
  localStorage.setItem("lang", lang);
}

type Dictionary = {
  [msg: string]: {
    [lang: string]: string;
  };
};

export let dictionary: Dictionary = {
  home: { PT: "Início", EN: "Home" },
  shop: { PT: "Loja", EN: "Shop" },
  search: { PT: "Procurar", EN: "Search" },
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
  yes: { PT: "Sim", EN: "Yes" },
  administrator: { PT: "Administrador", EN: "Administrator" },
  unknown_error: { PT: "Erro desconhecido", EN: "Something went wrong" },
  title: { PT: "Título", EN: "Title" },
  create_post: { PT: "Criar publicação", EN: "Create post" },
  closed_conference: {
    PT: "Esta conferência foi encerrada!",
    EN: "This conference has been closed!"
  },
  reopen_conference: { PT: "Reabrir conferência", EN: "Reopen conference" },
  hide_conference: { PT: "Esconder conferência", EN: "Hide conference" },
  report_conference: { PT: "Reportar conferência", EN: "Report conference" },
  archive_conference: { PT: "Arquivar conferência", EN: "Archive conference" },
  start_livestream_conference: {
    PT: "Começar transmissão em direto",
    EN: "Start livestream"
  },
  create_challenge_conference: { PT: "Criar desafio", EN: "Create challenge" },
  invite_users: { PT: "Convidar utilizadores", EN: "Invite users" },
  leave_conference: { PT: "Sair da conferência", EN: "Leave conference" },
  join_conference: { PT: "Entrar na conferência", EN: "Join conference" },
  no_access_conference: {
    PT: "Não tem permissões para aceder a esta conferência",
    EN: "You don't have permissions to access this conference"
  },
  login: { PT: "Entrar", EN: "Login" },
  username: { PT: "Nome de utilizador", EN: "Username" },
  password: { PT: "Palavra passe", EN: "Password" },
  notifications: { PT: "Notificações", EN: "Notifications" },
  no_notifications: {
    PT: "Erro ao adquirir notificações",
    EN: "Error retrieving notifications."
  },
  error_notifications: {
    PT: "Não tem notificações",
    EN: "You have no notifications."
  },
  search_type: { PT: "Tipo de busca", EN: "Search type" },
  all_users: { PT: "Todos os utilizadores", EN: "All users" },
  administrators: { PT: "Administradores", EN: "Administrators" },
  banned_users: { PT: "Utilizadores banidos", EN: "Banned users" },
  admin_area: { PT: "Área de administração", EN: "Administration area" },
  manage_users: { PT: "Gerir utilizadores", EN: "Manage users" },
  description: {
    PT: "Rede Social para profissionais e estudantes de saúde",
    EN: "Social Network for medicine professionals and students"
  },
  document_sharing: { PT: "Partilha de Documentos", EN: "Document Sharing" },
  comment_encourage: { PT: "Comente e Incentive", EN: "Comment and Encourage" },
  search_find: { PT: "Procure e Encontre", EN: "Search and Find" },
  description2: {
    PT: "Teses, casos de estudo, video-conferências, ...",
    EN: "Thesis, clinical cases, video conferences..."
  },
  signup: { PT: "Registar", EN: "Sign up" },
  first_name: { PT: "Primeiro nome", EN: "First name" },
  last_name: { PT: "Último nome", EN: "Last name" },
  profession_field: { PT: "Profissão / Área", EN: "Profession / Field" },
  workplace_institution: {
    PT: "Local de Trabalho / Instituição",
    EN: "Workplace / Institution"
  },
  search_results: { PT: "Resultados de Pesquisa", EN: "Search Results" },
  posts_by_content: { PT: "Publicações por Conteúdo", EN: "Posts by Content" },
  search_by_author: { PT: "Publicações por Autor", EN: "Posts by Author" },
  search_users: { PT: "Utilizadores", EN: "Users" },
  shop_you_have: { PT: "Tem", EN: "You have" },
  shop_points: { PT: "pontos!", EN: "points!" },
  shop_search_points: { PT: "Procurar produtos", EN: "Search products" },
  shop_exchange: { PT: "Trocar", EN: "Exchange" },
  tag_placeholder: {
    PT: "Procure ou insira uma nova categoria e carregue Enter.",
    EN: "Search for or insert a new tag and click Enter."
  },
  report: { PT: "Denúncia", EN: "Report" },
  search_user: { PT: "Procurar utilizador", EN: "Search user" },
  publication: { PT: "publicação", EN: "Post" },
  comment: { PT: "comentário", EN: "comment" },
  take_action: { PT: "Tomar ação", EN: "Take action" },
  ban_user: { PT: "Banir utilizador", EN: "Ban user" },
  delete_content: { PT: "Apagar conteúdo", EN: "Delete content" },
  ignore: { PT: "Ignorar", EN: "Ignore" },
  banned: { PT: "banido", EN: "banned" },
  ban_action: { PT: "Banir", EN: "Ban" },
  unban_action: { PT: "Desbanir", EN: "Unban" },
  turn_admin: { PT: "Tornar admin", EN: "Turn admin" },
  expel_admin: { PT: "Expulsar admin", EN: "Expel admin" },
  conference_chat: { PT: "Chat da conferência", EN: "Conference Chat" },
  chat_message_placeholder: {
    PT: "Insira aqui a sua mensagem...",
    EN: "Insert your message here..."
  }
};

export const LanguageContext: Context<string> = React.createContext<string>(
  defaultLanguage
);
