import React, {useEffect, useRef, useState} from 'react';
import {
    Box,
    Button, ButtonGroup,
    Flex,
    FormControl, FormHelperText,
    FormLabel, GridItem,
    Heading,
    Input, InputGroup, InputLeftAddon, InputRightElement, Progress,
    Radio,
    RadioGroup, Select, SimpleGrid,
    Text,
    Textarea, Image, IconButton
} from "@chakra-ui/react";
import {Form} from "react-router-dom";
import {auth, db, storage} from "../firebase";
import {useCollection} from "react-firebase-hooks/firestore";
import { useToast } from '@chakra-ui/react';
import {CloseIcon} from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";
import firebase from "firebase";
import {useRouter} from "next/router";


const Form1 = ({ formData, setFormData }) => {
    const [show, setShow] = useState(false);
    const toast = useToast()

    const handleClick = () => setShow(!show);



    return (
        <>
            <Heading w="100%" textAlign={'center'} fontWeight="normal" mb="2%">
                Post a Property
            </Heading>

            <FormControl mr="5%">
                <FormLabel htmlFor="property-title" fontWeight={'normal'}>
                    Property title
                </FormLabel>
                <Input
                    id="property-title"
                    placeholder="Property name..."
                    value={formData.title}
                    onChange={(event) => setFormData({...formData, title: event.target.value})}
                />
            </FormControl>
            <FormControl mt="2%" as={GridItem} colSpan={[6, 3]}>
                <FormLabel
                    htmlFor="purpose"
                    fontSize="sm"
                    fontWeight="md"
                    color="gray.700"
                    _dark={{
                        color: 'gray.50',
                    }}>
                    Purpose
                </FormLabel>
                <Select
                    id="purpose"
                    name="purpose"
                    autoComplete="purpose"
                    placeholder="Select an option"
                    focusBorderColor="brand.400"
                    value={formData.purpose}
                    onChange={(event) => setFormData({...formData, purpose: event.target.value})}
                    shadow="sm"
                    size="sm"
                    w="full"
                    rounded="md">
                    <option>for-rent</option>
                    <option>for-sale</option>
                    <option>Other...</option>
                </Select>
            </FormControl>
            <FormControl mt="2%">
                <FormLabel htmlFor="cover-photo" fontWeight={'normal'}>
                    Cover Photo
                </FormLabel>
                <Input
                    id="cover-photo"
                    type="file"
                    placeholder={"please attach a cover photo"}
                    p={"4px"}
                />
                <FormHelperText>Please select a photo that best describes the property. It will be used as the thumbnail for the property.</FormHelperText>
            </FormControl>
            <FormControl mt="2%">
                <FormLabel htmlFor="property-description" fontWeight={'normal'}>
                    property description
                </FormLabel>
                <Textarea
                    placeholder="write the description here. Don't leave out any detail..."
                    rows={3}
                    shadow="sm"
                    value={formData.description}
                    onChange={(event) => setFormData({...formData, description: event.target.value})}
                    focusBorderColor="brand.400"
                    fontSize={{
                        sm: 'sm',
                    }}
                />
                <FormHelperText>
                    Brief description for your property. URLs are hyperlinked.
                </FormHelperText>
            </FormControl>
            <FormControl mt="2%" as={GridItem} colSpan={6}>
                <FormLabel htmlFor="price" fontWeight={'normal'}>
                    Price/Rent
                </FormLabel>
                <Input
                    id="price"
                    placeholder="Price..."
                    value={formData.price}
                    onChange={(event) => setFormData({...formData, price: event.target.value})}
                />
            </FormControl>

        </>
    );
};

