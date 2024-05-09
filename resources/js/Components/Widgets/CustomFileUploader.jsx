import { useDropzone } from 'react-dropzone';
import React, { useState, useEffect, useRef } from 'react';
import { FiUpload, FiTrash2 } from "react-icons/fi";
import {
  Box,
  Text,
  useColorModeValue,
  Image,
  IconButton,
  Tooltip,
  FormLabel,
  HStack,
  Input,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button
} from '@chakra-ui/react';

const CustomFileUploader = (props) => {
  const [files, setFiles] = useState([]);
  const [item, setItem] = useState(props.item ?? [])
  const [confirmDialogState, setConfirmDialogState] = useState(false);
  const { platform } = props
  const cancelRef = useRef()
  const [selectedFile, setSelectedFile] = useState({ id: null, index: null });
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [".png", ".jpeg", ".jpg"] },
    multiple: !!props.multiple,
    onDrop: (acceptedFiles) => {
      if (props.multiple) {
        setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
      } else {
        setFiles([acceptedFiles[0]]);
      }
    },
  });

  useEffect(() => {
    if (props.onChange) {
      props.onChange(files);
    }
  }, [files])

  const removeItemById = (prevItems, id) => prevItems.filter(item => item.id !== id);

  const removeItemByIndex = (prevItems, index) => {
    if (index >= 0 && index < prevItems.length) {
      const updatedItems = [...prevItems];
      updatedItems.splice(index, 1);
      return updatedItems;
    }
    return prevItems;
  };

  const handleRemoveImageUpdate = (id = null, index = null) => {
    setItem(prevItems => {
      let updatedItems = [...prevItems];
      if (id !== null) {
        updatedItems = removeItemById(updatedItems, id);
      } else if (index !== null) {
        updatedItems = removeItemByIndex(updatedItems, index);
      }
      closeDialog();
      axios.delete(route(platform + ".media.destroy", id)).then(response => console.log(response));
      
      return updatedItems;
    });
  };

  const handleRemoveImage = (id = null, index = null) => {
    setFiles(prevFiles => {
      let updatedFiles = [...prevFiles];
      if (id !== null) {
        updatedFiles = removeItemById(updatedFiles, id);
      } else if (index !== null) {
        updatedFiles = removeItemByIndex(updatedFiles, index);
      }
      return updatedFiles;
    });
  };
  const openDialog = (id, index) => {
    setConfirmDialogState(true);
    setSelectedFile({ id: id, index: index });
  }

  const closeDialog = () => {
    setConfirmDialogState(false);
    setSelectedFile({ id: null, index: null, action: null });

  }
  const SingleImageListUpdate = ({ file, index }) => (
    <HStack mt="2" borderWidth="1px" p="2" index={index} rounded="md" justify={'space-between'}>
      <HStack>
        <Image
          mr="2"
          boxSize="50px"
          objectFit="cover"
          alt={file.file_name}
          src={file.cdn}

        />
        <Box>
          <Text fontSize="md" fontWeight="semibold">
            {file.file_name.length > 20 ? file.file_name.substring(0, 14) + '...' : file.file_name}
          </Text>
          <Text fontSize="sm" color="gray.600">
            {(file.size / 1024).toFixed(2)} KB
          </Text>
        </Box>
      </HStack>
      <HStack>
        <Tooltip label="Remove">
          <IconButton
            ml="2"
            size="sm"
            aria-label={''}
            variant='transperant'
            icon={<FiTrash2 color='#f57373' />}
            onClick={() => openDialog(file.id, index)}
          />
        </Tooltip>
      </HStack>
    </HStack>
  )

  const SingleImageList = ({ file, index }) => (
    <HStack mt="2" borderWidth="1px" p="2" index={index} rounded="md" justify={'space-between'}>
      <HStack>
        <Image
          mr="2"
          boxSize="50px"
          objectFit="cover"
          alt={file.name}
          src={URL.createObjectURL(file)}
        />
        <Box>
          <Text fontSize="md" fontWeight="semibold">
            {file.name.length > 20 ? file.name.substring(0, 14) + '...' : file.name}
          </Text>
          <Text fontSize="sm" color="gray.600">
            {(file.size / 1024).toFixed(2)} KB
          </Text>
        </Box>
      </HStack>
      <HStack>
        <Tooltip label="Remove">
          <IconButton
            ml="2"
            size="sm"
            aria-label={''}
            variant='transperant'
            icon={<FiTrash2 color='#f57373' />}
            onClick={() => handleRemoveImage(file.id, index)}
          />
        </Tooltip>
      </HStack>
    </HStack>
  )

  return (
    <>
      <FormLabel fontSize="15px" fontWeight="bold">
        Upload Images {props.isOptional && "(optional)"}
      </FormLabel>
      {(props.keepUploader && files.length === 0 || !props.keepUploader) && <Box
        {...getRootProps()}
        p="4"
        rounded="md"
        height={150}
        display="flex"
        cursor="pointer"
        borderWidth="1px"
        border={'dashed'}
        textAlign="center"
        alignItems="center"
        flexDirection="column"
        borderColor={useColorModeValue("gray.200", "gray.600")}
        justifyContent="center"
      >
        <Input {...getInputProps()} />
        <Box style={{
          backgroundColor: 'rgba(128, 128, 128, 0.12)',
          padding: '6px',
          display: 'inline-block',
          borderRadius: '8px',
          marginBottom: 2,
          color: "black"
        }}>
          <FiUpload fontSize={18} color={useColorModeValue("black", "gray")} />
        </Box>
        <>
          <Text fontSize="md" color="blue.500">
            Click to Upload
          </Text>

          <Text fontSize="sm" color={useColorModeValue('blackAlpha.600', "gray.200")}>
            images/*
          </Text>
        </>
      </Box>}
      <AlertDialog
        isOpen={confirmDialogState}
        leastDestructiveRef={cancelRef}
        onClose={closeDialog}
        motionPreset='slideInBottom'
        isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete Image
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef}
                size={'sm'} onClick={closeDialog}>
                Cancel
              </Button>
              <Button
                size={'sm'}
                colorScheme='red'
                onClick={() => handleRemoveImageUpdate(selectedFile.id, selectedFile.index)}
                ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      {files.length > 0 &&
        <Box maxH="300px" overflowY="auto">
          {files.map((file, index) => (<SingleImageList file={file} key={index} index={index} />))}
        </Box>
      }
      {item.length > 0 &&
        <Box maxH="300px" overflowY="auto">
          {item.length > 0 && item.map((file, index) => (<SingleImageListUpdate file={file} key={index} index={index} />))}
        </Box>
      }

    </>
  );
}

export default CustomFileUploader;