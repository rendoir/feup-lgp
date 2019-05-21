import React, { Context } from 'react';

export const defaultLanguage = 'EN';
export let preferedLanguage = localStorage.getItem('lang');

export function saveLanguage(lang: string) {
  localStorage.setItem('lang', lang);
}

type Dictionary = {
  [msg: string]: {
    [lang: string]: string;
  };
};

/* tslint:disable:object-literal-sort-keys */
export let dictionary: Dictionary = {
  of: { PT: 'de', EN: 'of' },
  by: { PT: 'por', EN: 'by' },
  home: { PT: 'Início', EN: 'Home' },
  shop: { PT: 'Loja', EN: 'Shop' },
  search: { PT: 'Procurar', EN: 'Search' },
  new: { PT: 'Novo', EN: 'New' },
  user_dropdown: { PT: 'Utilizador', EN: 'User' },
  profile: { PT: 'Perfil', EN: 'Profile' },
  talks: { PT: 'Palestras', EN: 'Talks' },
  edit_profile: { PT: 'Editar perfil', EN: 'Edit profile' },
  logout: { PT: 'Terminar sessão', EN: 'Logout' },
  conferences: { PT: 'Conferências', EN: 'Conferences' },
  return_conference: {
    PT: ' Voltar para a conferência',
    EN: ' Return to conference'
  },
  upcoming_conferences: {
    PT: 'Proximas conferencias',
    EN: 'Upcoming conferences'
  },
  no_upcoming_conferences: {
    PT: 'Não há conferencias próximas',
    EN: 'There is no upcoming conferences'
  },
  view_more: { PT: 'Ver mais', EN: 'View more' },
  like_action: { PT: 'Gostar', EN: 'Like' },
  dislike_action: { PT: 'Não gostar', EN: 'Dislike' },
  comment_action: { PT: 'Comentar', EN: 'Comment' },
  share_action: { PT: 'Partilhar', EN: 'Share' },
  subscribe_action: { PT: 'Subscrever', EN: 'Subscribe' },
  unsubscribe_action: { PT: 'Dessubscrever', EN: 'Unsubscribe' },
  reply_action: { PT: 'Responder', EN: 'Reply' },
  edit_action: { PT: 'Editar', EN: 'Edit' },
  delete_action: { PT: 'Apagar', EN: 'Delete' },
  likes: { PT: 'gostos', EN: 'likes' },
  comments: { PT: 'comentários', EN: 'comments' },
  replies: { PT: 'respostas', EN: 'replies' },
  see_replies: { PT: 'Ver', EN: 'See' },
  insert_comment_placeholder: {
    PT: 'Escreve aqui o teu comentário',
    EN: 'Insert your comment here'
  },
  submit: { PT: 'Submeter', EN: 'Submit' },
  edit_comment: { PT: 'Editar comentário', EN: 'Edit comment' },
  delete_comment: { PT: 'Apagar comentário', EN: 'Delete comment' },
  save: { PT: 'Gravar', EN: 'Save' },
  cancel: { PT: 'Cancelar', EN: 'Cancel' },
  confirm_delete: {
    PT:
      'Tem a certeza que deseja apagar este comentário? Não será possível recuperá-lo.',
    EN:
      "Are you sure you want do delete this comment? It can't be retrieved later."
  },
  report_comment: { PT: 'Reportar comentário', EN: 'Report comment' },
  report_post: { PT: 'Reportar publicação', EN: 'Report post' },
  report_comment_issued: {
    PT: 'Este comentário já foi reportado',
    EN: 'Report already issued'
  },
  report_post_issued: {
    PT: 'Esta publicação já foi reportada',
    EN: 'Report already issued'
  },
  edit_post: { PT: 'Editar publicação', EN: 'Edit post' },
  delete_post: { PT: 'Apagar publicação', EN: 'Delete post' },
  yes: { PT: 'Sim', EN: 'Yes' },
  administrator: { PT: 'Administrador', EN: 'Administrator' },
  unknown_error: { PT: 'Erro desconhecido', EN: 'Something went wrong' },
  title: { PT: 'Título', EN: 'Title' },
  create_post: { PT: 'Criar publicação', EN: 'Create post' },
  edit_talk: { PT: 'Editar palestra', EN: 'Edit talk' },
  edit_conference: { PT: 'Editar conferencia', EN: 'Edit conference' },
  closed_talk: {
    PT: 'Esta palestra encontra-se fechada!',
    EN: 'This talk is closed!'
  },
  reopen_talk: { PT: 'Abrir palestra', EN: 'Open talk' },
  hide_talk: { PT: 'Esconder palestra', EN: 'Hide talk' },
  report_talk: { PT: 'Reportar palestra', EN: 'Report talk' },
  archive_talk: { PT: 'Arquivar palestra', EN: 'Archive talk' },
  unarchive_talk: {
    PT: 'Desarquivar conferência',
    EN: 'Unarchive conference'
  },
  start_livestream_talk: {
    PT: 'Começar transmissão em direto',
    EN: 'Start livestream'
  },
  create_challenge_talk: { PT: 'Criar desafio', EN: 'Create challenge' },
  invite_users: { PT: 'Convidar utilizadores', EN: 'Invite users' },
  leave_talk: { PT: 'Sair da palestra', EN: 'Leave talk' },
  join_talk: { PT: 'Entrar na palestra', EN: 'Join talk' },
  joined_talks: { PT: 'Palestras participantes', EN: 'Joined talks' },
  no_joined_talks: {
    PT: 'Você não participa de nenhuma palestra',
    EN: 'You have not joined any talk'
  },
  no_access_talk: {
    PT: 'Não tem permissões para aceder a esta palestra',
    EN: "You don't have permissions to access this talk"
  },
  login: { PT: 'Entrar', EN: 'Login' },
  username: { PT: 'Nome de utilizador', EN: 'Username' },
  email: { PT: 'E-mail', EN: 'E-mail' },
  password: { PT: 'Palavra passe', EN: 'Password' },
  new_password: { PT: 'Nova palavra passe', EN: 'New Password' },
  old_password: { PT: 'Palavra passe atual', EN: 'Current Password' },
  notifications: { PT: 'Notificações', EN: 'Notifications' },
  no_notifications: {
    PT: 'Não tem notificações',
    EN: 'You have no notifications.'
  },
  error_notifications: {
    PT: 'Erro ao adquirir notificações',
    EN: 'Error retrieving notifications.'
  },
  search_type: { PT: 'Tipo de busca', EN: 'Search type' },
  all_users: { PT: 'Todos os utilizadores', EN: 'All users' },
  administrators: { PT: 'Administradores', EN: 'Administrators' },
  banned_users: { PT: 'Utilizadores banidos', EN: 'Banned users' },
  admin_area: { PT: 'Área de administração', EN: 'Administration area' },
  manage_users: { PT: 'Gerir utilizadores', EN: 'Manage users' },
  website_description: {
    PT: 'Rede Social para profissionais e estudantes de saúde',
    EN: 'Social Network for medicine professionals and students'
  },
  document_sharing: { PT: 'Partilha de Documentos', EN: 'Document Sharing' },
  comment_encourage: { PT: 'Comente e Incentive', EN: 'Comment and Encourage' },
  search_find: { PT: 'Procure e Encontre', EN: 'Search and Find' },
  website_description2: {
    PT: 'Teses, casos de estudo, video-palestras, ...',
    EN: 'Thesis, clinical cases, video talks...'
  },
  signup: { PT: 'Registar', EN: 'Sign up' },
  first_name: { PT: 'Primeiro nome', EN: 'First name' },
  last_name: { PT: 'Último nome', EN: 'Last name' },
  profession_field: {
    PT: 'Profissão / Área (Opcional)',
    EN: 'Profession / Field (Optional)'
  },
  workplace_institution: {
    PT: 'Local de Trabalho / Instituição (Opcional)',
    EN: 'Workplace / Institution (Optional)'
  },
  hometown: { PT: 'Localidade (Opcional)', EN: 'Hometown (Optional)' },
  university: { PT: 'Universidade (Opcional)', EN: 'University (Optional)' },
  confirm_password: { PT: 'Confirme a palavra passe', EN: 'Confirm password' },
  invalid_name: { PT: 'Nome inválido', EN: 'Invalid name' },
  invalid_email: { PT: 'Email inválido', EN: 'Invalid email' },
  invalid_password: {
    PT: 'A palavra passe deve conter pelo menos um número e 8 caracteres',
    EN: 'Password must have at least a number and be 8 characters of length'
  },
  invalid_confirm_password: {
    PT: 'As palavras passe não são iguais',
    EN: 'Passwords do not match'
  },
  register: { PT: 'Registar', EN: 'Register' },
  search_results: { PT: 'Resultados de Pesquisa', EN: 'Search Results' },
  posts_by_content: { PT: 'Publicações por Conteúdo', EN: 'Posts by Content' },
  search_by_author: { PT: 'Publicações por Autor', EN: 'Posts by Author' },
  search_users: { PT: 'Utilizadores', EN: 'Users' },
  shop_you_have: { PT: 'Tem', EN: 'You have' },
  shop_points: { PT: 'pontos', EN: 'points' },
  shop_search_points: { PT: 'Procurar produtos', EN: 'Search products' },
  shop_exchange: { PT: 'Trocar', EN: 'Exchange' },
  tag_placeholder: {
    PT: 'Procure ou insira uma nova tag e clique Enter.',
    EN: 'Search for or insert a new tag and click Enter.'
  },
  report: { PT: 'Denúncia', EN: 'Report' },
  search_user: { PT: 'Procurar utilizador', EN: 'Search user' },
  publication: { PT: 'publicação', EN: 'Post' },
  comment: { PT: 'comentário', EN: 'comment' },
  take_action: { PT: 'Tomar ação', EN: 'Take action' },
  ban_user: { PT: 'Banir utilizador', EN: 'Ban user' },
  unban_user: { PT: 'Desbanir utilizador', EN: 'Unban user' },
  delete_content: { PT: 'Apagar conteúdo', EN: 'Delete content' },
  ignore: { PT: 'Ignorar', EN: 'Ignore' },
  banned: { PT: 'banido', EN: 'banned' },
  ban_action: { PT: 'Banir', EN: 'Ban' },
  unban_action: { PT: 'Desbanir', EN: 'Unban' },
  turn_admin: { PT: 'Tornar admin', EN: 'Turn admin' },
  expel_admin: { PT: 'Expulsar admin', EN: 'Expel admin' },
  talk_chat: { PT: 'Chat da palestra', EN: 'Talk Chat' },
  chat_message_placeholder: {
    PT: 'Insira aqui a sua mensagem...',
    EN: 'Insert your message here...'
  },
  conference: { PT: 'conferência', EN: 'conference' },
  talk: { PT: 'palestra', EN: 'talk' },
  post: { PT: 'publicação', EN: 'post' },
  description: { PT: 'Descrição', EN: 'Description' },
  description_placeholder: {
    PT: 'Escreva uma breve descrição',
    EN: 'Write a short description'
  },
  visibility_public: { PT: 'Público', EN: 'Public' },
  visibility_followers: { PT: 'Seguidores', EN: 'Followers' },
  visibility_private: { PT: 'Privado', EN: 'Private' },
  visibility: { PT: 'Visibilidade', EN: 'Visibility' },
  talk_local: { PT: 'Local da palestra', EN: 'Talk location' },
  conference_local: { PT: 'Local da conferência', EN: 'Conference location' },
  location: { PT: 'Localização', EN: 'Location' },
  dates: { PT: 'Datas', EN: 'Dates' },
  date_start: { PT: 'Início', EN: 'Start' },
  date_end: { PT: 'Fim', EN: 'End' },
  starting_date: { PT: 'Data de inicio', EN: 'Starting date' },
  ending_date: { PT: 'Data de termino', EN: 'Ending date' },
  date_format: {
    PT: 'pt-PT',
    EN: 'en-US'
  },
  livestream: { PT: 'Transmissão em direto', EN: 'Livestream' },
  livestream_url: {
    PT: 'URL da transmissão em direto (Embed Link)',
    EN: 'Livestream URL (Embed Link)'
  },
  tags: { PT: 'Categorias', EN: 'Tags' },
  files: { PT: 'Ficheiros', EN: 'Files' },
  post_cap: { PT: 'Publicação', EN: 'Post' },
  post_description: {
    PT: 'Publicações são o mecanismo básico de partilha de conhecimento',
    EN: 'Post are the basic mechanism used to share knowledge.'
  },
  talk_cap: { PT: 'Palestra', EN: 'Talk' },
  talk_description: {
    PT: 'Palestras são sessões formais para a discussão de um tópico',
    EN: 'Talks are formal meetings for discussion of a particular topic.'
  },
  conference_cap: { PT: 'Conferência', EN: 'Conference' },
  conference_description: {
    PT: 'Conferências são sessões formais para a discussão de um tópico',
    EN: 'Conferences are formal meetings for discussion of a particular topic.'
  },
  new_f: { PT: 'Nova', EN: 'New' },
  error_occurred: { PT: 'Ocorreu um erro', EN: 'An error occurred' },
  next: { PT: 'Continuar', EN: 'Next' },
  finish: { PT: 'Concluir', EN: 'Finish' },
  edit_avatar: { PT: 'Editar Avatar', EN: 'Edit Avatar' },
  new_talk_post: {
    PT: 'Nova publicação de palestra',
    EN: 'New talk Post'
  },
  accept: { PT: 'Aceitar', EN: 'Accept' },
  refuse: { PT: 'Recusar', EN: 'Refuse' },
  invitation: { PT: 'Foi convidado para ', EN: 'You have been invited to' },
  Create: { PT: 'Criar', EN: 'Create' },
  Delete: { PT: 'Apagar', EN: 'Delete' },
  Edit: { PT: 'Editar', EN: 'Edit' },
  confirm_delete_post: {
    PT:
      'Tem a certeza que deseja apagar esta publicação? Não será possível recuperá-la.',
    EN:
      "Are you sure you want do delete this post? It can't be retrieved later."
  },
  user: { PT: 'Utilizador', EN: 'User' },
  invite_success: {
    PT: 'foi aceite com sucesso.',
    EN: 'was successfully invited.'
  },
  invite_error: {
    PT: 'não pôde ser convidado. Ocorreu um erro',
    EN: "couldn't be invited. An error occurred."
  },
  invite_no_user: {
    PT: 'Nenhum utilizador não convidado com o nome',
    EN: 'No uninvited user called'
  },
  invite_no_users: {
    PT: 'Não exitem utilizadores não convidados',
    EN: 'There are no uninvited users left'
  },
  invite_fetching_uninvited: {
    PT: 'Carregando utilizadores não convidados...',
    EN: 'Fetching uninvited users...'
  },
  invite: { PT: 'Convidar', EN: 'Invite' },
  invite_fetching_subscribers: {
    PT: 'Carregando subscritores não convidados...',
    EN: 'Fetching uninvited subscribers...'
  },
  invite_all_subs: {
    PT: 'Convidar todos os subscritos',
    EN: 'Invite all subscribers'
  },
  invite_all_subs_done: {
    PT: 'Todos os subscritos foram convidados',
    EN: 'All subscribers have been invited'
  },
  inviting_subs: { PT: 'Convidando subscritos', EN: 'Inviting subscribers...' },
  invite_without: { PT: 'sem convite', EN: 'without invitation' },
  invite_error_sub: {
    PT:
      'Erro ao carregar subscritos não convidados. Tente novamente mais tarde',
    EN: 'Error fetching uninvited subscribers. Try again later.'
  },
  invite_users_to: {
    PT: 'Convide utilizadores para a sua',
    EN: 'Invite users to your'
  },
  done: { PT: 'Concluído', EN: 'Done' },
  report_reason: { PT: 'Razão de reportar', EN: 'Report reason' },
  report_reason_required: {
    PT: 'Uma razão de reportar deve ser introduzida',
    EN: 'A report reason must be provided'
  },
  report_submit: { PT: 'Submeter denúncia', EN: 'Submit report' },
  content_report: { PT: 'Denúncia de Conteúdo', EN: 'Content Report' },
  insert_title: { PT: 'Insira um título', EN: 'Insert title' },
  title_required: {
    PT: 'Um título deve ser introduzido',
    EN: 'Title must be provided'
  },
  body: { PT: 'Conteúdo', EN: 'Body' },
  insert_body: { PT: 'Insira conteúdo', EN: 'Insert body' },
  body_required: {
    PT: 'Conteúdo deve ser introduzido',
    EN: 'Body must be provided'
  },
  insert_files: {
    PT: 'Insira imagens, videos e documentos',
    EN: 'Insert images, videos and documents'
  },
  start_at: { PT: 'Começou a', EN: 'Started at' },
  day_split: { PT: 'Acaba a', EN: 'Ends at' },
  month1: { PT: 'Janeiro', EN: 'January' },
  month2: { PT: 'Fevereiro', EN: 'February' },
  month3: { PT: 'Março', EN: 'March' },
  month4: { PT: 'Abril', EN: 'April' },
  month5: { PT: 'Maio', EN: 'May' },
  month6: { PT: 'Junho', EN: 'June' },
  month7: { PT: 'Julho', EN: 'July' },
  month8: { PT: 'Agosto', EN: 'August' },
  month9: { PT: 'Setembro', EN: 'September' },
  month10: { PT: 'Outubro', EN: 'October' },
  month11: { PT: 'Novembro', EN: 'November' },
  month12: { PT: 'Dezembro', EN: 'December' },

  create_new_post: { PT: 'Criar nova publicação', EN: 'Create new post' },
  create_new_talk: { PT: 'Criar nova palestra', EN: 'Create new talk' },
  save_changes: { PT: 'Gravar mudanças', EN: 'Save changes' },
  challenge_conference: { PT: 'Desafios', EN: 'Challenges' },
  no_challenges: {
    PT: 'Ainda não há desafios. Tenta mais tarde!',
    EN: 'No challenges yet. Try later!'
  },
  simple_question: {
    PT: 'Desafios de Questão Simples',
    EN: 'Simple Question Challenges'
  },
  simple_question_desc: {
    PT:
      'servem para convidar os participantes da conferência a responder a uma pergunta para ganhar algo.',
    EN:
      'serve to invite conference participants to answer a question to win something.'
  },
  mult_choice_question: {
    PT: 'Desafios de Questão de Escolha Múltipla',
    EN: 'Multiple Choice Question Challenges'
  },
  mult_choice_question_desc: {
    PT:
      'servem para convidar os participantes da conferência a responder a uma pergunta de escolha múltipla para ganhar algo.',
    EN:
      'serve to invite conference participants to answer a question with multiple choice options, to win something.'
  },
  post_create: {
    PT: 'Desafios de Publicar na conferência',
    EN: 'Post on Conference Challenges'
  },
  post_create_desc: {
    PT:
      'servem para convidar os participantes da conferência a criar publicações na conferência.',
    EN: 'serve to invite conference participants to write posts on conference.'
  },
  comment_post: {
    PT: 'Desafios de Comentar uma Publicação',
    EN: 'Comment on a Post Challenges'
  },
  comment_post_desc: {
    PT:
      'servem para convidar os participantes da conferência a escrever comentários em certas publicações na conferência.',
    EN:
      'serve to invite conference participants to write comments on specific posts on conference.'
  },
  new_challenge: {
    PT: 'Novo Desafio',
    EN: 'New Challenge'
  },
  challenge_title: {
    PT: 'Título do Desafio',
    EN: 'Challenge title'
  },
  chal_description_placeholder: {
    PT: 'Escreva uma breve descrição do desafio.',
    EN: 'Write a brief description of the challenge.'
  },
  prize: {
    PT: 'Prémio',
    EN: 'Prize'
  },
  prize_desc: {
    PT:
      "Escreva uma breve descrição do prémio. Se este for em pontos indique 'points'.",
    EN:
      "Write a short description of the prize to give. If it is in points, write 'points'."
  },
  my_points: {
    PT: 'Os Meus Pontos: ',
    EN: 'My Points: '
  },
  points: {
    PT: 'Pontos',
    EN: 'Points'
  },
  points_desc: {
    PT: "Se o prémio não for em pontos, escreva '0'",
    EN: "If prize is not points, write '0'"
  },
  question: {
    PT: 'Questão',
    EN: 'Question'
  },
  correct_answer: {
    PT: 'Resposta Correcta',
    EN: 'Correct Answer'
  },
  options: {
    PT: 'Opções',
    EN: 'Options'
  },
  post_to_com: {
    PT: 'Publicação a comentar',
    EN: 'Post to Comment'
  },
  ending_at: {
    PT: 'Acaba em:',
    EN: 'Ending at:'
  },
  solve_challenge: {
    PT: 'Resolver Desafio',
    EN: 'Solve Challenge'
  },
  win: {
    PT: 'Ganha',
    EN: 'Win'
  },
  comment_on_post: {
    PT: 'Comenta na publicação com o título:',
    EN: 'Comment On Post with title:'
  },
  write_answer: {
    PT: 'Escreve aqui a tua resposta',
    EN: 'Write here your answer'
  },
  new_mp: {
    PT: 'Novos',
    EN: 'New'
  },
  join: { PT: 'Aderir', EN: 'Join' },
  invite_discussion: {
    PT: 'Convidar para a discussão',
    EN: 'Invite users to discussion'
  },
  invite_discussion_placeholder: {
    PT: 'Insira o primeiro e último nome do utilizador',
    EN: "Insert user's first and last name"
  },
  see_all_reports: { PT: 'Ver todas as denúncias', EN: 'See all reports' },
  days: { PT: 'dias', EN: 'days' },
  hours: { PT: 'horas', EN: 'hours' },
  minutes: { PT: 'minutos', EN: 'minutes' },
  now: { PT: 'agora', EN: 'now' },
  ago: { PT: 'atrás', EN: 'ago' },
  followers: { PT: 'A seguir', EN: 'Following' },
  following: {
    PT: 'Você não segue ninguém ainda!',
    EN: "You don't follow anyone yet!"
  },
  create_post_chal: {
    PT: 'Leia a descrição e crie uma publicação nesta palestra.',
    EN: 'Read the description and create a post in this talk.'
  },
  add_admin: { PT: 'Adicionar Admin', EN: 'Add Admin' },
  insert_admin_email: { PT: 'Email do utilizador', EN: 'User email' },
  success_add_admin: {
    PT: 'O utilizador é agora administrador',
    EN: 'User is now an administrator'
  },
  error_add_admin: {
    PT: 'Não foi possível tornar o utilizador num administrador',
    EN: 'Error turning user into administrator'
  },
  not_current_password: {
    PT: 'A palavra passe inserida não é a palavra passe correcta!',
    EN:
      'The current password inserted is different than the one existent for this user!'
  },
  success_remove_admin: {
    PT: 'O utilizador já não é administrador',
    EN: 'User is no longer an administrator'
  },
  error_remove_admin: {
    PT: 'Não foi possível tornar o administrador num utilizador',
    EN: 'Error turning administrator back to user'
  },
  success_ban_user: {
    PT: 'O utilizador foi banido!',
    EN: 'User is now banned'
  },
  error_ban_user: {
    PT: 'Não foi possível banir o utilizador',
    EN: 'Error banning user'
  },
  success_unban_user: {
    PT: 'O utilizador foi desbanido!',
    EN: 'User is now unbanned'
  },
  error_unban_user: {
    PT: 'Não foi possível desbanir o utilizador',
    EN: 'Error unbanning user'
  },
  empty: { PT: '', EN: '' },
  orderBy: { PT: 'Ordenar por', EN: 'Order by' }
};

export const LanguageContext: Context<string> = React.createContext<string>(
  defaultLanguage
);
