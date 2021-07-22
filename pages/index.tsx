import { Box, Grid, ResponsiveContext, TextInput } from "grommet";
import React, { useContext, useEffect, useState } from "react";
import UserCard from "../components/user.card";
import { fetchStudents, Student } from "../services/students";
import Link from 'next/link'

type Props = {
  students: Student[]
};

const Main: React.FC<Props> = ({students}) => {
  const [searchText, setSearchText] = useState('');
  const [studentList, setStudentList] = useState(students);
  const size = useContext(ResponsiveContext);

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
      <Box pad="large">
      <Grid columns={size !== 'small' ? 'small' : '100%'} gap="small" justify={'center'}>
          {studentList.map((s) => (
            <Link href={`/student/${s.id}`} key={s.id}>
              <Box margin="10px" alignSelf="center">
                <UserCard user={s} />
              </Box>
            </Link>
          ))}
      </Grid>
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
