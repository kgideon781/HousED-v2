import React, {useEffect, useState} from 'react';
import {
    Box,
    Input,
    Radio,
    RadioGroup,
    Button,
    Stack,
    HStack,
    FormControl,
    FormLabel,
    Text,
    Icon,
    useBreakpointValue, Heading, Flex, Avatar, AvatarGroup, Container, SimpleGrid, Textarea, useToast
} from '@chakra-ui/react';
import {auth, db} from '../firebase';
import firebase from "firebase";
import {useRouter} from "next/router";

const AccountSetup = () => {
    const [userDetails, setUserDetails] = useState({
        name: '',
        lastName: '',
        phone: '',
        userEmail: '',
    });

    const [agencyInfo, setAgencyInfo] = useState({
        errorMessage: '',
        location: '',
        agencyName: '',
        description: '',
        showName: '',
        agencyID: '',
        position: '',
        agencyEmail: '',
        agencyCode: '',
        showNewAgencyFields: false,
    });

    const [currentUser, setCurrentUser] = useState(null);
    const current_username = currentUser?.displayName;
    const router = useRouter();
    const toast = useToast();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setCurrentUser(user);
            }
        });
        return () => unsubscribe();
    }, []);
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Check if there is a logged-in user
                if (currentUser) {
                    // Get the user document from Firestore
                    const userDoc = await db.collection('users').doc(currentUser.uid).get();

                    if (userDoc.exists) {
                        const userData = userDoc.data();

                        // Assuming the user document has 'displayName' and 'email' fields
                        const { displayName, email } = userData;

                        // Split the display name into first and last name (assuming a space separates them)
                        const [firstName, lastName] = displayName.split(' ');

                        // Set the state variables
                        setUserDetails(prevDetails => ({...prevDetails, name: firstName}));
                        setUserDetails(prevDetails => ({...prevDetails, lastName: lastName}));
                        setUserDetails(prevDetails => ({...prevDetails, userEmail: email}));
                    } else {
                        console.error('User document not found in Firestore');
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        // Call the fetchUserData function
        fetchUserData();
    }, [currentUser]);
    useEffect(() => {
        const checkUserSetupStatus = async () => {
            try {
                if (currentUser) {
                    const userDoc = await db.collection('users').doc(currentUser.uid).get();

                    if (userDoc.exists) {
                        const userData = userDoc.data();
                        if (userData.setupCompleted) {
                            await router.push('/my-profile');
                        }
                    }
                }
            } catch (error) {
                console.error('Error checking user setup status:', error);
            }
        };

        // Call the checkUserSetupStatus function
        checkUserSetupStatus();
    }, [currentUser, router]);


    const handlePositionChange = (value) => {
        setAgencyInfo(prevDetails => ({
            ...prevDetails,
            position: value,
        }));
        setAgencyInfo(prevDetails => ({
            ...prevDetails,
            showName: '',
        }));
        setAgencyInfo(prevDetails => ({
            ...prevDetails,
            agencyCode: '',
        }));
        setAgencyInfo(prevDetails => ({
            ...prevDetails,
            agencyName: '',
        }))
        setAgencyInfo(prevDetails => ({
            ...prevDetails,
            showNewAgencyFields: false,
        }));
        setAgencyInfo(prevDetails => ({
            ...prevDetails,
            location: '',
        }));
        setAgencyInfo(prevDetails => ({
            ...prevDetails,
            agencyEmail: '',
        }));
        setAgencyInfo(prevDetails => ({
            ...prevDetails,
            phone: '',
        }));
        setAgencyInfo(prevDetails => ({
            ...prevDetails,
            description: '',
        }));
    };

    const generateAgencyCode = () => {
        const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const numeric = '0123456789';
        const getRandomChar = (pool) => pool.charAt(Math.floor(Math.random() * pool.length));
        let code = '';
        for (let i = 0; i < 3; i++) {
            code += getRandomChar(alphanumeric);
        }
        for (let i = 0; i < 3; i++) {
            code += getRandomChar(numeric);
        }
        return code;
    };

    const handleAgencyCodeCheck = async () => {
        try {
            const querySnapshot = await db.collection('agencies').where('agencyCode', '==', agencyInfo.agencyCode).get();
            if (agencyInfo.agencyCode === '') setAgencyInfo(prevDetails => ({
                ...prevDetails,
                errorMessage: '',
            }));
            if (querySnapshot.empty) {
                setAgencyInfo(prevDetails => ({
                    ...prevDetails,
                    errorMessage: 'The agency code you entered does not exist. Please try again or register a new agency.',
                }));
            } else {
                const data = querySnapshot.docs[0].data();
                setAgencyInfo(prevDetails => ({
                    ...prevDetails,
                    errorMessage: '',
                }));

                setAgencyInfo(prevDetails => ({
                    ...prevDetails,
                    agencyID: data.agencyID,
                }));
                setAgencyInfo(prevDetails => ({
                    ...prevDetails,
                    agencyName: data.name,
                }));
                setAgencyInfo(prevDetails => ({
                    ...prevDetails,
                    showNewAgencyFields: false,
                }));
                setAgencyInfo(prevDetails => ({
                    ...prevDetails,
                    showName: data.name,
                }));
            }
        } catch (error) {
            console.log("Error getting documents: ", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (agencyInfo.position === 'agency' && agencyInfo.agencyCode === '' && !agencyInfo.showNewAgencyFields) {
                // If agency position is selected and no agency code is provided, show an error or handle accordingly
                setAgencyInfo(prevDetails => ({
                    ...prevDetails,
                    errorMessage: 'Please enter an agency code.',
                }));
                return;
            }

            // Check if new agency fields are shown and all required fields are filled
            if (agencyInfo.showNewAgencyFields && (!agencyInfo.agencyName || !agencyInfo.location || !userDetails.phone || !agencyInfo.agencyEmail)) {
                // If any required field is missing for a new agency, show an error or handle accordingly
                setAgencyInfo(prevDetails => ({
                    ...prevDetails,
                    errorMessage: 'Please fill in all fields for the new agency.',
                }));
                return;
            }

            // If agency position is selected and the agency code is provided, proceed with checking the code
            if (agencyInfo.position === 'agency' && agencyInfo.agencyCode !== '') {
                await handleAgencyCodeCheck();
            }

            // Now, based on the selected position, update the database
            if (agencyInfo.position === 'agency') {
                const agentData = {
                    agentID: currentUser.uid,
                    dateJoined: firebase.firestore.FieldValue.serverTimestamp(),
                }
                // Update the user's information with agency details
                await db.collection('users').doc(currentUser.uid).update({
                    agencyID: agencyInfo.agencyID,
                    role: 'admin',
                    setupCompleted: true,
                });
                console.log("Agency ID: ", agencyInfo.agencyID)
            } else if (agencyInfo.position === 'landlord') {
                await db.collection('users').doc(currentUser.uid).update({
                    role: 'admin',
                    position: 'landlord',
                    setupCompleted: true,
                });

            } else if (agencyInfo.position === 'caretaker') {
                await db.collection('users').doc(currentUser.uid).update({
                    role: 'admin',
                    position: 'caretaker',
                    setupCompleted: true,
                });
            }

            // If a new agency is being registered, add it to the 'agencies' collection
            if (agencyInfo.showNewAgencyFields) {
                const newAgencyData = {
                    name: agencyInfo.agencyName,
                    location: agencyInfo.location,
                    phone: userDetails.phone,
                    agencyEmail: agencyInfo.agencyEmail,
                    description: agencyInfo.description,
                    createdBy: currentUser.uid,
                    position: 'agency',
                    dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
                    agencyCode: agencyInfo.agencyCode || generateAgencyCode(),
                };

                const newAgencyRef = await db.collection('agencies').add(newAgencyData);

                // Update the agency ID in the user's information
                await db.collection('users').doc(currentUser.uid).update({
                    agencyID: newAgencyRef.id,
                    role: 'admin',
                    setupCompleted: true,
                });

                const agentsCollectionRef = newAgencyRef.collection('agents');
                await agentsCollectionRef.doc(currentUser.uid).set({
                    agentID: currentUser.uid,
                    dateJoined: firebase.firestore.FieldValue.serverTimestamp(),
                });

                // Optionally, update the agencyInfo state with the new agency ID
                setAgencyInfo(prevDetails => ({
                    ...prevDetails,
                    agencyID: newAgencyRef.id,
                }));
            }

            // Handle success or navigate to the next page as needed
            toast({
                title: "Account setup successful.",
                description: "We've created your account for you.",
                status: "success",
                duration: 9000,
                isClosable: true,
            });
            /*// Example: Navigate to a different page
            router.push('/dashboard');*/
            resetForm();
        } catch (error) {
            console.error('Error submitting data:', error);
            // Handle errors accordingly
        }
    };

    const resetForm = () => {
        setUserDetails(prevDetails => ({...prevDetails, name: ''}));
        setUserDetails(prevDetails => ({...prevDetails, lastName: ''}));
        setUserDetails(prevDetails => ({...prevDetails, phone: ''}));
        setUserDetails(prevDetails => ({...prevDetails, userEmail: ''}));
        setAgencyInfo(prevDetails => ({
            ...prevDetails,
            errorMessage: '',
        }));
        setAgencyInfo(prevDetails => ({
            ...prevDetails,
            location: '',
        }));
        setAgencyInfo(prevDetails => ({
            ...prevDetails,
            agencyName: '',
        }));
        setAgencyInfo(prevDetails => ({
            ...prevDetails,
            showName: '',
        }));
        setAgencyInfo(prevDetails => ({
            ...prevDetails,
            agencyEmail: '',
        }));
        setAgencyInfo(prevDetails => ({
            ...prevDetails,
            agencyCode: '',
        }));
        setAgencyInfo(prevDetails => ({
            ...prevDetails,
            showNewAgencyFields: false,
        }));
        setAgencyInfo(prevDetails => ({
            ...prevDetails,
            description: '',
        }));
    }

    const avatars = [
        {
            name: 'Gideon Kiprotich',
            url: 'https://bit.ly/ryan-florence',
        },
        {
            name: 'Segun Adebayo',
            url: 'https://bit.ly/sage-adebayo',
        },
        {
            name: 'Kent Dodds',
            url: 'https://bit.ly/kent-c-dodds',
        },
        {
            name: 'Prosper Otemuyiwa',
            url: 'https://bit.ly/prosper-baba',
        },
        {
            name: 'Christian Nwamba',
            url: 'https://bit.ly/code-beast',
        },
    ];

    return (
        <Box position={'relative'}>
            <Container
                as={SimpleGrid}
                maxW={'7xl'}
                columns={{ base: 1, md: 2 }}
                spacing={{ base: 10, lg: 32 }}
                py={{ base: 10, sm: 20, lg: 32 }}>
                <Stack spacing={{ base: 10, md: 20 }}>
                    <Heading
                        lineHeight={1.1}
                        fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}>
                        Home Owners and{' '}
                        <Text
                            as={'span'}
                            bgGradient="linear(to-r, blue.400,cyan.400)"
                            bgClip="text">
                            &
                        </Text>{' '}
                        Real Estate Agencies
                    </Heading>
                    <Text>Secure your space, guard against scams. Complete our quick registration form for landlords, agents, and agencies. Let's build a trusted community together!</Text>
                    <Stack direction={'row'} spacing={4} align={'center'}>
                        <AvatarGroup>
                            {avatars.map((avatar) => (
                                <Avatar
                                    key={avatar.name}
                                    name={avatar.name}
                                    src={avatar.url}
                                    size={useBreakpointValue({ base: 'md', md: 'lg' })}
                                    position={'relative'}
                                    zIndex={2}
                                    _before={{
                                        content: '""',
                                        width: 'full',
                                        height: 'full',
                                        rounded: 'full',
                                        transform: 'scale(1.125)',
                                        bgGradient: 'linear(to-bl, blue.400,cyan.400)',
                                        position: 'absolute',
                                        zIndex: -1,
                                        top: 0,
                                        left: 0,
                                    }}
                                />
                            ))}
                        </AvatarGroup>
                        <Text fontFamily={'heading'} fontSize={{ base: '4xl', md: '6xl' }}>
                            +
                        </Text>
                        <Flex
                            align={'center'}
                            justify={'center'}
                            fontFamily={'heading'}
                            fontSize={{ base: 'sm', md: 'lg' }}
                            bg={'gray.800'}
                            color={'white'}
                            rounded={'full'}
                            minWidth={useBreakpointValue({ base: '44px', md: '60px' })}
                            minHeight={useBreakpointValue({ base: '44px', md: '60px' })}
                            position={'relative'}
                            _before={{
                                content: '""',
                                width: 'full',
                                height: 'full',
                                rounded: 'full',
                                transform: 'scale(1.125)',
                                bgGradient: 'linear(to-bl, green.400,gray.400)',
                                position: 'absolute',
                                zIndex: -1,
                                top: 0,
                                left: 0,
                            }}>
                            YOU
                        </Flex>
                    </Stack>
                </Stack>
                <Stack
                    bg={'gray.50'}
                    rounded={'xl'}
                    p={{ base: 4, sm: 6, md: 8 }}
                    spacing={{ base: 8 }}
                    maxW={{ lg: 'lg' }}>
                    <Stack spacing={4}>
                        <Heading
                            color={'gray.800'}
                            lineHeight={1.1}
                            fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}>
                            Join our team of Owners and Agencies
                            <Text
                                as={'span'}
                                bgGradient="linear(to-r, blue.400,cyan.400)"
                                bgClip="text">
                                !
                            </Text>
                        </Heading>
                        <Text color={'gray.500'} fontSize={{ base: 'sm', sm: 'md' }}>
                            Fill out the form below to join our team of Owners and Agencies.
                        </Text>
                    </Stack>
                    <Box mt={10}>
                        <form onSubmit={{handleSubmit}}>
                            <Stack spacing={4}>
                                <HStack>

                                    <Box>
                                        <Input
                                            placeholder="First Name"
                                            bg={'gray.100'}
                                            border={0}
                                            color={'gray.500'}
                                            _placeholder={{
                                                color: 'gray.500',
                                            }}
                                            value={userDetails.name}
                                            onChange={(e) => setUserDetails(prevDetails => ({...prevDetails, firstName: e.target.value}))}
                                            required={agencyInfo.position !== 'agency'}
                                        />

                                    </Box>
                                    <Box>
                                        <FormControl id="lastName">
                                            <Input
                                                placeholder="Last Name"
                                                bg={'gray.100'}
                                                border={0}
                                                color={'gray.500'}
                                                _placeholder={{
                                                    color: 'gray.500',
                                                }}
                                                type="text"
                                                value={userDetails.lastName}
                                                onChange={(e) => setUserDetails(prevDetails => ({...prevDetails, lastName: e.target.value}))}
                                                required={agencyInfo.position !== 'agency'}
                                            />
                                        </FormControl>
                                    </Box>
                                </HStack>
                                <Input
                                    placeholder={currentUser?.email}
                                    bg={'gray.100'}
                                    border={0}
                                    color={'gray.500'}
                                    _placeholder={{
                                        color: 'gray.500',
                                    }}
                                    disabled={true}
                                />
                                <FormControl>
                                    <FormLabel>I am a...</FormLabel>
                                    <RadioGroup  onChange={handlePositionChange} value={agencyInfo.position} required>
                                        <Radio m={"1%"} value="landlord">Landlord</Radio>
                                        <Radio m={"1%"} value="caretaker">Caretaker</Radio>
                                        <Radio m={"1%"} value="agency">Agency</Radio>
                                    </RadioGroup>
                                    {agencyInfo.position === 'agency' && (
                                        <>
                                            <Input
                                                mb={2}
                                                placeholder="Agency Code"
                                                bg={'gray.100'}
                                                border={0}
                                                color={'gray.500'}
                                                value={agencyInfo.agencyCode}
                                                _placeholder={{
                                                    color: 'gray.500',
                                                }}
                                                type="text"
                                                onChange={(e) => setAgencyInfo(prevDetails => ({...prevDetails, agencyCode: e.target.value}))}
                                                onBlur={handleAgencyCodeCheck}
                                                required
                                            />
                                            {agencyInfo.errorMessage ? <Text textColor={"red.500"} fontSize={"12px"}>{agencyInfo.errorMessage}</Text> : <Text>{agencyInfo.showName}</Text>}
                                            <Text
                                                color="blue.500"
                                                cursor="pointer"
                                                onClick={() => {
                                                    setAgencyInfo(prevDetails => ({...prevDetails,
                                                        showNewAgencyFields: true,
                                                        agencyCode: '',
                                                    }));
                                                }}
                                                mt={2}
                                            >
                                                Register a new agency
                                            </Text>

                                            {agencyInfo.showNewAgencyFields && (
                                                <>
                                                    {/* New agency fields */}
                                                    <Input
                                                        mb={2}
                                                        placeholder="Agency Name"
                                                        bg={'gray.100'}
                                                        border={0}
                                                        color={'gray.500'}
                                                        _placeholder={{
                                                            color: 'gray.500',
                                                        }}
                                                        type="text"
                                                        value={agencyInfo.agencyName}
                                                        onChange={(e) => setAgencyInfo(prevDetails => ({...prevDetails, agencyName: e.target.value}))}
                                                        required={agencyInfo.agencyCode === ''}
                                                    />
                                                    <Input
                                                        mb={2}
                                                        placeholder="Location"
                                                        bg={'gray.100'}
                                                        border={0}
                                                        color={'gray.500'}
                                                        _placeholder={{
                                                            color: 'gray.500',
                                                        }}
                                                        value={agencyInfo.location}
                                                        onChange={(e) => setAgencyInfo(prevDetails => ({...prevDetails, location: e.target.value}))}
                                                        required={agencyInfo.agencyCode === ''}
                                                    />
                                                    <Flex>
                                                        <Box mr={2}>
                                                            <FormLabel>Phone e.g. 0712...</FormLabel>
                                                            <Input

                                                                placeholder="0712345678"
                                                                bg={'gray.100'}
                                                                border={0}
                                                                color={'gray.500'}
                                                                _placeholder={{
                                                                    color: 'gray.500',
                                                                }}
                                                                value={userDetails.phone}
                                                                onChange={(e) => setUserDetails(prevDetails => ({...prevDetails, phone: e.target.value}))}
                                                                required={agencyInfo.agencyCode === ''}
                                                            />
                                                        </Box>

                                                        <Box>
                                                            <FormLabel>Email</FormLabel>
                                                            <Input
                                                                placeholder="Agency Email"
                                                                bg={'gray.100'}
                                                                border={0}
                                                                color={'gray.500'}
                                                                _placeholder={{
                                                                    color: 'gray.500',
                                                                }}
                                                                value={agencyInfo.agencyEmail}
                                                                onChange={(e) => setAgencyInfo(prevDetails => ({...prevDetails, agencyEmail: e.target.value}))}
                                                                required={agencyInfo.agencyCode === ''}
                                                            />
                                                        </Box>

                                                    </Flex>
                                                    <FormControl mt="2%">
                                                        <FormLabel htmlFor="property-description" fontWeight={'normal'}>
                                                            property description
                                                        </FormLabel>
                                                        <Textarea
                                                                  mt={2}
                                                                  placeholder="Write a brief description about your agency..."
                                                                  rows={3}
                                                                  shadow="sm"
                                                                  value={agencyInfo.description}
                                                                  onChange={(e) => setAgencyInfo(prevDetails => ({...prevDetails, description: e.target.value}))}
                                                                  required={agencyInfo.agencyCode === ''}
                                                        />
                                                    </FormControl>
                                                </>
                                            )}
                                        </>
                                    )}
                                    {agencyInfo.position === 'landlord' && (
                                        <>
                                            <Input
                                                placeholder="+254712345678"
                                                bg={'gray.100'}
                                                border={0}
                                                color={'gray.500'}
                                                _placeholder={{
                                                    color: 'gray.500',
                                                }}
                                                value={userDetails.phone}
                                                onChange={(e) => setUserDetails(prevDetails => ({...prevDetails, phone: e.target.value}))}
                                                required
                                            />
                                        </>
                                    )}
                                    {agencyInfo.position === 'caretaker' && (
                                        <>
                                            <Input
                                                placeholder="+254712345678"
                                                bg={'gray.100'}
                                                border={0}
                                                color={'gray.500'}
                                                _placeholder={{
                                                    color: 'gray.500',
                                                }}
                                                value={userDetails.phone}
                                                onChange={(e) => setUserDetails(prevDetails => ({...prevDetails, phone: e.target.value}))}
                                                required
                                            />
                                        </>
                                    )}
                                </FormControl>

                            </Stack>
                            <Button
                                fontFamily={'heading'}
                                mt={8}
                                w={'full'}
                                bgGradient="linear(to-r, blue.400,cyan.400)"
                                color={'white'}
                                _hover={{
                                    bgGradient: 'linear(to-r, blue.400,cyan.400)',
                                    boxShadow: 'xl',
                                }}
                            onClick={handleSubmit}>
                                Submit
                            </Button>
                        </form>
                    </Box>
                    form
                </Stack>
            </Container>
            <Blur
                position={'absolute'}
                top={-10}
                left={-10}
                style={{ filter: 'blur(180px)' }}
            />
        </Box>
    );
};

export default AccountSetup;

export const Blur = (props) => {
    return (
        <Icon
            width={useBreakpointValue({ base: '100%', md: '40vw', lg: '30vw' })}
            zIndex={useBreakpointValue({ base: -1, md: -1, lg: 0 })}
            height="560px"
            viewBox="0 0 528 560"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}>
            <circle cx="71" cy="61" r="111" fill="#F56565" />
            <circle cx="244" cy="106" r="139" fill="#ED64A6" />
            <circle cy="291" r="139" fill="#ED64A6" />
            <circle cx="80.5" cy="189.5" r="101.5" fill="#ED8936" />
            <circle cx="196.5" cy="317.5" r="101.5" fill="#ECC94B" />
            <circle cx="70.5" cy="458.5" r="101.5" fill="#48BB78" />
            <circle cx="426.5" cy="-0.5" r="101.5" fill="#4299E1" />
        </Icon>
    );
};
