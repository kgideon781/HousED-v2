import {Box, Flex, Text, Spacer, Avatar, Button} from "@chakra-ui/react";
import {FaBed, FaBath} from "react-icons/fa";
import {BsGridFill} from "react-icons/bs";
import {GoVerified} from "react-icons/go";
import millify from "millify";
import {baseUrl, fetchApi} from "../../utils/fetchApi";
import ImageScrollbar from "../../components/ImageScrollbar";
import jsmastery_logo from "../../assets/images/jsmastery_logo.jpg";

import React, {useEffect, useRef, useState} from "react";
import {db} from "../../firebase";
import {useCollection} from "react-firebase-hooks/firestore";
import {GoogleMap } from "react-google-maps";


const PropertyDetails = ({propertyDetails:{price, rentFrequency, rooms, area,  title, baths, agency, isVerified, description, furnishingStatus, type, purpose, amenities, photos, propertyID}}/*{ price,rentFrequency, rooms, area,  title, baths, agency, isVerified, description, furnishingStatus, type, purpose, amenities, photos, propertyID }*/) => {

    const mapContainerRef = useRef(null);

    useEffect(() => {
        const googleMapScript = document.createElement('script');
        googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCwdCrstGu9YbrqNyg8JAw2ZYJ_Vigv-FQ`;
        googleMapScript.async = true;
        window.document.body.appendChild(googleMapScript);

        googleMapScript.addEventListener('load', initMap);

        return () => {
            googleMapScript.removeEventListener('load', initMap);
        };
    }, []);

    const initMap = () => {
        new window.google.maps.Map(mapContainerRef.current, {
            center: { lat: 0.479208, lng: 35.266436 }, // Set your desired latitude and longitude
            zoom: 10,
        });
    };

    return (
        <Flex w={"100%"} p="1" flexWrap={"wrap"}>
            {/*Left side*/}
            <Box w={[ "100%", "70%"]}>
                <Box maxWidth="1000px" margin="auto" p="4">
                    {photos && <ImageScrollbar data={photos}/>}
                    <Box w="full" p="6">
                        <Flex paddingTop="2" alignItems="center" justifyContent="space-between">
                            <Flex alignItems="center">
                                <Box paddingRight="3" color="green.400">
                                    {isVerified && <GoVerified/>}
                                </Box>
                                <Text fontWeight="bold"
                                      fontSize="lg">KES {millify(price)}{rentFrequency && `/${rentFrequency}`}</Text>
                            </Flex>

                            <Box>
                                <Avatar size="sm" src={agency?.logo?.url}/>
                            </Box>


                        </Flex>
                        <Flex alignItems="center" p="1" justifyContent="space-between" w="250px" color="blue.400">
                            {rooms} <FaBed/> |{baths} <FaBath/> {millify(area)} sqft <BsGridFill/>
                        </Flex>
                        <Box marginTop="2">
                            <Text fontSize="lg" marginBottom="2" fontWeight="bold">
                                {title}
                            </Text>
                            <Text lineHeight="2" color="gray.600">{description}</Text>
                        </Box>
                        <Flex flexWrap='wrap' textTransform='uppercase' justifyContent='space-between'>
                            <Flex justifyContent="space-between" w="400px" borderBottom="1px" borderColor="gray.100" p="3">
                                <Text>Type</Text>
                                <Text fontWeight="bold">{type}</Text>
                            </Flex>
                            <Flex justifyContent="space-between" w="400px" borderBottom="1px" borderColor="gray.100" p="3">
                                <Text>Purpose</Text>
                                <Text fontWeight="bold">{purpose}</Text>
                            </Flex>
                            {furnishingStatus && (
                                <Flex justifyContent="space-between" w="400px" borderBottom="1px" borderColor="gray.100"
                                      p="3">
                                    <Text>Furnishing Status</Text>
                                    <Text fontWeight="bold">{furnishingStatus}</Text>
                                </Flex>
                            )}
                        </Flex>
                    </Box>
                    <Box>
                        {amenities?.length && <Text fontSize="2xl" fontWeight="black" marginTop="5">Amenities</Text>}
                        <Flex flexWrap="wrap">
                            {amenities?.map((amenity) => (
                                <Text
                                    fontWeight="bold"
                                    color="blue.400"
                                    fontSize="1xl"
                                    p="2"
                                    bg="gray.200"
                                    m="1"
                                    borderRadius="5"
                                    key={amenity.text}

                                >{amenity}</Text>

                            ))}
                        </Flex>
                    </Box>
                </Box>
            </Box>

            {/*Right side*/}
            <Box w={["100%", "30%"]}>
                <Box>
                    <Text fontSize="2xl" fontWeight="black" marginTop="5">Contact Agent</Text>
                    <Box p="4" bg="gray.100" borderRadius="5">
                        <Avatar size={"md"} src={jsmastery_logo} alt={"agency logo"} w="100px" h="100px" borderRadius="5" objectFit="cover"/>
                        <Text fontWeight="bold" fontSize="lg">{agency?.name}</Text>
                        <Text>{agency?.phone}</Text>
                    </Box>
                </Box>
                {/*Google map place API*/}
                <Box>
                    <Text fontSize="2xl" fontWeight="black" marginTop="5">Location</Text>
                    <Box p="4" bg="gray.100" borderRadius="5">
                        <Text fontWeight="bold" fontSize="lg">{agency?.name}</Text>
                        <Text>{agency?.phone}</Text>

                        <Box ref={mapContainerRef} style={{ width: '100%', height: '400px' }} />

                    </Box>
                </Box>
                <Box p={"1%"} w={"100%"}>
                    <Button colorScheme="blue" marginTop="2">Contact Agent</Button>
                </Box>

            </Box>

        </Flex>
    )

};
export async function getServerSideProps({ params: {id}} ){
    const doc = await db.collection("properties").doc(id).get()
    console.log(id)
    const data = doc.data()

    if (!data) return { notFound: true };
    return {
        props: {
            propertyDetails: JSON.parse(JSON.stringify(data))
        }
    };
}


//TODO: make contact agent button work and add their details
//TODO: add related properties
//TODO: add 

export default PropertyDetails;
