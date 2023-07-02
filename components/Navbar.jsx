import Link from 'next/link';
import {Avatar, Box, Button, Flex, Icon, IconButton, Menu, MenuButton, MenuList, Stack, Text} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {auth, db} from "../firebase";
import {BiChevronDown, BiCog, BiHome, BiHotel, BiLogOut, BiPlus, BiSearch, BiUser} from "react-icons/bi";
import {FaBiking} from "react-icons/fa";
import {GiOverlordHelm} from "react-icons/gi";


const Navbar = (props) => {
    const [isOpen, setIsOpen] = useState(false);


    const toggle = () => setIsOpen(!isOpen);



    return (
        <NavBarContainer  {...props}>
            <Box fontSize="3xl" color="blue.400" fontWeight="bold">
                <Link href={"/"} color={"blue.400"}>HousED</Link>
            </Box>

            <MenuToggle toggle={toggle} isOpen={isOpen} />
            <MenuLinks isOpen={isOpen} />
        </NavBarContainer>
    );
};
const CloseIcon = () => (
    <svg width="24" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <title>Close</title>
        <path
            fill="#4299E1"
            d="M9.00023 7.58599L13.9502 2.63599L15.3642 4.04999L10.4142 8.99999L15.3642 13.95L13.9502 15.364L9.00023 10.414L4.05023 15.364L2.63623 13.95L7.58623 8.99999L2.63623 4.04999L4.05023 2.63599L9.00023 7.58599Z"
        />
    </svg>
);

const MenuIcon = () => (
    <svg
        width="24px"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        fill={"#4299E1"}
    >
        <title>Menu</title>
        <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
    </svg>
);

const MenuToggle = ({ toggle, isOpen }) => {
    return (
        <Box display={{ base: "block", md: "none" }} onClick={toggle}>
            {isOpen ? <CloseIcon /> : <MenuIcon />}
        </Box>
    );
};

const MenuItem = ({ children, isLast, to = "/", ...rest }) => {
    return (
        <Link href={to}>
            <Text display="block" {...rest}>
                {children}
            </Text>
        </Link>
    );
};

const MenuLinks = ({ isOpen }) => {
    const [currentUser, setCurrentUser] = useState(null)
    const [role, setRole] = useState('subscriber')
    const loggedInUser = auth.currentUser;


    const handleLogout = async () => {
        try {
            await auth.signOut();
            console.log('Logout successful')
        } catch (error) {
            // Handle logout error
            console.error('Logout error:', error);
        }
    };


    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                setCurrentUser(user)
                //console.log(user.uid)
                const usersRef = db.collection('users').doc(user.uid)

                //check if the logged in user's role is subscriber in firestore database
                usersRef?.onSnapshot((user) => {
                    if (user.data()?.role === 'subscriber') {
                        setRole('subscriber')
                    } else {
                        setRole('admin')
                    }
                })

            } else {
                setCurrentUser(null)
            }
        })
    }, [currentUser])
    return (
        <Box
            display={{ base: isOpen ? "block" : "none", md: "block" }}
            flexBasis={{ base: "100%", md: "auto" }}
        >
            <Stack
                spacing={8}
                align="center"
                justify={["center", "space-between", "flex-end", "flex-end"]}
                direction={["column", "row", "row", "row"]}
                pt={[4, 4, 0, 0]}
                fontWeight="bold"
            >
                <MenuItem to="/">Home</MenuItem>
                {role !== 'subscriber' && <MenuItem to="/create">List a Property</MenuItem>}
                <MenuItem to="/search?purpose=for-rent">Rent Property </MenuItem>
                <MenuItem to="/search?purpose=for-sale">Buy Property </MenuItem>
                <MenuItem to="/about-us">About us </MenuItem>
                <MenuItem to="/search" isLast>

                    <IconButton
                        colorScheme='blue'
                        aria-label='Search database'
                        icon={<BiSearch />}
                    />
                </MenuItem>
                {currentUser ? <Menu>
                    <MenuButton
                        as={Button}
                        rightIcon={<BiChevronDown />}
                        size="sm"
                        rounded="md"
                        color="white"
                        bg={["gray.300", "gray.300", "black.200", "black.200"]}

                        _hover={{
                            bg: ["blue.400", "blue.400", "black.500", "black.500"],
                        }}
                    >
                        <Avatar size="sm" name={currentUser.displayName} src={"path"} />
                    </MenuButton>
                    <MenuList>
                        {/* Add your user account menu items here */}
                        <Flex alignItems={"center"} p={"3%"}>
                            <Icon fontSize={"lg"} ml={"2%"} mr={"2%"} as={BiUser} />
                            <MenuItem to={"/my-profile"}>Your Profile</MenuItem>
                        </Flex>
                        {role !== 'subscriber' && <Flex alignItems={"center"} p={"3%"} borderColor={"gray.200"} borderWidth={"1px"}>
                            <Icon fontSize={"lg"} ml={"2%"} mr={"2%"} as={BiPlus} />
                            <MenuItem to="/create">New Property</MenuItem>

                        </Flex>}
                        <Flex alignItems={"center"} p={"3%"} borderColor={"gray.200"} borderWidth={"1px"}>
                            <Icon fontSize={"lg"} ml={"2%"} mr={"2%"} as={BiCog} />
                            <MenuItem to={"/settings"}>Settings</MenuItem>
                        </Flex>
                        {role === 'subscriber' ?  <Flex alignItems={"center"}  p={"2%"} w={"100%"} cursor={"pointer"}>
                            <Icon fontSize={"lg"} ml={"2%"} mr={"2%"} as={GiOverlordHelm} />
                            <MenuItem to={"/account-setup"}>I am a Landlord/Agency</MenuItem>

                        </Flex>
                            :
                            <Flex alignItems={"center"}  p={"2%"} w={"100%"} cursor={"pointer"}>
                                <Icon fontSize={"lg"} ml={"2%"} mr={"2%"} as={BiHotel} />
                                <MenuItem to={"/my-profile"}>My Properties</MenuItem>

                            </Flex>

                        }

                        <Flex alignItems={"center"} p={"2%"}>
                            <Icon fontSize={"lg"} ml={"2%"} mr={"2%"} as={BiLogOut} />
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>

                            <Text></Text>
                        </Flex>



                    </MenuList>
                </Menu>
                    :
                    <MenuItem to="/signin">
                        <Button
                            size="sm"
                            rounded="md"
                            color={"white"}
                            bg={["blue.400", "blue.400", "black.500", "black.500"]}
                            _hover={{
                                bg: ["black.100", "black.100", "black.600", "black.600"]
                            }}
                        >
                            Login
                        </Button>
                    </MenuItem>
                }

            </Stack>
        </Box>
    );
};

const NavBarContainer = ({ children, ...props }) => {
    return (
        <Flex
            as="nav"
            align="center"
            justify="space-between"
            wrap="wrap"
            w="100%"
            mb={8}
            p={4}
            bg={["black.500", "black.500", "transparent", "transparent"]}
            color={["blue.400", "blue.400", "black.700", "black.700"]}
            borderBottom="1px" borderColor="gray.100"
            {...props}
        >
            {children}
        </Flex>
    );
};
export default Navbar;
