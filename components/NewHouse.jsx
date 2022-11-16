
import {Input, Box, Button, Flex} from '@chakra-ui/react'
import {useRef} from "react";
import {db} from "../firebase";

const NewHouse = () => {
    const inputRef = useRef(null);

    const sendPost = (e) => {
        e.preventDefault();
        if (!inputRef.current.value) return;

        db.collection("properties").add({
            title: inputRef.current.value,
            timestamp: firebase.firestore.fieldValue.serverTimestamp()
        });
        inputRef.current.value = "";
    }

    return(
        <Box>
            <form>
                <Flex>
                    <Input
                        placeholder='Apartment name...'
                        size='lg'
                    />
                    <Button
                        hidden
                        ref={inputRef}
                        type="submit"
                        onClick={sendPost}
                    />
                </Flex>

            </form>

        </Box>
    )
}
export default NewHouse;