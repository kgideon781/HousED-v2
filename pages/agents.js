import React from 'react';
import {
    Box, Button,
    Flex, Image, Input,
    InputGroup,
    InputLeftElement, InputRightElement,
    Stack,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs, Text,
} from "@chakra-ui/react";
import {BiCurrentLocation, BiLocationPlus} from "react-icons/bi";
import {FaLocationDot} from "react-icons/fa6";



const Agents = () => {
    return (
        <Box mt={-8}>
            <Box p={"2%"} borderBottom={"1px"} borderColor={"gray.100"}>
                <Flex justifyContent={"center"} align={"center"}>
                    <Flex justifyContent={"center"} alignItems={"center"}>
                        <Box p={"5px"} borderWidth={"1px"} borderColor={"gray.400"} borderRadius={"5px"}>
                            <Tabs variant='soft-rounded' colorScheme='green'>
                                <TabList>
                                    <Tab>Agencies</Tab>
                                    <Tab>Agents</Tab>
                                    <Tab>Landlords</Tab>
                                </TabList>
                            </Tabs>

                        </Box>

                    </Flex>
                    <Flex ml={"10px"} p={"5px"} borderWidth={"1px"} borderColor={"gray.400"} borderRadius={"5px"}>
                        <Stack mr={"10px"}>
                            <InputGroup>
                                <Input placeholder='Enter Location' variant={"flushed"} />
                                <InputRightElement pointerEvents='none'>
                                    <FaLocationDot color='gray.300' />
                                </InputRightElement>
                            </InputGroup>
                        </Stack>

                    </Flex>
                    <Flex ml={"10px"} p={"5px"} borderWidth={"1px"} borderColor={"gray.400"} borderRadius={"5px"}>
                        <Input variant='flushed' placeholder='Agency Name' htmlSize={30} width='auto'/>
                    </Flex>
                    <Flex>
                        <Button colorScheme='blue' variant='solid' size='lg' ml={"10px"} borderRadius={"5px"}>
                            Find
                        </Button>
                    </Flex>
                </Flex>
            </Box>
            <Box>
                <Box m={"32px 0 8px"}>
                    <Text fontSize={"18px"} fontWeight={"bold"} fontFamily={"helvetica"}>Featured Agencies(Eldoret)</Text>
                    <Text fontSize={"14px"} fontWeight={"normal"} fontFamily={"helvetica"}>Make informed decisions with help from industry experts</Text>
                </Box>
            </Box>
            <Box>
                <Flex>
                    {/*One Featured Property*/}
                    <Box borderWidth={"1px"} borderColor={"gray.200"} maxW={180} width={"auto"} display={"flex"}
                         flexDirection={"column"}
                         justifyContent={"center"}
                         alignItems={"center"}
                         borderRadius={"10px"}
                         m={"1%"}
                    >
                        <Box w={"100%"} borderBottom={"1px"} borderColor={"gray.200"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                            <Image src={"https://images.bayut.com/thumbnails/27679948-240x180.webp"} alt={"agency"} w={"auto"} height={"150px"} objectFit={"contain"}/>
                        </Box>
                        <Box mt={1} p={"3%"}>
                            <Text fontSize={"14px"} textAlign={"center"} fontWeight={"bold"} fontFamily={"helvetica"}>Al Sabeel PVT Real Estate</Text>
                            <Text mt={"2%"} textAlign={"center"} fontSize={"12px"} fontWeight={"normal"} fontFamily={"helvetica"}>2540 Properties for sale</Text>
                            <Text mt={"2%"} textAlign={"center"} fontSize={"12px"} fontWeight={"normal"} fontFamily={"helvetica"}>30 Properties for rent</Text>

                        </Box>
                    </Box>
                    {/*One Featured Property*/}
                    <Box borderWidth={"1px"} borderColor={"gray.200"} maxW={180} width={"auto"} display={"flex"}
                         flexDirection={"column"}
                         justifyContent={"center"}
                         alignItems={"center"}
                         borderRadius={"10px"}
                         m={"1%"}
                    >
                        <Box w={"100%"} borderBottom={"1px"} borderColor={"gray.200"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                            <Image src={"https://images.bayut.com/thumbnails/96047165-240x180.webp"} alt={"agency"} height={"150px"} objectFit={"contain"}/>
                        </Box>
                        <Box mt={1} p={"3%"}>
                            <Text fontSize={"14px"} textAlign={"center"} fontWeight={"bold"} fontFamily={"helvetica"}>Al Sabeel PVT Real Estate</Text>
                            <Text mt={"2%"} textAlign={"center"} fontSize={"12px"} fontWeight={"normal"} fontFamily={"helvetica"}>2540 Properties for sale</Text>
                            <Text mt={"2%"} textAlign={"center"} fontSize={"12px"} fontWeight={"normal"} fontFamily={"helvetica"}>30 Properties for rent</Text>

                        </Box>
                    </Box>
                    {/*Two Featured Property*/}
                    {/*Three Featured Property*/}
                    <Box borderWidth={"1px"} borderColor={"gray.200"} maxW={180} width={"auto"} display={"flex"}
                         flexDirection={"column"}
                         justifyContent={"center"}
                         alignItems={"center"}
                         borderRadius={"10px"}
                         m={"1%"}
                    >
                        <Box w={"100%"} borderBottom={"1px"} borderColor={"gray.200"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                            <Image src={"https://images.bayut.com/thumbnails/27681299-240x180.webp"} alt={"agency"} height={"150px"} objectFit={"contain"}/>
                        </Box>
                        <Box mt={1} p={"3%"}>
                            <Text fontSize={"14px"} textAlign={"center"} fontWeight={"bold"} fontFamily={"helvetica"}>Al Sabeel PVT Real Estate</Text>
                            <Text mt={"2%"} textAlign={"center"} fontSize={"12px"} fontWeight={"normal"} fontFamily={"helvetica"}>2540 Properties for sale</Text>
                            <Text mt={"2%"} textAlign={"center"} fontSize={"12px"} fontWeight={"normal"} fontFamily={"helvetica"}>30 Properties for rent</Text>

                        </Box>
                    </Box>
                    {/*Three Featured Property*/}
                </Flex>

            </Box>




        </Box>
    );
};

export default Agents;
