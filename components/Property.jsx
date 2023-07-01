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
    ModalFooter, ModalContent, Textarea, FormLabel, FormControl, FormHelperText
} from '@chakra-ui/react';
import {FaBed, FaBath} from "react-icons/fa";
import {BsGridFill} from "react-icons/bs";
import {GoVerified} from "react-icons/go";
import {MdStarHalf} from "react-icons/md";
import millify from "millify";
import defaultImage from '../assets/images/defaultImage.jpg'
import { BiLike } from "react-icons/bi";
import { IoMdShare } from "react-icons/io";
import {addLike, countLikes} from "../pages/index";

import {useRouter} from "next/router";
import {useCollection} from "react-firebase-hooks/firestore";
import React, {useEffect, useState} from "react";
import {db} from "../firebase";
import firebase from "firebase";
import RatingBar from "../utils/ratingsBar";


const Property  = ({ coverPhoto, price, rentFrequency, rooms, title, baths, area, agency, isVerified, externalID, propertyID, currentUser, timestamp }) => {

    const router = useRouter();
    const [likes, setLikes] = useState(0);
    const [likesRef, Error, loading] = useCollection(db.collection("properties").doc(propertyID).collection("likes"));
    const [rating, setRating] = useState(0);

    const [isOpen, setIsOpen] = useState(false);
    const [feedback, setFeedback] = useState('');

    const [averageRating, setAverageRating] = useState(0);

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
    useEffect(() => {

    });



    const saveRatingAndFeedback = () => {
        // Save the rating and feedback to Firestore
        saveRating(rating);


        // Close the modal
        closeModal();
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

    }, [likesRef]);


    return (
        <>


            <Flex flexWrap="wrap" w="420px" p="5" paddingTop="0" justifyContent="flex-start" cursor="pointer">
                <Link href={`/property/${propertyID}`} passHref>
                    <Box>
                        {timestamp && <Text>Posted {timestamp}</Text>}
                        <Image src={coverPhoto ? coverPhoto : defaultImage} width={400} height={260} alt="Image"/>
                    </Box>

                </Link>
                <Box w="full" border="1px solid #d3eaf2">

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

                        <Text fontSize="lg" paddingBottom="4" paddingLeft="1">
                            {title?.length > 30 ? `${title.substring(0, 40)}...` : title}
                        </Text>

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
                            <Button colorScheme='blue' size="md">Contact Agent</Button>
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
