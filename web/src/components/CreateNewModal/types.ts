export type Step = 'avatar' | 'type' | 'info';

export type Request = {
  avatar?: File;
  dateEnd?: string;
  dateStart?: string;
  description: string;
  files?: {
    docs: File[];
    images: File[];
    videos: File[];
  };
  local?: string;
  visibility: string;
  tags?: string[];
  title: string;
  type: 'post' | 'conference';
};
