export type Department = {
  id: number;
  name: string;
  whatsapp_link?: string;
};

export type Subject = {
  id: number;
  department_id: number;
  semester_number: number;
  subject_name: string;
};

export type Category = {
  id: number;
  category_name: string;
};

export type Resource = {
  id: number;
  department_id: number;
  semester_number: number;
  subject_id: number;
  category_id: number;
  title: string;
  drive_link: string;
  description: string;
  status: 'active' | 'trash';
  created_at: string;
  updated_at: string;
  department_name?: string;
  subject_name?: string;
  category_name?: string;
};

export type AdminStats = {
  departments: number;
  subjects: number;
  resources: number;
  recent: Resource[];
};