const Form2 = ({ formData, setFormData }) => {

    return (
        <>
            <Heading w="100%" textAlign={'center'} fontWeight="normal" mb="2%">
                Additional Information
            </Heading>
            <FormControl as={GridItem} colSpan={[6, 3]}>
                <FormLabel
                    htmlFor="rentFrequency"
                    fontSize="sm"
                    fontWeight="md"
                    color="gray.700"
                    _dark={{
                        color: 'gray.50',
                    }}>
                    Rent Frequency
                </FormLabel>
                <Select
                    id="rentFrequency"
                    name="rentFrequency"
                    autoComplete="rentFrequency"
                    placeholder="Select option"
                    focusBorderColor="brand.400"
                    shadow="sm"
                    size="sm"
                    disabled={formData.purpose === "for-sale"}
                    w="full"
                    value={formData.rentFrequency}
                    onChange={(event) => setFormData({...formData, rentFrequency: event.target.value})}
                    rounded="md">
                    <option>Weekly</option>
                    <option>Monthly</option>
                    <option>Yearly</option>
                    <option>Other...</option>
                </Select>
            </FormControl>

            <FormControl mt="2%" as={GridItem} colSpan={6}>
                <FormLabel htmlFor="listing-agency" fontWeight={'normal'}>
                    Listing Agency
                </FormLabel>
                <Input
                    id="listing-agency"
                    placeholder="Agency/Landlord/Caretaker name..."
                    value={formData.age}
                    onChange={(event) => setFormData({...formData, agency: event.target.value})}
                />
            </FormControl>

            <FormControl as={GridItem} colSpan={[6, 3, null, 2]}>
                <FormLabel
                    htmlFor="area"
                    fontSize="sm"
                    fontWeight="md"
                    color="gray.700"
                    _dark={{
                        color: 'gray.50',
                    }}
                    mt="2%">
                    Area (SQFT)
                </FormLabel>
                <Input
                    type="text"
                    name="area"
                    id="area"
                    autoComplete="area"
                    focusBorderColor="brand.400"
                    shadow="sm"
                    size="sm"
                    w="full"
                    rounded="md"
                    value={formData.area}
                    onChange={(event) => setFormData({...formData, area: event.target.value})}
                />
            </FormControl>

            <FormControl as={GridItem} colSpan={[6, 3, null, 2]}>
                <FormLabel
                    htmlFor="baths"
                    fontSize="sm"
                    fontWeight="md"
                    color="gray.700"
                    _dark={{
                        color: 'gray.50',
                    }}
                    mt="2%">
                    No. of Baths
                </FormLabel>
                <Input
                    type="text"
                    name="baths"
                    id="baths"
                    autoComplete="baths"
                    focusBorderColor="brand.400"
                    shadow="sm"
                    size="sm"
                    w="full"
                    rounded="md"
                    value={formData.baths}
                    onChange={(event) => setFormData({...formData, baths: event.target.value})}

                />
            </FormControl>

            <FormControl as={GridItem} colSpan={[6, 6, null, 2]}>
                <FormLabel
                    htmlFor="rooms"
                    fontSize="sm"
                    fontWeight="md"
                    color="gray.700"
                    _dark={{
                        color: 'gray.50',
                    }}
                    mt="2%">
                    No. of Rooms
                </FormLabel>
                <Input
                    type="text"
                    name="rooms"
                    id="rooms"
                    autoComplete="rooms"
                    focusBorderColor="brand.400"
                    shadow="sm"
                    size="sm"
                    w="full"
                    rounded="md"
                    value={formData.rooms}
                    onChange={(event) => setFormData({...formData, rooms: event.target.value})}

                />
            </FormControl>

        </>
    );
};

