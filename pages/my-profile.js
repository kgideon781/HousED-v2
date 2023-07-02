import React, {useEffect} from 'react';
import {Avatar, Box, Flex, Text} from "@chakra-ui/react";
import {auth, db} from "../firebase";

const MyProfile = () => {
    const currentUser = auth.currentUser;
    const [role, setRole] = React.useState("user");
    const usersRef = db.collection('users');
    const userRef = usersRef.doc(currentUser.uid);


    useEffect(() => {
        userRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                setRole(doc.data().role);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        }
        );
    }, []);

    return (
        <Box>


            <Box
                bg="gray.200"
                p={4}
                borderRadius="md"
                boxShadow="md"
            >
                <Text fontSize="2xl" fontWeight="bold" mb={4}>
                    My Profile
                </Text>
                <Box h={"30vh"}>
                    <Flex h={"100%"}>
                        <Box>
                            <Avatar size="xl" name={currentUser.displayName} src={currentUser.photoURL} />
                        </Box>
                        <Flex h={"100%"} ml={"5%"}>
                            <Box>

                                <Text fontSize="xl" mb={2} fontWeight={"black"} color={"blue.500"}>
                                    {currentUser.displayName}
                                </Text>
                                <Text fontSize="xl" mb={2} textDecor={"underline"} fontWeight={"thin"}>
                                    Email: {currentUser.email}
                                </Text>
                                <Text fontSize="xl" mb={2}  fontWeight={"bold"} >
                                    Role: {role}
                                </Text>

                            </Box>
                        </Flex>

                    </Flex>

                </Box>
            </Box>


            <Box>
                <Text fontSize="2xl" fontWeight="bold" mb={4} mt={4}>
                    My Properties
                </Text>
                <Box
                    bg="gray.200"
                    p={4}
                    borderRadius="md"
                    boxShadow="md"
                >
                    {/*Fetch properties by current user*/}
                </Box>
            </Box>


        </Box>
    );
};

export default MyProfile;
