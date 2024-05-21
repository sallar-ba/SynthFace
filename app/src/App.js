import {
  ChakraProvider,
  Heading,
  Container,
  Input,
  Button,
  Wrap,
  Box,
  Image,
  Text,
} from "@chakra-ui/react";
import axios from 'axios';
import { useState } from 'react';

const App = () => {
  const [file, setFile] = useState(null);
  const [inputImage, setInputImage] = useState(null);
  const [generatedImage, setGeneratedImage] = useState();
  const [errorMessage, setErrorMessage] = useState('');

  const generate = async () => {
    if (!file) {
      setErrorMessage('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://127.0.0.1:8000/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setGeneratedImage(response.data);
      setInputImage(URL.createObjectURL(file)); // Display input image
      setErrorMessage('');
    } catch (error) {
      setInputImage(URL.createObjectURL(file)); // Display input image even on error
      setErrorMessage('Error generating image');
      console.error('Error:', error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  return (
    <ChakraProvider>
      <Container textAlign="center" mt="4rem">
        <Heading mb="2rem">VariGlimpse</Heading>
        <Text fontSize="lg" mb="1rem">An Image Variation Generator</Text>
        <Box>
          <Wrap justify="center">
            <Input
              variant='flushed'
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            <Button colorScheme="yellow" onClick={generate}>Generate</Button>
          </Wrap>
          {errorMessage && <Text color="red.500" mt="1rem">{errorMessage}</Text>}
        </Box>
        {inputImage && (
          <Box mt="2rem">
            <Text fontSize="lg" mb="1rem">Input Image:</Text>
            <Image src={inputImage} boxShadow="lg" />
          </Box>
        )}
        {generatedImage && (
          <Box mt="2rem">
            <Text fontSize="lg" mb="1rem">Generated Image:</Text>
            <Image src={`data:image/jpeg;base64,${generatedImage}`} boxShadow="lg" />
          </Box>
        )}
      </Container>
    </ChakraProvider>
  );
};

export default App;
