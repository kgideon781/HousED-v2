import Link from 'next/link';
import Image from 'next/image';
import {
    Flex,
    Box,
    Text,
    Button,
    Avatar,
    Icon,
    Modal,
    ModalOverlay,
    ModalHeader,
    ModalBody,
    ModalFooter, ModalContent, Textarea, FormLabel, FormControl, FormHelperText, Center, IconButton
} from '@chakra-ui/react';
import {FaBed, FaBath} from "react-icons/fa";
import {BsGridFill} from "react-icons/bs";
import {GoVerified} from "react-icons/go";
import {MdStarHalf} from "react-icons/md";
import millify from "millify";
import defaultImage from '../assets/images/defaultImage.jpg'
import {BiCurrentLocation, BiLike} from "react-icons/bi";
import { IoMdShare } from "react-icons/io";
import {addLike, countLikes} from "../pages/index";

import {useRouter} from "next/router";
import {useCollection} from "react-firebase-hooks/firestore";
import React, {useEffect, useState} from "react";
import {db} from "../firebase";
import firebase from "firebase";
import RatingBar from "../utils/ratingsBar";
import {FiChevronLeft, FiChevronRight} from "react-icons/fi";
import {ImLocation2} from "react-icons/im";



const Property  = ({ coverPhoto, price, rentFrequency, rooms, ward,title, baths, area, agency, isVerified, externalID, propertyID, currentUser, timestamp }) => {

    const router = useRouter();
    const [likes, setLikes] = useState(0);
    const [likesRef, Error, loading] = useCollection(db.collection("properties").doc(propertyID).collection("likes"));
    const [rating, setRating] = useState(0);

    const [isOpen, setIsOpen] = useState(false);
    const [feedback, setFeedback] = useState('');

    const [averageRating, setAverageRating] = useState(0);
    const [images, setImages] = useState([]);
    //console.log(ward)
    const saveRating = async (rating) => {
        try {
            const ratingRef = db.collection("properties").doc(propertyID).collection("ratings").doc(currentUser);
            if (feedback === '') {
                await ratingRef.set({
                    rating: rating,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    userId: currentUser,
                    feedback: feedback
                },{merge: true});
            }
            else {
                await ratingRef.set({
                    rating: rating,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    userId: currentUser,
                    feedback: feedback
                },{merge: true});
            }
            console.log("Rating saved to Firestore!");
        } catch (error) {
            console.error("Error saving rating:", error);
        }
    };
    const handleRatingChange = (rating) => {
        setRating(rating);
    };

    const handleInputChange = (event) => {
        setFeedback(event.target.value);
    };

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const saveRatingAndFeedback = () => {
        // Save the rating and feedback to Firestore
        saveRating(rating);


        // Close the modal
        closeModal();
    };



    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleThumbnailClick = (index) => {
        setCurrentImageIndex(index);
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };


    useEffect(() => {
        setLikes(likesRef?.docs.length);

        //get the average of ratings
        db.collection("properties").doc(propertyID).collection("ratings").get().then((querySnapshot) => {
            let total = 0;
            querySnapshot.forEach((doc) => {
                total += doc.data().rating;
            });
            setAverageRating(total / querySnapshot.size);
        });

        //fetch property photos from firestore
        db.collection("properties").doc(propertyID)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    const propertyData = doc.data();
                    const propertyPhotos = propertyData.photos;
                    setImages(propertyPhotos);
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            });
    }, [likesRef]);





    return (
        <>
            {/*<Box>
                {timestamp && <Text>Posted {timestamp}</Text>}
                <Image src={coverPhoto ? coverPhoto : defaultImage} width={400} height={260} alt="Image"/>
            </Box>
*/}

            <Flex flexWrap="wrap" w="420px" p="5" paddingTop="0" justifyContent="flex-start" cursor="pointer">
                {/*<Link href={`/property/${propertyID}`} passHref>*/}
                <Flex direction="column" alignItems="center">
                    <Box position="relative" mb={4} height={260} maxHeight={260} width={380} >
                        <Image src={images[currentImageIndex]} alt={`Image ${currentImageIndex + 1}`} minHeight={260} height={260} width={380} boxSize="400px" />
                        <Center position="absolute" top="50%" left={0} transform="translateY(-50%)">
                            <IconButton
                                aria-label="Previous Image"
                                icon={<FiChevronLeft />}
                                fontSize={"48px"}
                                onClick={handlePrevImage}
                                disabled={currentImageIndex === 0}
                                bg="blackAlpha.700"
                                _hover={{ bg: 'blackAlpha.900' }}
                                _active={{ bg: 'transparent' }}
                                color="white"
                            />
                        </Center>
                        <Center position="absolute" top="50%" right={0} transform="translateY(-50%)">
                            <IconButton
                                aria-label="Next Image"
                                icon={<FiChevronRight />}
                                fontSize={"48px"}
                                onClick={handleNextImage}
                                disabled={currentImageIndex === images.length - 1}
                                bg="blackAlpha.700"
                                _hover={{ bg: 'blackAlpha.900' }}
                                _active={{ bg: 'transparent' }}
                                color="white"
                            />
                        </Center>
                        <Box position="absolute" bottom={0} left={0} width="100%" p={2} bg="rgba(0, 0, 0, 0.5)" color="white" textAlign="center">
                            {currentImageIndex + 1}/{images.length}
                        </Box>
                    </Box>
                </Flex>
                {/*</Link>*/}
                <Box w="full" border="1px solid #d3eaf2" mt={"-4%"} zIndex={10} bg={"white"}>

                        <Flex paddingTop="2" alignItems="center" justifyContent="space-between">
                            <Flex alignItems="center">
                                <Box paddingLeft="1" paddingRight="3" color="green.400">
                                    {isVerified && <GoVerified/>}
                                </Box>
                                <Text fontWeight="bold"
                                      fontSize="lg">KES {millify(price)}{rentFrequency && `/${rentFrequency}`}</Text>
                            </Flex>

                            <Box marginRight="2">
                                <Avatar size="sm" src={agency?.logo?.url}/>
                            </Box>


                        </Flex>
                        <Flex justifyContent={"space-between"}>
                            <Flex alignItems="center" p="1" justifyContent={"space-between"} w={"50%"} color="blue.400">
                                {rooms} <FaBed/> |{baths} <FaBath/> {area} sqft <BsGridFill/>
                            </Flex>

                            <Flex alignItems="center" p="1"  color="blue.400" mr={"1%"} _hover={{
                                background: "gray.200",
                            }}
                                  onClick={currentUser !== null ? openModal : () => router.push("/signin")}>

                                <MdStarHalf size={25}/>
                                {averageRating > 1 && <Text paddingLeft="1">{averageRating}</Text>}
                            </Flex>

                        </Flex>

                        <Text fontSize="lg" paddingBottom="2" paddingLeft="1">
                            {title?.length > 30 ? `${title.substring(0, 40)}...` : title}
                        </Text>
                    {ward && <Flex p={"1%"} justifyContent={"flex-start"} alignItems={"center"}>
                        <ImLocation2 size={20}/>
                        <Text fontSize="sm" fontWeight={"bold"} paddingLeft="1">{ward}</Text>
                    </Flex>}

                    <hr/>
                    <Flex mt="4px" padding="5px" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Flex alignItems="center" p="1" justifyContent="space-between" w="100%" color="blue.400" >

                                <Box
                                    borderRadius="15px"
                                    padding="2"
                                    _hover={{
                                        background: "gray.200",

                                    }}
                                    onClick={() =>{
                                        currentUser != null ? addLike(propertyID) : router.push("/signin");
                                        //console.log(`you liked ${propertyID}.`)
                                    }}
                                >
                                    <Flex justifyContent={"space-between"} alignItems={"center"} >
                                        <BiLike/>
                                        <Text paddingLeft="1">{likes} likes</Text>
                                    </Flex>
                                </Box>

                                <Box
                                    borderRadius="50%"
                                    padding="2"
                                    _hover={{
                                        background: "gray.200",

                                    }}
                                >
                                    <IoMdShare size="23px"/>
                                </Box>
                            </Flex>

                        </Box>
                        <Box>
                            <Button colorScheme='blue' size="md" onClick={() => router.push(`/property/${propertyID}`)}>More details</Button>
                        </Box>

                    </Flex>

                </Box>

            </Flex>


            <Modal isOpen={isOpen} onClose={closeModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Rate and Give Feedback</ModalHeader>
                    <ModalBody>
                        <RatingBar initialRating={rating} onRatingChange={handleRatingChange}  />
                        <FormControl mt={"2%"}>
                            <FormLabel>Feedback(optional)</FormLabel>
                            <Textarea
                                placeholder='Leave your honest feedback for the developer...'
                                value={feedback}
                                onChange={handleInputChange}
                            />
                            <FormHelperText>Any feedback regarding this house or this website is welcome.</FormHelperText>
                        </FormControl>

                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={saveRatingAndFeedback}>
                            Save
                        </Button>
                        <Button variant="ghost" onClick={closeModal}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </>
    )

   // TODO: Add a button to add a property to favorites
    //TODO: Make agents clickable and lead to their profile page.

};

export default Property;
