import React, { useState } from 'react';
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

const AccountSetup = () => {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [position, setPosition] = useState('');
    const [agencyName, setAgencyName] = useState('');
    const [location, setLocation] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    const currentUser = auth.currentUser;

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Save the user data to Firestore
        await db.collection('users').doc(currentUser.uid).set({
            displayName: name + ' ' + lastName,
            name,
            lastName,
            position,
            role: "admin",
        }, {merge: true}).then(() => {
            if (position === 'agency'){
                db.collection('agencies').add({
                    name: agencyName,
                    location,
                    phone,
                    email,
                    position,
                    agent: currentUser.uid,
                })
            }
            else {
                db.collection('agencies').add({
                    name,
                    lastName,
                    phone,
                    email,
                    position,
                    agent: currentUser.uid,
                })
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
        setEmail('');
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
                    <Box as={'form'} mt={10}>
                        <form onSubmit={handleSubmit}>
                            <Stack spacing={4}>
                                <HStack>
                                    <Box>
                                        <FormControl id="firstName" isRequired>
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
                                        </FormControl>
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
                                <RadioGroup onChange={setPosition} value={position} required>
                                    <Radio m={"1%"} value="landlord">Landlord</Radio>
                                    <Radio m={"1%"} value="caretaker">Caretaker</Radio>
                                    <Radio m={"1%"} value="agency">Agency</Radio>
                                </RadioGroup>
                                {position === 'agency' && (
                                    <>
                                        <Input
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
                                            required
                                        />
                                        <Input
                                            placeholder="Location"
                                            bg={'gray.100'}
                                            border={0}
                                            color={'gray.500'}
                                            _placeholder={{
                                                color: 'gray.500',
                                            }}
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            required
                                        />
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
                                {position === 'landlord' && (
                                    <>
                                        <Input
                                            placeholder="Location"
                                            bg={'gray.100'}
                                            border={0}
                                            color={'gray.500'}
                                            _placeholder={{
                                                color: 'gray.500',
                                            }}
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            required
                                        />
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
                                            placeholder="Location"
                                            bg={'gray.100'}
                                            border={0}
                                            color={'gray.500'}
                                            _placeholder={{
                                                color: 'gray.500',
                                            }}
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            required
                                        />
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
