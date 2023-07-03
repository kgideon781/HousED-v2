import React, {useEffect, useState} from 'react';
import {Avatar, Box, Flex, Text} from "@chakra-ui/react";
import {auth, db} from "../firebase";
import {useCollection} from "react-firebase-hooks/firestore";

const MyProfile = () => {
    const currentUser = auth.currentUser;
    const [role, setRole] = useState("user");
    const [agency, setAgency] = useState("");
    const usersRef = db.collection('users');
    const [fullName, setFullName] = useState("No name");
    const userRef = usersRef.doc(currentUser?.uid);
    const query = currentUser
        ? db.collection('properties').where('uid', '==', currentUser.uid)
        : null;

    const [properties, loading, error] = useCollection(query);

    useEffect(() => {
        userRef.get().then((doc) => {
            if (doc.exists) {
                //   console.log("Document data:", doc.data());
                //extract agency array
                const agencyArray = doc.data().agency;
                //console.log(agencyArray.name);
                setAgency(agencyArray.name);
                setRole(doc.data().role);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }, []);
    useEffect(() => {
        usersRef.doc(currentUser?.uid).get().then((doc) => {
            if (doc.exists) {
                // console.log("Document data:", doc.data());
                setFullName(doc.data().name + " " + doc.data().lastName);
                return doc.data().name + " " + doc.data().lastName
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
                return "No name";
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
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
                            <Avatar size="xl" name={currentUser?.displayName} src={currentUser?.photoURL} />
                        </Box>
                        <Flex h={"100%"} ml={"5%"}>
                            <Box>

                                <Text fontSize="xl" mb={2} fontWeight={"black"} color={"blue.500"}>
                                    {currentUser?.displayName ? currentUser?.displayName : fullName}
                                </Text>
                                <Text fontSize="xl" mb={2} textDecor={"underline"} fontWeight={"thin"}>
                                    Email: {currentUser?.email}
                                </Text>
                                <Text fontSize="xl" mb={2}  fontWeight={"bold"} >
                                    Role: {role}
                                </Text>
                                {agency && <Box borderRadius={"10px"} pl={"10px"} pr={"1%"} pt={"1%"} pb={"1%"} bg={"green.100"} display={"flex"} alignItems={"center"}>
                                    <Text fontSize="xl" mb={2}  fontWeight={"bold"} >
                                        {agency}
                                    </Text>
                                </Box>}
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
                    {properties?.docs.map((property) => (
                        <Box
                            key={property.id}
                            bg="white"
                            p={4}
                            borderRadius="md"
                            boxShadow="md"
                            mb={4}
                        >
                            <Text fontSize="xl" fontWeight="bold" mb={2}>
                                {property.data().title}
                            </Text>
                            <Text fontSize="md" fontWeight="bold" mb={2}>
                                {property.data().address}
                            </Text>
                            <Text fontSize="md" fontWeight="bold" mb={2}>
                                {property.data().city}
                            </Text>
                            <Text fontSize="md" fontWeight="bold" mb={2}>
                                {property.data().country}
                            </Text>
                            <Text fontSize="md" fontWeight="bold" mb={2}>
                                {property.data().price}
                            </Text>
                            <Text fontSize="md" fontWeight="bold" mb={2}>
                                {property.data().description}
                            </Text>
                        </Box>
                    ))}
                </Box>
            </Box>


        </Box>
    );
};

export default MyProfile;
