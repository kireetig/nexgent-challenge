export type Student = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
  job: string;
  company: string;
};

const HOST = process.env.HOST;

export const fetchStudents = async (): Promise<Student[]> => {
  const response = await fetch(`${HOST}/api/students`);
  const data = await response.json();
  return data;
};

export const fetchStudent = async (id: string): Promise<Student> => {
  const response = await fetch(`${HOST}/api/students/${id}`);
  const data = await response.json();
  return data;
};
