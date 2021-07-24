import { Box, Grid, ResponsiveContext, TextInput } from "grommet";
import React, { useContext, useEffect, useState } from "react";
import UserCard from "../components/user.card";
import { fetchStudents, Student } from "../services/students";
import Link from "next/link";
import { useRouter } from "next/dist/client/router";

type Props = {
  students: Student[];
};

const Main: React.FC<Props> = ({ students }) => {
  const router = useRouter();
  const [searchText, setSearchText] = useState<string>(
    (router.query.search as string) || ""
  );
  const [studentList, setStudentList] = useState<Student[]>([]);
  const size = useContext(ResponsiveContext);

  const onChangeHandler = (event: any) => {
    setSearchText(event.target.value);
  };

  // this to filter when user stopped typing
  useDebouncedEffect(() => filterText(searchText), [searchText], 250);

  const isValuePresent = (s: string, val: string) => {
    return s.toLowerCase().includes(val);
  };

  const filterText = (val: string) => {
    // to persist search text
    router.push({
      pathname: "/",
      query: { search: val },
    });
    router.push(router);
    const filteredStudents = students.filter(
      (s) =>
        isValuePresent(s.first_name, val) || isValuePresent(s.last_name, val)
    );
    setStudentList(filteredStudents);
  };

  return (
    <Box direction="column" pad="medium" height="100%" overflow="auto">
      <TextInput
        placeholder="type here"
        value={searchText}
        onChange={onChangeHandler}
      />
      <Box pad="large">
        <Grid
          columns={size !== "small" ? "small" : "100%"}
          gap="small"
          justify={"center"}
        >
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

export const getServerSideProps = async (context: any) => {
  const students = await fetchStudents();

  return {
    props: { students }, // will be passed to the page component as props
  };
};

// normally i add this in hooks folder where we keep custom hooks
export const useDebouncedEffect = (effect: any, deps: any, delay: number) => {
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay);

    return () => clearTimeout(handler);
  }, [...(deps || []), delay]);
};

export default Main;
