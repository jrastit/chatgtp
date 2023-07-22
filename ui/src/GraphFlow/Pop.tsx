import { Box, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { useRef } from "react";


interface PopupProps {
    children: React.ReactNode,
    close: () => void
    validate: () => void
    closeLabel: string
    validateLabel: string
    isVisible: boolean
    title: string
    loading?: boolean
  }

function Pop({ children, close, validate, closeLabel, validateLabel, isVisible, title, loading = false }: PopupProps) {
    const initialRef = useRef(null)
    const finalRef = useRef(null)

    return (
        <>

        <Modal
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
            isOpen={isVisible}
            onClose={close}
            isCentered
            size={['sm', 'md', 'lg', 'xl']}
        >
            <ModalOverlay />
            <ModalContent bg='darkGrey'>
            <ModalHeader>{title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
                <Box>{children}</Box>
            </ModalBody>

            <ModalFooter>
                <Button onClick={close} mr={3}>{closeLabel}</Button>
                <Button isLoading={loading} colorScheme='blue' variant='primary' onClick={validate}>
                {validateLabel}
                </Button>
            </ModalFooter>

            </ModalContent>
        </Modal>
        </>
    )
};

export default Pop;