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


export default Main;
