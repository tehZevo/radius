import {useDropzone} from 'react-dropzone'
import Box from "../components/box"

//TODO: configurable to only allow single file
//TODO: make it so Boxes can have fixed width/height
export default function FileDropzone({onDrop, defaultText="Click here to add files", dragText="Drop files here", width="200px", height="50px"})
{
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <Box>
      <div style={{width, height, cursor: "pointer"}} {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? <p>{dragText}</p> : <p>{defaultText}</p>}
      </div>
    </Box>
  )
}
