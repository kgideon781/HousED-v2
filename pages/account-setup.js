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
    useBreakpointValue, Heading, Flex, Avatar, AvatarGroup, Container, SimpleGrid
} from '@chakra-ui/react';
import {auth, db} from '../firebase';
import firebase from "firebase";
import {useRouter} from "next/router";

const AccountSetup = () => {
    const [agencyCode, setAgencyCode] = useState('');
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [position, setPosition] = useState('');
    const [agencyName, setAgencyName] = useState('');
    const [location, setLocation] = useState('');
    const [phone, setPhone] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [agencyEmail, setAgencyEmail] = useState('');

    //handling agency retrieval
    const [agencyErrorMessage, setAgencyErrorMessage] = useState('');
    //show the agency details when there was a match
    const [showAgencyName, setShowAgencyName] = useState('');
    const [agencyID, setAgencyID] = useState('');

    const [showNewAgencyFields, setShowNewAgencyFields] = useState(false);

    const [currentUser, setCurrentUser] = useState(null);
    const current_username = currentUser?.displayName;
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setCurrentUser(user);
            }
        });

        return () => unsubscribe(); // Cleanup on component unmount

    }, []);

    useEffect(() => {
        // Check if the user's role is 'admin' and redirect to the home
        const fetchData = async () => {
            try {
                // Check if currentUser is available and not null
                if (currentUser && currentUser.uid) {
                    const doc = await db.collection('users').doc(currentUser.uid).get();

                    if (doc.exists) {
                        const data = doc.data();

                        if (data.role === 'admin') {
                            // Redirect to the homepage
                            await router.push('/');
                        }
                    }
                }
            } catch (error) {
                console.error("Error getting document:", error);

                // Handle error and redirect if needed
                if (error.message.includes("Hydration failed")) {
                    // Redirect to the homepage
                    await router.push('/');
                }
            }
        };

        fetchData();
    }, [currentUser, router]);

    // Make sure the user is logged in and the position, location and phone are filled before proceeding
    const isInvalid =
        (position === '' || location === '' || phone === '') &&
        (agencyCode === '');

    const handlePositionChange = (value) => {
        setPosition(value);
        setShowAgencyName("")
        // Reset fields when position changes
        setAgencyCode("")
        setAgencyName('');
        setLocation('');
        setPhone('');
        setAgencyEmail('');
        setShowNewAgencyFields(false);
    };
    //generate a random agency code 6 characters long, first three should be alphanumeric and last three should be numeric
    const generateAgencyCode = () => {
        const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const numeric = '0123456789';
        let code = '';
        for (let i = 0; i < 3; i++) {
            code += alphanumeric.charAt(Math.floor(Math.random() * alphanumeric.length));
        }
        for (let i = 0; i < 3; i++) {
            code += numeric.charAt(Math.floor(Math.random() * numeric.length));
        }
        return code;
    };



    const handleAgencyCodeCheck = () => {
        // Check if the agency code exists
        db.collection('agencies').where('agencyCode', '==', agencyCode).get().then((querySnapshot) => {
            if (querySnapshot.empty) {
                setAgencyErrorMessage("The agency code you entered does not exist. Please try again or register a new agency.")
            } else {
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    console.log(data.agencyID)
                    setAgencyID(data.agencyID)
                    setAgencyErrorMessage("");
                    setShowAgencyName(data.name)
                    /*setAgencyName(data.name);
                    setLocation(data.location);
                    setPhone(data.phone);
                    setAgencyEmail(data.email);*/
                    setShowNewAgencyFields(false);
                });
            }
        }).catch((error) => {
            console.log("Error getting documents: ", error);
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        await db.collection('users').doc(currentUser.uid).set({
            displayName: name + ' ' + lastName,
            name,
            lastName,
            position,
            role: "admin",
        }, {merge: true}).then(async () => {
            if (position === 'agency') {
                const agencyData = {
                    name: agencyName,
                    location,
                    phone,
                    userEmail,
                    agencyEmail,
                    position,
                    createdBy: currentUser.uid,
                    dateCreated: firebase.firestore.FieldValue.serverTimestamp()
                };
                if (agencyID !== '') {
                    console.log(agencyID)
                    const currentUserData = {
                        agentName: currentUser.displayName,
                        userID: currentUser.uid,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    }
                        await db.collection('agencies').doc(agencyID).collection("agents").add(currentUserData);
                }else {
                    const agencyRef = await db.collection('agencies').add(agencyData);
                    const agencyID = agencyRef.id;
                    const generatedAgencyCode = generateAgencyCode();

                   // setAgencyID(agencyID);
                    await agencyRef.update({
                        agencyID: agencyID,
                        agencyCode: generatedAgencyCode,
                    }, {merge: true}).then(async () => {
                        const currentUserData = {
                            agentName: currentUser.displayName,
                            userID: currentUser.uid,
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        }
                        await db.collection('agencies').doc(agencyID).collection("agents").add(currentUserData);
                    });
                }

            } else {

                const agencyData = {
                    name,
                    lastName,
                    phone,
                    userEmail,
                    position,
                    userID: currentUser.uid,
                    userVerified: false,
                };
                const agencyRef = await db.collection('agencies').add(agencyData);
                const agencyID = agencyRef.id;
                const generatedAgencyCode = generateAgencyCode();
                await agencyRef.update({
                    agentID: agencyID,
                    agencyCode: generatedAgencyCode,
                }, {merge: true});
            }

            console.log("Document successfully written!");
        }).catch((error) => {
            console.error("Error writing document: ", error);
        });

        // Reset the form
        setName('');
        setLastName('');
        setPosition('');
        setAgencyName('');
        setLocation('');
        setPhone('');
        setAgencyEmail('');
        setUserEmail("")
        setShowAgencyName("")
    };
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
                        <form onSubmit={handleSubmit}>
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
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
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
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                required
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
                                    <RadioGroup  onChange={handlePositionChange} value={position} required>
                                        <Radio m={"1%"} value="landlord">Landlord</Radio>
                                        <Radio m={"1%"} value="caretaker">Caretaker</Radio>
                                        <Radio m={"1%"} value="agency">Agency</Radio>
                                    </RadioGroup>
                                    {position === 'agency' && (
                                        <>
                                            <Input
                                                mb={2}
                                                placeholder="Agency Code"
                                                bg={'gray.100'}
                                                border={0}
                                                color={'gray.500'}
                                                value={agencyCode}
                                                _placeholder={{
                                                    color: 'gray.500',
                                                }}
                                                type="text"
                                                onChange={(e) => setAgencyCode(e.target.value)}
                                                onBlur={handleAgencyCodeCheck}
                                                required
                                            />
                                            {agencyErrorMessage ? <Text textColor={"red.500"} fontSize={"12px"}>{agencyErrorMessage}</Text> : <Text>{showAgencyName}</Text>}
                                            <Text
                                                color="blue.500"
                                                cursor="pointer"
                                                onClick={() => setShowNewAgencyFields(true)}
                                                mt={2}
                                            >
                                                Register a new agency
                                            </Text>

                                            {showNewAgencyFields && (
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
                                                        value={agencyName}
                                                        onChange={(e) => setAgencyName(e.target.value)}
                                                        required={agencyCode === ''}
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
                                                        value={location}
                                                        onChange={(e) => setLocation(e.target.value)}
                                                        required={agencyCode === ''}
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
                                                                value={phone}
                                                                onChange={(e) => setPhone(e.target.value)}
                                                                required={agencyCode === ''}
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
                                                                value={agencyEmail}
                                                                onChange={(e) => setAgencyEmail(e.target.value)}
                                                                required={agencyCode === ''}
                                                            />
                                                        </Box>

                                                    </Flex>
                                                </>
                                            )}
                                        </>
                                    )}
                                    {position === 'landlord' && (
                                        <>
                                            <Input
                                                placeholder="+254712345678"
                                                bg={'gray.100'}
                                                border={0}
                                                color={'gray.500'}
                                                _placeholder={{
                                                    color: 'gray.500',
                                                }}
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                required
                                            />
                                        </>
                                    )}
                                    {position === 'caretaker' && (
                                        <>
                                            <Input
                                                placeholder="+254712345678"
                                                bg={'gray.100'}
                                                border={0}
                                                color={'gray.500'}
                                                _placeholder={{
                                                    color: 'gray.500',
                                                }}
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
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
