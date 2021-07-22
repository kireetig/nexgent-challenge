import { Box, TextInput } from "grommet";
import React, { useEffect, useMemo, useState } from "react";
import UserCard from "../components/user.card";
import { fetchStudents, Student } from "../services/students";

type Props = {
  students: Student[]
};

const Main: React.FC<Props> = ({students}) => {
  const [searchText, setSearchText] = useState('');
  const [studentList, setStudentList] = useState(students);

   const onChangeHandler = (event: any) => {
    setSearchText(event.target.value);
   }

   // this to filter when user stopped typing
   useDebouncedEffect(() => filterText(searchText), [searchText], 500);

  const isValuePresent = (s:string, val: string) => {
    return s.toLowerCase().includes(val);
  }

  const filterText = (val:string) => {
    const filteredStudents = students.filter(s => isValuePresent(s.first_name, val) || isValuePresent(s.last_name, val));
    setStudentList(filteredStudents);
  }

  return (
    <Box direction="column" pad="medium" height="100%" overflow="auto">
      <TextInput placeholder="type here" value={searchText} onChange={onChangeHandler} />
      <Box direction="row" wrap={true}>
        {studentList.map((s) => (
          <Box margin="10px" key={s.id}>
            <UserCard user={s} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export const getServerSideProps = async (context:any) => {
  const students = await fetchStudents();

  return {
    props: { students }, // will be passed to the page component as props
  }
}

// normally i add this in hooks folder where we keep custom hooks
export const useDebouncedEffect = (effect:any, deps:any, delay:number) => {
    useEffect(() => {
        const handler = setTimeout(() => effect(), delay);

        return () => clearTimeout(handler);
    }, [...deps || [], delay]);
}

export default Main;
