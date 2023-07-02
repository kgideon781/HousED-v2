import {Box, Flex, Text, Spacer, Avatar, Button, Image, Icon, Stack} from "@chakra-ui/react";
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
import ImageGallery from "../../components/ImagesGallery";
import {BiBookmark, BiChevronRight, BiEnvelope, BiLogoWhatsapp, BiPhoneCall} from "react-icons/bi";
import {PiShareFatFill} from "react-icons/pi";


const PropertyDetails = ({propertyDetails:{price, rentFrequency, rooms, area,  title, baths, agency, isVerified, description, furnishingStatus, type, purpose, amenities, photos, propertyID}}/*{ price,rentFrequency, rooms, area,  title, baths, agency, isVerified, description, furnishingStatus, type, purpose, amenities, photos, propertyID }*/) => {

    const profile_image = "https://firebasestorage.googleapis.com/v0/b/houseed-50461.appspot.com/o/misc%2Fprofile_image.png?alt=media&token=1c6f6a7b-bd5a-4cea-a15b-cb57b40cd569"
    const mapContainerRef = useRef(null);
    const [url, setUrl] = useState('');

    useEffect(() => {
        const googleMapScript = document.createElement('script');
        googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCwdCrstGu9YbrqNyg8JAw2ZYJ_Vigv-FQ`;
        googleMapScript.async = true;
        window.document.body.appendChild(googleMapScript);

        console.log(photos)
        googleMapScript.addEventListener('load', initMap);

        return () => {
            googleMapScript.removeEventListener('load', initMap);
        };
    }, []);


    useEffect(() => {
        setUrl(window.location.href);
    }, []);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: document.title,
                url: url,
            })
                .then(() => console.log('Shared successfully.'))
                .catch((error) => console.error('Error sharing:', error));
        } else {
            console.warn('Web Share API not supported.');
            // Handle sharing fallback for unsupported browsers or devices
        }
    };

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
                    <ImageGallery photos={photos} />
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
                                <Flex>
                                    {/*Bookmark and share buttons*/}
                                    <Button colorScheme="blue" variant="outline" size="sm" marginRight="2">
                                        <BiBookmark/>   Bookmark
                                    </Button>
                                    <Button colorScheme="blue" variant="outline" size="sm" onClick={handleShare}>
                                        <PiShareFatFill/>   Share
                                    </Button>
                                </Flex>
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
                        <Box p="4" borderWidth={"1px"} borderColor={"gray.400"} borderRadius="5">
                            <Flex>
                                <Image width={"80px"} height={"80px"} src={profile_image} placeholder={profile_image} alt={"agency logo"} borderRadius="50%" objectFit="cover"/>
                                <Box m={"16px"} w={"100%"}>
                                    {agency.name ? <Text fontWeight="bold" fontSize="lg">{agency.name}</Text> : <Text fontWeight="bold" fontSize="lg">Gide Legacy</Text>}
                                    <Flex alignItems={"center"} w={"100%"}>
                                        <Text fontSize={"12px"} fontWeight={"bold"} mr={"5px"}>No reviews</Text>
                                        <Flex m={"2%"} borderColor={"blue.400"} borderWidth={"1px"} w={"auto"} borderRadius={5} p={"2%"} cursor={"pointer"}>
                                            <Text fontSize={"12px"} color="blue.400" >Write a review</Text>
                                            <Icon as={BiChevronRight} color="blue.400" w={5} h={5}/>
                                        </Flex>
                                    </Flex>
                                    <Text>{agency?.phone}</Text>
                                </Box>
                            </Flex>

                            <Flex justifyContent={"center"} alignItems={"center"}>
                                <Stack direction='row' spacing={4}>
                                    <Button leftIcon={<BiPhoneCall/>} fontSize={"14px"} colorScheme='teal' variant='solid'>
                                        Call us
                                    </Button>
                                    <Button leftIcon={<BiEnvelope/>} fontSize={"14px"} colorScheme='teal' variant='solid'>
                                        Email
                                    </Button>
                                    <Button leftIcon={<BiLogoWhatsapp/>} fontSize={"14px"} colorScheme='whatsapp' variant='solid'>
                                        Whatsapp
                                    </Button>
                                </Stack>
                            </Flex>
                        </Box>


                    {/*Contact Section*/}

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
