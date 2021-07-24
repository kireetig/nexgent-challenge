import {
  Box,
  Grid,
  ResponsiveContext,
  Spinner,
  TextInput,
  Text,
  Pagination,
  Heading,
} from "grommet";
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
  const pageSize = 12; // number of items per page to be shown
  const [searchText, setSearchText] = useState<string>(
    (router.query.search as string) || ""
  );
  const [studentList, setStudentList] = useState<Student[]>(() =>
    router.query.search ? [] : students
  );
  const [isloading, setIsLoading] = useState<boolean>(
    () => !!router.query.search
  );
  const [currentData, setCurrentData] = useState(() =>
    router.query.search ? [] : students.slice(0, pageSize)
  );
  const [indices, setIndices] = useState([0, pageSize]);
  const size = useContext(ResponsiveContext);

  const onChangeHandler = (event: any) => {
    setIsLoading(true);
    setSearchText(event.target.value);
  };

  const handleChange = ({
    startIndex,
    endIndex,
  }: {
    startIndex: number;
    endIndex: number;
  }) => {
    const nextData = studentList.slice(startIndex, endIndex);
    setCurrentData(nextData);
    setIndices([startIndex, Math.min(endIndex, studentList.length)]);
  };

  // this to filter when user stopped typing
  useDebouncedEffect(() => filterText(searchText), [searchText], 300);

  const isValuePresent = (s: string, val: string) => {
    return s.toLowerCase().includes(val);
  };

  const filterText = (val: string) => {
    // to persist search text
    router.push(
      {
        query: { search: val },
      },
      undefined,
      { shallow: true }
    );
    const filteredStudents = students.filter(
      (s) =>
        isValuePresent(s.first_name, val) || isValuePresent(s.last_name, val)
    );
    setIsLoading(false);
    setStudentList(filteredStudents);
    setIndices([0, pageSize]);
    setCurrentData(filteredStudents.slice(0, pageSize));
  };

  return (
    <Box direction="column" pad="medium" height="100%" overflow="auto">
      <TextInput
        placeholder="type here"
        value={searchText}
        onChange={onChangeHandler}
      />
      <Box pad="large">
        {isloading && (
          <Box justify="center" align={"center"}>
            <Spinner message="Loading..." size={"xlarge"} />
          </Box>
        )}
        <Grid
          columns={size !== "small" ? "small" : "100%"}
          gap="small"
          justify={"center"}
        >
          {!isloading &&
            currentData.map((s) => (
              <Link href={`/student/${s.id}`} key={s.id}>
                <Box margin="10px" alignSelf="center">
                  <UserCard user={s} />
                </Box>
              </Link>
            ))}
        </Grid>
        {!isloading && currentData.length === 0 && (
          <Heading>Ops! No results found</Heading>
        )}
        {currentData.length !== 0 && (
          <Box align="center" margin="30px 0" direction="row" justify="between">
            <Text>
              Showing {indices[0] + 1} -{" "}
              {currentData.length < indices[1]
                ? currentData.length
                : indices[1]}{" "}
              of {studentList.length}
            </Text>
            <Pagination
              numberItems={studentList.length}
              onChange={handleChange}
            />
          </Box>
        )}
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
