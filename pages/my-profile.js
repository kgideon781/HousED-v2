import React, {useEffect, useState} from 'react';
import {Avatar, Badge, Box, Divider, Flex, Heading, Image, Stack, Text} from "@chakra-ui/react";
import {auth, db} from "../firebase";
import {useCollection} from "react-firebase-hooks/firestore";

const MyProfile = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [agency, setAgency] = useState("");
    const usersRef = db.collection('users');
    const [fullName, setFullName] = useState("No name");
    const userRef = usersRef.doc(currentUser?.uid);
    const [agencies, loadingAgencies, errorAgencies] = useCollection(
        db.collection('agencies')
    );
    const query = currentUser
        ? db.collection('properties').where('uid', '==', currentUser.uid)
        : null;

    const [properties, loading, error] = useCollection(query);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
        });


        return () => {
            unsubscribe();
        };
    }, []);
    useEffect(() => {
        if (currentUser) {
            userRef.get().then((doc) => {
                if (doc.exists) {
                    const userArray = doc.data();
                    console.log(userArray)
                    const agency = doc.data()?.agency;
                    setAgency(userArray.name);
                    setEmail(userArray.email);
                    setPhone(userArray.phone);
                } else {
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
        }
    }, [currentUser]);
    const fetchUserAgency = async () => {
        if (!currentUser) return;
        try {
            // Fetch all agencies
            const agenciesQuerySnapshot = await db.collection('agencies').get();

            // Loop through each agency to find the one that contains the user in its 'agents' subcollection
            for (const agencyDoc of agenciesQuerySnapshot.docs) {
                const agencyID = agencyDoc.id;

                // Check if the user exists in the 'agents' subcollection of the current agency
                const userInAgencyQuerySnapshot = await db
                    .collection('agencies')
                    .doc(agencyID)
                    .collection('agents')
                    .doc(currentUser.uid)
                    .get();

                if (userInAgencyQuerySnapshot.exists) {
                    // User belongs to this agency
                    setAgency(agencyDoc.data().name);
                    //console.log('User belongs to agency:', agencyDoc.data());
                    return;
                }
            }

            // If the loop completes and no agency is found, handle the case where the user does not belong to any agency
            console.log('User does not belong to any agency');
        } catch (error) {
            // Handle any errors that may occur during the query
            console.error('Error fetching user agency:', error);
        }
    };

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
        fetchUserAgency()
    }, [currentUser]);

    return (
    <Flex
        direction="column"
        align="center"
        justify="center"
        minH="100vh"
        p={4}
    >
        <Avatar size="2xl" name={fullName} src={currentUser?.photoURL} />

        <Box mt={4} textAlign="center">
            <Heading as="h1" size="xl">
                {fullName ? fullName : currentUser?.displayName}
            </Heading>
            <Text fontSize="lg" color="gray.600">
                Real Estate Agent
            </Text>
            <Text fontSize="md" color="gray.500" mt={2}>
                Serving the {agency}
            </Text>
            <Stack direction="row" mt={2} spacing={2}>
                <Badge colorScheme="green">Residential</Badge>
                <Badge colorScheme="blue">Commercial</Badge>
            </Stack>
        </Box>

        <Divider my={6} />

        <Box textAlign="left" maxW="600px">
            <Text fontSize="lg">
                Welcome to my profile! As a dedicated real estate agent, I am
                committed to helping you find your dream property. Whether you're
                buying, selling, or renting, I'm here to guide you through the
                process.
            </Text>
        </Box>

        <Divider my={6} />

        <Heading as="h2" size="xl" mb={4}>
            Featured Listings
        </Heading>

        {/* Displaying fetched properties */}
        {properties?.docs.map((property) => (
            <Box
                key={property.id}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                boxShadow="lg"
                p={4}
                mb={4}
            >
                <Image src={property.data().coverPhoto} alt="Listing Image" />

                <Text fontSize="lg" mt={2}>
                    {property.data().title}
                </Text>

                <Stack direction="row" mt={2} spacing={2}>
                    <Badge colorScheme="green">{property.data().status}</Badge>
                    <Badge colorScheme="blue">{property.data().price}</Badge>
                </Stack>
            </Box>
        ))}

        <Divider my={6} />

        <Heading as="h2" size="xl" mb={4}>
            Contact Information
        </Heading>

        <Box textAlign="left" maxW="600px">
            <Text fontSize="lg">
                Feel free to contact me for any inquiries or assistance:
            </Text>
            <Stack spacing={2} mt={4}>
                <Text>Email: {email} </Text>
                <Text>Phone: {phone}</Text>
                <Text>Address: {address}</Text>
            </Stack>
        </Box>
    </Flex>
    );
};

export default MyProfile;
