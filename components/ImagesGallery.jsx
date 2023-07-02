import React, {useEffect, useState} from 'react';
import { Image, Flex, Box, IconButton, Center } from '@chakra-ui/react';
import {FiChevronLeft, FiChevronRight} from "react-icons/fi";
import {db} from "../firebase";

const ImageGallery = (photos) => {
    //console.log(propertyID)
    const [images, setImages] = useState(photos.photos);

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

    }, []);

    return (
        <Flex direction="column" alignItems="center">
            <Box position="relative" mb={4} height={400}>
                <Image src={images[currentImageIndex]} alt={`Image ${currentImageIndex + 1}`} width={"100%"} boxSize={"100%"}/>
                <Center position="absolute" top="50%" left={0} transform="translateY(-50%)">
                    <IconButton
                        aria-label="Previous Image"
                        icon={<FiChevronLeft />}
                        onClick={handlePrevImage}
                        disabled={currentImageIndex === 0}
                        bg="transparent"
                        _hover={{ bg: 'transparent' }}
                        _active={{ bg: 'transparent' }}
                        color="white"
                    />
                </Center>
                <Center position="absolute" top="50%" right={0} transform="translateY(-50%)">
                    <IconButton
                        aria-label="Next Image"
                        icon={<FiChevronRight />}
                        onClick={handleNextImage}
                        disabled={currentImageIndex === images.length - 1}
                        bg="transparent"
                        _hover={{ bg: 'transparent' }}
                        _active={{ bg: 'transparent' }}
                        color="white"
                    />
                </Center>
                <Box position="absolute" bottom={0} left={0} width="100%" p={2} bg="rgba(0, 0, 0, 0.5)" color="white" textAlign="center">
                    {currentImageIndex + 1}/{images.length}
                </Box>
            </Box>
            <Flex>
                {images.map((imageUrl, index) => (
                    <Box
                        key={imageUrl}
                        boxSize="80px"
                        m={1}
                        cursor="pointer"
                        opacity={index === currentImageIndex ? 1 : 0.7}
                        _hover={{ opacity: 1 }}
                        onClick={() => handleThumbnailClick(index)}
                    >
                        <Image src={imageUrl} alt={`Image ${index + 1}`} width={300} height={200} boxSize="100%" borderRadius="md" />
                    </Box>
                ))}
            </Flex>
        </Flex>
    );
};

export default ImageGallery;