const Form3 = ({formData, setFormData}) => {
    return (
        <>
            <Heading w="100%" textAlign={'center'} fontWeight="normal" mb="2%">
                Location Information
            </Heading>
            <FormControl as={GridItem} colSpan={[6, 3]}>
                <FormLabel
                    htmlFor="county"
                    fontSize="sm"
                    fontWeight="md"
                    color="gray.700"
                    _dark={{
                        color: 'gray.50',
                    }}>
                    County
                </FormLabel>
                <Input
                    type="text"
                    name="county"
                    id="county"
                    autoComplete="county"
                    focusBorderColor="brand.400"
                    shadow="sm"
                    size="sm"
                    w="full"
                    rounded="md"
                    value={formData.county}
                    onChange={(event) => setFormData({...formData, county: event.target.value})}
                />

            </FormControl>

            <FormControl as={GridItem} colSpan={6}>
                <FormLabel
                    htmlFor="constituency"
                    fontSize="sm"
                    fontWeight="md"
                    color="gray.700"
                    _dark={{
                        color: 'gray.50',
                    }}
                    mt="2%">
                    Constituency
                </FormLabel>
                <Input
                    type="text"
                    name="constituency"
                    id="constituency"
                    autoComplete="constituency"
                    focusBorderColor="brand.400"
                    shadow="sm"
                    size="sm"
                    w="full"
                    rounded="md"
                    value={formData.constituency}
                    onChange={(event) => setFormData({...formData, constituency: event.target.value})}
                />
            </FormControl>

            <FormControl as={GridItem} colSpan={[6, 6, null, 2]}>
                <FormLabel
                    htmlFor="ward"
                    fontSize="sm"
                    fontWeight="md"
                    color="gray.700"
                    _dark={{
                        color: 'gray.50',
                    }}
                    mt="2%">
                    Ward
                </FormLabel>
                <Input
                    type="text"
                    name="ward"
                    id="ward"
                    autoComplete="ward"
                    focusBorderColor="brand.400"
                    shadow="sm"
                    size="sm"
                    w="full"
                    rounded="md"
                    value={formData.ward}
                    onChange={(event) => setFormData({...formData, ward: event.target.value})}
                />

            </FormControl>

            <FormControl as={GridItem} colSpan={[6, 3, null, 2]}>
                <FormLabel
                    htmlFor="latitude"
                    fontSize="sm"
                    fontWeight="md"
                    color="gray.700"
                    _dark={{
                        color: 'gray.50',
                    }}
                    mt="2%">
                    Latitude
                </FormLabel>
                <Input
                    type="text"
                    name="latitude"
                    id="latitude"
                    autoComplete="Geo-location latitude"
                    focusBorderColor="brand.400"
                    shadow="sm"
                    size="sm"
                    w="full"
                    rounded="md"
                    value={formData.latitude}
                    onChange={(event) => setFormData({...formData, latitude: event.target.value})}
                />
                <FormHelperText>
                    Enter the latitude of the property location
                </FormHelperText>
            </FormControl>


        </>
    );
};

