import { Flex, Heading, Icon, Text, useDisclosure } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { boxFields, icons } from '../../../service';
import DragDrop from '../../../components/DragDrop';
import { useState } from 'react';
import UploadModal from './UploadModal';

export default function UploadBoxes() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { t } = useTranslation();
	const [file, setFile] = useState(null);

	const onFile = (file) => {
		setFile(file);
		onOpen();
	}

	return (
		<>
			{file && (
				<UploadModal
					onClose={onClose}
					isOpen={isOpen}
					file={file}
				/>
			)}
			<DragDrop
				height={400}
				onFile={onFile}
			>
				<Flex
					direction={{ base: 'column', md: 'row' }}
					align='center'
					justify='center'
					gap={2.5}
				>
					<Icon
						as={icons.plus}
						boxSize={5}
					/>
					<Heading>
						{t('addBoxes')}
					</Heading>
				</Flex>
				<Heading
					size='md'
					fontWeight='light'
					lineHeight={1.5}
				>
					{t('uploadPrompt')}
				</Heading>
				<Text
					opacity={0.5}
				>
					{t('columnOrder')}{': '}
					<code>{boxFields.join(', ') + `, ${t('latitude')}, ${t('longitude')}`}</code>
				</Text>
			</DragDrop>
		</>
	)
}