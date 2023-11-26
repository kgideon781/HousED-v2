import React, {useEffect, useState} from 'react';
import {Avatar, Box, Flex, Image, Text} from "@chakra-ui/react";
import {auth, db} from "../firebase";
import {useCollection} from "react-firebase-hooks/firestore";

const MyProfile = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [role, setRole] = useState("user");
    const [position, setPosition] = useState("");
    const [agency, setAgency] = useState("");
    const usersRef = db.collection('users');
    const [fullName, setFullName] = useState("No name");
    const userRef = usersRef.doc(currentUser?.uid);
    const query = currentUser
        ? db.collection('properties').where('uid', '==', currentUser.uid)
        : null;

    const [properties, loading, error] = useCollection(query);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
        });
        //console.log(properties?.docs.map((property) => property.data()));

        return () => {
            unsubscribe();
        };
    }, []);
    useEffect(() => {
        if (currentUser) {
            userRef.get().then((doc) => {
                if (doc.exists) {
                    //console.log("Document data:", doc.data());
                    const agencyArray = doc.data()?.agency;
                    setAgency(agencyArray.name);
                    setRole(doc.data().role);
                    setPosition(doc.data().position);
                } else {
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
        }
    }, [currentUser]);

    useEffect(() => {
        if (currentUser) {
            usersRef.doc(currentUser.uid).get().then((doc) => {
                if (doc.exists) {
                    setFullName(doc.data().displayName);
                } else {
                    console.log("No such document!");
                    setFullName("No name");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
        }
    }, [currentUser]);

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
                            <Avatar size="xl" name={fullName} src={fullName && fullName} />
                        </Box>
                        <Flex h={"100%"} ml={"5%"}>
                            <Box>

                                <Text fontSize="xl" mb={2} fontWeight={"black"} color={"blue.500"}>
                                    {fullName ? fullName : currentUser?.displayName}
                                </Text>
                                <Text fontSize="xl" mb={2} textDecor={"underline"} fontWeight={"thin"}>
                                    Email: {currentUser?.email}
                                </Text>
                                {
                                    position && <Box>
                                    <Text fontSize="xl" fontWeight={"bold"}>
                                    Role:
                                </Text>
                                    <Text fontSize="xl" mb={2}   ml={'2%'}>
                                {position} at {agency}
                                </Text>
                                    </Box>
                                }

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
                    <Flex maxW={500}>
                        {loading && <p>Loading...</p>}
                        {error && <p>Error: {error}</p>}
                        {/*Fetch properties by current user*/}
                        {properties?.docs.map((property) => (
                            <Flex
                                key={property.id}
                                bg="white"
                                borderRadius="md"
                                boxShadow="md"
                                mb={4}
                                gap={2}
                                h={150}
                            >
                                <Box>
                                    <Image src={property.data().coverPhoto} alt="" width={200} height={"100%"}/>
                                </Box>
                                <Box p={4}>
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

                            </Flex>
                        ))}
                    </Flex>

                </Box>
            </Box>


        </Box>
    );
};

export default MyProfile;