export default function multistep() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [progress, setProgress] = useState(33.33);
    const [selectedImages, setSelectedImages] = useState([]);
    const toast = useToast()
    const currentUser = auth?.currentUser;
    const currentUserID = currentUser && currentUser.uid;
    const [formData, setFormData] = useState({
        title: "",
        purpose: "for-rent",
        rentFrequency: "monthly",
        description: "",
        agency: "",
        photos: [],
        area: 0,
        rooms: 0,
        baths: 0,
        price: 0,
        county: "",
        constituency: "",
        ward: "",
        latitude: "",

    })

    const handleFileChange = (event) => {
        const files = event.target.files;
        const selectedImagesArray = Array.from(files);
        setSelectedImages(selectedImagesArray);
    };
    const handleRemoveImage = (imageName) => {
        setSelectedImages((prevSelectedImages) =>
            prevSelectedImages.filter((image) => image.name !== imageName)
        );
    };

    const submitProperty = async (e) => {
        e.preventDefault();

        try {
            const propertyData = {
                title: formData.title,
                description: formData.description,
                coverPhoto: "https://bayut-production.s3.eu-central-1.amazonaws.com/image/175202260/3271d492ce4149e18b3aa2eb91f288e5",
                photos: [],
                price: formData.price,
                rentFrequency: formData.rentFrequency,
                purpose: formData.purpose,
                baths: formData.baths,
                agency: formData.agency,
                area: formData.area,
                isVerified: false,
                rooms: formData.rooms,
                county: formData.county,
                constituency: formData.constituency,
                uid: currentUserID,
                ward: formData.ward,
                latitude: formData.latitude,
                type: "Rental Apartment",
                amenities: ["balcony", "airport nearby", "shopping mall", "grocery market", "stadium", "basketball court", "indoor pool", "Jacuzzi", "helipad"],
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            };
            // Upload each selected image to Firebase Storage
            for (const image of selectedImages) {
                const imageRef = storage.ref().child(`properties/${image.name}`);
                const uploadTask = imageRef.put(image);

                // Track the upload progress
                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setProgress(progress);
                    },
                    (error) => {
                        // Handle error during upload
                        console.log('Error uploading image:', error);
                    }
                );

                // Wait for the upload to complete and retrieve the download URL
                await uploadTask;

                // Get the download URL of the uploaded image
                const downloadURL = await imageRef.getDownloadURL();

                // Add the download URL to the propertyData.photos array
                propertyData.photos.push(downloadURL);
            }

            // Add the property data to Firestore
            const propertyRef = await db.collection('properties').add(propertyData).then(router.push('/'));
            toast({
                title: `Property with id ${propertyRef.id} was posted successfully.`,
                status: 'success',
                duration: 9000,
                isClosable: true,
            });
        } catch (error) {
            console.log('Error submitting property:', error);
            toast({
                title: 'Error',
                description: 'Failed to submit the property.',
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
        }

};
    useEffect(() => {
        if(currentUser === null){
            router.push('/signin')
        }
    }, []);
    return (
        <Flex width="100%" flexWrap={"wrap"}>
            {/*Left form*/}
            <Box
                borderWidth="1px"
                rounded="lg"
                shadow="1px 1px 3px rgba(0,0,0,0.3)"
                maxWidth={800}
                p={6}
                m="10px auto"
                as="form">
                <Progress
                    hasStripe
                    value={progress}
                    mb="5%"
                    mx="5%"
                    isAnimated></Progress>
                {step === 1 ? <Form1 formData={formData} setFormData={setFormData} /> :
                    step === 2 ? <Form2 formData={formData} setFormData={setFormData} /> :
                        <Form3 formData={formData} setFormData={setFormData} />}
                <ButtonGroup mt="5%" w="100%">
                    <Flex w="100%" justifyContent="space-between">
                        <Flex>
                            <Button
                                onClick={() => {
                                    setStep(step - 1);
                                    setProgress(progress - 33.33);

                                }}
                                isDisabled={step === 1}
                                colorScheme="teal"
                                variant="solid"
                                w="7rem"
                                mr="5%">
                                Back
                            </Button>
                            <Button
                                w="7rem"
                                isDisabled={step === 3}
                                onClick={() => {
                                    setStep(step + 1);
                                    if (step === 3) {
                                        setProgress(100);
                                    } else {
                                        setProgress(progress + 33.33);
                                    }
                                }}
                                colorScheme="teal"
                                variant="outline">
                                Next
                            </Button>
                        </Flex>
                        {step === 3 ? (
                            <Button
                                w="7rem"
                                colorScheme="red"
                                variant="solid"
                                onClick={(e) => {
                                    submitProperty(e)
                                }}>
                                Submit
                            </Button>
                        ) : null}
                    </Flex>
                </ButtonGroup>
            </Box>
            {/*Right form*/}
            {/*multiple image picker*/}
            <Box
                borderWidth="1px"
                rounded="lg"
                shadow="1px 1px 3px rgba(0,0,0,0.3)"
                maxWidth={800}
                p={6}
                m="10px auto"
                as="form">
                <Text fontSize="xl" fontWeight="bold" mb="5%">
                    Upload Images
                </Text>
                <Input p={"4px"} type="file" multiple onChange={handleFileChange} />
                <SimpleGrid columns={2} spacing="10px" mt="2">
                    {selectedImages.map((image) => (
                        <Box position="relative">
                            <Image key={image.name} src={URL.createObjectURL(image)} alt={image.name} boxSize="200px" objectFit="contain" />
                            <IconButton
                                onClick={() => handleRemoveImage(image.name)}
                                position="absolute"
                                top="0"
                                right="0"
                                zIndex="1"
                                aria-label="Remove image"
                                colorScheme={"red"}
                                size={"sm"}
                                icon={<CloseIcon />}
                            />
                        </Box>
                    ))}
                </SimpleGrid>

            </Box>
        </Flex>
    );
}
