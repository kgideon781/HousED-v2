import Link from 'next/link';
import Image from 'next/image';
import {Flex, Box, Text, Button, Avatar} from '@chakra-ui/react';
import {FaBed, FaBath} from "react-icons/fa";
import {BsGridFill} from "react-icons/bs";
import {GoVerified} from "react-icons/go";
import millify from "millify";
import defaultImage from '../assets/images/defaultImage.jpg'
import { BiLike } from "react-icons/Bi";
import { IoMdShare } from "react-icons/Io";
import {addLike} from "../pages/index";

const Property  = ({ coverPhoto, price, rentFrequency, rooms, title, baths, area, agency, isVerified, externalID, propertyID }) => (

   <>


           <Flex flexWrap="wrap" w="420px" p="5" paddingTop="0" justifyContent="flex-start" cursor="pointer">
               <Link href={`/property/${propertyID}`} passHref>
                   <Box>
                       <Image src={coverPhoto ? coverPhoto : defaultImage} width={400} height={260} alt="Image"/>
                   </Box>
               </Link>
                   <Box w="full" border="1px solid #d3eaf2">
                       <Link href={`/property/${propertyID}`} passHref>
                           <Flex paddingTop="2" alignItems="center" justifyContent="space-between">
                               <Flex alignItems="center">
                                   <Box paddingLeft="1" paddingRight="3" color="green.400">
                                       {isVerified && <GoVerified/>}
                                   </Box>
                                   <Text fontWeight="bold" fontSize="lg">KES {millify(price)}{rentFrequency && `/${rentFrequency}`}</Text>
                               </Flex>

                               <Box marginRight="2">
                                   <Avatar size="sm" src={agency?.logo?.url}/>
                               </Box>


                           </Flex>
                           <Flex alignItems="center" p="1" justifyContent="space-between" w="250px" color="blue.400">
                               {rooms} <FaBed/> |{baths} <FaBath/> {area} sqft <BsGridFill/>
                           </Flex>
                           <Text fontSize="lg" paddingBottom="4" paddingLeft="1">
                               {title?.length > 30 ? `${title.substring(0, 40)}...` : title}
                           </Text>
                       </Link>
                   <hr/>
                   <Flex mt="4px" padding="5px" justifyContent="space-between" alignItems="center">
                       <Box>
                           <Flex alignItems="center" p="1" justifyContent="space-between" w="75px" color="blue.400">

                               <Box
                                   borderRadius="50%"
                                   padding="2"
                                   _hover={{
                                   background: "gray.200",

                               }}
                                   onClick={() => addLike(propertyID)}
                               >
                                   <BiLike
                                       size="23px"
                                   />
                               </Box>

                               <Box
                                   borderRadius="50%"
                                   padding="2"
                                   _hover={{
                                       background: "gray.200",

                                   }}
                               >
                               <IoMdShare size="23px"  />
                               </Box>
                           </Flex>

                       </Box>
                       <Box>
                           <Button colorScheme='blue' size="md">Contact Agent</Button>
                       </Box>

                   </Flex>

               </Box>

           </Flex>

   </>

)
export default Property;