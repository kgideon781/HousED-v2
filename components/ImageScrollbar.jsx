import {ScrollMenu, VisibilityContext} from "react-horizontal-scrolling-menu";
import {Box, Flex, Icon} from "@chakra-ui/react";
import {useContext} from "react";
import {FaArrowAltCircleLeft, FaArrowAltCircleRight} from "react-icons/fa";
import Image from "next/image";

const LeftArrow = () => {
    const {scrollPrev} = useContext(VisibilityContext);

    return (
        <Flex marginRight="1" justifyContent="center" alignItems="center">
            <Icon
                as={FaArrowAltCircleLeft}
                onClick={() => scrollPrev()}
                fontSize="2xl"
                cursor="pointer"
            />
        </Flex>
    )
}
const RightArrow = () => {
    const {scrollNext} = useContext(VisibilityContext);

    return (
        <Flex marginRight="1" justifyContent="center" alignItems="center">
            <Icon
                as={FaArrowAltCircleRight}
                onClick={() => scrollNext()}
                fontSize="2xl"
                cursor="pointer"
            />
        </Flex>
    )
}
const ImageScrollbar = ( { data }) => (
    <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow} style={{overflow: 'hidden'}}>
        {data.map((item) => (
            <Box key={item.id} width="910px" itemID={item.id} overflow="hidden" p="1">
                <Image
                    placeholder="blur"
                    blurDataURL={item.url}
                    src={item.url}
                    width={1000}
                    height={500}
                    alt="property"
                    sizes="(max-width: 500px) 100px, (max-width: 1023px) 400px, 1000px"
                >

                </Image>
            </Box>
        ))}
    </ScrollMenu>

)
export default ImageScrollbar;