import React, {useEffect} from 'react';
import {Avatar, Badge, Box, Divider, Flex, Heading, Stack, Text, Image} from "@chakra-ui/react";
import {useRouter} from "next/router";
import {db} from "../../firebase";
import {useCollection} from "react-firebase-hooks/firestore";

const AgencyDetails = () => {
    const router = useRouter();
    const { id } = router.query;
    const [agencyDetails, setAgencyDetails] = React.useState({
        agencyName:'',
        agencyAddress: '',
        agencyPhone: '',
        agencyEmail:'',
        agencyLocation: '',
        agencyDescription: '',
    })
    const [properties, loading, error] = useCollection(
        db.collection("properties").where("agencyID", "==", id)
    );


    useEffect(() => {
        if (id) {
            db
                .collection("agencies")
                .doc(id)
                .get()
                .then((doc) => {
                    if (doc.exists) {
                        const agencyData = doc.data();
                        setAgencyDetails({
                            agencyName: agencyData.name,
                            agencyEmail: agencyData.email,
                            agencyPhone: agencyData.phone,
                            agencyLocation: agencyData.location,
                            agencyDescription: agencyData.description,
                            // Add other details as needed
                        });
                    } else {
                        console.log('No such document!');
                    }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
        }

    }, [agencyDetails]);
    return (
        <Box>
            <Flex
                direction="column"
                align="center"
                justify="center"
                minH="100vh"
                p={4}
            >
                <Heading as="h1" size="2xl" mb={4}>
                    {agencyDetails.agencyName}
                </Heading>

                <Box textAlign="center">
                    <Avatar size="2xl" name={agencyDetails.agencyName} />

                    <Stack direction="row" mt={2} spacing={2}>
                        <Badge colorScheme="green">Residential</Badge>
                        <Badge colorScheme="blue">Commercial</Badge>
                        <Badge colorScheme="teal">Vacation Rentals</Badge>
                    </Stack>
                </Box>

                <Divider my={6} />

                <Box textAlign="left" maxW="600px">
                    <Text fontSize="lg">
                        {agencyDetails.agencyDescription}
                    </Text>
                </Box>

                <Divider my={6} />

                <Heading as="h2" size="xl" mb={4}>
                    Featured Properties
                </Heading>

               <Flex gap={2} flexWrap={"wrap"}>
                   {
                       properties?.docs.map((property) => (
                           <Box
                               borderWidth="1px"
                               borderRadius="lg"
                               overflow="hidden"
                               boxShadow="lg"
                               p={4}
                               mb={4}
                           >
                               <Image src={property.data().coverPhoto} alt="Property Image" height={100} width={350} objectFit={"cover"}/>

                               <Text fontSize="lg" mt={2}>
                                   {property.data().title}
                               </Text>

                               <Stack direction="row" mt={2} spacing={2}>
                                   <Badge colorScheme="green">{property.data().purpose}</Badge>
                                   <Badge colorScheme="blue">{property.data().price}</Badge>
                                   <Badge colorScheme="green">{property.data().ward}</Badge>
                               </Stack>
                           </Box>
                       ))
                   }

               </Flex>

            </Flex>

        </Box>
    );
};

export default AgencyDetails;
