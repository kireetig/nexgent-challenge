import { Avatar, Box, Card, CardBody, Heading, Text  } from 'grommet';
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
        <Card margin="10px 0px 0px 40px" background="background-front">
            <CardBody align="start" pad="medium">
                <Box direction="row">
                    <Text color="text-xweak">First Name :</Text >
                    <Text color="text-strong" weight="bold">{student.first_name}</Text>
                </Box>
                <Box direction="row" margin="15px 0">
                    <Text color="text-xweak">Last Name :</Text >
                    <Text color="text-strong" weight="bold">{student.last_name}</Text>
                </Box>
                <Box direction="row" align="center" margin="10px 0">
                    <Text color="text-xweak">Avatar :</Text >
                    <Avatar src={student.avatar} />
                </Box>
                <Box direction="row" margin="15px 0">
                    <Text color="text-xweak">Email :</Text >
                    <Text color="text-strong" weight="bold">{student.email}</Text>
                </Box>
                <Box direction="row" margin="15px 0">
                    <Text color="text-xweak">Job :</Text >
                    <Text color="text-strong" weight="bold">{student.job}</Text>
                </Box>
                <Box direction="row" margin="15px 0">
                    <Text color="text-xweak">Company :</Text >
                    <Text color="text-strong" weight="bold">{student.company}</Text>
                </Box>
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