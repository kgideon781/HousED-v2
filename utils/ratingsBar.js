import {Box, Text } from "@chakra-ui/react";
import {MdStarHalf} from "react-icons/md";
import {IoMdStar, IoMdStarOutline} from "react-icons/io";
import {useEffect, useState} from "react";
const RatingBar = ({ initialRating, onRatingChange  }) => {
    const [rating, setRating] = useState(initialRating);
    const [hoverRating, setHoverRating] = useState(0);

    const handleMouseEnter = (index) => {
        setHoverRating(index);
    };

    const handleMouseLeave = () => {
        setHoverRating(0);
    };

    const handleClick = (index) => {
        setRating(index);
        onRatingChange(index);
    };

    useEffect(() => {
        onRatingChange(rating);
    }, [rating, onRatingChange]);

    return (
        <Box display="flex" alignItems="center">
            {[1, 2, 3, 4, 5].map((index) => (
                <Box
                    key={index}
                    as={hoverRating !== 0 || rating >= index ? IoMdStar : IoMdStarOutline}
                    size={25}
                    color={hoverRating >= index || rating >= index ? 'yellow.400' : 'gray.300'}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleClick(index)}
                />
            ))}
            <Text marginLeft="2" fontSize="sm" color="gray.500">
                {rating}
            </Text>
        </Box>
    );
};
export default RatingBar;
