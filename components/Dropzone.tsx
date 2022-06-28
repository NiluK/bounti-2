import { useState } from 'react';
import { Group, Text, useMantineTheme, MantineTheme, Image, Grid } from '@mantine/core';
import { Upload, Photo, X, Icon as TablerIcon } from 'tabler-icons-react';
import { Dropzone, DropzoneStatus, IMAGE_MIME_TYPE } from '@mantine/dropzone';

function getIconColor(status: DropzoneStatus, theme: MantineTheme) {
  return status.accepted
    ? theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]
    : status.rejected
    ? theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]
    : theme.colorScheme === 'dark'
    ? theme.colors.dark[0]
    : theme.colors.gray[7];
}

function ImageUploadIcon({
  status,
  ...props
}: React.ComponentProps<TablerIcon> & { status: DropzoneStatus }) {
  if (status.accepted) {
    return <Upload {...props} />;
  }

  if (status.rejected) {
    return <X {...props} />;
  }

  return <Photo {...props} />;
}

export const dropzoneChildren = (status: DropzoneStatus, theme: MantineTheme) => (
  <Group position="center" spacing="xl" style={{ minHeight: 100, pointerEvents: 'none' }}>
    <ImageUploadIcon status={status} style={{ color: getIconColor(status, theme) }} size={40} />
    <div>
      <Text size="xl" inline>
        Drag images here or click to select files
      </Text>
      <Text size="sm" color="dimmed" inline mt={7}>
        Each file should not exceed 5mb
      </Text>
    </div>
  </Group>
);

export default function DropZone({
  title,
  required,
  multiple,
  name,
  onChange,
  accept = IMAGE_MIME_TYPE,
}: {
  title: string;
  required: boolean;
  multiple: boolean;
  name: string;
  onChange: Function;
  accept?: any;
}) {
  const theme = useMantineTheme();
  const [files, setFiles] = useState<File[]>([]);
  return (
    <>
      <Text my="xs">
        {title}
        {required && (
          <Text component="span" inline sx={{ color: theme.colors.red[5] }}>
            &nbsp;*
          </Text>
        )}
      </Text>
      <Dropzone
        onDrop={(file) => {
          if (multiple) {
            setFiles([...files, ...file]);
            onChange([...files, ...file]);
          } else {
            setFiles(file);
            onChange(file[0]);
          }
        }}
        name={name}
        onReject={(files) => console.log('rejected files', files)}
        maxSize={5 * 1024 * 1024}
        accept={accept}
        multiple={multiple}
        my="xs"
      >
        {(status) => {
          if (files.length) {
            return (
              <Grid columns={multiple ? 3 : 1}>
                {files.map((file) => (
                  <Grid.Col span={1}>
                    <Image
                      sx={{
                        aspectRatio: '16 / 9',
                        maxHeight: '150px',
                      }}
                      src={URL.createObjectURL(file)}
                      key={file.name}
                    />
                  </Grid.Col>
                ))}
              </Grid>
            );
          }

          return dropzoneChildren(status, theme);
        }}
      </Dropzone>
    </>
  );
}
