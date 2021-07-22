import { Avatar, Box, Card, CardBody, Heading } from 'grommet';
import { LinkPrevious } from 'grommet-icons';
import Link from 'next/link';
import React from 'react';
import { fetchStudent, Student } from '../../services/students';

type Props = {
  student: Student
};

const StudentPage:React.FC<Props> = ({student}) => {
    return (
    <Box direction="column" pad="medium">
        <Box direction="row" align="center">
            <Link href={`/`}>
                <LinkPrevious />
            </Link>
            <Heading margin="0px 0px 0px 20px" level="2">Student Details</Heading>
        </Box>
        <Card height="medium" margin="10px 0px 0px 35px" width="large">
            <CardBody align="start" pad="medium">
                <p>First Name : <b>{student.first_name}</b></p>
                <p>Last Name : <b>{student.last_name}</b></p>
                <Box direction="row" align="center">
                    Avatar : <Avatar src={student.avatar} />
                </Box>
                <p>Email: <b>{student.email}</b></p>
                <p>Job: <b>{student.job}</b></p>
                <p>Company: <b>{student.company}</b></p>
            </CardBody>
        </Card>
    </Box>)
}

export const getServerSideProps = async (context:any) => {
  const student = await fetchStudent(context.params.id);

  return {
    props: { student }, // will be passed to the page component as props
  }
}

export default StudentPage;